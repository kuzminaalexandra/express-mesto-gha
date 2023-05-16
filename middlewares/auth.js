const jwt = require('jsonwebtoken');

const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('./errorHandler');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new CustomError('Авторизуйтесь!', StatusCodes.UNAUTHORIZED));
  }

  try {
    const payload = jwt.verify(token, 'secret1111');
    req.user = payload;
    next();
  } catch (error) {
    next(new CustomError('Авторизуйтесь!', StatusCodes.UNAUTHORIZED));
  }
};
