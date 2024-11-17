const { AppDataSource } = require('../data-source');
const { User } = require('../entity/User');
const { PictureOfPost } = require('../entity/PictureOfPost');
const ApiError = require('../utils/ApiError');
const { Post } = require('../entity/Post');
const { Notifications } = require('../entity/Notifications');
const { NotificationType } = require('../entity/NotificationType');
const { Not, Like } = require('typeorm');

const userRepository = AppDataSource.getRepository(User);
const pictureOfPostRepository = AppDataSource.getRepository(PictureOfPost);
const notificationsRepository = AppDataSource.getRepository(Notifications);
const notificationTypeRepository =
  AppDataSource.getRepository(NotificationType);

class UserController {
  // [GET] /user/my-info
  async getMyInfo(req, res, next) {
    const { id } = req.userToken;

    const user = await userRepository.findOneBy({
      id,
    });

    if (user) {
      res.status(200).json({
        id: user.id,
        lastName: user.lastName,
        firstName: user.firstName,
        birthday: user.birthday,
        homeTown: user.homeTown,
        school: user.school,
        workplace: user.workplace,
        avatar: user.avatar,
        isPrivate: user.isPrivate,
      });
    } else {
      res.clearCookie('token');
      res.clearCookie('refreshToken');
      res.status(404).json({
        message: 'The user does not exist',
      });
    }
  }

  // [PUT] /user/my-info
  async updateMyInfo(req, res, next) {
    const { id } = req.userToken;
    const { homeTown, school, workplace, avatar, birthday } = req.body;
    const user = await userRepository.findOneBy({
      id,
    });

    if (user) {
      if (homeTown !== null) user.homeTown = homeTown !== '' ? homeTown : null;
      if (school !== null) user.school = school !== '' ? school : null;
      if (workplace !== null)
        user.workplace = workplace !== '' ? workplace : null;
      if (avatar !== null) user.avatar = avatar;
      if (birthday !== null) user.birthday = birthday;

      await userRepository.save(user);

      return res.status(204).json();
    }

    throw new ApiError(404, "Couldn't update personal info");
  }

  // [GET] /user/user-info
  async getUserInfo(req, res, next) {
    const { userId } = req.params;

    const user = await userRepository.findOneBy({
      id: userId,
    });

    if (user) {
      return res.status(200).json({
        id: user.id,
        lastName: user.lastName,
        firstName: user.firstName,
        birthday: user.birthday,
        homeTown: user.homeTown,
        school: user.school,
        workplace: user.workplace,
        avatar: user.avatar,
        isPrivate: user.isPrivate,
      });
    }
    throw new ApiError(404, "Couldn't find user");
  }

  // [GET] /user/pictures/:userId
  async getPictures(req, res, next) {
    const { userId } = req.params;

    const pictures = await pictureOfPostRepository
      .createQueryBuilder('pictures')
      .innerJoin(Post, 'post', 'pictures.postId = post.id')
      .innerJoin(User, 'user', 'post.poster = user.id')
      .where('user.id = :userId', { userId })
      .select(['pictures.id as pictureId', 'pictures.picture as pictureUrl'])
      .getRawMany();

    res.status(200).json(pictures);
  }

  // [GET] /user/notifications
  async getNotifications(req, res, next) {
    const { id } = req.userToken;

    const notificationType = await notificationTypeRepository.find();

    const notificationsMessenger = await notificationsRepository
      .createQueryBuilder('notification')
      .select([
        'notification.id as id',
        'notification.userId as userId',
        'notification.senderId as senderId',
        'notification.type as type',
        'notification.relatedId as relatedId',
        'notification.content as content',
        'notification.isRead as isRead',
        'notification.isOpenMenu as isOpenMenu',
        'notification.createdAt as createdAt',
        'notification.updatedAt as updatedAt',
      ])
      .where(
        'notification.userId = :userId AND notification.type = :type AND notification.isRead = false',
        {
          userId: id,
          type: notificationType?.find((type) => type?.name === 'message')?.id,
        }
      )
      .groupBy('notification.userId, notification.senderId, notification.type')
      .orderBy('notification.createdAt', 'DESC')
      .getRawMany();

    const notificationsOther = await notificationsRepository
      .createQueryBuilder('notification')
      .leftJoin(User, 'sender', 'notification.senderId = sender.id')
      .select([
        'notification.id as id',
        'notification.userId as userId',
        'notification.senderId as senderId',
        'notification.type as type',
        'notification.relatedId as relatedId',
        'notification.content as content',
        'notification.isRead as isRead',
        'notification.isOpenMenu as isOpenMenu',
        'notification.createdAt as createdAt',
        'notification.updatedAt as updatedAt',
        'sender.firstName as senderFirstName',
        'sender.lastName as senderLastName',
        'sender.avatar as senderAvatar',
      ])
      .where('notification.userId = :userId AND notification.type != :type', {
        userId: id,
        type: notificationType?.find((type) => type?.name === 'message')?.id,
      })
      .groupBy('notification.userId, notification.senderId, notification.type')
      .orderBy('notification.createdAt', 'DESC')
      .getRawMany();

    res.status(200).json({
      messenger: notificationsMessenger,
      other: notificationsOther,
    });
  }

