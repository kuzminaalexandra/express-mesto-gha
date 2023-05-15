const cardsRouter = require('express').Router();
const {
  getCards, createCard, deleteCard, dislikeCard, likeCard,
} = require('../controllers/cards');

const { cardValidate, cardIdValidate } = require('../middlewares/validate/cardValidate');

cardsRouter.get('/', getCards);
cardsRouter.post('/', cardValidate, createCard);
cardsRouter.delete('/:cardId', cardIdValidate, deleteCard);
cardsRouter.delete('/:cardId/likes', cardIdValidate, dislikeCard);
cardsRouter.put('/:cardId/likes', cardIdValidate, likeCard);

module.exports = cardsRouter;
