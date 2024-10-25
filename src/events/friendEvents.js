const { AppDataSource } = require('../data-source');
const { Relationship } = require('../entity/Relationship');
const { User } = require('../entity/User');

const relationshipRepository = AppDataSource.getRepository(Relationship);
const userRepository = AppDataSource.getRepository(User);

const friendEvents = async (socket, io, client, userToken) => {
  const setUserOnline = async (userId) => {
    try {
      const userKey = `user_online_${userId}`;
      await client.set(userKey, 'true');
    } catch (error) {
      console.error(`Failed to set user ${userId} online:`, error);
    }
  };

  const setUserOffline = async (userId) => {
    try {
      await client.del(`user_online_${userId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const isUserOnline = async (userId) => {
    try {
      const exists = await client.exists(`user_online_${userId}`);
      return exists === 1;
    } catch (error) {
      console.log(error);
    }
  };

  const friendsOnline = async (userId) => {
    try {
      const friends = await relationshipRepository
        .createQueryBuilder('relationship')
        .select(
          'CASE WHEN relationship.user1 = :currentUserId THEN relationship.user2 ELSE relationship.user1 END',
          'friendId'
        )
        .where(
          '(relationship.user1 = :currentUserId OR relationship.user2 = :currentUserId)'
        )
        .setParameters({ currentUserId: userId })
        .getRawMany();

      const onlineFriends = [];
      const offlineFriends = [];

      for (const friend of friends) {
        const isOnline = await isUserOnline(friend.friendId);
        if (isOnline) {
          onlineFriends.push(friend.friendId);
        } else {
          offlineFriends.push(friend.friendId);
        }
      }

      const totalFriends = [
        ...onlineFriends.slice(0, 20),
        ...offlineFriends.slice(0, 20 - onlineFriends.length),
      ].slice(0, 20);

      const result = await totalFriends.reduce(async (accPromise, friendId) => {
        try {
          const acc = await accPromise;

          const fr = await userRepository.findOne({
            where: { id: friendId },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          });

          const isOnline = await isUserOnline(friendId);

          return fr
            ? [
                ...acc,
                {
                  ...fr,
                  isOnline: isOnline,
                },
              ]
            : acc;
        } catch (error) {
          console.log(error);
        }
      }, Promise.resolve([]));

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  try {
    await setUserOnline(userToken.id);
  } catch (error) {
    console.log(error);
  }

  const getFriendsOnline = async () => {
    try {
      io.to(`user-${userToken.id}`).emit(
        'friendsOnline',
        await friendsOnline(userToken.id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  socket.on('getFriendsOnline', () => {
    getFriendsOnline();
  });

  const intervalId = setInterval(() => {
    getFriendsOnline();
  }, 20000);

  socket.on('checkFriendOnline', async (friendId) => {
    try {
      const result = await isUserOnline(friendId);
      io.to(`user-${userToken?.id}`).emit('isFriendOnline', result);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('disconnect', async () => {
    try {
      await setUserOffline(userToken.id);
      clearInterval(intervalId);
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = friendEvents;
