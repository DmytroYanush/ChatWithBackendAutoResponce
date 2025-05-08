const Chat = require('../models/Chat');

const getChats = async (req, res) => {
  const chats = await Chat.find().sort({ createdAt: -1 });
  res.json(chats);
};

const createChat = async (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First and last name required' });
  }
  const chat = new Chat({ firstName, lastName });
  await chat.save();
  res.status(201).json(chat);
};

const updateChat = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName } = req.body;
  try {
    const chat = await Chat.findById(id);
    if (chat.isPredefined) {
      return res.status(403).json({ error: 'Cannot modify predefined chat' });
    }
    const updated = await Chat.findByIdAndUpdate(id, { firstName, lastName }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update chat' });
  }
};

const deleteChat = async (req, res) => {
  const { id } = req.params;
  const chat = await Chat.findById(id);
  
  if (chat.isPredefined) {
    return res.status(403).json({ error: 'Cannot delete predefined chat' });
  }
  
  await Chat.findByIdAndDelete(id);
  res.json({ message: 'Chat deleted' });
};

module.exports = {
  getChats,
  createChat,
  updateChat,
  deleteChat
};