  // [PATCH] /user/notification/:notificationId
  async readNotification(req, res, next) {
    const { notificationId } = req.params;

    const notificationMessenger = await notificationsRepository.findOne({
      where: {
        id: notificationId,
      },
    });

    if (!notificationMessenger) {
      throw new ApiError(400, 'Not found notification messenger');
    }

    notificationMessenger.isRead = true;

    await notificationsRepository.save(notificationMessenger);

    res.status(200).json();
  }

  // [GET] /user/notifications-type
  async getNotificationsType(req, res, next) {
    const notificationsType = await notificationTypeRepository.find();

    res.status(200).json(notificationsType);
  }

  // [PATCH] /user/notification/messenger/open
  async openMenuMessenger(req, res, next) {
    const { id } = req.userToken;

    const notificationTypeMessage = await notificationTypeRepository.findOne({
      where: {
        name: 'message',
      },
    });

    const notificationMessenger = await notificationsRepository.find({
      where: {
        userId: id,
        type: notificationTypeMessage.id,
      },
    });

    notificationMessenger?.forEach((noti) => {
      noti.isOpenMenu = true;
    });

    await notificationsRepository.save(notificationMessenger);

    res.status(200).json();
  }

  // [PATCH] /user/notification/other/open
  async openMenuOther(req, res, next) {
    const { id } = req.userToken;

    const notificationTypeMessage = await notificationTypeRepository.findOne({
      where: {
        name: 'message',
      },
    });

    const notificationOther = await notificationsRepository.find({
      where: {
        userId: id,
        type: Not(notificationTypeMessage.id),
      },
    });

    notificationOther?.forEach((noti) => {
      noti.isOpenMenu = true;
    });

    await notificationsRepository.save(notificationOther);

    res.status(200).json();
  }

  // [PATCH] /user/profile/private
  async setPrivateProfile(req, res, next) {
    const { id } = req.userToken;

    const user = await userRepository.findOne({
      where: {
        id,
      },
    });

    if (user) {
      user.isPrivate = true;

      await userRepository.save(user);

      return res.status(200).json();
    }

    throw new ApiError(404, 'Not found user');
  }

  // [PATCH] /user/profile/public
  async setPublicProfile(req, res, next) {
    const { id } = req.userToken;

    const user = await userRepository.findOne({
      where: {
        id,
      },
    });

    if (user) {
      user.isPrivate = false;

      await userRepository.save(user);

      return res.status(200).json();
    }

    throw new ApiError(404, 'Not found user');
  }

  // [GET] /user/search?keyword=keyword
  async search(req, res, next) {
    const { id } = req.userToken;
    const { keyword } = req.query;

    const queryBuilder = userRepository
      .createQueryBuilder('user')
      .select([
        'user.id as id',
        'user.firstName as firstName',
        'user.lastName as lastName',
        'user.avatar as avatar',
      ]);

    const keywords = keyword.split(' ');

    keywords.forEach((word, index) => {
      const condition = `(user.firstName like :keyword${index} OR user.lastName like :keyword${index})`;

      if (index === 0) {
        queryBuilder.where(condition, { keyword0: `%${word}%` });
      } else {
        queryBuilder.orWhere(condition, { [`keyword${index}`]: `%${word}%` });
      }
    });
    queryBuilder.andWhere('user.id != :id', { id });

    const users = await queryBuilder.getRawMany();

    return res.status(200).json(users);
  }
}

module.exports = new UserController();
