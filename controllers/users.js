const User = require('../models/user');
const {
  BAD_REQUEST_ERR,
  NOT_FOUND_ERR,
  INTERNAL_SERVER_ERR,
  CREATED_STATUS,
} = require('../utils/constants/constants');

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
      res.status(CREATED_STATUS).send(user);
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
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERR).send({ message: 'Пользователь с указанным _id не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERR).send({ message: 'Передан невалидный _id пользователя' });
      } else {
        res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера.' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERR).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERR).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера.' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERR).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERR).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else {
        res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера.' });
      }
    });
};
