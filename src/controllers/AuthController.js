require('dotenv').config();
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { AppDataSource } = require('../data-source');

const { User } = require('../entity/User');
const { Comment } = require('../entity/Comment');
const { EmotionComment } = require('../entity/EmotionComment');
const { EmotionMessage } = require('../entity/EmotionMessage');
const { EmotionPost } = require('../entity/EmotionPost');
const { FriendRequest } = require('../entity/FriendRequest');
const { GroupMember } = require('../entity/GroupMember');
const { Message } = require('../entity/Message');
const { Notifications } = require('../entity/Notifications');
const { Post } = require('../entity/Post');
const { Relationship } = require('../entity/Relationship');

const ApiError = require('../utils/ApiError');
const { Not, IsNull } = require('typeorm');

const userRepository = AppDataSource.getRepository(User);
const commentRepository = AppDataSource.getRepository(Comment);
const emotionCommentRepository = AppDataSource.getRepository(EmotionComment);
const emotionMessageRepository = AppDataSource.getRepository(EmotionMessage);
const emotionPostRepository = AppDataSource.getRepository(EmotionPost);
const friendRequestRepository = AppDataSource.getRepository(FriendRequest);
const groupMemberRepository = AppDataSource.getRepository(GroupMember);
const messageRepository = AppDataSource.getRepository(Message);
const notificationsRepository = AppDataSource.getRepository(Notifications);
const postRepository = AppDataSource.getRepository(Post);
const relationshipRepository = AppDataSource.getRepository(Relationship);

class AuthController {
  // [POST] /auth/signup
  async signup(req, res, next) {
    const { firstName, lastName, username, password } = req.body;

    const user = await userRepository.findOne({
      where: { username: username },
    });
    if (!!user) {
      return res.status(400).json({
        message: 'Username is already in use',
      });
    } else {
      const hashPassword = await bcrypt.hashSync(password, saltRounds);

      await userRepository.save({
        firstName,
        lastName,
        username,
        password: hashPassword,
      });

      return res.status(201).json();
    }
  }

