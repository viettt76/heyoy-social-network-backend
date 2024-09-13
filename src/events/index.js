const cookie = require('cookie');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const postEvents = require('./postEvents');
const { createClient } = require('redis');
const { AppDataSource } = require('../data-source');
const { Relationship } = require('../entity/Relationship');
const { User } = require('../entity/User');

const relationshipRepository = AppDataSource.getRepository(Relationship);
const userRepository = AppDataSource.getRepository(User);

const events = async (io) => {
  const client = createClient({
    url: 'redis://localhost:6379', // URL Redis của bạn
  });

  client.on('connect', () => {
    console.log('Redis client connected successfully');
  });

  client.on('error', (err) => {
    console.error('Redis client connection error:', err);
  });

  try {
    await client.connect();
  } catch (error) {
    console.error('Redis client connection failed', error);
  }

  const setUserOnline = async (userId) => {
    try {
      const userKey = `user_online_${String(userId)}`;
      await client.set(userKey, 'true');
    } catch (error) {
      console.error(`Failed to set user ${userId} online:`, error);
    }
  };

  const setUserOffline = async (userId) => {
    await client.del(`user_online_${userId}`);
  };

  const isUserOnline = async (userId) => {
    try {
      const exists = await client.exists(`user_online_${userId}`);
      return exists === 1;
    } catch (error) {
      console.log('lỗi khi check user online');
    }
  };

  const friendsOnline = async (userToken) => {
    const friends = await relationshipRepository
      .createQueryBuilder('relationship')
      .select(
        'CASE WHEN relationship.user1 = :currentUserId THEN relationship.user2 ELSE relationship.user1 END',
        'friendId'
      )
      .where(
        '(relationship.user1 = :currentUserId OR relationship.user2 = :currentUserId)'
      )
      .setParameters({ currentUserId: userToken.id })
      .getRawMany();

    // Lọc danh sách bạn bè online từ Redis
    const onlineFriendsArray = [];

    for (const friend of friends) {
      const isOnline = await isUserOnline(friend.friendId);
      if (isOnline) {
        onlineFriendsArray.push(friend.friendId);
      }
    }

    const onlineFriends = Promise.all(
      onlineFriendsArray.map(async (friendId) => {
        return await userRepository.findOne({
          where: { id: friendId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        });
      })
    );

    return onlineFriends;
  };

  io.on('connection', async (socket) => {
    const cookies = socket.handshake.headers.cookie;

    if (cookies) {
      const { refreshToken } = cookie.parse(cookies);

      if (refreshToken) {
        try {
          const userToken = jwt.verify(refreshToken, process.env.JWT_SECRET);

          try {
            await setUserOnline(userToken.id);
          } catch (error) {
            console.log('lỗi khi set user online');
          }

          socket.join(`user-${userToken.id}`);

          try {
            io.to(`user-${userToken.id}`).emit(
              'friendsOnline',
              await friendsOnline(userToken)
            );
          } catch (error) {
            console.log('lỗi khi lấy danh sách bạn đang online');
          }

          const intervalId = setInterval(async () => {
            try {
              io.to(`user-${userToken.id}`).emit(
                'friendsOnline',
                await friendsOnline(userToken)
              );
            } catch (error) {
              console.log('lỗi khi lấy danh sách bạn đang online');
            }
          }, 120000);

          socket.once('disconnect', async () => {
            try {
              await setUserOffline(userToken.id);
              clearInterval(intervalId);
            } catch (error) {
              console.log('lỗi khi set user offline');
            }
            socket.leave(`user-${userToken.id}`);
          });
        } catch (error) {
          socket.disconnect();
        }
      } else {
        socket.disconnect();
      }
    } else {
      socket.disconnect();
    }

    postEvents(socket);
  });
};

module.exports = events;
