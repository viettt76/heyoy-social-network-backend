const express = require('express');
const relationshipController = require('../controllers/RelationshipController');

const relationshipRouter = (io) => {
  const router = express.Router();

  router.get('/friends', relationshipController.friends);
  router.get('/suggestion', relationshipController.suggestion);
  router.post('/request', relationshipController.request);
  router.get('/request', relationshipController.friendRequests);
  router.post('/accept', relationshipController.accept);

  return router;
};
module.exports = relationshipRouter;
