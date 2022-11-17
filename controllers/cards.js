const Card = require('../models/card');

const BAD_REQUEST_ERR = 400;
const NOT_FOUND_ERR = 404;
const INTERNAL_SERVER_ERR = 500;

module.exports.getCards = (req, res) => {
  Card.find({}).then((card) => {
    if (card === null) {
      res.status(NOT_FOUND_ERR).send({ message: 'Карточка не найдена.' });
    }
    res.send(card);
  })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера.' });
    });
};

module.exports.createCards = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERR).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера.' });
      }
    });
};

module.exports.getCardId = (req, res) => {
  Card.findById(req.params.cardId)
    .then((cardId) => res.send(cardId))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERR).send({ message: 'Карточка с указанным _id не найдена.' });
      }
    });
};

module.exports.putLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => {
      if (card === null) {
        res.status(NOT_FOUND_ERR).send({ message: 'Передан несуществующий _id карточки.' });
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERR).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else {
        res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера.' });
      }
    });
};

module.exports.deleteLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => {
      if (card === null) {
        res.status(NOT_FOUND_ERR).send({ message: 'Передан несуществующий _id карточки.' });
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERR).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      } else {
        res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера.' });
      }
    });
};
