const express = require('express');
const { getChats, createChat, updateChat, deleteChat } = require('../controllers/chatController');
const router = express.Router();

router.get('/', getChats);
router.post('/', createChat);
router.put('/:id', updateChat);
router.delete('/:id', deleteChat);

module.exports = router;
