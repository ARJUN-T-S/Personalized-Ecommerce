const express = require('express');
const router = express.Router();
const {
  createCategory, getMyCategories, getCategoriesByStore, updateCategory, deleteCategory
} = require('../controllers/categoryController');
const { protectAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/categories/store/{adminId}:
 *   get:
 *     summary: Get categories for specific store
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/store/:adminId', getCategoriesByStore);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get categories owned by logged-in store admin
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category list
 *   post:
 *     summary: Create new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 */
router.get('/', protectAdmin, getMyCategories);
router.post('/', protectAdmin, createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category by ID
 *     tags: [Categories]
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
 *         description: Category updated
 *   delete:
 *     summary: Delete category by ID
 *     tags: [Categories]
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
 *         description: Category deleted
 */
router.put('/:id', protectAdmin, updateCategory);
router.delete('/:id', protectAdmin, deleteCategory);

module.exports = router;
