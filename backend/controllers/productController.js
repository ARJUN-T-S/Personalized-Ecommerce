const Product = require('../models/Product');

// @desc   Create product (admin only)
// @route  POST /api/products
const createProduct = async (req, res) => {
  try {
    const { categoryId, name, description, price, stock, image } = req.body;
    if (!categoryId || !name || price === undefined) {
      return res.status(400).json({ message: 'categoryId, name and price are required' });
    }

    const product = await Product.create({
      adminId: req.admin._id,
      categoryId,
      name,
      description,
      price,
      stock: stock || 0,
      image: image || '',
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get products for own store (admin)
// @route  GET /api/products
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ adminId: req.admin._id })
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get products by store (public)
// @route  GET /api/products/store/:adminId
const getProductsByStore = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { adminId: req.params.adminId };
    if (category) filter.categoryId = category;

    const products = await Product.find(filter)
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single product by ID (public)
// @route  GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId', 'name')
      .populate('adminId', 'storeName name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update product (admin only – own store)
// @route  PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, adminId: req.admin._id });
    if (!product) return res.status(404).json({ message: 'Product not found or not authorized' });

    const { categoryId, name, description, price, stock, image } = req.body;
    if (categoryId) product.categoryId = categoryId;
    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (image !== undefined) product.image = image;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete product (admin only – own store)
// @route  DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, adminId: req.admin._id });
    if (!product) return res.status(404).json({ message: 'Product not found or not authorized' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProduct, getMyProducts, getProductsByStore, getProductById, updateProduct, deleteProduct };
