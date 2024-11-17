const express = require('express');
const authController = require('../controllers/AuthController');
const authValidations = require('../validations/authValidations');

const router = express.Router();

router.post('/signup', authValidations.signup, authController.signup);
router.post('/login', authValidations.login, authController.login);
router.post('/logout', authController.logout);
router.delete(
  '/delete-account',
  authValidations.deleteAccount,
  authController.deleteAccount
);
router.post(
  '/recover-account',
  authValidations.recoverAccount,
  authController.recoverAccount
);

router.patch(
  '/change-password',
  authValidations.changePassword,
  authController.changePassword
);

module.exports = router;
