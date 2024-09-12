const cookie = require('cookie');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const postEvents = require('./postEvents');

const events = (io) => {
  io.on('connection', (socket) => {
    const cookies = socket.handshake.headers.cookie;
    if (cookies) {
      const { token } = cookie.parse(cookies);

      if (token) {
        try {
          const userToken = jwt.verify(token, process.env.JWT_SECRET);

          socket.join(`user-${userToken.id}`);

          socket.once('disconnect', () => {
            socket.leave(`user-${userToken.id}`);
          });
        } catch (error) {
          socket.disconnect();
        }
      }
    } else {
      socket.disconnect();
    }

    postEvents(socket);
  });
};

module.exports = events;
