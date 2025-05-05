const mongoose = require('mongoose');
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const { getRandomQuote } = require('../utils/quote');

const isValidObjectId = mongoose.Types.ObjectId.isValid;

const getMessages = async (req, res) => {
  const { chatId } = req.params;

  if (!isValidObjectId(chatId)) {
    return res.status(400).json({ error: 'Invalid chatId' });
  }

  try {
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error('getMessages error:', err.message);
    res.status(500).json({ error: 'Failed to get messages' });
  }
};

const sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const { text } = req.body;

  if (!isValidObjectId(chatId)) {
    return res.status(400).json({ error: 'Invalid chatId' });
  }

  try {
    const userMsg = new Message({ chatId, sender: 'user', text });
    await userMsg.save();

    res.status(201).json(userMsg);

    setTimeout(async () => {
      try {
        const quote = await getRandomQuote();
        const botMsg = new Message({ chatId, sender: 'bot', text: quote });
        await botMsg.save();
      } catch (botError) {
        console.error('Bot reply error:', botError.message);
      }
    }, 3000);
  } catch (err) {
    console.error('sendMessage error:', err.message);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};
