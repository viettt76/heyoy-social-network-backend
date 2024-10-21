require('dotenv').config();
const { AppDataSource } = require('../data-source');
const { User } = require('../entity/User');

const userRepository = AppDataSource.getRepository(User);

// const { AccessToken } = require('livekit-server-sdk');
const createToken = async ({ roomId, username }) => {
  const LivekitServerSDK = await import('livekit-server-sdk');

  const { AccessToken } = LivekitServerSDK;

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: username,
      ttl: '10m',
    }
  );
  at.addGrant({ roomJoin: true, room: roomId });

  return await at.toJwt();
};

const chatEvents = (socket, io) => {
  socket.on('joinGroupChat', (groupChatId) => {
    socket.join(`group-chat-${groupChatId}`);
  });

  socket.on('requestPrivateCall', async ({ callerId, receiverId }) => {
    try {
      const roomId = [callerId, receiverId].join('-');

      const callerToken = await createToken({ roomId, username: callerId });

      const callerInfo = await userRepository.findOne({
        where: { id: callerId },
        select: {
          id: true,
          lastName: true,
          firstName: true,
          avatar: true,
        },
      });

      const receiverInfo = await userRepository.findOne({
        where: { id: receiverId },
        select: {
          id: true,
          lastName: true,
          firstName: true,
          avatar: true,
        },
      });

      io.to(`user-${callerId}`).emit('callerToken', {
        callerToken,
        receiverInfo,
      });
      io.to(`user-${receiverId}`).emit('hasRequestPrivateCall', {
        roomId,
        callerInfo,
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('acceptPrivateCall', async ({ acceptorId, callerId, roomId }) => {
    try {
      const receiverToken = await createToken({ roomId, username: acceptorId });
      io.to(`user-${acceptorId}`).emit('startPrivateCall', receiverToken);
      io.to(`user-${callerId}`).emit('friendAcceptCall');
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('refusePrivateCall', ({ callerId }) => {
    io.to(`user-${callerId}`).emit('callRejected');
  });

  socket.on('cancelCalling', (receiverId) => {
    io.to(`user-${receiverId}`).emit('callCancelled');
  });
};

module.exports = chatEvents;
