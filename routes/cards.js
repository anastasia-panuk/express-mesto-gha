const router = require('express').Router();
const {
  getCards,
  createCards,
  getCardId,
  putLikes,
  deleteLikes,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', getCardId);
router.post('/', createCards);
router.put('/:cardId/likes', putLikes);
router.delete('/:cardId/likes', deleteLikes);

module.exports = router;
