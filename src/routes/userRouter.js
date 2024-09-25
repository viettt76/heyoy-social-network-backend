const express = require('express');
const userController = require('../controllers/UserController');

const userRouter = (io) => {
  const router = express.Router();

  router.get('/personal-info', userController.getPersonalInfo);
  router.put('/personal-info', userController.updatePersonalInfo);

  return router;
};

module.exports = userRouter;
