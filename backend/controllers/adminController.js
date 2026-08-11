const Admin = require('../models/Admin');

// @desc   Get all admins (public – store list for customers)
// @route  GET /api/admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single admin (public)
// @route  GET /api/admins/:id
const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update own admin profile
// @route  PUT /api/admins/profile
const updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    admin.name = req.body.name || admin.name;
    admin.storeName = req.body.storeName || admin.storeName;
    if (req.body.email) admin.email = req.body.email;
    if (req.body.password) admin.password = req.body.password;

    const updated = await admin.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      storeName: updated.storeName,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete own admin account
// @route  DELETE /api/admins/profile
const deleteAdminProfile = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.admin._id);
    res.json({ message: 'Admin account deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllAdmins, getAdminById, updateAdminProfile, deleteAdminProfile };
