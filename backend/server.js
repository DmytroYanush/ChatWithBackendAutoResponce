const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  await createInitialChats(); 
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.error('MongoDB connection error:', err));


const Chat = require('./models/Chat');

async function createInitialChats() {
  const count = await Chat.countDocuments();
  console.log('Chat count in DB:', count); // <--- додай це
  if (count === 0) {
    await Chat.insertMany([
      { firstName: 'Ada', lastName: 'Lovelace' },
      { firstName: 'Alan', lastName: 'Turing' },
      { firstName: 'Grace', lastName: 'Hopper' },
    ]);
    console.log('✅ Predefined chats created');
  } else {
    console.log('⚠️ Chats already exist, skipping creation');
  }
}


