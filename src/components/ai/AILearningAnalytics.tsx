import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, TrendingUp, Target, Clock, Star, Award, Activity, 
  BarChart3, PieChart, LineChart, Zap, Lightbulb, CheckCircle,
  AlertCircle, Play, Pause, RotateCcw, Settings, Sparkles
} from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import { useTranslation } from 'react-i18next';
import { useToast } from "@/hooks/use-toast";

// Analytics Types
interface LearningMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  target: number;
  category: 'performance' | 'engagement' | 'accuracy' | 'speed';
}

interface AIPrediction {
  id: string;
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeframe: string;
  reasoning: string;
}

interface LearningPattern {
  id: string;
  pattern: string;
  description: string;
  strength: number;
  impact: 'positive' | 'negative' | 'neutral';
  recommendations: string[];
}

interface SkillGap {
  id: string;
  skill: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  priority: 'high' | 'medium' | 'low';
  aiRecommendation: string;
}

// Mock Analytics Data
const mockLearningMetrics: LearningMetric[] = [
  {
    id: '1',
    name: 'Vocabulary Retention',
    value: 87,
    unit: '%',
    change: 12,
    trend: 'up',
    target: 90,
    category: 'performance'
  },
  {
    id: '2',
    name: 'Grammar Accuracy',
    value: 78,
    unit: '%',
    change: -3,
    trend: 'down',
    target: 85,
    category: 'accuracy'
  },
  {
    id: '3',
    name: 'Speaking Fluency',
    value: 82,
    unit: 'WPM',
    change: 8,
    trend: 'up',
    target: 100,
    category: 'speed'
  },
  {
    id: '4',
    name: 'Daily Practice Time',
    value: 45,
    unit: 'min',
    change: 15,
    trend: 'up',
    target: 60,
    category: 'engagement'
  },
  {
    id: '5',
    name: 'Pronunciation Accuracy',
    value: 91,
    unit: '%',
    change: 5,
    trend: 'up',
    target: 95,
    category: 'accuracy'
  },
  {
    id: '6',
    name: 'Comprehension Rate',
    value: 76,
    unit: '%',
    change: 9,
    trend: 'up',
    target: 85,
    category: 'performance'
  }
];

const mockAIPredictions: AIPrediction[] = [
  {
    id: '1',
    metric: 'Vocabulary Mastery',
    currentValue: 87,
    predictedValue: 92,
    confidence: 89,
    timeframe: '2 weeks',
    reasoning: 'Based on current learning pace and practice consistency'
  },
  {
    id: '2',
    metric: 'Grammar Proficiency',
    currentValue: 78,
    predictedValue: 83,
    confidence: 76,
    timeframe: '3 weeks',
    reasoning: 'Focus on irregular verbs will improve scores'
  },
  {
    id: '3',
    metric: 'Speaking Confidence',
    currentValue: 82,
    predictedValue: 88,
    confidence: 91,
    timeframe: '1 week',
    reasoning: 'Recent conversation practice shows rapid improvement'
  }
];

const mockLearningPatterns: LearningPattern[] = [
  {
    id: '1',
    pattern: 'Morning Learning Peak',
    description: 'You learn best between 8-10 AM',
    strength: 85,
    impact: 'positive',
    recommendations: ['Schedule important lessons in the morning', 'Practice pronunciation during peak hours']
  },
  {
    id: '2',
    pattern: 'Vocabulary Retention',
    description: 'You retain new words better with visual aids',
    strength: 92,
    impact: 'positive',
    recommendations: ['Use flashcards with images', 'Watch videos with subtitles']
  },
  {
    id: '3',
    pattern: 'Grammar Struggle',
    description: 'Complex grammar rules need more repetition',
    strength: 65,
    impact: 'negative',
    recommendations: ['Focus on one grammar concept at a time', 'Use spaced repetition for grammar']
  }
];

const mockSkillGaps: SkillGap[] = [
  {
    id: '1',
    skill: 'Advanced Grammar',
    currentLevel: 65,
    targetLevel: 85,
    gap: 20,
    priority: 'high',
    aiRecommendation: 'Focus on subjunctive mood and complex sentence structures'
  },
  {
    id: '2',
    skill: 'Business Vocabulary',
    currentLevel: 45,
    targetLevel: 75,
    gap: 30,
    priority: 'medium',
    aiRecommendation: 'Practice formal expressions and professional terminology'
  },
  {
    id: '3',
    skill: 'Cultural Context',
    currentLevel: 70,
    targetLevel: 90,
    gap: 20,
    priority: 'low',
    aiRecommendation: 'Engage with cultural content and native speakers'
  }
];

