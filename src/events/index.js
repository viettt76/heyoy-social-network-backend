const cookie = require('cookie');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const postEvents = require('./postEvents');
const friendEvents = require('./friendEvents');
const chatEvents = require('./chatEvents');

const events = (io, client) => {
  io.on('connection', (socket) => {
    const cookies = socket.handshake.headers.cookie;

    if (cookies) {
      const { refreshToken } = cookie.parse(cookies);

      if (refreshToken) {
        try {
          const userToken = jwt.verify(refreshToken, process.env.JWT_SECRET);

          socket.join(`user-${userToken.id}`);

          socket.on('disconnect', () => {
            socket.leave(`user-${userToken.id}`);
          });

          postEvents(socket);
          friendEvents(socket, io, client, userToken);
          chatEvents(socket, io);
        } catch (error) {
          socket.disconnect();
        }
      } else {
        socket.disconnect();
      }
    } else {
      socket.disconnect();
    }
  });
};

module.exports = events;
