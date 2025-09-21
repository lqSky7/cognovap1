const User = require('../models/user');

// Admin middleware - checks if user is admin
const adminAuth = async (req, res, next) => {
  try {
    // Get user from auth middleware
    const userId = req.user.user_id;
    
    const user = await User.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has admin role (you might want to add an admin field to User model)
    // For now, we'll use a simple env var approach or check if it's the first user
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
    
    if (!adminEmails.includes(user.email)) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = adminAuth;