const AILearningAnalytics = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState(mockLearningMetrics);
  const [predictions, setPredictions] = useState(mockAIPredictions);
  const [patterns, setPatterns] = useState(mockLearningPatterns);
  const [skillGaps, setSkillGaps] = useState(mockSkillGaps);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh analytics data
  const refreshAnalytics = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate data refresh
      const updatedMetrics = metrics.map(metric => ({
        ...metric,
        value: Math.min(100, Math.max(0, metric.value + (Math.random() - 0.5) * 10)),
        change: Math.floor((Math.random() - 0.5) * 20)
      }));
      setMetrics(updatedMetrics);
      setIsRefreshing(false);
      
      toast({
        title: "Analytics Updated!",
        description: "AI has refreshed your learning analytics with latest data.",
      });
    }, 2000);
  };

  // Get trend color and icon
  const getTrendData = (trend: string, change: number) => {
    switch (trend) {
      case 'up':
        return { color: 'text-green-500', icon: TrendingUp, bg: 'bg-green-50 dark:bg-green-950/50' };
      case 'down':
        return { color: 'text-red-500', icon: TrendingUp, bg: 'bg-red-50 dark:bg-red-950/50' };
      default:
        return { color: 'text-blue-500', icon: Activity, bg: 'bg-blue-50 dark:bg-blue-950/50' };
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'bg-blue-500';
      case 'engagement': return 'bg-green-500';
      case 'accuracy': return 'bg-purple-500';
      case 'speed': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-500';
    if (confidence >= 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold gradient-text mb-2">AI Learning Analytics</h2>
          <p className="text-muted-foreground">Advanced insights and predictions powered by artificial intelligence</p>
        </div>
      </FadeIn>

      {/* Analytics Dashboard */}
      <div className="space-y-6">
        {/* Key Metrics Overview */}
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.slice(0, 6).map((metric, index) => {
              const trendData = getTrendData(metric.trend, metric.change);
              const TrendIcon = trendData.icon;
              
              return (
                <Card key={metric.id} className="modern-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full ${getCategoryColor(metric.category)} flex items-center justify-center`}>
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-sm">{metric.name}</CardTitle>
                          <CardDescription className="text-xs">
                            Target: {metric.target}{metric.unit}
                          </CardDescription>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 ${trendData.color}`}>
                        <TrendIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current</span>
                        <span className="font-bold">{metric.value}{metric.unit}</span>
                      </div>
                      <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {Math.round((metric.value / metric.target) * 100)}% of target
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </FadeIn>

        {/* AI Predictions */}
        <FadeIn>
          <Card className="modern-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    AI Predictions
                  </CardTitle>
                  <CardDescription>AI-powered forecasts based on your learning patterns</CardDescription>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={refreshAnalytics}
                  disabled={isRefreshing}
                >
                  <RotateCcw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.map((prediction, index) => (
                  <div key={prediction.id} className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{prediction.metric}</h4>
                        <p className="text-sm text-muted-foreground">{prediction.timeframe}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Current: </span>
                          <span className="font-medium">{prediction.currentValue}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Predicted: </span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            {prediction.predictedValue}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>AI Confidence</span>
                        <span className={`font-bold ${getConfidenceColor(prediction.confidence)}`}>
                          {prediction.confidence}%
                        </span>
                      </div>
                      <Progress value={prediction.confidence} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {prediction.reasoning}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Learning Patterns */}
        <FadeIn>
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Learning Patterns
              </CardTitle>
              <CardDescription>AI-identified patterns in your learning behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patterns.map((pattern, index) => (
                  <div key={pattern.id} className="p-4 rounded-lg border border-border/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium flex items-center gap-2">
                          {pattern.pattern}
                          <Badge 
                            variant={pattern.impact === 'positive' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {pattern.impact}
                          </Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {pattern.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {pattern.strength}%
                        </div>
                        <div className="text-xs text-muted-foreground">Strength</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">AI Recommendations:</div>
                      <div className="space-y-1">
                        {pattern.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Skill Gaps Analysis */}
        <FadeIn>
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Skill Gaps Analysis
              </CardTitle>
              <CardDescription>AI-identified areas for improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillGaps.map((gap, index) => (
                  <div key={gap.id} className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium flex items-center gap-2">
                          {gap.skill}
                          <Badge 
                            variant="outline" 
                            className={`${getPriorityColor(gap.priority)} text-white`}
                          >
                            {gap.priority} priority
                          </Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Gap: {gap.gap} points
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Current: </span>
                          <span className="font-medium">{gap.currentLevel}%</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Target: </span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            {gap.targetLevel}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round((gap.currentLevel / gap.targetLevel) * 100)}%</span>
                      </div>
                      <Progress value={(gap.currentLevel / gap.targetLevel) * 100} className="h-2" />
                      
                      <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                              AI Recommendation
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              {gap.aiRecommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
};

export default AILearningAnalytics; 