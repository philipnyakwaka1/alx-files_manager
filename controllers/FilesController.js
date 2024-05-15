import mime from 'mime-types';

class FilesController {
  static async getFile(req, res) {
    const fileId = req.params.id;
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const file = await dbClient.db.collection('files').findOne({ _id: ObjectId(fileId) });

    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (!file.isPublic && file.userId !== ObjectId(userId)) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (file.type === 'folder') {
      return res.status(400).json({ error: "A folder doesn't have content" });
    }

    let filePath = file.localPath;

    if (req.query.size) {
      filePath += `_${req.query.size}`;
    }

    try {
      const fileContent = await fs.promises.readFile(filePath);
      const mimeType = mime.lookup(filePath);

      res.setHeader('Content-Type', mimeType);
      return res.send(fileContent);
    } catch (error) {
      return res.status(404).json({ error: 'Not found' });
    }
  }
}
