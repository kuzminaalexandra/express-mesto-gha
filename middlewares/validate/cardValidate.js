const { celebrate, Joi } = require('celebrate');

const regEx = /https?:\/\/w{0,3}\.?[\w0-9-]{1,10}\.\w{2,3}[\w\d\-._~:/?#[\]@!$&'()*+,;=]{0,}/m;

const cardValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regEx),
  }),
});

const cardIdValidate = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  cardValidate,
  cardIdValidate,
};
