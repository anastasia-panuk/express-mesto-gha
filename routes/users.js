const router = require('express').Router();
const {
  getUsers,
  createUsers,
  getUserId,
  updUser,
  updAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.post('/', createUsers);
router.patch('/me', updUser);
router.patch('/me/avatar', updAvatar);

module.exports = router;
