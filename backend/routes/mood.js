const express = require('express');
const moodController = require('../controllers/moodController');
const auth = require('../middleware/auth');

const router = express.Router();

// All mood routes require authentication
router.use(auth);

// Mood tracking
router.post('/', moodController.setMood);
router.get('/', moodController.getMoodEntries);
router.get('/today', moodController.getTodayMood);
router.get('/insights', moodController.getMoodInsights);
router.delete('/:date', moodController.deleteMoodEntry);

module.exports = router;
