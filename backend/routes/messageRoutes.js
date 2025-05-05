const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const router = express.Router();

router.get('/:chatId', getMessages);
router.post('/:chatId', sendMessage);

module.exports = router;
