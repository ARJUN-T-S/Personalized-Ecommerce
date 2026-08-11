const Cart = require('../models/Cart');
const Product = require('../models/Product');

const recalcTotal = (items) => items.reduce((sum, i) => sum + i.price * i.quantity, 0);

// @desc   Get cart for a specific store
// @route  GET /api/carts/:adminId
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id, adminId: req.params.adminId })
      .populate('items.productId', 'name image price stock');
    if (!cart) return res.json({ items: [], totalAmount: 0 });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all store carts of current logged-in user
// @route  GET /api/carts
const getMyCarts = async (req, res) => {
  try {
    const carts = await Cart.find({ userId: req.user._id })
      .populate('adminId', 'storeName name')
      .populate('items.productId', 'name image price');
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Add item to cart (or update quantity if already exists)
// @route  POST /api/carts
const addToCart = async (req, res) => {
  try {
    let { adminId, productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    quantity = Number(quantity);
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    // Find product to verify existence and extract adminId automatically if needed
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Extract store adminId from body (string or object) or fallback to product.adminId
    const storeAdminId = (typeof adminId === 'object' && adminId?._id)
      ? adminId._id
      : (adminId || product.adminId);

    if (!storeAdminId) {
      return res.status(400).json({ message: 'Store adminId is required' });
    }

    if (product.stock < 1) {
      return res.status(400).json({ message: 'This item is currently out of stock.' });
    }

    let cart = await Cart.findOne({ userId: req.user._id, adminId: storeAdminId });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, adminId: storeAdminId, items: [], totalAmount: 0 });
    }

    const existingIndex = cart.items.findIndex((i) => i.productId.toString() === productId.toString());
    if (existingIndex >= 0) {
      const existingQty = cart.items[existingIndex].quantity;
      if (existingQty >= product.stock) {
        return res.status(400).json({
          message: `You already have the maximum available stock (${product.stock}) of this item in your cart.`
        });
      }
      cart.items[existingIndex].quantity = Math.min(product.stock, existingQty + quantity);
    } else {
      const initialQty = Math.min(product.stock, quantity);
      cart.items.push({ productId: product._id, quantity: initialQty, price: product.price });
    }

    cart.totalAmount = recalcTotal(cart.items);
    await cart.save();

    const populated = await Cart.findById(cart._id).populate('items.productId', 'name image price stock');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update item quantity in cart
// @route  PUT /api/carts/:adminId/items/:productId
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

    const cart = await Cart.findOne({ userId: req.user._id, adminId: req.params.adminId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find((i) => i.productId.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    const product = await Product.findById(req.params.productId);
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Insufficient stock. Only ${product.stock} available.` });
    }

    item.quantity = quantity;
    cart.totalAmount = recalcTotal(cart.items);
    await cart.save();

    const populated = await Cart.findById(cart._id).populate('items.productId', 'name image price stock');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Remove single item from cart
// @route  DELETE /api/carts/:adminId/items/:productId
const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id, adminId: req.params.adminId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter((i) => i.productId.toString() !== req.params.productId);
    cart.totalAmount = recalcTotal(cart.items);
    await cart.save();

    const populated = await Cart.findById(cart._id).populate('items.productId', 'name image price stock');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Clear entire cart
// @route  DELETE /api/carts/:adminId
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user._id, adminId: req.params.adminId });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, getMyCarts, addToCart, updateCartItem, removeCartItem, clearCart };
