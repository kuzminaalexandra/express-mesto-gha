const express = require('express');
const router = require('express').Router();

const mongoose = require('mongoose');

const auth = require('./middlewares/auth');

const { userInfoValidate } = require('./middlewares/validate/userValidate');

const { login, createUser } = require('./controllers/users');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { errorHandler } = require('./middlewares/errorHandler');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const app = express();
app.use(express.json());

router.post('/signin', userInfoValidate, login);
router.post('/signup', userInfoValidate, createUser);

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);

app.use('*', auth, (_, res) => {
  res.status(404).send({ message: 'Такой страницы не существует' });
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
