const { mongoose } = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Введите имя карточки'],
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Длина не должна превышать 30 символов'],
  },
  link: {
    type: String,
    required: [true, 'Обязательно к заполнению'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Укажите корректную ссылку',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Обязательно к заполнению'],
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
