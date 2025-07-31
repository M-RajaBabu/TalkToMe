
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Calendar, 
  Trophy, 
  Target, 
  Clock, 
  BookOpen, 
  MessageSquare, 
  Star,
  Zap,
  Award,
  Users,
  BarChart3,
  Flame,
  CheckCircle,
  Play,
  Download,
  Bell,
  Globe,
  Languages,
  BookMarked,
  RefreshCw,
  Gift,
  Timer,
  Sparkles,
  Brain,
  Activity,
  Lightbulb
} from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import SlideUp from "@/components/animations/SlideUp";
import { useTranslation } from 'react-i18next';
import { useToast } from "@/hooks/use-toast";
import AdvancedAnalytics from "@/components/analytics/AdvancedAnalytics";
import AILearningAnalytics from "@/components/ai/AILearningAnalytics";

// Enhanced challenge types
interface Challenge {
  id: number;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  completed: boolean;
  type: 'greeting' | 'weather' | 'food' | 'numbers' | 'colors' | 'family' | 'travel' | 'shopping';
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // in minutes
  startedAt?: Date;
  completedAt?: Date;
  category: 'conversation' | 'vocabulary' | 'grammar' | 'pronunciation';
  autoProgress?: boolean; // Whether this challenge auto-progresses
  triggerCondition?: string; // What activity triggers progress
}

// Mock data - in real app, this would come from API
const mockUserData = {
  streak: 7,
  totalPoints: 1250,
  wordsLearned: 150,
  conversations: 25,
  timeSpent: 12.5, // hours
  accuracy: 87,
  level: "Intermediate",
  achievements: [
    { id: 1, name: "First Steps", description: "Complete your first conversation", icon: "🎯", earned: true, date: "2024-01-15" },
    { id: 2, name: "Week Warrior", description: "7-day learning streak", icon: "🔥", earned: true, date: "2024-01-20" },
    { id: 3, name: "Word Wizard", description: "Learn 100 words", icon: "📚", earned: true, date: "2024-01-18" },
    { id: 4, name: "Chat Master", description: "Complete 50 conversations", icon: "💬", earned: false },
    { id: 5, name: "Grammar Guru", description: "Achieve 95% accuracy", icon: "⭐", earned: false },
    { id: 6, name: "Cultural Explorer", description: "Learn about 5 cultures", icon: "🌍", earned: false }
  ],
  weeklyProgress: [
    { day: "Mon", conversations: 3, words: 12, time: 0.5 },
    { day: "Tue", conversations: 5, words: 18, time: 0.8 },
    { day: "Wed", conversations: 2, words: 8, time: 0.3 },
    { day: "Thu", conversations: 7, words: 22, time: 1.2 },
    { day: "Fri", conversations: 4, words: 15, time: 0.7 },
    { day: "Sat", conversations: 6, words: 20, time: 1.0 },
    { day: "Sun", conversations: 8, words: 25, time: 1.5 }
  ],
  leaderboard: [
    { rank: 1, name: "Sarah", points: 2100, streak: 15, avatar: "👩‍🦰" },
    { rank: 2, name: "Mike", points: 1850, streak: 12, avatar: "👨‍🦱" },
    { rank: 3, name: "Emma", points: 1650, streak: 10, avatar: "👩‍🦳" },
    { rank: 4, name: "You", points: 1250, streak: 7, avatar: "👤" },
    { rank: 5, name: "Alex", points: 1100, streak: 8, avatar: "👨‍🦲" }
  ]
};

