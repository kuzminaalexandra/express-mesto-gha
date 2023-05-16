const router = require('express').Router();

const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../middlewares/errorHandler');

const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { auth } = require('../middlewares/auth');

const { userInfoValidate } = require('../middlewares/validate/userValidate');
const { login, createUser } = require('../controllers/users');

router.post('/signin', userInfoValidate, login);
router.post('/signup', userInfoValidate, createUser);

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);

router.use('*', auth, (_, res, next) => {
  next(new CustomError('Страница не найдена', StatusCodes.NOT_FOUND));
});

module.exports = router;
