const { mongoose } = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'E-mail обязателен к заполнению'],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Неправильный email или пароль',
    },
  },
  password: {
    type: String,
    required: [true, 'Пароль обязателен к заполнению'],
    select: false,
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Длина не должна превышать 30 символов'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Длина не должна превышать 30 символов'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Укажите корректную ссылку',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
