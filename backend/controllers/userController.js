const User = require('../models/user');

// Get all users (admin function)
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('-password_hash')
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 });

    const total = await User.countDocuments({});

    res.json({
      users,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_users: total,
        has_next: page < Math.ceil(total / limit),
        has_prev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.user_id;

    // Check if user is requesting their own profile or is admin
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
    const requestingUser = await User.findOne({ user_id: requestingUserId });
    const isAdmin = adminEmails.includes(requestingUser.email);
    
    if (userId !== requestingUserId && !isAdmin) {
      return res.status(403).json({ message: 'Access denied. Can only view your own profile.' });
    }

    const user = await User.findOne({ user_id: userId }).select('-password_hash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(query, 'i');
    const searchConditions = {
      $or: [
        { username: searchRegex },
        { email: searchRegex },
        { first_name: searchRegex },
        { last_name: searchRegex }
      ]
    };

    const users = await User.find(searchConditions)
      .select('-password_hash')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ created_at: -1 });

    const total = await User.countDocuments(searchConditions);

    res.json({
      users,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_users: total,
        query
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const activeUsers = await User.countDocuments({ is_active: true });
    const inactiveUsers = await User.countDocuments({ is_active: false });
    
    // Users registered in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({ 
      created_at: { $gte: thirtyDaysAgo } 
    });

    // Users registered today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayUsers = await User.countDocuments({ 
      created_at: { $gte: today } 
    });

    res.json({
      total_users: totalUsers,
      active_users: activeUsers,
      inactive_users: inactiveUsers,
      new_users_last_30_days: newUsers,
      users_registered_today: todayUsers,
      activity_rate: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(2) : 0
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Update user status
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({ message: 'is_active must be a boolean value' });
    }

    const user = await User.findOneAndUpdate(
      { user_id: userId },
      { is_active },
      { new: true }
    ).select('-password_hash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: `User ${is_active ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Delete user
const adminDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOneAndDelete({ user_id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  searchUsers,
  getUserStats,
  updateUserStatus,
  adminDeleteUser
};
