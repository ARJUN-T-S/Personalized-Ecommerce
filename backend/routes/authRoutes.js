const express = require('express');
const router = express.Router();
const {
  registerUser, loginUser, registerAdmin, loginAdmin, getUserProfile, getAdminProfile
} = require('../controllers/authController');
const { protectUser, protectAdmin } = require('../middleware/authMiddleware');

router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.get('/user/me', protectUser, getUserProfile);

router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);
router.get('/admin/me', protectAdmin, getAdminProfile);

module.exports = router;
