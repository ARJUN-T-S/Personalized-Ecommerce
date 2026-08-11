const Category = require('../models/Category');

// @desc   Create category (admin only)
// @route  POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    const category = await Category.create({ adminId: req.admin._id, name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get categories for own store (admin)
// @route  GET /api/categories
const getMyCategories = async (req, res) => {
  try {
    const categories = await Category.find({ adminId: req.admin._id }).sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get categories by store adminId (public)
// @route  GET /api/categories/store/:adminId
const getCategoriesByStore = async (req, res) => {
  try {
    const categories = await Category.find({ adminId: req.params.adminId }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update category (admin only – own store)
// @route  PUT /api/categories/:id
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, adminId: req.admin._id });
    if (!category) return res.status(404).json({ message: 'Category not found or not authorized' });

    category.name = req.body.name || category.name;
    category.description = req.body.description !== undefined ? req.body.description : category.description;

    const updated = await category.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete category (admin only – own store)
// @route  DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, adminId: req.admin._id });
    if (!category) return res.status(404).json({ message: 'Category not found or not authorized' });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCategory, getMyCategories, getCategoriesByStore, updateCategory, deleteCategory };
