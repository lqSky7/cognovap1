const express = require('express');
const journalController = require('../controllers/journalController');
const auth = require('../middleware/auth');

const router = express.Router();

// All journal routes require authentication
router.use(auth);

// Journal entries
router.post('/', journalController.createJournalEntry);
router.get('/', journalController.getJournalEntries);
router.get('/mood-stats', journalController.getMoodStats);
router.get('/:entryId', journalController.getJournalEntry);
router.put('/:entryId', journalController.updateJournalEntry);
router.delete('/:entryId', journalController.deleteJournalEntry);

module.exports = router;
