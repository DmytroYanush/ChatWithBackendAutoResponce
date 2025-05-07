const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Chat = require('./models/Chat');

dotenv.config();

const predefinedChats = [
    { firstName: 'Ada', lastName: 'Lovelace' },
    { firstName: 'Alan', lastName: 'Turing' },
    { firstName: 'Grace', lastName: 'Hopper' },
];

async function seedChats() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const existing = await Chat.countDocuments();
        if (existing === 0) {
            await Chat.insertMany(predefinedChats);
            console.log('✅ Chats seeded successfully');
        } else {
            console.log('⚠️ Chats already exist. Skipping.');
        }

        mongoose.disconnect();
    } catch (err) {
        console.error('❌ Seeding failed:', err);
    }
}

seedChats();
