import React, { useState, useEffect } from 'react';
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
  Eye,
  Ear,
  PenTool,
  Mic,
  Activity,
  Target as TargetIcon,
  TrendingDown,
  AlertCircle,
  Lightbulb,
  CalendarDays,
  Clock3,
  PieChart,
  LineChart,
  BarChart,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Crown,
  Medal,
  Award as AwardIcon,
  Brain as BrainIcon,
  Target as TargetIcon2
} from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import { useTranslation } from 'react-i18next';

// Advanced Analytics Types
interface SkillNode {
  id: string;
  name: string;
  category: 'vocabulary' | 'grammar' | 'pronunciation' | 'listening' | 'speaking' | 'reading' | 'writing';
  level: number; // 0-5
  maxLevel: number;
  progress: number; // 0-100
  isUnlocked: boolean;
  isMastered: boolean;
  children: string[]; // IDs of dependent skills
  parents: string[]; // IDs of prerequisite skills
  xpRequired: number;
  currentXp: number;
}

interface LearningSession {
  id: string;
  date: Date;
  duration: number; // minutes
  activity: 'chat' | 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'reading' | 'writing';
  accuracy: number;
  wordsLearned: number;
  pointsEarned: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface PerformanceMetric {
  date: string;
  accuracy: number;
  speed: number;
  comprehension: number;
  retention: number;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // days
  progress: number;
  skills: string[];
  isActive: boolean;
  isCompleted: boolean;
}

// Mock Data for Advanced Analytics
const mockSkillTree: SkillNode[] = [
  // Vocabulary Skills
  {
    id: 'basic_vocab',
    name: 'Basic Vocabulary',
    category: 'vocabulary',
    level: 3,
    maxLevel: 5,
    progress: 60,
    isUnlocked: true,
    isMastered: false,
    children: ['greetings', 'numbers', 'colors'],
    parents: [],
    xpRequired: 1000,
    currentXp: 600
  },
  {
    id: 'greetings',
    name: 'Greetings & Introductions',
    category: 'vocabulary',
    level: 4,
    maxLevel: 5,
    progress: 80,
    isUnlocked: true,
    isMastered: false,
    children: ['conversation_basics'],
    parents: ['basic_vocab'],
    xpRequired: 500,
    currentXp: 400
  },
  {
    id: 'numbers',
    name: 'Numbers & Counting',
    category: 'vocabulary',
    level: 2,
    maxLevel: 5,
    progress: 40,
    isUnlocked: true,
    isMastered: false,
    children: ['time_expressions'],
    parents: ['basic_vocab'],
    xpRequired: 800,
    currentXp: 320
  },
  {
    id: 'colors',
    name: 'Colors & Descriptions',
    category: 'vocabulary',
    level: 5,
    maxLevel: 5,
    progress: 100,
    isUnlocked: true,
    isMastered: true,
    children: ['advanced_descriptions'],
    parents: ['basic_vocab'],
    xpRequired: 600,
    currentXp: 600
  },
  // Grammar Skills
  {
    id: 'basic_grammar',
    name: 'Basic Grammar',
    category: 'grammar',
    level: 2,
    maxLevel: 5,
    progress: 40,
    isUnlocked: true,
    isMastered: false,
    children: ['verb_conjugation', 'sentence_structure'],
    parents: [],
    xpRequired: 1200,
    currentXp: 480
  },
  {
    id: 'verb_conjugation',
    name: 'Verb Conjugation',
    category: 'grammar',
    level: 1,
    maxLevel: 5,
    progress: 20,
    isUnlocked: true,
    isMastered: false,
    children: ['advanced_grammar'],
    parents: ['basic_grammar'],
    xpRequired: 1000,
    currentXp: 200
  },
  // Speaking Skills
  {
    id: 'pronunciation',
    name: 'Pronunciation',
    category: 'speaking',
    level: 3,
    maxLevel: 5,
    progress: 60,
    isUnlocked: true,
    isMastered: false,
    children: ['fluency', 'intonation'],
    parents: [],
    xpRequired: 800,
    currentXp: 480
  },
  {
    id: 'fluency',
    name: 'Speaking Fluency',
    category: 'speaking',
    level: 2,
    maxLevel: 5,
    progress: 40,
    isUnlocked: true,
    isMastered: false,
    children: ['conversation_mastery'],
    parents: ['pronunciation'],
    xpRequired: 1500,
    currentXp: 600
  }
];

const mockLearningSessions: LearningSession[] = [
  {
    id: '1',
    date: new Date('2024-01-15'),
    duration: 45,
    activity: 'chat',
    accuracy: 85,
    wordsLearned: 12,
    pointsEarned: 150,
    difficulty: 'medium'
  },
  {
    id: '2',
    date: new Date('2024-01-16'),
    duration: 30,
    activity: 'vocabulary',
    accuracy: 92,
    wordsLearned: 8,
    pointsEarned: 120,
    difficulty: 'easy'
  },
  {
    id: '3',
    date: new Date('2024-01-17'),
    duration: 60,
    activity: 'grammar',
    accuracy: 78,
    wordsLearned: 15,
    pointsEarned: 200,
    difficulty: 'hard'
  },
  {
    id: '4',
    date: new Date('2024-01-18'),
    duration: 25,
    activity: 'listening',
    accuracy: 88,
    wordsLearned: 6,
    pointsEarned: 100,
    difficulty: 'medium'
  },
  {
    id: '5',
    date: new Date('2024-01-19'),
    duration: 40,
    activity: 'speaking',
    accuracy: 82,
    wordsLearned: 10,
    pointsEarned: 180,
    difficulty: 'medium'
  }
];

const mockPerformanceMetrics: PerformanceMetric[] = [
  { date: '2024-01-15', accuracy: 85, speed: 75, comprehension: 80, retention: 82 },
  { date: '2024-01-16', accuracy: 92, speed: 78, comprehension: 85, retention: 88 },
  { date: '2024-01-17', accuracy: 78, speed: 72, comprehension: 75, retention: 80 },
  { date: '2024-01-18', accuracy: 88, speed: 80, comprehension: 82, retention: 85 },
  { date: '2024-01-19', accuracy: 82, speed: 76, comprehension: 78, retention: 83 },
  { date: '2024-01-20', accuracy: 90, speed: 82, comprehension: 85, retention: 87 },
  { date: '2024-01-21', accuracy: 85, speed: 79, comprehension: 80, retention: 84 }
];

const mockLearningPaths: LearningPath[] = [
  {
    id: 'beginner_path',
    name: 'Beginner Foundation',
    description: 'Master the basics of conversation and essential vocabulary',
    difficulty: 'beginner',
    estimatedDuration: 30,
    progress: 65,
    skills: ['basic_vocab', 'greetings', 'basic_grammar'],
    isActive: true,
    isCompleted: false
  },
  {
    id: 'intermediate_path',
    name: 'Intermediate Communication',
    description: 'Develop fluency and advanced conversation skills',
    difficulty: 'intermediate',
    estimatedDuration: 45,
    progress: 25,
    skills: ['conversation_basics', 'verb_conjugation', 'fluency'],
    isActive: false,
    isCompleted: false
  },
  {
    id: 'advanced_path',
    name: 'Advanced Mastery',
    description: 'Achieve native-like proficiency and cultural understanding',
    difficulty: 'advanced',
    estimatedDuration: 60,
    progress: 0,
    skills: ['conversation_mastery', 'advanced_grammar', 'cultural_context'],
    isActive: false,
    isCompleted: false
  }
];

const AdvancedAnalytics = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [skillTree, setSkillTree] = useState(mockSkillTree);
  const [learningSessions, setLearningSessions] = useState(mockLearningSessions);
  const [performanceMetrics, setPerformanceMetrics] = useState(mockPerformanceMetrics);
  const [learningPaths, setLearningPaths] = useState(mockLearningPaths);

