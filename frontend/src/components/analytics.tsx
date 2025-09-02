import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { BlurFade } from "@/components/magicui/blur-fade";
import { AuroraText } from "@/components/magicui/aurora-text";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Brain,
  Heart,
  Smile,
  MessageCircle,
  BookOpen,
  Target,
  Award,
} from "lucide-react";

interface AnalyticsProps {
  user: any;
}

interface MoodData {
  date: string;
  mood: number;
}

interface Stats {
  totalEntries: number;
  averageMood: number;
  streakDays: number;
  chatSessions: number;
  moodTrend: "up" | "down" | "stable";
  weeklyMoods: MoodData[];
}

export function Analytics({ user: _user }: AnalyticsProps) {
  const [stats, setStats] = useState<Stats>({
    totalEntries: 0,
    averageMood: 0,
    streakDays: 0,
    chatSessions: 0,
    moodTrend: "stable",
    weeklyMoods: [],
  });

  // Mock data for demo
  useEffect(() => {
    const mockStats: Stats = {
      totalEntries: 24,
      averageMood: 7.2,
      streakDays: 12,
      chatSessions: 18,
      moodTrend: "up",
      weeklyMoods: [
        { date: "2025-08-27", mood: 6 },
        { date: "2025-08-28", mood: 7 },
        { date: "2025-08-29", mood: 5 },
        { date: "2025-08-30", mood: 8 },
        { date: "2025-08-31", mood: 6 },
        { date: "2025-09-01", mood: 7 },
        { date: "2025-09-02", mood: 8 },
      ],
    };
    setStats(mockStats);
  }, []);

  const getMoodColor = (mood: number) => {
    if (mood >= 7) return "text-green-500";
    if (mood >= 4) return "text-yellow-500";
    return "text-red-500";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up")
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === "down")
      return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    return <TrendingUp className="w-4 h-4 text-gray-500 rotate-90" />;
  };

  const achievements = [
    {
      title: "First Steps",
      description: "Created your first journal entry",
      earned: true,
      icon: BookOpen,
    },
    {
      title: "Conversationalist",
      description: "Had 10 AI chat sessions",
      earned: true,
      icon: MessageCircle,
    },
    {
      title: "Consistent Writer",
      description: "7-day journaling streak",
      earned: true,
      icon: Calendar,
    },
    {
      title: "Mood Master",
      description: "Maintained 7+ mood for a week",
      earned: false,
      icon: Smile,
    },
    {
      title: "Self-Reflector",
      description: "25 total journal entries",
      earned: false,
      icon: Target,
    },
    {
      title: "Wellness Warrior",
      description: "30-day journaling streak",
      earned: false,
      icon: Award,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <AuroraText className="text-3xl font-bold mb-2">
          Your Wellness Journey
        </AuroraText>
        <p className="text-muted-foreground">
          Track your mental health progress and celebrate your achievements
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <BlurFade delay={0.1} inView>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Journal Entries
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <NumberTicker value={stats.totalEntries} />
              </div>
              <p className="text-xs text-muted-foreground">+3 from last week</p>
            </CardContent>
          </Card>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Mood
              </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${getMoodColor(
                  stats.averageMood
                )}`}
              >
                <NumberTicker value={stats.averageMood} decimalPlaces={1} />
                <span className="text-sm">/10</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                {getTrendIcon(stats.moodTrend)}
                <span className="ml-1">Trending {stats.moodTrend}</span>
              </div>
            </CardContent>
          </Card>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak Days</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                <NumberTicker value={stats.streakDays} />
              </div>
              <p className="text-xs text-muted-foreground">Keep it up! 🔥</p>
            </CardContent>
          </Card>
        </BlurFade>

        <BlurFade delay={0.4} inView>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Chat Sessions
              </CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                <NumberTicker value={stats.chatSessions} />
              </div>
              <p className="text-xs text-muted-foreground">+2 this week</p>
            </CardContent>
          </Card>
        </BlurFade>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Mood Chart */}
        <BlurFade delay={0.5} inView>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Weekly Mood Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.weeklyMoods.map((day) => (
                  <div key={day.date} className="flex items-center space-x-3">
                    <div className="text-xs w-16 text-muted-foreground">
                      {new Date(day.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </div>
                    <div className="flex-1">
                      <Progress value={day.mood * 10} className="h-2" />
                    </div>
                    <div
                      className={`text-sm font-medium w-8 ${getMoodColor(
                        day.mood
                      )}`}
                    >
                      {day.mood}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </BlurFade>

        {/* Achievements */}
        <BlurFade delay={0.6} inView>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.title}
                    className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                      achievement.earned
                        ? "bg-green-50 dark:bg-green-900/20"
                        : "bg-gray-50 dark:bg-gray-800/50"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        achievement.earned
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      <achievement.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div
                        className={`font-medium text-sm ${
                          achievement.earned
                            ? "text-green-700 dark:text-green-300"
                            : "text-gray-500"
                        }`}
                      >
                        {achievement.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {achievement.description}
                      </div>
                    </div>
                    {achievement.earned && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-green-100 text-green-800"
                      >
                        Earned
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </BlurFade>
      </div>

      {/* Insights */}
      <BlurFade delay={0.7} inView>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  <NumberTicker value={5} />
                </div>
                <div className="text-sm text-muted-foreground">
                  Days with mood 7+
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  <NumberTicker value={3} />
                </div>
                <div className="text-sm text-muted-foreground">
                  Most used AI: Supportive
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  85%
                </div>
                <div className="text-sm text-muted-foreground">
                  Journaling consistency
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </BlurFade>
    </div>
  );
}
