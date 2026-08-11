const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc   Place an order from cart
// @route  POST /api/orders
const placeOrder = async (req, res) => {
  try {
    const { adminId } = req.body;
    if (!adminId) return res.status(400).json({ message: 'adminId is required' });

    // Get the user's cart for this store
    const cart = await Cart.findOne({ userId: req.user._id, adminId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Fetch all products and verify stock
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(400).json({ message: `Product ${item.productId} not found` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price, // Always use current DB price
      });
      totalAmount += product.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      userId: req.user._id,
      adminId,
      items: orderItems,
      totalAmount,
      status: 'Pending',
    });

    // Reduce stock for each product
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    // Clear the cart
    await Cart.findByIdAndDelete(cart._id);

    const populated = await Order.findById(order._id)
      .populate('items.productId', 'name image')
      .populate('adminId', 'storeName');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get logged-in user's orders
// @route  GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId', 'name image')
      .populate('adminId', 'storeName')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single order by ID
// @route  GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId', 'name image price')
      .populate('adminId', 'storeName name')
      .populate('userId', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only the owner or the store admin can view
    const isUser = req.user && order.userId._id.toString() === req.user._id.toString();
    const isAdmin = req.admin && order.adminId._id.toString() === req.admin._id.toString();
    if (!isUser && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get orders for admin's store
// @route  GET /api/orders/store
const getStoreOrders = async (req, res) => {
  try {
    const orders = await Order.find({ adminId: req.admin._id })
      .populate('userId', 'name email')
      .populate('items.productId', 'name image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update order status (admin only)
// @route  PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findOne({ _id: req.params.id, adminId: req.admin._id });
    if (!order) return res.status(404).json({ message: 'Order not found or not authorized' });

    order.status = status;
    // If cancelled, restore stock
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
      }
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete an order (admin only)
// @route  DELETE /api/orders/:id
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ _id: req.params.id, adminId: req.admin._id });
    if (!order) return res.status(404).json({ message: 'Order not found or not authorized' });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, getStoreOrders, updateOrderStatus, deleteOrder };
