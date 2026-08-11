const express = require('express');
const router = express.Router();
const { getAllAdmins, getAdminById, updateAdminProfile, deleteAdminProfile } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/', getAllAdmins);
router.get('/:id', getAdminById);
router.put('/profile', protectAdmin, updateAdminProfile);
router.delete('/profile', protectAdmin, deleteAdminProfile);

module.exports = router;
