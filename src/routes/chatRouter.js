const express = require('express');
const chatController = require('../controllers/ChatController');
const ioMiddleware = require('../middlewares/ioMiddleware');
const chatValidations = require('../validations/chatValidations');

const chatRouter = (io) => {
  const router = express.Router();

  router.get(
    '/messages',
    chatValidations.getMessages,
    chatController.getMessages
  );
  router.post(
    '/message',
    chatValidations.sendMessage,
    ioMiddleware(io),
    chatController.sendMessage
  );

  return router;
};

module.exports = chatRouter;
