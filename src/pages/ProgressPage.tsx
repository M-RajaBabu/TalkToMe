
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppHeader from "@/components/layout/AppHeader";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Clock, MessageCircle, Target, TrendingUp } from "lucide-react";
import SlideUp from "@/components/animations/SlideUp";
import { useEffect, useState } from 'react';

const mockData = {
  fluencyScore: 68,
  practiceStats: [
    { day: 'Mon', minutes: 15 },
    { day: 'Tue', minutes: 12 },
    { day: 'Wed', minutes: 20 },
    { day: 'Thu', minutes: 8 },
    { day: 'Fri', minutes: 25 },
    { day: 'Sat', minutes: 18 },
    { day: 'Sun', minutes: 5 },
  ],
  metrics: {
    daysActive: 7,
    messagesExchanged: 42,
    grammarAccuracy: 73,
    vocabularyMastered: 24,
  },
};

const ProgressPage = () => {
  // Calculate today's active minutes (use last entry in mockData.practiceStats as 'today')
  const todayMinutes = mockData.practiceStats.length > 0 ? mockData.practiceStats[mockData.practiceStats.length - 1].minutes : 0;

  // Visual streak counter state
  const [streak, setStreak] = useState(0);
  // Weekly streak calendar (real: use recentActivity from backend)
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/streak', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data) {
          if (typeof data.currentStreak === 'number') setStreak(data.currentStreak);
          if (Array.isArray(data.recentActivity)) setRecentActivity(data.recentActivity);
          if (Array.isArray(data.badges)) setBadges(data.badges);
        }
      } catch (err) {
        setStreak(0);
        setRecentActivity([]);
        setBadges([]);
      }
    };
    fetchStreak();
  }, []);

  // Build weekActive array for the last 7 days ending today
  const weekActive = (() => {
    const arr = Array(7).fill(false);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const iso = d.toISOString().slice(0, 10);
      arr[i] = recentActivity.includes(iso);
    }
    return arr;
  })();

  // Badge display info
  const badgeInfo: Record<string, { icon: string; label: string }> = {
    'streak-7': { icon: '🔥', label: '7-Day Streak' },
    'messages-100': { icon: '💬', label: '100 Messages' },
    'voice-1': { icon: '🎤', label: 'First Voice Chat' },
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <div className="container max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mt-4 mb-6">My Progress</h1>
        
        <SlideUp>
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Fluency Score</CardTitle>
              <CardDescription>Your language proficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Beginner</span>
                <span className="font-medium">{mockData.fluencyScore}%</span>
                <span className="text-sm text-muted-foreground">Advanced</span>
              </div>
              <Progress value={mockData.fluencyScore} className="h-2" />
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Keep practicing to increase your fluency!</p>
              </div>
            </CardContent>
          </Card>
        </SlideUp>
        
        <SlideUp delay={100}>
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Practice Activity</CardTitle>
              <CardDescription>Minutes spent learning per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockData.practiceStats}
                    margin={{
                      top: 5,
                      right: 5,
                      left: 5,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <Tooltip
                      formatter={(value) => [`${value} min`, 'Practice time']}
                      labelStyle={{ color: '#333' }}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Bar dataKey="minutes" fill="#6D28D9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </SlideUp>
        
        <SlideUp delay={400}>
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Time Active Today</CardTitle>
              <CardDescription>How much time you were active today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="font-medium text-2xl">{todayMinutes} min</div>
                <div className="text-sm text-muted-foreground">Active today</div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>
        
        {/* Visual Streak Counter */}
        <SlideUp delay={0}>
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Streak</CardTitle>
              <CardDescription>Keep your streak going!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-2 text-2xl">
                  🔥
                </div>
                <div className="font-bold text-3xl">{streak} day{streak === 1 ? '' : 's'}</div>
                <div className="text-sm text-muted-foreground mb-2">Current streak</div>
                {/* Weekly streak calendar */}
                <div className="flex gap-2 mt-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span className="text-xs text-muted-foreground mb-1">{d}</span>
                      <div className={`w-5 h-5 rounded-full border ${weekActive[i] ? 'bg-orange-400 border-orange-500' : 'bg-background border-gray-300'}`}></div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Past 7 days</div>
                {/* Badges section */}
                <div className="mt-6">
                  <div className="font-semibold mb-2">Badges</div>
                  <div className="flex gap-4 flex-wrap">
                    {badges.length === 0 && <span className="text-muted-foreground text-sm">No badges yet</span>}
                    {badges.map(badge => (
                      <div key={badge} className="flex flex-col items-center">
                        <span className="text-2xl mb-1">{badgeInfo[badge]?.icon || '🏅'}</span>
                        <span className="text-xs text-muted-foreground">{badgeInfo[badge]?.label || badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <SlideUp delay={200}>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="font-medium text-xl">{mockData.metrics.daysActive}</div>
                  <div className="text-sm text-muted-foreground">Days active</div>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
          
          <SlideUp delay={250}>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                    <MessageCircle className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="font-medium text-xl">{mockData.metrics.messagesExchanged}</div>
                  <div className="text-sm text-muted-foreground">Messages</div>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
          
          <SlideUp delay={300}>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                    <Target className="h-5 w-5 text-accent" />
                  </div>
                  <div className="font-medium text-xl">{mockData.metrics.grammarAccuracy}%</div>
                  <div className="text-sm text-muted-foreground">Grammar accuracy</div>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
          
          <SlideUp delay={350}>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div className="font-medium text-xl">{mockData.metrics.vocabularyMastered}</div>
                  <div className="text-sm text-muted-foreground">Words mastered</div>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        </div>
      </div>
      
      <AppHeader className="md:hidden" />
    </div>
  );
};

export default ProgressPage;
