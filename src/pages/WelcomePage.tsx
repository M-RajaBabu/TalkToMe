
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import FadeIn from "@/components/animations/FadeIn";
import SlideUp from "@/components/animations/SlideUp";
import { 
  ArrowRight, 
  Languages, 
  MessageSquare, 
  VolumeX, 
  Sparkles, 
  Users, 
  Trophy, 
  BookOpen,
  Star,
  Play,
  Mic,
  Brain,
  Globe,
  Heart,
  Download,
  Zap,
  Target,
  Clock,
  CheckCircle,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Music,
  GraduationCap
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

const features = [
  {
    icon: Languages,
    title: "Multiple Languages",
    description: "Practice Hindi, Telugu, Kannada, Tamil, and English at your own pace",
    color: "from-blue-500 to-purple-600",
    stats: "15+ Languages"
  },
  {
    icon: MessageSquare,
    title: "AI Conversations",
    description: "Chat with our AI language tutor for instant feedback and guidance",
    color: "from-green-500 to-teal-600",
    stats: "24/7 Available"
  },
  {
    icon: VolumeX,
    title: "Voice Recognition",
    description: "Speak naturally and improve your pronunciation with real-time feedback",
    color: "from-orange-500 to-red-600",
    stats: "Real-time"
  },
  {
    icon: Trophy,
    title: "Gamification",
    description: "Earn XP, badges, and track your progress with engaging challenges",
    color: "from-yellow-500 to-orange-600",
    stats: "100+ Achievements"
  },
  {
    icon: BookOpen,
    title: "Structured Learning",
    description: "Follow chapters and lessons for systematic progress and mastery",
    color: "from-indigo-500 to-blue-600",
    stats: "50+ Chapters"
  },
  {
    icon: Users,
    title: "Community",
    description: "Join leaderboards and compete with learners worldwide",
    color: "from-pink-500 to-purple-600",
    stats: "10K+ Users"
  }
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Student",
    avatar: "👩‍🎓",
    content: "TalkToMe helped me learn Hindi in just 3 months! The AI conversations are so natural.",
    rating: 5,
    language: "Hindi"
  },
  {
    name: "Rajesh Kumar",
    role: "Professional",
    avatar: "👨‍💼",
    content: "The voice recognition feature is amazing. My pronunciation improved dramatically.",
    rating: 5,
    language: "English"
  },
  {
    name: "Anjali Patel",
    role: "Teacher",
    avatar: "👩‍🏫",
    content: "I use this with my students. The cultural integration features are fantastic!",
    rating: 5,
    language: "Telugu"
  }
];

const learningPaths = [
  {
    title: "Beginner Path",
    description: "Start your language journey with basic conversations",
    duration: "2-3 months",
    lessons: 20,
    icon: "🌱",
    color: "from-green-400 to-emerald-600"
  },
  {
    title: "Intermediate Path",
    description: "Build fluency with advanced grammar and vocabulary",
    duration: "4-6 months",
    lessons: 35,
    icon: "🚀",
    color: "from-blue-400 to-indigo-600"
  },
  {
    title: "Advanced Path",
    description: "Master the language with cultural context and idioms",
    duration: "6-12 months",
    lessons: 50,
    icon: "🏆",
    color: "from-purple-400 to-pink-600"
  }
];

const languagePreview = [
  { name: "Hindi", native: "हिंदी", greeting: "नमस्ते", flag: "🇮🇳" },
  { name: "Telugu", native: "తెలుగు", greeting: "నమస్కారం", flag: "🇮🇳" },
  { name: "Kannada", native: "ಕನ್ನಡ", greeting: "ನಮಸ್ಕಾರ", flag: "🇮🇳" },
  { name: "Tamil", native: "தமிழ்", greeting: "வணக்கம்", flag: "🇮🇳" },
  { name: "English", native: "English", greeting: "Hello", flag: "🇺🇸" }
];

interface WelcomePageProps {
  isLoggedIn: boolean;
}

