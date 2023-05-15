const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../middlewares/errorHandler');

const User = require('../models/user');

const ERROR_CODE = 400;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

module.exports.getUserId = (req, res, next) => {
  const userId = req.params.id;
  User.exists({ _id: userId })
    .then((exists) => {
      if (exists) {
        User.findById(userId)
          .then((user) => {
            res.status(200).send({ data: user });
          })
          .catch((err) => next(err));
      } else {
        next(new CustomError('Такого пользователя нет', StatusCodes.NOT_FOUND));
      }
    })
    .catch(() => {
      next(new CustomError('Ошибка запроса', StatusCodes.BAD_REQUEST));
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 15)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CustomError('Ошибка запроса', StatusCodes.BAD_REQUEST));
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new CustomError('Такого пользователя нет', StatusCodes.NOT_FOUND));
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CustomError('Ошибка запроса', StatusCodes.BAD_REQUEST));
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CustomError('Такого пользователя нет', StatusCodes.NOT_FOUND));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = User.findOne({ email }).select('+password');

    if (!user) {
      next(new CustomError('Неверный email или пароль', StatusCodes.UNAUTHORIZED));
    }
    const passwordMatch = bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      next(new CustomError('Неверный email или пароль', StatusCodes.UNAUTHORIZED));
    }
    const token = jwt.sign({ _id: user._id }, 'secret', { expiresIn: '7d' });

    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(200).json({ message: 'Успешный вход' });
  } catch (err) {
    next(err);
  }
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  try {
    const user = User.findById(req.user._id);
    if (!user) {
      next(new CustomError('Такого пользователя нет', StatusCodes.NOT_FOUND));
    }
    return res.json({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
    });
  } catch (err) {
    return next(err);
  }
};
