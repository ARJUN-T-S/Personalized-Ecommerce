const express = require('express');
const router = express.Router();
const {
  createCategory, getMyCategories, getCategoriesByStore, updateCategory, deleteCategory
} = require('../controllers/categoryController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/store/:adminId', getCategoriesByStore);          // Public
router.get('/', protectAdmin, getMyCategories);               // Admin: own categories
router.post('/', protectAdmin, createCategory);               // Admin: create
router.put('/:id', protectAdmin, updateCategory);             // Admin: update own
router.delete('/:id', protectAdmin, deleteCategory);          // Admin: delete own

module.exports = router;
