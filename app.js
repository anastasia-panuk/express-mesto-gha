const express = require('express');
const mongoose = require('mongoose');
const {
  NOT_FOUND_ERR,
  INTERNAL_SERVER_ERR,
} = require('./utils/constants/constants');
const auth = require('./middlewares/auth');
const {
  login,
  createUsers,
} = require('./controllers/users');

const { PORT = 3000, DB_CONN = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());

mongoose.connect(DB_CONN);

app.post('/signin', login);
app.post('/signup', createUsers);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERR).send({ message: 'Страница не найдена' });
});

app.use((err, req, res, next) => {
  const { statusCode, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === INTERNAL_SERVER_ERR
        ? 'Ошибка сервера.'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
