const express = require('express');
const router = express.Router();
const {
  createRating, getProductRatings, getStoreRatings, updateRating, deleteRating
} = require('../controllers/ratingController');
const { protectUser, protectAdmin } = require('../middleware/authMiddleware');

router.get('/product/:productId', getProductRatings);         // Public
router.get('/store', protectAdmin, getStoreRatings);          // Admin: own store ratings
router.post('/', protectUser, createRating);                  // User: create
router.put('/:id', protectUser, updateRating);                // User: update own
router.delete('/:id', protectUser, deleteRating);             // User: delete own

module.exports = router;
