const jwt = require('jsonwebtoken');

const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('./errorHandler');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new CustomError('Необходима авторизация', StatusCodes.UNAUTHORIZED));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret1111');
  } catch (err) {
    return next(new CustomError('Необходима авторизация', StatusCodes.UNAUTHORIZED));
  }

  if (!payload) {
    return next(new CustomError('Необходима авторизация', StatusCodes.UNAUTHORIZED));
  }

  req.user = payload;

  return next();
};
