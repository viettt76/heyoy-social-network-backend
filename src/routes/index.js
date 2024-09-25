const authRouter = require('./authRouter');
const postRouter = require('./postRouter');
const relationshipRouter = require('./relationshipRouter');
const chatRouter = require('./chatRouter');
const userRouter = require('./userRouter');

const routes = (app, io) => {
  app.use('/auth', authRouter);
  app.use('/posts', postRouter(io));
  app.use('/relationships', relationshipRouter(io));
  app.use('/chat', chatRouter(io));
  app.use('/user', userRouter(io));
};

module.exports = routes;