  // [POST] /auth/login
  async login(req, res, next) {
    const { username, password } = req.body;

    const user = await userRepository.findOne({
      where: { username },
    });

    if (!user) {
      const userIsDeleted = await userRepository.findOne({
        where: {
          username,
          deletedAt: Not(IsNull()),
        },
        withDeleted: true,
      });

      if (userIsDeleted) {
        const checkPassword = await bcrypt.compareSync(
          password,
          userIsDeleted.password
        );

        if (checkPassword) {
          return res.status(410).json({
            message: 'Your account has been deleted',
          });
        }

        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'The username or password you entered is incorrect.',
        });
      }
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'The username or password you entered is incorrect.',
      });
    }

    const checkPassword = await bcrypt.compareSync(password, user.password);

    if (checkPassword) {
      const jwtSecret = process.env.JWT_SECRET;

      const payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: 'user',
      };

      const token = jwt.sign(payload, jwtSecret);
      const refreshToken = jwt.sign(payload, jwtSecret);

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json();
    } else {
      res.status(401).json({
        error: 'Invalid credentials',
        message: 'The username or password you entered is incorrect.',
      });
    }
  }

  // [POST] /auth/logout
  logout(req, res, next) {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.status(200).json();
  }

  // [DELETE] /auth/delete-account
  async deleteAccount(req, res, next) {
    try {
      const { id } = req.userToken;
      const { password } = req.body;

      const user = await userRepository.findOne({
        where: { id },
      });

      if (user) {
        const checkPassword = bcrypt.compareSync(password, user.password);

        if (checkPassword) {
          await userRepository.softRemove(user);

          const comments = await commentRepository.find({
            where: {
              commentator: id,
            },
          });
          await commentRepository.softRemove(comments);

          const emotionComment = await emotionCommentRepository.find({
            where: {
              userId: id,
            },
          });
          await emotionCommentRepository.softRemove(emotionComment);

          const emotionMessage = await emotionMessageRepository.find({
            where: {
              userId: id,
            },
          });
          await emotionMessageRepository.softRemove(emotionMessage);

          const emotionPosts = await emotionPostRepository.find({
            where: {
              userId: id,
            },
          });
          await emotionPostRepository.softRemove(emotionPosts);

          const friendRequests = await friendRequestRepository.find({
            where: [{ senderId: id }, { receiverId: id }],
          });
          await friendRequestRepository.softRemove(friendRequests);

          const groupMembers = await groupMemberRepository.find({
            where: [{ memberId: id }],
          });
          await groupMemberRepository.softRemove(groupMembers);

          const messages = await messageRepository.find({
            where: [{ sender: id }, { receiver: id }],
          });
          await messageRepository.softRemove(messages);

          const notifications = await notificationsRepository.find({
            where: [{ userId: id }, { senderId: id }],
          });
          await notificationsRepository.softRemove(notifications);

          const posts = await postRepository.find({
            where: { poster: id },
          });
          await postRepository.softRemove(posts);

          const relationships = await relationshipRepository.find({
            where: [{ user1: id }, { user2: id }],
          });
          await relationshipRepository.softRemove(relationships);

          return res.status(204).json();
        }

        throw new ApiError(400, 'Password is incorrect');
      }

      throw new ApiError(404, 'Not found user');
    } catch (error) {
      next(error);
    }
  }

  // [POST] /auth/recover-account
  async recoverAccount(req, res, next) {
    try {
      const { username, password } = req.body;

      const user = await userRepository.findOne({
        where: { username },
        withDeleted: true,
      });

      if (user) {
        const checkPassword = bcrypt.compareSync(password, user.password);

        if (checkPassword) {
          await userRepository.recover(user);

          const { id } = user;

          const comments = await commentRepository.find({
            where: { commentator: id },
            withDeleted: true,
          });
          if (comments?.length > 0) {
            await commentRepository.recover(comments);
          }

          const emotionComment = await emotionCommentRepository.find({
            where: { userId: id },
            withDeleted: true,
          });
          if (emotionComment?.length > 0) {
            await emotionCommentRepository.recover(emotionComment);
          }

          const emotionMessage = await emotionMessageRepository.find({
            where: { userId: id },
            withDeleted: true,
          });
          if (emotionMessage?.length > 0) {
            await emotionMessageRepository.recover(emotionMessage);
          }

          const emotionPosts = await emotionPostRepository.find({
            where: { userId: id },
            withDeleted: true,
          });
          if (emotionPosts?.length > 0) {
            await emotionPostRepository.recover(emotionPosts);
          }

          const friendRequests = await friendRequestRepository.find({
            where: [{ senderId: id }, { receiverId: id }],
            withDeleted: true,
          });
          if (friendRequests?.length > 0) {
            await friendRequestRepository.recover(friendRequests);
          }

          const groupMembers = await groupMemberRepository.find({
            where: { memberId: id },
            withDeleted: true,
          });
          if (groupMembers?.length > 0) {
            await groupMemberRepository.recover(groupMembers);
          }

          const messages = await messageRepository.find({
            where: [{ sender: id }, { receiver: id }],
            withDeleted: true,
          });
          if (messages?.length > 0) {
            await messageRepository.recover(messages);
          }

          const notifications = await notificationsRepository.find({
            where: [{ userId: id }, { senderId: id }],
            withDeleted: true,
          });
          if (notifications?.length > 0) {
            await notificationsRepository.recover(notifications);
          }

          const posts = await postRepository.find({
            where: { poster: id },
            withDeleted: true,
          });
          if (posts?.length > 0) {
            await postRepository.recover(posts);
          }

          const relationships = await relationshipRepository.find({
            where: [{ user1: id }, { user2: id }],
            withDeleted: true,
          });
          if (relationships?.length > 0) {
            await relationshipRepository.recover(relationships);
          }

          return res.status(204).json();
        }

        throw new ApiError(400, 'Password is incorrect');
      }

      throw new ApiError(404, 'Not found user');
    } catch (error) {
      next(error);
    }
  }

  // [PATCH] /auth/change-password
  async changePassword(req, res, next) {
    try {
      const { id } = req.userToken;
      const { currentPassword, newPassword } = req.body;

      const user = await userRepository.findOne({
        where: { id },
      });

      if (user) {
        const checkPassword = bcrypt.compareSync(
          currentPassword,
          user.password
        );

        if (checkPassword) {
          const hashPassword = bcrypt.hashSync(newPassword, saltRounds);
          user.password = hashPassword;
          userRepository.save(user);

          return res.status(200).json();
        } else {
          throw new ApiError(400, 'Password is incorrect');
        }
      }

      throw new ApiError(404, 'Not found user');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
