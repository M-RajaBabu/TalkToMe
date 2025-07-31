import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  BookOpen, 
  MessageSquare, 
  Globe, 
  Award,
  CheckCircle,
  Lock,
  Zap,
  Crown,
  Heart,
  Brain,
  Languages,
  BookMarked,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FadeIn from "@/components/animations/FadeIn";
import { useTranslation } from "react-i18next";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'conversation' | 'vocabulary' | 'grammar' | 'culture' | 'special';
  points: number;
  requirement: number;
  current: number;
  earned: boolean;
  dateEarned?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserStats {
  totalPoints: number;
  currentStreak: number;
  totalConversations: number;
  wordsLearned: number;
  accuracy: number;
  level: number;
  experience: number;
  experienceToNext: number;
}

const achievements: Achievement[] = [
  // Streak Achievements
  {
    id: 'first-day',
    name: 'First Steps',
    description: 'Complete your first day of learning',
    icon: '🎯',
    category: 'streak',
    points: 10,
    requirement: 1,
    current: 1,
    earned: true,
    dateEarned: '2024-01-15',
    rarity: 'common'
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    category: 'streak',
    points: 50,
    requirement: 7,
    current: 7,
    earned: true,
    dateEarned: '2024-01-20',
    rarity: 'rare'
  },
  {
    id: 'month-master',
    name: 'Month Master',
    description: 'Maintain a 30-day learning streak',
    icon: '👑',
    category: 'streak',
    points: 200,
    requirement: 30,
    current: 7,
    earned: false,
    rarity: 'epic'
  },
  {
    id: 'hundred-days',
    name: 'Century Club',
    description: 'Maintain a 100-day learning streak',
    icon: '💎',
    category: 'streak',
    points: 500,
    requirement: 100,
    current: 7,
    earned: false,
    rarity: 'legendary'
  },

  // Conversation Achievements
  {
    id: 'first-chat',
    name: 'First Conversation',
    description: 'Complete your first conversation',
    icon: '💬',
    category: 'conversation',
    points: 20,
    requirement: 1,
    current: 1,
    earned: true,
    dateEarned: '2024-01-15',
    rarity: 'common'
  },
  {
    id: 'chat-master',
    name: 'Chat Master',
    description: 'Complete 50 conversations',
    icon: '🎭',
    category: 'conversation',
    points: 100,
    requirement: 50,
    current: 25,
    earned: false,
    rarity: 'rare'
  },
  {
    id: 'conversation-expert',
    name: 'Conversation Expert',
    description: 'Complete 200 conversations',
    icon: '🏆',
    category: 'conversation',
    points: 300,
    requirement: 200,
    current: 25,
    earned: false,
    rarity: 'epic'
  },

  // Vocabulary Achievements
  {
    id: 'word-collector',
    name: 'Word Collector',
    description: 'Learn 50 words',
    icon: '📚',
    category: 'vocabulary',
    points: 30,
    requirement: 50,
    current: 50,
    earned: true,
    dateEarned: '2024-01-18',
    rarity: 'common'
  },
  {
    id: 'vocabulary-master',
    name: 'Vocabulary Master',
    description: 'Learn 500 words',
    icon: '📖',
    category: 'vocabulary',
    points: 150,
    requirement: 500,
    current: 150,
    earned: false,
    rarity: 'rare'
  },
  {
    id: 'polyglot',
    name: 'Polyglot',
    description: 'Learn 1000 words',
    icon: '🌍',
    category: 'vocabulary',
    points: 400,
    requirement: 1000,
    current: 150,
    earned: false,
    rarity: 'legendary'
  },

  // Grammar Achievements
  {
    id: 'grammar-novice',
    name: 'Grammar Novice',
    description: 'Achieve 80% grammar accuracy',
    icon: '✏️',
    category: 'grammar',
    points: 40,
    requirement: 80,
    current: 87,
    earned: true,
    dateEarned: '2024-01-19',
    rarity: 'common'
  },
  {
    id: 'grammar-guru',
    name: 'Grammar Guru',
    description: 'Achieve 95% grammar accuracy',
    icon: '⭐',
    category: 'grammar',
    points: 200,
    requirement: 95,
    current: 87,
    earned: false,
    rarity: 'epic'
  },

  // Culture Achievements
  {
    id: 'culture-explorer',
    name: 'Culture Explorer',
    description: 'Learn about 5 different cultures',
    icon: '🏛️',
    category: 'culture',
    points: 80,
    requirement: 5,
    current: 2,
    earned: false,
    rarity: 'rare'
  },
  {
    id: 'cultural-ambassador',
    name: 'Cultural Ambassador',
    description: 'Learn about 20 different cultures',
    icon: '🌐',
    category: 'culture',
    points: 300,
    requirement: 20,
    current: 2,
    earned: false,
    rarity: 'legendary'
  },

  // Special Achievements
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete a lesson before 8 AM',
    icon: '🌅',
    category: 'special',
    points: 25,
    requirement: 1,
    current: 0,
    earned: false,
    rarity: 'common'
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Complete a lesson after 10 PM',
    icon: '🦉',
    category: 'special',
    points: 25,
    requirement: 1,
    current: 0,
    earned: false,
    rarity: 'common'
  },
  {
    id: 'weekend-warrior',
    name: 'Weekend Warrior',
    description: 'Complete lessons on 5 consecutive weekends',
    icon: '🎉',
    category: 'special',
    points: 100,
    requirement: 5,
    current: 2,
    earned: false,
    rarity: 'rare'
  }
];

