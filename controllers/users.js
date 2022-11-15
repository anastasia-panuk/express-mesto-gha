const User = require('../models/user');

const BAD_REQUEST_ERR = 400;
const NOT_FOUND_ERR = 404;
const INTERNAL_SERVER_ERR = 500;

module.exports.getUsers = (req, res) => {
  User.find({}).then((users) => res.send(users))
    .catch(() => {
      res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера.' });
    });
};

module.exports.createUsers = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERR).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера.' });
      }
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((userId) => {
      res.send(userId);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERR).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера.' });
      }
    });
};

module.exports.updUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERR).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERR).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера.' });
      }
    });
};

module.exports.updAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERR).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERR).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера.' });
      }
    });
};
