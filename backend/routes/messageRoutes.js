const express = require('express');
const { sendMessage, getMessages, updateMessage } = require('../controllers/messageController');
const router = express.Router();

router.get('/:chatId', getMessages);
router.post('/:chatId', sendMessage);
router.put('/update/:messageId', updateMessage);

module.exports = router;
