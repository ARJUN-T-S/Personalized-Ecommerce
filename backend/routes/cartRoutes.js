const express = require('express');
const router = express.Router();
const { getCart, getMyCarts, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cartController');
const { protectUser } = require('../middleware/authMiddleware');

router.use(protectUser);

router.get('/', getMyCarts);
router.get('/:adminId', getCart);
router.post('/', addToCart);
router.put('/:adminId/items/:productId', updateCartItem);
router.delete('/:adminId/items/:productId', removeCartItem);
router.delete('/:adminId', clearCart);

module.exports = router;
