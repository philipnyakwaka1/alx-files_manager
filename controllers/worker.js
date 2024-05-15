const Queue = require('bull');
const userQueue = new Queue('userQueue');

userQueue.process(async job => {
    const { userId } = job.data;

    if (!userId) {
        throw new Error('Missing userId');
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    console.log(`Welcome ${user.email}!`);
});

