const express = require('express');
const router = express.Router();
const {
  registerUser, loginUser, registerAdmin, loginAdmin, getUserProfile, getAdminProfile
} = require('../controllers/authController');
const { protectUser, protectAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/auth/user/register:
 *   post:
 *     summary: Register a new customer user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       210:
 *         description: User created successfully
 */
router.post('/user/register', registerUser);

/**
 * @swagger
 * /api/auth/user/login:
 *   post:
 *     summary: Customer login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful with JWT token
 */
router.post('/user/login', loginUser);

/**
 * @swagger
 * /api/auth/user/me:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 */
router.get('/user/me', protectUser, getUserProfile);

/**
 * @swagger
 * /api/auth/admin/register:
 *   post:
 *     summary: Register a new store admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, storeName]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               storeName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created successfully
 */
router.post('/admin/register', registerAdmin);

/**
 * @swagger
 * /api/auth/admin/login:
 *   post:
 *     summary: Store admin login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful with JWT token
 */
router.post('/admin/login', loginAdmin);

/**
 * @swagger
 * /api/auth/admin/me:
 *   get:
 *     summary: Get current authenticated store admin profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile data
 */
router.get('/admin/me', protectAdmin, getAdminProfile);

module.exports = router;
