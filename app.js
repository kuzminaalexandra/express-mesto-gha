const express = require('express');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errorHandler } = require('./middlewares/errorHandler');

const router = require('./routes/index');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);

app.use(errors());
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
