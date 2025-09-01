const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google-signin', authController.googleSignin);
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.put('/change-password', auth, authController.changePassword);
router.put('/deactivate', auth, authController.deactivateAccount);
router.delete('/delete-account', auth, authController.deleteAccount);
router.post('/logout', authController.logout);

module.exports = router;
