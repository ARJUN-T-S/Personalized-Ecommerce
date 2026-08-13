const express = require('express');
const router = express.Router();
const { getAllAdmins, getAdminById, updateAdminProfile, deleteAdminProfile } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/admins:
 *   get:
 *     summary: Get all stores / admins
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: List of all registered stores
 */
router.get('/', getAllAdmins);

/**
 * @swagger
 * /api/admins/profile:
 *   put:
 *     summary: Update current store admin profile
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               storeName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated profile
 *   delete:
 *     summary: Delete current store admin account
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 */
router.put('/profile', protectAdmin, updateAdminProfile);
router.delete('/profile', protectAdmin, deleteAdminProfile);

/**
 * @swagger
 * /api/admins/{id}:
 *   get:
 *     summary: Get store / admin details by ID
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store detail data
 */
router.get('/:id', getAdminById);

module.exports = router;
