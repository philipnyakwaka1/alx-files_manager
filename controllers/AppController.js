import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const usersCollection = dbClient.db.collection('users');

    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const hashedPassword = sha1(password);
    const userId = uuidv4();

    const newUser = {
      _id: userId,
      email,
      password: hashedPassword,
    };

    await usersCollection.insertOne(newUser);

    return res.status(201).json({ id: userId, email });
  }
}

export default UsersController;
