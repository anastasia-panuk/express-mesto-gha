const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { urlRegExp } = require('../utils/constants/constants');

// const avatarRegExp = /^https?:\/\/[www.]?[a-zA-Z0-9]+[\w\-._~:/?#[\]$&'()*+,;*]{2,}#?$/;
// const emailRegExp = /^([a-z0-9_.-]+)@([a-z0-9_.-]+)\.([a-z.]{2,6})$/;

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
      validator: (v) => (urlRegExp).test(v),
      message: () => 'Указана некорректная ссылка изображение',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: () => 'Указан некорректный адрес почты',
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

// userSchema.statics.findUserByCredentials = function ({ email, password }) {
//   return this.findOne({ email })
//     .select('+password')
//     .then((user) => {
//       if (!user) {
//         return Promise.reject(new Error('Почта или пароль неверны'));
//       }
//       console.log(password, user.password);
//       return bcrypt.compare(password, user.password)
//         .then((matched) => {
//           if (!matched) {
//             return Promise.reject(new Error('Почта или пароль неверны'));
//           }
//           return user;
//         });
//     });
// };

module.exports = mongoose.model('user', userSchema);
