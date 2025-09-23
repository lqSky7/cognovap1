// React import removed - not needed with new JSX transform
import { useTheme } from '../contexts/ThemeContext.js';
import type { User } from '../services/api';

interface WellnessJourneyProps {
  user?: User;
}

export default function WellnessJourney({ user }: WellnessJourneyProps) {
  const { theme } = useTheme();

  // Mock wellness data for demo
  const mockWellnessData = {
    weeklyMood: 7.2,
    streakDays: 12,
    totalSessions: 34,
    journalEntries: 28,
    achievements: [
      { id: 1, name: "First Chat", icon: "💬", earned: true },
      { id: 2, name: "Week Streak", icon: "🔥", earned: true },
      { id: 3, name: "Mood Master", icon: "😊", earned: false },
      { id: 4, name: "Journal Hero", icon: "📖", earned: true },
    ],
    moodTrend: [6, 7, 8, 6, 7, 8, 9],
    weeklyInsight: "You've shown great consistency this week! Your mood has been trending upward with regular check-ins."
  };

  if (user) {
    // For now, show demo data even for authenticated users until backend is set up
    // Will be changed when we configure backend and signup
  }

  // Show demo data for guests
  return (
    <div>
      <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        <span className="text-xl">🌟</span>
        Wellness Journey 
        <span className="text-xs px-2 py-1 bg-[#FF7900] text-white rounded">Demo</span>
      </h3>
      
      <div className="space-y-3 h-[calc(100vh-240px)] overflow-y-auto pr-2">
        {/* Weekly Insight */}
        <div className={`p-3 rounded-lg border ${
          theme === 'dark'
            ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,121,0,0.1)]'
            : 'bg-white border-gray-200'
        }`}>
          <h4 className="text-sm font-medium text-[#FF7900] mb-2 flex items-center gap-1">
            💡 Weekly Insight
          </h4>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {mockWellnessData.weeklyInsight}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`p-3 rounded-lg border text-center ${
            theme === 'dark'
              ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,121,0,0.1)]'
              : 'bg-white border-gray-200'
          }`}>
            <div className="text-lg font-bold text-[#FF7900]">{mockWellnessData.weeklyMood}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Avg Mood</div>
          </div>
          <div className={`p-3 rounded-lg border text-center ${
            theme === 'dark'
              ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,121,0,0.1)]'
              : 'bg-white border-gray-200'
          }`}>
            <div className="text-lg font-bold text-[#FF7900]">{mockWellnessData.streakDays}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Day Streak 🔥</div>
          </div>
          <div className={`p-3 rounded-lg border text-center ${
            theme === 'dark'
              ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,121,0,0.1)]'
              : 'bg-white border-gray-200'
          }`}>
            <div className="text-lg font-bold text-[#FF7900]">{mockWellnessData.totalSessions}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">AI Chats</div>
          </div>
          <div className={`p-3 rounded-lg border text-center ${
            theme === 'dark'
              ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,121,0,0.1)]'
              : 'bg-white border-gray-200'
          }`}>
            <div className="text-lg font-bold text-[#FF7900]">{mockWellnessData.journalEntries}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Entries</div>
          </div>
        </div>

        {/* Mood Trend */}
        <div className={`p-3 rounded-lg border ${
          theme === 'dark'
            ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,121,0,0.1)]'
            : 'bg-white border-gray-200'
        }`}>
          <h4 className="text-sm font-medium text-[#FF7900] mb-2">📈 Mood Trend</h4>
          <div className="flex items-end justify-between h-12">
            {mockWellnessData.moodTrend.map((mood, index) => (
              <div
                key={index}
                className="bg-[#FF7900] rounded-t"
                style={{ 
                  width: '10px',
                  height: `${(mood / 10) * 100}%`,
                  opacity: 0.7 + (mood / 20)
                }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Achievements */}
        <div className={`p-3 rounded-lg border ${
          theme === 'dark'
            ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,121,0,0.1)]'
            : 'bg-white border-gray-200'
        }`}>
          <h4 className="text-sm font-medium text-[#FF7900] mb-2">🏆 Achievements</h4>
          <div className="grid grid-cols-2 gap-2">
            {mockWellnessData.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-2 rounded text-center text-xs ${
                  achievement.earned
                    ? 'bg-[rgba(255,121,0,0.1)] text-[#FF7900]'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}
              >
                <div className="text-lg mb-1">{achievement.icon}</div>
                <div>{achievement.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Demo message */}
        <div className={`p-3 rounded-lg border text-center text-xs ${
          theme === 'dark'
            ? 'border-[rgba(255,121,0,0.2)] bg-[rgba(255,121,0,0.05)] text-gray-400'
            : 'border-orange-200 bg-orange-50 text-gray-600'
        }`}>
          🌟 Demo wellness data - Sign up to save your own!
        </div>
      </div>
    </div>
  );
}