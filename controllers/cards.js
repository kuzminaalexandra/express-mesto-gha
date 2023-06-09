const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../middlewares/errorHandler');

const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new CustomError('Карточка не найдена', StatusCodes.NOT_FOUND);
      }
      if (card.owner.toString() !== req.user._id) {
        throw new CustomError('У вас нет доступа к удалению этой карточки', StatusCodes.FORBIDDEN);
      }
      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((deletedCard) => {
      if (deletedCard) {
        res.send({ data: deletedCard });
      } else {
        throw new CustomError('Карточка не найдена', StatusCodes.NOT_FOUND);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CustomError('Некорректные данные', StatusCodes.BAD_REQUEST));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        next(new CustomError('Карточка не найдена', StatusCodes.NOT_FOUND));
      }
    })
    .catch((err) => next(err));
};

module.exports.dislikeCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        next(new CustomError('Карточка не найдена', StatusCodes.NOT_FOUND));
      }
    })
    .catch((err) => next(err));
};
