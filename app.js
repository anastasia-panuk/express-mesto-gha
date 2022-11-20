const express = require('express');
const mongoose = require('mongoose');
const { NOT_FOUND_ERR } = require('./utils/constants/constants');

const { PORT = 3000, DB_CONN = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());

mongoose.connect(DB_CONN);

app.use((req, res, next) => {
  req.user = {
    _id: '636bf51c9763e2b834175a94',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERR).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
