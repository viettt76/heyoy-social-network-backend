const Joi = require('joi');
const validationHandler = require('../utils/validationHandler');

const updatePersonalInfo = (req, res, next) => {
  const correctValidation = Joi.object({
    homeTown: Joi.string().max(50).trim().strict(),
    school: Joi.string().max(50).trim().strict(),
    workplace: Joi.string().max(50).trim().strict(),
    avatar: Joi.string().trim().strict(),
    birthday: Joi.string().trim().strict(),
  });

  validationHandler(correctValidation, req.body, res, next);
};

module.exports = {
  updatePersonalInfo,
};