const mockUserStats: UserStats = {
  totalPoints: 1250,
  currentStreak: 7,
  totalConversations: 25,
  wordsLearned: 150,
  accuracy: 87,
  level: 8,
  experience: 750,
  experienceToNext: 1000
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'bg-gray-500';
    case 'rare': return 'bg-blue-500';
    case 'epic': return 'bg-purple-500';
    case 'legendary': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};

const getRarityTextColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'text-gray-600 dark:text-gray-400';
    case 'rare': return 'text-blue-600 dark:text-blue-400';
    case 'epic': return 'text-purple-600 dark:text-purple-400';
    case 'legendary': return 'text-yellow-600 dark:text-yellow-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
};

const AchievementSystem = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Add error handling
  useEffect(() => {
    console.log('AchievementSystem component mounted');
  }, []);
  
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 1250,
    currentStreak: 7,
    totalConversations: 25,
    wordsLearned: 150,
    accuracy: 87,
    level: 5,
    experience: 750,
    experienceToNext: 1000
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All', icon: Trophy },
    { id: 'streak', name: 'Streaks', icon: Flame },
    { id: 'conversation', name: 'Conversations', icon: MessageSquare },
    { id: 'vocabulary', name: 'Vocabulary', icon: BookOpen },
    { id: 'grammar', name: 'Grammar', icon: Target },
    { id: 'culture', name: 'Culture', icon: Globe },
    { id: 'special', name: 'Special', icon: Sparkles }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const earnedAchievements = achievements.filter(a => a.earned);
  const totalPoints = earnedAchievements.reduce((sum, a) => sum + a.points, 0);

  const handleAchievementClick = (achievement: Achievement) => {
    if (achievement.earned) {
      toast({
        title: `🎉 ${achievement.name}`,
        description: `You earned this achievement on ${achievement.dateEarned}!`,
      });
    } else {
      const progress = (achievement.current / achievement.requirement) * 100;
      toast({
        title: `${achievement.name} - ${progress.toFixed(0)}% Complete`,
        description: `${achievement.current}/${achievement.requirement} - Keep going!`,
      });
    }
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    toast({
      title: `Filtered by ${category}`,
      description: `Showing ${category} achievements`,
    });
  };

  const simulateProgress = () => {
    // Simulate user progress
    const updatedStats = {
      ...userStats,
      totalPoints: userStats.totalPoints + 50,
      currentStreak: userStats.currentStreak + 1,
      experience: Math.min(userStats.experience + 100, userStats.experienceToNext)
    };
    
    setUserStats(updatedStats);
    
    toast({
      title: "Progress Updated!",
      description: `+50 points, +1 day streak, +100 XP`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalPoints}</div>
              <p className="text-xs text-muted-foreground">+{totalPoints} from achievements</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Level</CardTitle>
              <Crown className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.level}</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Experience</span>
                  <span>{userStats.experience}/{userStats.experienceToNext}</span>
                </div>
                <Progress value={(userStats.experience / userStats.experienceToNext) * 100} className="h-1" />
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{earnedAchievements.length}</div>
              <p className="text-xs text-muted-foreground">of {achievements.length} total</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((earnedAchievements.length / achievements.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">achievement completion</p>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Category Filter */}
      <FadeIn delay={100}>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryFilter(category.id)}
              className="flex items-center gap-2"
            >
              <category.icon className="w-4 h-4" />
              {category.name}
            </Button>
          ))}
        </div>
      </FadeIn>

      {/* Achievements Grid */}
      <FadeIn delay={200}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement, index) => (
            <Card 
              key={achievement.id}
              className={`modern-card transition-all duration-300 cursor-pointer hover:scale-105 ${
                achievement.earned 
                  ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/50' 
                  : 'opacity-75'
              }`}
              onClick={() => handleAchievementClick(achievement)}
            >
              <CardHeader className="text-center pb-3">
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <CardTitle className="text-lg">{achievement.name}</CardTitle>
                <CardDescription className="text-sm">{achievement.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{achievement.current}/{achievement.requirement}</span>
                  </div>
                  <Progress 
                    value={Math.min((achievement.current / achievement.requirement) * 100, 100)} 
                    className="h-2"
                  />
                </div>

                {/* Points and Status */}
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={`${getRarityColor(achievement.rarity)} text-white border-0`}
                  >
                    {achievement.points} pts
                  </Badge>
                  {achievement.earned ? (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs">Earned</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Lock className="w-4 h-4" />
                      <span className="text-xs">Locked</span>
                    </div>
                  )}
                </div>

                {/* Rarity Badge */}
                <div className="flex justify-center">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getRarityTextColor(achievement.rarity)}`}
                  >
                    {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </FadeIn>
    </div>
  );
};

export default AchievementSystem; 