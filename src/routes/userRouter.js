const express = require('express');
const userController = require('../controllers/UserController');
const userValidations = require('../validations/userValidations');

const userRouter = (io) => {
  const router = express.Router();

  router.get('/my-info', userController.getMyInfo);
  router.put(
    '/my-info',
    userValidations.updateMyInfo,
    userController.updateMyInfo
  );
  router.get(
    '/user-info/:userId',
    userValidations.getUserInfo,
    userController.getUserInfo
  );
  router.get(
    '/pictures/:userId',
    userValidations.getPictures,
    userController.getPictures
  );
  router.get('/notifications', userController.getNotifications);
  router.patch(
    '/notification/:notificationId',
    userValidations.readNotification,
    userController.readNotification
  );
  router.get('/notifications-type', userController.getNotificationsType);
  router.patch(
    '/notification/messenger/open',
    userController.openMenuMessenger
  );
  router.patch('/notification/other/open', userController.openMenuOther);
  router.patch('/profile/private', userController.setPrivateProfile);
  router.patch('/profile/public', userController.setPublicProfile);
  router.get('/search', userValidations.search, userController.search);

  return router;
};

module.exports = userRouter;
