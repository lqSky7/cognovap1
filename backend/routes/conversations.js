const express = require('express');
const conversationController = require('../controllers/conversationController');
const auth = require('../middleware/auth');

const router = express.Router();

// All conversation routes require authentication
router.use(auth);

// AI types
router.get('/ai-types', conversationController.getAITypes);

// Stream management (must come before /:conversationId to avoid conflicts)
router.get('/streams/active', conversationController.getActiveStreams);

// Conversations
router.post('/', conversationController.createConversation);
router.get('/', conversationController.getConversations);
router.get('/:conversationId', conversationController.getConversation);
router.delete('/:conversationId', conversationController.deleteConversation);

// Messages
router.post('/:conversationId/messages', conversationController.sendMessage);
router.post('/:conversationId/stream', conversationController.streamAIResponse);
router.delete('/:conversationId/stream', conversationController.cancelStream);

module.exports = router;
