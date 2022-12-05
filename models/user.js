const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { schemaAvatar, schemaEmail } = require('../validators/userValidator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => !schemaAvatar.validate(v).error,
      message: () => 'Указана некорректная ссылка на изображение.',
    },
  },
  email: {
    type: 'String',
    required: true,
    unique: true,
    validate: {
      validator: (v) => !schemaEmail.validate(v).error,
      message: () => 'Указана некорректный адрес почты.',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {
  versionKey: false,
  statics: {
    findUserByCredentials({ password, email }) {
      return this.findOne({ email })
        .select('+password')
        .then((userData) => {
          if (!userData) {
            return Promise.reject(new Error('Почта или пароль неверны'));
          }
          return bcrypt.compare(password, userData.password)
            .then((isSuccess) => {
              if (!isSuccess) {
                return Promise.reject(new Error('Почта или пароль неверны'));
              }

              const {
                password: removed,
                ...user
              } = userData.toObject();

              return user;
            });
        });
    },
  },
});

module.exports = mongoose.model('user', userSchema);