const WelcomePage = ({ isLoggedIn }: WelcomePageProps) => {
  const { t } = useTranslation();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [demoMessages, setDemoMessages] = useState<Array<{type: 'user' | 'ai', text: string, timestamp: Date}>>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const demoSteps = [
    { action: "Initializing AI Tutor...", progress: 10 },
    { action: "Loading language models...", progress: 25 },
    { action: "Setting up voice recognition...", progress: 40 },
    { action: "Preparing conversation...", progress: 60 },
    { action: "Starting demo chat...", progress: 80 },
    { action: "Demo ready!", progress: 100 }
  ];

  const demoConversation = [
    { type: 'ai' as const, text: "नमस्ते! मैं आपकी AI भाषा शिक्षिका हूं। आप कैसे हैं?" },
    { type: 'user' as const, text: "मैं बिलकुल ठीक हूं, धन्यवाद!" },
    { type: 'ai' as const, text: "बहुत अच्छा! आपका उच्चारण बहुत अच्छा है। क्या आप आज कुछ नया सीखना चाहते हैं?" },
    { type: 'user' as const, text: "हाँ, मुझे रोज़मर्रा की बातचीत सीखनी है।" },
    { type: 'ai' as const, text: "शानदार! चलिए रोज़मर्रा की बातचीत के कुछ वाक्य सीखते हैं।" }
  ];

  const startDemo = () => {
    setIsPlayingDemo(true);
    setDemoProgress(0);
    setDemoStep(0);
    setDemoMessages([]);
    
    // Simulate demo progress
    const progressInterval = setInterval(() => {
      setDemoProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          startDemoConversation();
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    // Update demo steps
    const stepInterval = setInterval(() => {
      setDemoStep(prev => {
        if (prev >= demoSteps.length - 1) {
          clearInterval(stepInterval);
          return demoSteps.length - 1;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const startDemoConversation = () => {
    let messageIndex = 0;
    
    const addMessage = () => {
      if (messageIndex < demoConversation.length) {
        setIsTyping(true);
        
        setTimeout(() => {
          setDemoMessages(prev => [...prev, {
            ...demoConversation[messageIndex],
            timestamp: new Date()
          }]);
          setIsTyping(false);
          messageIndex++;
          
          if (messageIndex < demoConversation.length) {
            setTimeout(addMessage, 2000);
          } else {
            // End demo after conversation
            setTimeout(() => {
              setIsPlayingDemo(false);
              setDemoProgress(0);
              setDemoStep(0);
              setDemoMessages([]);
            }, 3000);
          }
        }, 1500);
      }
    };
    
    addMessage();
  };

  const quickActions = [
    { icon: MessageSquare, label: "Start Chat", action: () => window.location.href = "/login" },
    { icon: BookOpen, label: "Browse Chapters", action: () => window.location.href = "/login" },
    { icon: Trophy, label: "View Progress", action: () => window.location.href = "/login" },
    { icon: Users, label: "Join Community", action: () => window.location.href = "/login" }
  ];

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pulse-glow"></div>
      </div>

      {/* Demo Overlay */}
      {isPlayingDemo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold gradient-text">TalkToMe Demo</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsPlayingDemo(false);
                    setDemoProgress(0);
                    setDemoStep(0);
                    setDemoMessages([]);
                  }}
                >
                  ✕
                </Button>
              </div>
              
              {/* Progress Section */}
              {demoProgress < 100 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{demoSteps[demoStep]?.action}</span>
                    <span className="text-sm text-muted-foreground">{demoProgress}%</span>
                  </div>
                  <Progress value={demoProgress} className="w-full" />
                </div>
              )}
            </div>

            {/* Chat Interface */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[60vh]">
              {demoMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Demo Features */}
            <div className="p-6 border-t border-border bg-muted/30">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div className="flex items-center justify-center gap-2">
                  <Mic className="w-4 h-4 text-green-500" />
                  <span>Voice Recognition</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Brain className="w-4 h-4 text-blue-500" />
                  <span>AI Learning</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>Progress Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {showFloatingMenu && (
            <div className="absolute bottom-16 right-0 space-y-2">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border/50 hover:scale-105 transition-all duration-200 cursor-pointer"
                  onClick={action.action}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {React.createElement(action.icon, { className: "w-4 h-4" })}
                  <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
                </div>
              ))}
            </div>
          )}
          <Button
            onClick={() => setShowFloatingMenu(!showFloatingMenu)}
            size="lg"
            className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
          >
            <Sparkles className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
        <FadeIn>
              <div className="relative inline-block mb-6">
          <img
            src="/pic_of_talk_to_me.jpg"
            alt={t('TalkToMe Logo')}
                  className="w-32 h-32 rounded-full shadow-2xl object-cover pulse-glow hover:scale-110 transition-transform duration-300 cursor-pointer"
                  onClick={() => window.location.href = "/login"}
          />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
        </FadeIn>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-4 gradient-text hover:scale-105 transition-transform duration-300 cursor-pointer">
              {t('TalkToMe')}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('Your AI language learning companion. Practice, learn, and chat in your favorite language with advanced AI tutors and cultural integration!')}
            </p>

            {/* Animated feature highlight */}
            <div className="mb-8">
              <SlideUp>
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-card/80 backdrop-blur-sm rounded-full border border-border/50 shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${features[currentFeature].color} flex items-center justify-center`}>
                    {React.createElement(features[currentFeature].icon, { className: "w-5 h-5 text-white" })}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{features[currentFeature].title}</p>
                    <p className="text-sm text-muted-foreground">{features[currentFeature].description}</p>
                  </div>
                </div>
              </SlideUp>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button asChild size="lg" className="w-full sm:w-auto px-8 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <Link to="/login" className="flex items-center gap-2">
                  {t('Get Started')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 py-6 text-lg font-semibold border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1">
                <Link to="/signup">{t('Create Account')}</Link>
            </Button>

              <Button 
                onClick={startDemo}
                disabled={isPlayingDemo}
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto px-8 py-6 text-lg font-semibold border-2 hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 hover:-translate-y-1"
              >
                {isPlayingDemo ? (
                  <>
                    <Play className="w-5 h-5 mr-2 animate-pulse" />
                    Demo Running...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Try Demo
                  </>
                )}
            </Button>
            </div>

            {/* Demo Progress */}
            {isPlayingDemo && (
              <div className="max-w-md mx-auto mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Demo Progress</span>
                  <span className="text-sm text-muted-foreground">{demoProgress}%</span>
                </div>
                <Progress value={demoProgress} className="w-full" />
              </div>
            )}
          </div>

          {/* Language Preview Section */}
          <FadeIn delay={200}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Supported Languages</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {languagePreview.map((lang, index) => (
                  <Card key={index} className="modern-card text-center hover:scale-105 transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{lang.flag}</div>
                      <h3 className="font-bold text-lg mb-1">{lang.name}</h3>
                      <p className="text-2xl mb-2 font-medium">{lang.native}</p>
                      <p className="text-sm text-muted-foreground">{lang.greeting}</p>
                      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Badge variant="secondary" className="text-xs">Click to Learn</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Why Choose TalkToMe?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <SlideUp key={index} delay={index * 0.1}>
                  <Card className="modern-card group cursor-pointer hover:scale-105 transition-all duration-300">
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        {React.createElement(feature.icon, { className: "w-8 h-8 text-white" })}
                      </div>
                      <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                      <Badge variant="secondary" className="mx-auto">{feature.stats}</Badge>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </SlideUp>
              ))}
            </div>
          </div>

          {/* Learning Paths */}
          <FadeIn delay={300}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Choose Your Learning Path</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {learningPaths.map((path, index) => (
                  <Card key={index} className="modern-card hover:scale-105 transition-all duration-300">
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${path.color} flex items-center justify-center mb-4`}>
                        <span className="text-3xl">{path.icon}</span>
                      </div>
                      <CardTitle className="text-xl font-bold">{path.title}</CardTitle>
                      <CardDescription className="text-center">{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Duration
                        </span>
                        <span className="font-medium">{path.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          Lessons
                        </span>
                        <span className="font-medium">{path.lessons}</span>
                      </div>
                    </CardContent>
                                         <CardFooter>
                       <Button className="w-full" variant="outline" onClick={() => window.location.href = "/login"}>
                         Start Path
                       </Button>
                     </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Testimonials */}
          <FadeIn delay={400}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8 gradient-text">What Our Users Say</h2>
              <div className="max-w-4xl mx-auto">
                <Card className="modern-card">
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-4">{testimonials[currentTestimonial].avatar}</div>
                    <p className="text-lg mb-4 italic">"{testimonials[currentTestimonial].content}"</p>
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonials[currentTestimonial].name}</p>
                      <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].role} • {testimonials[currentTestimonial].language}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </FadeIn>

          {/* Stats Section */}
          <FadeIn delay={500}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Our Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="modern-card p-6 text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">15+</div>
                  <div className="text-muted-foreground">Languages Supported</div>
                </div>
                <div className="modern-card p-6 text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
                  <div className="text-muted-foreground">AI Tutor Available</div>
                </div>
                <div className="modern-card p-6 text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
                  <div className="text-muted-foreground">Active Learners</div>
                </div>
                <div className="modern-card p-6 text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">100%</div>
                  <div className="text-muted-foreground">Free to Use</div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Advanced Features Preview */}
          <FadeIn delay={600}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Advanced Features</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <Card className="modern-card text-center p-4 hover:scale-105 transition-all duration-300 cursor-pointer group" onClick={() => window.location.href = "/login"}>
                   <Brain className="w-8 h-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300" />
                   <h3 className="font-semibold">AI Tutors</h3>
                   <p className="text-sm text-muted-foreground">Personalized learning</p>
                   <Badge variant="secondary" className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Try Now</Badge>
                 </Card>
                 <Card className="modern-card text-center p-4 hover:scale-105 transition-all duration-300 cursor-pointer group" onClick={() => window.location.href = "/login"}>
                   <Globe className="w-8 h-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300" />
                   <h3 className="font-semibold">Cultural Integration</h3>
                   <p className="text-sm text-muted-foreground">Learn through culture</p>
                   <Badge variant="secondary" className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore</Badge>
                 </Card>
                 <Card className="modern-card text-center p-4 hover:scale-105 transition-all duration-300 cursor-pointer group" onClick={() => window.location.href = "/login"}>
                   <Music className="w-8 h-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300" />
                   <h3 className="font-semibold">Music Learning</h3>
                   <p className="text-sm text-muted-foreground">Learn through songs</p>
                   <Badge variant="secondary" className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Listen</Badge>
                 </Card>
                 <Card className="modern-card text-center p-4 hover:scale-105 transition-all duration-300 cursor-pointer group" onClick={() => window.location.href = "/login"}>
                   <GraduationCap className="w-8 h-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300" />
                   <h3 className="font-semibold">Private Lessons</h3>
                   <p className="text-sm text-muted-foreground">One-on-one tutoring</p>
                   <Badge variant="secondary" className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Book Now</Badge>
                 </Card>
               </div>
            </div>
          </FadeIn>

          {/* Final CTA */}
          <FadeIn delay={700}>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 gradient-text">Ready to Start Your Language Journey?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of learners who are already mastering new languages with TalkToMe's AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  <Link to="/signup" className="flex items-center gap-2">
                    Start Learning Now
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg font-semibold">
                  <Link to="/login">Already have an account?</Link>
                </Button>
              </div>
            </div>
          </FadeIn>
          </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-card/80 backdrop-blur-sm border-t border-border/50 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 gradient-text">TalkToMe</h3>
              <p className="text-muted-foreground mb-4">
                Your AI language learning companion. Practice, learn, and chat in your favorite language.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm">
                  <Github className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>AI Conversations</li>
                <li>Voice Recognition</li>
                <li>Cultural Integration</li>
                <li>Private Lessons</li>
                <li>Music Learning</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Languages</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Hindi</li>
                <li>Telugu</li>
                <li>Kannada</li>
                <li>Tamil</li>
                <li>English</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  support@talktome.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  San Francisco, CA
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 TalkToMe. All rights reserved. Made with ❤️ for language learners worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
