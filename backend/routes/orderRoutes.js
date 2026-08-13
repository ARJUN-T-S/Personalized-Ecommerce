const express = require('express');
const router = express.Router();
const {
  placeOrder, getMyOrders, getOrderById, getStoreOrders, updateOrderStatus, deleteOrder
} = require('../controllers/orderController');
const { protectUser, protectAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [storeId, items]
 *             properties:
 *               storeId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *               shippingAddress:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post('/', protectUser, placeOrder);

/**
 * @swagger
 * /api/orders/my:
 *   get:
 *     summary: Get logged-in user order history
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User orders
 */
router.get('/my', protectUser, getMyOrders);

/**
 * @swagger
 * /api/orders/store:
 *   get:
 *     summary: Get store orders for logged-in admin
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Store order list
 */
router.get('/store', protectAdmin, getStoreOrders);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/:id/status', protectAdmin, updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete order (Admin)
 *     tags: [Orders]
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
 *         description: Order deleted
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
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
 *         description: Order details
 */
router.delete('/:id', protectAdmin, deleteOrder);

router.get('/:id', (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const jwt = require('jsonwebtoken');
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    if (decoded.role === 'admin') {
      const Admin = require('../models/Admin');
      Admin.findById(decoded.id).select('-password').then(admin => {
        req.admin = admin;
        next();
      });
    } else {
      const User = require('../models/User');
      User.findById(decoded.id).select('-password').then(user => {
        req.user = user;
        next();
      });
    }
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}, getOrderById);

module.exports = router;
