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
  const { text, sender } = req.body;

  if (!isValidObjectId(chatId)) {
    return res.status(400).json({ error: 'Invalid chatId' });
  }
  if (!sender) {
    return res.status(400).json({ error: 'Sender is required' });
  }

  try {
    const userMsg = new Message({ chatId, sender, text });
    await userMsg.save();

    // Emit new-message event for user message
    const io = req.app.get('io');
    io.emit('new-message', userMsg);

    res.status(201).json(userMsg);

    setTimeout(async () => {
      try {
        const quote = await getRandomQuote();
        const botMsg = new Message({ chatId, sender: 'bot', text: quote });
        await botMsg.save();
        // Emit new-message event for bot message
        io.emit('new-message', botMsg);
      } catch (botError) {
        console.error('Bot reply error:', botError.message);
      }
    }, 3000);
  } catch (err) {
    console.error('sendMessage error:', err.message);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

const updateMessage = async (req, res) => {
  const { messageId } = req.params;
  const { text, sender } = req.body;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({ error: 'Invalid messageId' });
  }
  if (!sender) {
    return res.status(400).json({ error: 'Sender is required' });
  }
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    if (message.sender !== sender) {
      return res.status(403).json({ error: 'You can only edit your own messages' });
    }
    message.text = text;
    await message.save();
    res.json(message);
  } catch (err) {
    console.error('updateMessage error:', err.message);
    res.status(500).json({ error: 'Failed to update message' });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  updateMessage,
};
