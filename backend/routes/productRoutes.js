const express = require('express');
const router = express.Router();
const {
  createProduct, getMyProducts, getProductsByStore, getProductById, updateProduct, deleteProduct
} = require('../controllers/productController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/store/:adminId', getProductsByStore);            // Public: store products
router.get('/:id', getProductById);                           // Public: single product
router.get('/', protectAdmin, getMyProducts);                 // Admin: own products
router.post('/', protectAdmin, createProduct);                // Admin: create
router.put('/:id', protectAdmin, updateProduct);              // Admin: update own
router.delete('/:id', protectAdmin, deleteProduct);           // Admin: delete own

module.exports = router;
