import User from '../Models/Users.js';
import Package from '../Models/packge.js';

// Get all users (admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'admin' });
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all packages (admin view)
export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().populate('bookedBy');
    res.json(packages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};