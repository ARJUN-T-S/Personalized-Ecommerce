const express = require('express');
const router = express.Router();
const { getCart, getMyCarts, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cartController');
const { protectUser } = require('../middleware/authMiddleware');

router.use(protectUser);

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Get all carts for logged-in user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user carts
 *   post:
 *     summary: Add product item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, storeId]
 *             properties:
 *               productId:
 *                 type: string
 *               storeId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart item added
 */
router.get('/', getMyCarts);
router.post('/', addToCart);

/**
 * @swagger
 * /api/carts/{adminId}:
 *   get:
 *     summary: Get cart items for specific store
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart details
 *   delete:
 *     summary: Clear cart for specific store
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.get('/:adminId', getCart);
router.delete('/:adminId', clearCart);

/**
 * @swagger
 * /api/carts/{adminId}/items/{productId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item quantity updated
 *   delete:
 *     summary: Remove single item from store cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from cart
 */
router.put('/:adminId/items/:productId', updateCartItem);
router.delete('/:adminId/items/:productId', removeCartItem);

module.exports = router;
