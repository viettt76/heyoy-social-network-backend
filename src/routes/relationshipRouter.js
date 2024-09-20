const express = require('express');
const relationshipController = require('../controllers/RelationshipController');

const relationshipRouter = (io) => {
  const router = express.Router();

  router.get('/friends', relationshipController.friends);
  router.get('/suggestion', relationshipController.suggestion);
  router.post('/request', (req, res, next) =>
    relationshipController.request(req, res, next, io)
  );
  router.get('/request', relationshipController.friendRequests);
  router.delete(
    '/request/:senderId',
    relationshipController.refuseFriendRequest
  );
  router.post('/accept', (req, res, next) =>
    relationshipController.accept(req, res, next, io)
  );
  router.delete('/:friendId', (req, res, next) =>
    relationshipController.delete(req, res, next, io)
  );

  return router;
};
module.exports = relationshipRouter;
