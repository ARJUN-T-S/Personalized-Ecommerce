const express = require('express');
const router = express.Router();
const {
  createRating, getProductRatings, getStoreRatings, updateRating, deleteRating
} = require('../controllers/ratingController');
const { protectUser, protectAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/ratings/product/{productId}:
 *   get:
 *     summary: Get ratings for specific product
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of ratings
 */
router.get('/product/:productId', getProductRatings);

/**
 * @swagger
 * /api/ratings/store:
 *   get:
 *     summary: Get store ratings for logged-in admin
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin store ratings
 */
router.get('/store', protectAdmin, getStoreRatings);

/**
 * @swagger
 * /api/ratings:
 *   post:
 *     summary: Submit rating for a product
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, storeId, rating]
 *             properties:
 *               productId:
 *                 type: string
 *               storeId:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rating created
 */
router.post('/', protectUser, createRating);

/**
 * @swagger
 * /api/ratings/{id}:
 *   put:
 *     summary: Update own rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rating updated
 *   delete:
 *     summary: Delete own rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rating deleted
 */
router.put('/:id', protectUser, updateRating);
router.delete('/:id', protectUser, deleteRating);

module.exports = router;
