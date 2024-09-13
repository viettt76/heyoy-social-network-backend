const express = require('express');
const chatController = require('../controllers/ChatController');

const chatRouter = (io) => {
  const router = express.Router();

  router.get('/messages', chatController.getMessages);
  router.post('/message', (req, res, next) =>
    chatController.sendMessage(req, res, next, io)
  );

  return router;
};

module.exports = chatRouter;
