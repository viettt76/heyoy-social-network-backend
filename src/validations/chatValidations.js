const Joi = require('joi');
const validationHandler = require('../utils/validationHandler');

const getMessages = (req, res, next) => {
  const correctValidation = Joi.object({
    friendId: Joi.string().uuid().required(),
  });

  validationHandler(correctValidation, req.query, res, next);
};

const sendMessage = (req, res, next) => {
  const correctValidation = Joi.object({
    friendId: Joi.string().uuid().required(),
    message: Joi.string().allow('', null),
  });

  validationHandler(correctValidation, req.body, res, next);
};

module.exports = {
  getMessages,
  sendMessage,
};
