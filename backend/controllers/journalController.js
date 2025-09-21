const JournalEntry = require('../models/journalEntry');
const { v4: uuidv4 } = require('uuid');

// Create a new journal entry
const createJournalEntry = async (req, res) => {
  try {
    const { title, content, mood_score, tags, entry_date, accessible_in_chat } = req.body;
    const user_id = req.user.user_id;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const entry_id = uuidv4();
    
    const journalEntry = new JournalEntry({
      entry_id,
      user_id,
      title,
      content,
      mood_score,
      tags: tags || [],
      accessible_in_chat: accessible_in_chat !== undefined ? accessible_in_chat : true,
      entry_date: entry_date ? new Date(entry_date) : new Date()
    });

    await journalEntry.save();

    res.status(201).json({
      message: 'Journal entry created successfully',
      entry: journalEntry
    });
  } catch (error) {
    console.error('Create journal entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all journal entries for a user
const getJournalEntries = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Optional filters
    const { mood_min, mood_max, tag, from_date, to_date } = req.query;
    
    let query = { user_id };
    
    // Add mood filter
    if (mood_min || mood_max) {
      query.mood_score = {};
      if (mood_min) query.mood_score.$gte = parseInt(mood_min);
      if (mood_max) query.mood_score.$lte = parseInt(mood_max);
    }
    
    // Add tag filter
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    // Add date range filter
    if (from_date || to_date) {
      query.entry_date = {};
      if (from_date) query.entry_date.$gte = new Date(from_date);
      if (to_date) query.entry_date.$lte = new Date(to_date);
    }

    const entries = await JournalEntry.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ entry_date: -1, created_at: -1 });

    const total = await JournalEntry.countDocuments(query);

    res.json({
      entries,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_entries: total,
        has_next: page < Math.ceil(total / limit),
        has_prev: page > 1
      }
    });
  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single journal entry
const getJournalEntry = async (req, res) => {
  try {
    const { entryId } = req.params;
    const user_id = req.user.user_id;

    const entry = await JournalEntry.findOne({ entry_id: entryId, user_id });
    
    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.json({ entry });
  } catch (error) {
    console.error('Get journal entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a journal entry
const updateJournalEntry = async (req, res) => {
  try {
    const { entryId } = req.params;
    const user_id = req.user.user_id;
    const { title, content, mood_score, tags, accessible_in_chat } = req.body;

    const entry = await JournalEntry.findOne({ entry_id: entryId, user_id });
    
    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    // Update fields if provided
    if (title !== undefined) entry.title = title;
    if (content !== undefined) entry.content = content;
    if (mood_score !== undefined) entry.mood_score = mood_score;
    if (tags !== undefined) entry.tags = tags;
    if (accessible_in_chat !== undefined) entry.accessible_in_chat = accessible_in_chat;

    await entry.save();

    res.json({
      message: 'Journal entry updated successfully',
      entry
    });
  } catch (error) {
    console.error('Update journal entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a journal entry
const deleteJournalEntry = async (req, res) => {
  try {
    const { entryId } = req.params;
    const user_id = req.user.user_id;

    const entry = await JournalEntry.findOneAndDelete({ entry_id: entryId, user_id });
    
    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Delete journal entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get mood statistics
const getMoodStats = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { days = 30 } = req.query; // Default to last 30 days
    
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - parseInt(days));

    const moodData = await JournalEntry.aggregate([
      {
        $match: {
          user_id,
          mood_score: { $exists: true, $ne: null },
          entry_date: { $gte: fromDate }
        }
      },
      {
        $group: {
          _id: null,
          avgMood: { $avg: '$mood_score' },
          minMood: { $min: '$mood_score' },
          maxMood: { $max: '$mood_score' },
          count: { $sum: 1 },
          entries: { $push: { date: '$entry_date', mood: '$mood_score' } }
        }
      }
    ]);

    const result = moodData.length > 0 ? moodData[0] : {
      avgMood: null,
      minMood: null,
      maxMood: null,
      count: 0,
      entries: []
    };

    res.json({
      period_days: parseInt(days),
      average_mood: result.avgMood ? Math.round(result.avgMood * 100) / 100 : null,
      min_mood: result.minMood,
      max_mood: result.maxMood,
      entries_count: result.count,
      mood_entries: result.entries.sort((a, b) => a.date - b.date)
    });
  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createJournalEntry,
  getJournalEntries,
  getJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getMoodStats
};
