const express = require('express');
const relationshipController = require('../controllers/RelationshipController');
const ioMiddleware = require('../middlewares/ioMiddleware');

const relationshipRouter = (io) => {
  const router = express.Router();

  router.get('/friends', relationshipController.friends);
  router.get('/suggestion', relationshipController.suggestion);
  router.post('/request', ioMiddleware(io), relationshipController.request);
  router.get('/request', relationshipController.friendRequests);
  router.delete(
    '/request/:senderId',
    relationshipController.refuseFriendRequest
  );
  router.post('/accept', ioMiddleware(io), relationshipController.accept);
  router.delete(
    '/:friendId',
    ioMiddleware(io),
    relationshipController.unfriend
  );
  router.get('/sent-requests', relationshipController.sentFriendRequests);
  router.delete(
    '/sent-request/:receiverId',
    ioMiddleware(io),
    relationshipController.cancelFriendRequest
  );

  return router;
};
module.exports = relationshipRouter;
