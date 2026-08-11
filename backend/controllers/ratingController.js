const Rating = require('../models/Rating');
const Product = require('../models/Product');

// @desc   Create a rating
// @route  POST /api/ratings
const createRating = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating) return res.status(400).json({ message: 'productId and rating are required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const existing = await Rating.findOne({ userId: req.user._id, productId });
    if (existing) return res.status(400).json({ message: 'You already rated this product. Update instead.' });

    const newRating = await Rating.create({
      userId: req.user._id,
      adminId: product.adminId,
      productId,
      rating,
      comment,
    });

    const populated = await Rating.findById(newRating._id).populate('userId', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get ratings for a product
// @route  GET /api/ratings/product/:productId
const getProductRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ productId: req.params.productId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get ratings for admin's store products
// @route  GET /api/ratings/store
const getStoreRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ adminId: req.admin._id })
      .populate('userId', 'name')
      .populate('productId', 'name')
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update a rating (owner only)
// @route  PUT /api/ratings/:id
const updateRating = async (req, res) => {
  try {
    const ratingDoc = await Rating.findOne({ _id: req.params.id, userId: req.user._id });
    if (!ratingDoc) return res.status(404).json({ message: 'Rating not found or not authorized' });

    if (req.body.rating !== undefined) ratingDoc.rating = req.body.rating;
    if (req.body.comment !== undefined) ratingDoc.comment = req.body.comment;

    const updated = await ratingDoc.save();
    const populated = await Rating.findById(updated._id).populate('userId', 'name');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete a rating (owner only)
// @route  DELETE /api/ratings/:id
const deleteRating = async (req, res) => {
  try {
    const ratingDoc = await Rating.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!ratingDoc) return res.status(404).json({ message: 'Rating not found or not authorized' });
    res.json({ message: 'Rating deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRating, getProductRatings, getStoreRatings, updateRating, deleteRating };
