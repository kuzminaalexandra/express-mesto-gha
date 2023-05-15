const { celebrate, Joi } = require('celebrate');

const regEx = /https?:\/\/w{0,3}\.?[\w0-9-]{1,10}\.\w{2,3}[\w\d\-._~:/?#[\]@!$&'()*+,;=]{0,}/m;

const userIdValidate = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

const userInfoValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regEx),
  }),
});

const userAboutValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const userAvatarValidate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(regEx),
  }),
});

module.exports = {
  userIdValidate,
  userInfoValidate,
  userAboutValidate,
  userAvatarValidate,
};
