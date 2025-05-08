const mongoose = require('mongoose');
const Chat = require('./models/Chat');
require('dotenv').config();

const predefinedChats = [
  { firstName: 'General', lastName: 'Discussion', isPredefined: true },
  { firstName: 'Help', lastName: 'Support', isPredefined: true },
  { firstName: 'Announcements', lastName: 'Channel', isPredefined: true }
];

async function initializePredefinedChats() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if predefined chats already exist
    const existingChats = await Chat.find({ isPredefined: true });
    
    if (existingChats.length === 0) {
      // Create predefined chats
      await Chat.insertMany(predefinedChats);
      console.log('Predefined chats created successfully');
    } else {
      console.log('Predefined chats already exist');
    }

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

initializePredefinedChats(); 