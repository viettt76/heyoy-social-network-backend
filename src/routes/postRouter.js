const express = require('express');
const postController = require('../controllers/PostController');
const ioMiddleware = require('../middlewares/ioMiddleware');

const postRouter = (io) => {
  const router = express.Router();

  router.post('/', ioMiddleware(io), postController.post);
  router.get('/', postController.getAll);
  router.get('/emotions', postController.getEmotions);
  router.put(
    '/emotion/:postId',
    ioMiddleware(io),
    postController.releaseEmotion
  );
  router.delete(
    '/emotion/:postId',
    ioMiddleware(io),
    postController.cancelReleasedEmotion
  );
  router.get('/me', postController.myPosts);
  router.get('/comments/:postId', postController.getComments);
  router.post('/comment', ioMiddleware(io), postController.comment);

  return router;
};

module.exports = postRouter;
