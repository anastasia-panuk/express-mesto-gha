const router = require('express').Router();
const {
  getUsers,
  getUserId,
  updateUser,
  updateAvatar,
  getMe,
} = require('../controllers/users');
const {
  paramsUser,
  bodyUsers,
  bodyMe,
  bodyAvatar,
} = require('../validators/user');

router.get('/', bodyUsers, getUsers);
router.patch('/me', bodyMe, updateUser);
router.patch('/me/avatar', bodyAvatar, updateAvatar);
router.get('/me', getMe);
router.get('/:userId', paramsUser, getUserId);

module.exports = router;
