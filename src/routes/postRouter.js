const express = require('express');
const postController = require('../controllers/PostController');

const postRouter = (io) => {
  const router = express.Router();

  router.post('/', (req, res, next) => postController.post(req, res, next, io));
  router.get('/', postController.getAll);
  router.get('/emotions', postController.getEmotions);
  router.put('/emotion/:postId', (req, res, next) =>
    postController.releaseEmotion(req, res, next, io)
  );
  router.delete('/emotion/:postId', (req, res, next) =>
    postController.cancelReleasedEmotion(req, res, next, io)
  );
  router.get('/me', postController.myPosts);
  router.get('/comments/:postId', postController.getComments);
  router.post('/comment', (req, res, next) =>
    postController.comment(req, res, next, io)
  );

  return router;
};

module.exports = postRouter;