// Challenge templates with auto-progression
const challengeTemplates: Challenge[] = [
  {
    id: 1,
    title: "Greeting Master",
    description: "Practice 10 different greetings in your target language",
    progress: 0,
    target: 10,
    reward: 50,
    completed: false,
    type: 'greeting',
    difficulty: 'easy',
    category: 'conversation',
    autoProgress: true,
    triggerCondition: 'greeting_words_used'
  },
  {
    id: 2,
    title: "Weather Talk",
    description: "Discuss weather conditions in your target language",
    progress: 0,
    target: 1,
    reward: 30,
    completed: false,
    type: 'weather',
    difficulty: 'medium',
    category: 'conversation',
    autoProgress: true,
    triggerCondition: 'weather_conversation'
  },
  {
    id: 3,
    title: "Food Explorer",
    description: "Learn 5 food-related words and use them in conversation",
    progress: 0,
    target: 5,
    reward: 40,
    completed: false,
    type: 'food',
    difficulty: 'medium',
    category: 'vocabulary',
    autoProgress: true,
    triggerCondition: 'food_words_used'
  },
  {
    id: 4,
    title: "Number Ninja",
    description: "Practice counting from 1 to 20 in your target language",
    progress: 0,
    target: 20,
    reward: 35,
    completed: false,
    type: 'numbers',
    difficulty: 'easy',
    category: 'vocabulary',
    autoProgress: true,
    triggerCondition: 'numbers_used'
  },
  {
    id: 5,
    title: "Color Connoisseur",
    description: "Learn and use 8 different colors in conversation",
    progress: 0,
    target: 8,
    reward: 45,
    completed: false,
    type: 'colors',
    difficulty: 'medium',
    category: 'vocabulary',
    autoProgress: true,
    triggerCondition: 'colors_used'
  },
  {
    id: 6,
    title: "Family Talk",
    description: "Discuss family members using proper grammar",
    progress: 0,
    target: 1,
    reward: 60,
    completed: false,
    type: 'family',
    difficulty: 'hard',
    category: 'grammar',
    autoProgress: true,
    triggerCondition: 'family_conversation'
  },
  {
    id: 7,
    title: "Travel Guide",
    description: "Practice travel-related vocabulary and phrases",
    progress: 0,
    target: 1,
    reward: 55,
    completed: false,
    type: 'travel',
    difficulty: 'hard',
    category: 'conversation',
    autoProgress: true,
    triggerCondition: 'travel_conversation'
  },
  {
    id: 8,
    title: "Shopping Spree",
    description: "Learn shopping vocabulary and practice bargaining",
    progress: 0,
    target: 1,
    reward: 50,
    completed: false,
    type: 'shopping',
    difficulty: 'medium',
    category: 'conversation',
    autoProgress: true,
    triggerCondition: 'shopping_conversation'
  }
];

const ProgressPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [userData] = useState(mockUserData);
  const [dailyChallenges, setDailyChallenges] = useState<Challenge[]>(() => {
    // Load challenges from localStorage or use default
    const saved = localStorage.getItem('dailyChallenges');
    if (saved) {
      const parsed = JSON.parse(saved);
      const lastUpdated = new Date(parsed.lastUpdated);
      const today = new Date();
      // Reset challenges if it's a new day
      if (lastUpdated.toDateString() !== today.toDateString()) {
        return generateDailyChallenges();
      }
      return parsed.challenges;
    }
    return generateDailyChallenges();
  });
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  // Generate 3 random daily challenges
  function generateDailyChallenges(): Challenge[] {
    const shuffled = [...challengeTemplates].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map(challenge => ({
      ...challenge,
      progress: 0,
      completed: false,
      startedAt: new Date(), // Auto-start all challenges
      completedAt: undefined
    }));
  }

  // Save challenges to localStorage
  useEffect(() => {
    localStorage.setItem('dailyChallenges', JSON.stringify({
      challenges: dailyChallenges,
      lastUpdated: new Date().toISOString()
    }));
  }, [dailyChallenges]);

  // Simulate automatic progress based on user activity
  useEffect(() => {
    const simulateUserActivity = () => {
      const updatedChallenges = dailyChallenges.map(challenge => {
        if (challenge.completed) return challenge;

        // Simulate different types of progress based on challenge type
        let progressIncrement = 0;
        
        switch (challenge.type) {
          case 'greeting':
            // Simulate greeting words being used in chat
            progressIncrement = Math.random() < 0.3 ? 1 : 0;
            break;
          case 'weather':
            // Simulate weather conversation
            progressIncrement = Math.random() < 0.2 ? 1 : 0;
            break;
          case 'food':
            // Simulate food words being learned
            progressIncrement = Math.random() < 0.4 ? 1 : 0;
            break;
          case 'numbers':
            // Simulate numbers being used
            progressIncrement = Math.random() < 0.5 ? 1 : 0;
            break;
          case 'colors':
            // Simulate colors being learned
            progressIncrement = Math.random() < 0.3 ? 1 : 0;
            break;
          case 'family':
            // Simulate family conversation
            progressIncrement = Math.random() < 0.1 ? 1 : 0;
            break;
          case 'travel':
            // Simulate travel conversation
            progressIncrement = Math.random() < 0.15 ? 1 : 0;
            break;
          case 'shopping':
            // Simulate shopping conversation
            progressIncrement = Math.random() < 0.2 ? 1 : 0;
            break;
        }

        if (progressIncrement > 0) {
          const newProgress = Math.min(challenge.target, challenge.progress + progressIncrement);
          const completed = newProgress >= challenge.target;
          
          if (completed && !challenge.completed) {
            // Show completion toast
            setTimeout(() => {
              toast({
                title: "Challenge Completed! 🎉",
                description: `${challenge.title} - You earned ${challenge.reward} points!`,
              });
            }, 100);
          }

          return {
            ...challenge,
            progress: newProgress,
            completed,
            completedAt: completed ? new Date() : undefined
          };
        }

        return challenge;
      });

      setDailyChallenges(updatedChallenges);
    };

    // Simulate activity every 5-15 seconds
    const interval = setInterval(simulateUserActivity, Math.random() * 10000 + 5000);
    
    return () => clearInterval(interval);
  }, [dailyChallenges, toast]);

  // Start a challenge (now mostly for display purposes)
  const startChallenge = (challenge: Challenge) => {
    const updatedChallenges = dailyChallenges.map(c => 
      c.id === challenge.id 
        ? { ...c, startedAt: new Date() }
        : c
    );
    setDailyChallenges(updatedChallenges);
    setActiveChallenge(challenge);
    setShowChallengeModal(true);
    
    toast({
      title: "Challenge Active!",
      description: `${challenge.title} is now tracking your progress automatically.`,
    });
  };

  // Manual progress update (for testing/demo purposes)
  const updateChallengeProgress = (challengeId: number, progress: number) => {
    const updatedChallenges = dailyChallenges.map(c => {
      if (c.id === challengeId) {
        const newProgress = Math.min(c.target, c.progress + progress);
        const completed = newProgress >= c.target;
        return {
          ...c,
          progress: newProgress,
          completed,
          completedAt: completed ? new Date() : undefined
        };
      }
      return c;
    });
    setDailyChallenges(updatedChallenges);

    // Check if challenge was completed
    const challenge = updatedChallenges.find(c => c.id === challengeId);
    if (challenge?.completed) {
      toast({
        title: "Challenge Completed! 🎉",
        description: `You earned ${challenge.reward} points!`,
      });
    }
  };

  // Refresh daily challenges
  const refreshChallenges = () => {
    const newChallenges = generateDailyChallenges();
    setDailyChallenges(newChallenges);
    toast({
      title: "Challenges Refreshed!",
      description: "New daily challenges are now active and tracking your progress.",
    });
  };

  // Get challenge icon based on type
  const getChallengeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      greeting: "👋",
      weather: "🌤️",
      food: "🍕",
      numbers: "🔢",
      colors: "🎨",
      family: "👨‍👩‍👧‍👦",
      travel: "✈️",
      shopping: "🛍️"
    };
    return icons[type] || "🎯";
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "hard": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "conversation": return "bg-blue-500";
      case "vocabulary": return "bg-green-500";
      case "grammar": return "bg-purple-500";
      case "pronunciation": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-500";
      case "Intermediate": return "bg-blue-500";
      case "Advanced": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-green-500";
    if (accuracy >= 80) return "text-blue-500";
    if (accuracy >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Learning Analytics</h1>
            <p className="text-muted-foreground">Track your progress and celebrate achievements</p>
        </div>
        </FadeIn>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-card/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="ai-analytics" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FadeIn delay={100}>
                <Card className="modern-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                    <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
                    <div className="text-2xl font-bold">{userData.streak} days</div>
                    <p className="text-xs text-muted-foreground">Keep it going! 🔥</p>
            </CardContent>
          </Card>
              </FadeIn>

              <FadeIn delay={200}>
                <Card className="modern-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                    <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
                    <div className="text-2xl font-bold">{userData.totalPoints}</div>
                    <p className="text-xs text-muted-foreground">+150 this week</p>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={300}>
                <Card className="modern-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Words Learned</CardTitle>
                    <BookOpen className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userData.wordsLearned}</div>
                    <p className="text-xs text-muted-foreground">+25 this week</p>
            </CardContent>
          </Card>
              </FadeIn>

              <FadeIn delay={400}>
                <Card className="modern-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversations</CardTitle>
                    <MessageSquare className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
                    <div className="text-2xl font-bold">{userData.conversations}</div>
                    <p className="text-xs text-muted-foreground">+8 this week</p>
            </CardContent>
          </Card>
              </FadeIn>
            </div>

            {/* Progress Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FadeIn delay={500}>
                <Card className="modern-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Weekly Progress
                    </CardTitle>
                    <CardDescription>Your learning activity this week</CardDescription>
            </CardHeader>
            <CardContent>
                    <div className="space-y-4">
                      {userData.weeklyProgress.map((day, index) => (
                        <div key={day.day} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{day.day}</span>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-green-500" />
                              <span className="text-xs">{day.conversations}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-blue-500" />
                              <span className="text-xs">{day.words}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-purple-500" />
                              <span className="text-xs">{day.time}h</span>
                            </div>
                          </div>
                </div>
                      ))}
              </div>
            </CardContent>
          </Card>
              </FadeIn>

              <FadeIn delay={600}>
                <Card className="modern-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Learning Metrics
                    </CardTitle>
                    <CardDescription>Your performance indicators</CardDescription>
            </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Current Level</span>
                      <Badge className={getLevelColor(userData.level)}>
                        {userData.level}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Time Spent</span>
                      <span className="text-sm font-medium">{userData.timeSpent}h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Accuracy</span>
                      <span className={`text-sm font-medium ${getAccuracyColor(userData.accuracy)}`}>
                        {userData.accuracy}%
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress to Next Level</span>
                        <span>75%</span>
                </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userData.achievements.map((achievement, index) => (
                  <Card 
                    key={achievement.id} 
                    className={`modern-card transition-all duration-300 ${
                      achievement.earned 
                        ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/50' 
                        : 'opacity-60'
                    }`}
                  >
                    <CardHeader className="text-center">
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <CardTitle className="text-lg">{achievement.name}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      {achievement.earned ? (
                        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Earned {achievement.date}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <Award className="w-4 h-4" />
                          <span className="text-sm">Locked</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  ))}
                </div>
            </FadeIn>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <FadeIn>
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Global Leaderboard
                  </CardTitle>
                  <CardDescription>Top learners this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userData.leaderboard.map((user, index) => (
                      <div 
                        key={user.rank}
                        className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                          user.name === "You" 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{user.avatar}</div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.streak} day streak
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{user.points} pts</div>
                          <div className="text-sm text-muted-foreground">
                            #{user.rank}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <FadeIn>
              {/* Challenge Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold gradient-text">Daily Challenges</h2>
                  <p className="text-muted-foreground">Challenges automatically track your progress as you learn</p>
                </div>
                <Button 
                  onClick={refreshChallenges}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>

              {/* Auto-Progress Notice */}
              <Card className="modern-card bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/50 dark:to-blue-950/50 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-green-700 dark:text-green-300">Auto-Progress Active</h3>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Your challenges automatically progress as you use the app. Chat, practice vocabulary, and complete lessons to advance your challenges!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Challenge Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="modern-card">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Challenges</p>
                      <p className="text-xl font-bold">{dailyChallenges.filter(c => !c.completed).length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="modern-card">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completed Today</p>
                      <p className="text-xl font-bold">{dailyChallenges.filter(c => c.completed).length}</p>
                </div>
              </CardContent>
            </Card>
                <Card className="modern-card">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-yellow-500" />
                  </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Rewards</p>
                      <p className="text-xl font-bold">{dailyChallenges.reduce((sum, c) => sum + (c.completed ? c.reward : 0), 0)} pts</p>
                </div>
              </CardContent>
            </Card>
              </div>

              {/* Challenge Cards */}
              <div className="space-y-4">
                {dailyChallenges.map((challenge, index) => (
                  <Card key={challenge.id} className="modern-card hover:scale-[1.02] transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{getChallengeIcon(challenge.type)}</div>
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-2">
                              {challenge.title}
                              <div className="flex items-center gap-1 text-xs text-green-500">
                                <Timer className="w-3 h-3" />
                                Auto-Tracking
                              </div>
                            </CardTitle>
                            <CardDescription className="mt-1">{challenge.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={challenge.completed ? "default" : "secondary"} className="flex items-center gap-1">
                            <Gift className="w-3 h-3" />
                            {challenge.reward} pts
                          </Badge>
                          <div className="flex gap-1">
                            <Badge className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                              {challenge.difficulty}
                            </Badge>
                            <Badge className={`text-xs ${getCategoryColor(challenge.category)}`}>
                              {challenge.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{challenge.progress}/{challenge.target}</span>
                        </div>
                        <Progress 
                          value={(challenge.progress / challenge.target) * 100} 
                          className="h-2"
                        />
                        
                        {challenge.completed ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Completed!</span>
                            </div>
                            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                              <Sparkles className="w-4 h-4" />
                              <span className="text-sm font-medium">+{challenge.reward} pts</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                              <Sparkles className="w-4 h-4" />
                              <span className="text-sm">Progressing automatically...</span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateChallengeProgress(challenge.id, 1)}
                              className="text-xs"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              +1 (Demo)
                            </Button>
                  </div>
                        )}
                </div>
              </CardContent>
            </Card>
                ))}
              </div>

              {/* Challenge Tips */}
              <Card className="modern-card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">How Challenges Work</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Challenges automatically track your learning activity</li>
                        <li>• Use the chat feature to practice conversation skills</li>
                        <li>• Complete vocabulary lessons to advance vocabulary challenges</li>
                        <li>• Practice grammar exercises to complete grammar challenges</li>
                        <li>• Challenges reset daily with new objectives</li>
                      </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            </FadeIn>
          </TabsContent>

          {/* Advanced Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AdvancedAnalytics />
          </TabsContent>

          {/* AI Learning Analytics Tab */}
          <TabsContent value="ai-analytics" className="space-y-6">
            <AILearningAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProgressPage;
