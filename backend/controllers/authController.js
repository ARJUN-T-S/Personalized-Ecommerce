const User = require('../models/User');
const Admin = require('../models/Admin');
const { generateToken } = require('../utils/generateToken');

// @desc   Register a new user
// @route  POST /api/auth/user/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Please provide name, email and password' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id, 'user'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Login user
// @route  POST /api/auth/user/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id, 'user'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Register a new admin
// @route  POST /api/auth/admin/register
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, storeName } = req.body;
    if (!name || !email || !password || !storeName) {
      return res.status(400).json({ message: 'Please provide name, email, password and storeName' });
    }

    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const admin = await Admin.create({ name, email, password, storeName });
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      storeName: admin.storeName,
      token: generateToken(admin._id, 'admin'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Login admin
// @route  POST /api/auth/admin/login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      storeName: admin.storeName,
      token: generateToken(admin._id, 'admin'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get current logged-in user profile
// @route  GET /api/auth/user/me
const getUserProfile = async (req, res) => {
  res.json(req.user);
};

// @desc   Get current logged-in admin profile
// @route  GET /api/auth/admin/me
const getAdminProfile = async (req, res) => {
  res.json(req.admin);
};

module.exports = { registerUser, loginUser, registerAdmin, loginAdmin, getUserProfile, getAdminProfile };
