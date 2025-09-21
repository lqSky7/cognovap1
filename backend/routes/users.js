const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// User management routes (admin only)
router.get('/', auth, adminAuth, userController.getAllUsers);
router.get('/stats', auth, adminAuth, userController.getUserStats);
router.get('/search', auth, adminAuth, userController.searchUsers);
router.get('/:userId', auth, userController.getUserById); // Can view own profile or admin can view any
router.put('/:userId/status', auth, adminAuth, userController.updateUserStatus);
router.delete('/:userId', auth, adminAuth, userController.adminDeleteUser);

module.exports = router;