  // Calculate analytics
  const totalSessions = learningSessions.length;
  const totalTimeSpent = learningSessions.reduce((sum, session) => sum + session.duration, 0);
  const averageAccuracy = learningSessions.reduce((sum, session) => sum + session.accuracy, 0) / totalSessions;
  const totalWordsLearned = learningSessions.reduce((sum, session) => sum + session.wordsLearned, 0);
  const totalPointsEarned = learningSessions.reduce((sum, session) => sum + session.pointsEarned, 0);

  // Performance trends
  const recentPerformance = performanceMetrics.slice(-7);
  const accuracyTrend = recentPerformance[recentPerformance.length - 1]?.accuracy - recentPerformance[0]?.accuracy || 0;
  const speedTrend = recentPerformance[recentPerformance.length - 1]?.speed - recentPerformance[0]?.speed || 0;

  // Skill mastery calculation
  const masteredSkills = skillTree.filter(skill => skill.isMastered).length;
  const totalSkills = skillTree.length;
  const masteryPercentage = (masteredSkills / totalSkills) * 100;

  // Learning path progress
  const activePath = learningPaths.find(path => path.isActive);
  const completedPaths = learningPaths.filter(path => path.isCompleted).length;

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      vocabulary: <BookOpen className="w-4 h-4" />,
      grammar: <PenTool className="w-4 h-4" />,
      pronunciation: <Mic className="w-4 h-4" />,
      listening: <Ear className="w-4 h-4" />,
      speaking: <Mic className="w-4 h-4" />,
      reading: <Eye className="w-4 h-4" />,
      writing: <PenTool className="w-4 h-4" />
    };
    return icons[category] || <TargetIcon className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      vocabulary: "bg-blue-500",
      grammar: "bg-purple-500",
      pronunciation: "bg-green-500",
      listening: "bg-orange-500",
      speaking: "bg-red-500",
      reading: "bg-indigo-500",
      writing: "bg-pink-500"
    };
    return colors[category] || "bg-gray-500";
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <ArrowDownRight className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-green-500";
    if (trend < 0) return "text-red-500";
    return "text-gray-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold gradient-text mb-2">Advanced Learning Analytics</h2>
          <p className="text-muted-foreground">Deep insights into your learning journey and performance</p>
        </div>
      </FadeIn>

      {/* Main Analytics Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-card/80 backdrop-blur-sm">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="skilltree" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Skill Tree
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="learningpaths" className="flex items-center gap-2">
            <TargetIcon className="w-4 h-4" />
            Learning Paths
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Predictions
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FadeIn delay={100}>
              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSessions}</div>
                  <p className="text-xs text-muted-foreground">+{Math.floor(totalSessions * 0.2)} this week</p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={200}>
              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
                  <Timer className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTimeSpent}h</div>
                  <p className="text-xs text-muted-foreground">~{Math.round(totalTimeSpent / totalSessions)}min/session</p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={300}>
              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Accuracy</CardTitle>
                  <Target className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageAccuracy.toFixed(1)}%</div>
                  <div className="flex items-center gap-1 text-xs">
                    {getTrendIcon(accuracyTrend)}
                    <span className={getTrendColor(accuracyTrend)}>
                      {accuracyTrend > 0 ? '+' : ''}{accuracyTrend.toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={400}>
              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Words Learned</CardTitle>
                  <BookOpen className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalWordsLearned}</div>
                  <p className="text-xs text-muted-foreground">+{Math.floor(totalWordsLearned * 0.15)} this week</p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FadeIn delay={500}>
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Weekly Performance Trends
                  </CardTitle>
                  <CardDescription>Your learning metrics over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPerformance.map((metric, index) => (
                      <div key={metric.date} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{new Date(metric.date).toLocaleDateString()}</span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3 text-purple-500" />
                            <span className="text-xs">{metric.accuracy}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-blue-500" />
                            <span className="text-xs">{metric.speed}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Brain className="w-3 h-3 text-green-500" />
                            <span className="text-xs">{metric.comprehension}%</span>
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
                    <PieChart className="w-5 h-5" />
                    Activity Distribution
                  </CardTitle>
                  <CardDescription>How you spend your learning time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {['chat', 'vocabulary', 'grammar', 'listening', 'speaking'].map((activity) => {
                    const activitySessions = learningSessions.filter(s => s.activity === activity);
                    const totalTime = activitySessions.reduce((sum, s) => sum + s.duration, 0);
                    const percentage = (totalTime / totalTimeSpent) * 100;
                    
                    return (
                      <div key={activity} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getCategoryColor(activity)}`}></div>
                          <span className="text-sm font-medium capitalize">{activity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="w-20 h-2" />
                          <span className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </TabsContent>

        {/* Skill Tree Tab */}
        <TabsContent value="skilltree" className="space-y-6">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skillTree.map((skill, index) => (
                <Card 
                  key={skill.id} 
                  className={`modern-card transition-all duration-300 hover:scale-105 ${
                    skill.isMastered 
                      ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/50' 
                      : skill.isUnlocked 
                        ? 'border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/50'
                        : 'opacity-60 border-gray-300'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full ${getCategoryColor(skill.category)} flex items-center justify-center`}>
                          {getCategoryIcon(skill.category)}
                        </div>
                        <div>
                          <CardTitle className="text-sm">{skill.name}</CardTitle>
                          <CardDescription className="text-xs capitalize">{skill.category}</CardDescription>
                        </div>
                      </div>
                      {skill.isMastered && (
                        <Crown className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Level {skill.level}/{skill.maxLevel}</span>
                      <span>{skill.progress}%</span>
                    </div>
                    <Progress value={skill.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>XP: {skill.currentXp}/{skill.xpRequired}</span>
                      <span>{skill.isUnlocked ? 'Unlocked' : 'Locked'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FadeIn>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    Learning Sessions
                  </CardTitle>
                  <CardDescription>Detailed breakdown of your learning activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {learningSessions.slice(-5).map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${getCategoryColor(session.activity)} flex items-center justify-center`}>
                            {getCategoryIcon(session.activity)}
                          </div>
                          <div>
                            <div className="font-medium capitalize">{session.activity}</div>
                            <div className="text-sm text-muted-foreground">
                              {session.duration}min • {session.accuracy}% accuracy
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{session.pointsEarned} pts</div>
                          <div className="text-sm text-muted-foreground">
                            {session.wordsLearned} words
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>Key performance indicators over time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Accuracy', value: averageAccuracy, trend: accuracyTrend, icon: Target },
                    { label: 'Speed', value: 78, trend: speedTrend, icon: Zap },
                    { label: 'Comprehension', value: 82, trend: 3, icon: Brain },
                    { label: 'Retention', value: 85, trend: 2, icon: BookOpen }
                  ].map((metric) => (
                    <div key={metric.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <metric.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{metric.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{metric.value.toFixed(1)}%</span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(metric.trend)}
                          <span className={`text-xs ${getTrendColor(metric.trend)}`}>
                            {metric.trend > 0 ? '+' : ''}{metric.trend.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </FadeIn>
        </TabsContent>

        {/* Learning Paths Tab */}
        <TabsContent value="learningpaths" className="space-y-6">
          <FadeIn>
            <div className="space-y-4">
              {learningPaths.map((path, index) => (
                <Card key={path.id} className="modern-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {path.name}
                          {path.isActive && (
                            <Badge className="bg-green-500 text-white">Active</Badge>
                          )}
                          {path.isCompleted && (
                            <Badge className="bg-blue-500 text-white">Completed</Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-2">{path.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">
                          {path.difficulty}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {path.estimatedDuration} days
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                      <div className="flex gap-2">
                        {path.skills.slice(0, 3).map((skillId) => {
                          const skill = skillTree.find(s => s.id === skillId);
                          return skill ? (
                            <Badge key={skillId} variant="secondary" className="text-xs">
                              {skill.name}
                            </Badge>
                          ) : null;
                        })}
                        {path.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{path.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FadeIn>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Fluency Prediction
                  </CardTitle>
                  <CardDescription>AI-powered insights about your learning journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Current Level</span>
                      <Badge className="bg-blue-500">Intermediate</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Predicted Fluency</span>
                      <Badge className="bg-green-500">Advanced</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Time to Fluency</span>
                      <span className="text-sm font-medium">~6 months</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Confidence</span>
                      <span className="text-sm font-medium text-green-600">85%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TargetIcon className="w-5 h-5" />
                    Recommended Focus
                  </CardTitle>
                  <CardDescription>Areas to focus on for maximum improvement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { skill: 'Grammar', priority: 'High', reason: 'Lowest accuracy score' },
                      { skill: 'Pronunciation', priority: 'Medium', reason: 'Needs more practice' },
                      { skill: 'Vocabulary', priority: 'Low', reason: 'Good progress, maintain' }
                    ].map((item) => (
                      <div key={item.skill} className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <div>
                          <div className="font-medium text-sm">{item.skill}</div>
                          <div className="text-xs text-muted-foreground">{item.reason}</div>
                        </div>
                        <Badge 
                          variant={item.priority === 'High' ? 'destructive' : item.priority === 'Medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {item.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </FadeIn>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics; 