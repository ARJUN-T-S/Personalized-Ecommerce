const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUserProfile, deleteUserProfile } = require('../controllers/userController');
const { protectUser } = require('../middleware/authMiddleware');

router.get('/', protectUser, getAllUsers);
router.get('/:id', protectUser, getUserById);
router.put('/profile', protectUser, updateUserProfile);
router.delete('/profile', protectUser, deleteUserProfile);

module.exports = router;
