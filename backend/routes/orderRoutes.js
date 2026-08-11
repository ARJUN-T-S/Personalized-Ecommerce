const express = require('express');
const router = express.Router();
const {
  placeOrder, getMyOrders, getOrderById, getStoreOrders, updateOrderStatus, deleteOrder
} = require('../controllers/orderController');
const { protectUser, protectAdmin } = require('../middleware/authMiddleware');

// User routes
router.post('/', protectUser, placeOrder);
router.get('/my', protectUser, getMyOrders);

// Admin routes
router.get('/store', protectAdmin, getStoreOrders);
router.put('/:id/status', protectAdmin, updateOrderStatus);
router.delete('/:id', protectAdmin, deleteOrder);

// Shared – either user or admin can access (controller handles auth check)
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
