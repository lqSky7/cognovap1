const User = require('../models/user');
const mongoose = require('mongoose');

// Create a mood tracking schema for daily moods
const moodTrackingSchema = new mongoose.Schema({
  user_id: { type: String, required: true, ref: 'User' },
  date: { type: Date, required: true },
  mood_score: { type: Number, required: true, min: 1, max: 10 },
  energy_level: { type: Number, min: 1, max: 10 },
  anxiety_level: { type: Number, min: 1, max: 10 },
  sleep_quality: { type: Number, min: 1, max: 10 },
  notes: { type: String },
  activities: [{ type: String }], // Array of activities done that day
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Compound index to ensure one mood entry per user per day
moodTrackingSchema.index({ user_id: 1, date: 1 }, { unique: true });

const MoodTracking = mongoose.model('MoodTracking', moodTrackingSchema);

// Set or update daily mood
const setMood = async (req, res) => {
  try {
    const { 
      mood_score, 
      energy_level, 
      anxiety_level, 
      sleep_quality, 
      notes, 
      activities,
      date 
    } = req.body;
    const user_id = req.user.user_id;

    if (!mood_score || mood_score < 1 || mood_score > 10) {
      return res.status(400).json({ 
        message: 'Mood score is required and must be between 1 and 10' 
      });
    }

    // Use provided date or today's date
    const trackingDate = date ? new Date(date) : new Date();
    // Set to start of day to ensure uniqueness
    trackingDate.setHours(0, 0, 0, 0);

    // Try to update existing entry for this date, or create new one
    const moodEntry = await MoodTracking.findOneAndUpdate(
      { user_id, date: trackingDate },
      {
        mood_score,
        energy_level,
        anxiety_level,
        sleep_quality,
        notes,
        activities: activities || [],
        updated_at: new Date()
      },
      { 
        new: true, 
        upsert: true, // Create if doesn't exist
        runValidators: true 
      }
    );

    res.json({
      message: 'Mood updated successfully',
      mood_entry: moodEntry
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error - should not happen with findOneAndUpdate
      return res.status(400).json({ 
        message: 'Mood entry for this date already exists' 
      });
    }
    console.error('Set mood error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get mood entries for a user
const getMoodEntries = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { 
      from_date, 
      to_date, 
      days = 30,
      page = 1, 
      limit = 50 
    } = req.query;

    let dateFilter = {};
    
    if (from_date && to_date) {
      dateFilter = {
        date: {
          $gte: new Date(from_date),
          $lte: new Date(to_date)
        }
      };
    } else {
      // Default to last X days
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - parseInt(days));
      dateFilter = {
        date: { $gte: fromDate }
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const moodEntries = await MoodTracking.find({
      user_id,
      ...dateFilter
    })
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ date: -1 });

    const total = await MoodTracking.countDocuments({
      user_id,
      ...dateFilter
    });

    res.json({
      mood_entries: moodEntries,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_entries: total,
        has_next: parseInt(page) < Math.ceil(total / limit),
        has_prev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get mood entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get mood statistics and insights
const getMoodInsights = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { days = 30 } = req.query;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - parseInt(days));

    const moodStats = await MoodTracking.aggregate([
      {
        $match: {
          user_id,
          date: { $gte: fromDate }
        }
      },
      {
        $group: {
          _id: null,
          avgMood: { $avg: '$mood_score' },
          minMood: { $min: '$mood_score' },
          maxMood: { $max: '$mood_score' },
          avgEnergy: { $avg: '$energy_level' },
          avgAnxiety: { $avg: '$anxiety_level' },
          avgSleep: { $avg: '$sleep_quality' },
          count: { $sum: 1 },
          entries: { $push: '$$ROOT' }
        }
      }
    ]);

    if (moodStats.length === 0) {
      return res.json({
        message: 'No mood data found for the specified period',
        period_days: parseInt(days),
        insights: null
      });
    }

    const stats = moodStats[0];
    
    // Calculate trends
    const sortedEntries = stats.entries.sort((a, b) => a.date - b.date);
    const recentEntries = sortedEntries.slice(-7); // Last 7 entries
    const olderEntries = sortedEntries.slice(0, Math.min(7, sortedEntries.length - 7));
    
    let trend = 'stable';
    if (recentEntries.length > 0 && olderEntries.length > 0) {
      const recentAvg = recentEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / recentEntries.length;
      const olderAvg = olderEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / olderEntries.length;
      
      if (recentAvg > olderAvg + 0.5) trend = 'improving';
      else if (recentAvg < olderAvg - 0.5) trend = 'declining';
    }

    // Find most common activities on good mood days (mood > 7)
    const goodMoodDays = stats.entries.filter(entry => entry.mood_score > 7);
    const activityCounts = {};
    
    goodMoodDays.forEach(entry => {
      if (entry.activities) {
        entry.activities.forEach(activity => {
          activityCounts[activity] = (activityCounts[activity] || 0) + 1;
        });
      }
    });

    const topActivities = Object.entries(activityCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([activity, count]) => ({ activity, count }));

    res.json({
      period_days: parseInt(days),
      insights: {
        average_mood: Math.round(stats.avgMood * 100) / 100,
        mood_range: {
          min: stats.minMood,
          max: stats.maxMood
        },
        average_energy: stats.avgEnergy ? Math.round(stats.avgEnergy * 100) / 100 : null,
        average_anxiety: stats.avgAnxiety ? Math.round(stats.avgAnxiety * 100) / 100 : null,
        average_sleep: stats.avgSleep ? Math.round(stats.avgSleep * 100) / 100 : null,
        entries_count: stats.count,
        trend,
        top_activities_on_good_days: topActivities,
        consistency_score: Math.round((stats.count / parseInt(days)) * 100) // Percentage of days tracked
      }
    });
  } catch (error) {
    console.error('Get mood insights error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get today's mood
const getTodayMood = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayMood = await MoodTracking.findOne({
      user_id,
      date: today
    });

    res.json({
      date: today,
      mood_entry: todayMood,
      has_entry: !!todayMood
    });
  } catch (error) {
    console.error('Get today mood error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a mood entry
const deleteMoodEntry = async (req, res) => {
  try {
    const { date } = req.params;
    const user_id = req.user.user_id;

    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);

    const deletedEntry = await MoodTracking.findOneAndDelete({
      user_id,
      date: entryDate
    });

    if (!deletedEntry) {
      return res.status(404).json({ message: 'Mood entry not found for this date' });
    }

    res.json({ message: 'Mood entry deleted successfully' });
  } catch (error) {
    console.error('Delete mood entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  setMood,
  getMoodEntries,
  getMoodInsights,
  getTodayMood,
  deleteMoodEntry,
  MoodTracking // Export the model for use in other controllers
};
