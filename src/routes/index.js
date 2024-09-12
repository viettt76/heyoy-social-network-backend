const authRouter = require('./authRouter');
const postRouter = require('./postRouter');
const relationshipRouter = require('./relationshipRouter');

const routes = (app, io) => {
  app.use('/auth', authRouter);
  app.use('/posts', postRouter(io));
  app.use('/relationships', relationshipRouter(io));
};

module.exports = routes;
