const express = require('express');
const chatController = require('../controllers/ChatController');
const ioMiddleware = require('../middlewares/ioMiddleware');

const chatRouter = (io) => {
  const router = express.Router();

  router.get('/messages', chatController.getMessages);
  router.post('/message', ioMiddleware(io), chatController.sendMessage);

  return router;
};

module.exports = chatRouter;
