const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUserProfile, deleteUserProfile } = require('../controllers/userController');
const { protectUser } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get user list
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', protectUser, getAllUsers);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update profile of logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Updated profile
 *   delete:
 *     summary: Delete profile of logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted
 */
router.put('/profile', protectUser, updateUserProfile);
router.delete('/profile', protectUser, deleteUserProfile);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
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
 *         description: User profile details
 */
router.get('/:id', protectUser, getUserById);

module.exports = router;
