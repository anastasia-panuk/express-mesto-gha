const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const {
  INTERNAL_SERVER_ERR,
} = require('./utils/constants/constants');
const NotFoundError = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');
const {
  login,
  createUsers,
} = require('./controllers/users');
const { bodyUser, bodyAuth } = require('./validators/user');

const { PORT = 3000, DB_CONN = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());

mongoose.connect(DB_CONN);

app.post('/signin', bodyAuth, login);
app.post('/signup', bodyUser, createUsers);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());
app.use((err, req, res, next) => {
  const status = err.statusCode || INTERNAL_SERVER_ERR;
  const message = status === INTERNAL_SERVER_ERR ? 'Ошибка сервера' : err.message;
  res.status(status).send({ message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
