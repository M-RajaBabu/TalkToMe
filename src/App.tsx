
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, BarChart2, MessageSquare, BookOpen, ChevronDown, Smartphone, Globe, Brain, Trophy, Sparkles, Download, RotateCcw, Music, GraduationCap } from "lucide-react";

// Pages
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LanguageSelectionPage from "./pages/LanguageSelectionPage";
import ChatPage from "./pages/ChatPage";
import ProgressPage from "./pages/ProgressPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import ChaptersPage from "./pages/ChaptersPage";
import ProfilePage from "./pages/ProfilePage";
import { ModeToggle } from "@/components/ui/mode-toggle";
import FlashcardsPage from "./pages/FlashcardsPage";
import QuizPage from "./pages/QuizPage";
import LeaderboardPage from "./pages/LeaderboardPage";

// New Advanced Features
import GestureControls from "./components/mobile/GestureControls";
import CulturalIntegration from "./components/cultural/CulturalIntegration";
import AdvancedLearningTools from "./components/learning/AdvancedLearningTools";
import AchievementSystem from "./components/gamification/AchievementSystem";
import AILearningSystem from "./components/ai/AILearningSystem";
import AIConversationPartner from "@/components/ai/AIConversationPartner";
import MusicLearning from "@/components/music/MusicLearning";
import PrivateLessons from "@/components/ai/PrivateLessons";

// Add uuid dependency
import { v4 as uuidv4 } from "uuid";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";

const queryClient = new QueryClient();

// Auth guard component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for JWT token in localStorage
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    setIsAuthenticated(!!token && token !== 'undefined' && token !== 'null' && token.trim() !== '' && !!userEmail);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const NavBar = ({ showChangeLanguage = true, isLoggedIn }: { showChangeLanguage?: boolean, isLoggedIn: boolean }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('languagePreference');
    navigate('/');
    window.location.reload();
  };

  const handleResetProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(API_ENDPOINTS.CHAT_ALL, { method: 'DELETE', headers: getAuthHeaders(token || '') });
      await fetch(API_ENDPOINTS.STREAK_ALL, { method: 'DELETE', headers: getAuthHeaders(token || '') });
      localStorage.removeItem('languagePreference');
      window.location.reload();
    } catch (error) {
      console.error('Failed to reset progress:', error);
    }
  };

  const handleExportHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_ENDPOINTS.CHAT}?sourceLanguage=&targetLanguage=`, { 
        headers: getAuthHeaders(token || '') 
      });
      const data = await res.json();
      
      // Create CSV content
      const csvContent = [
        ['Date', 'Type', 'Content', 'Source Language', 'Target Language'],
        ...data.map((msg: any) => [
          new Date(msg.timestamp).toLocaleString(),
          msg.type,
          msg.content,
          msg.sourceLanguage || '',
          msg.targetLanguage || ''
        ])
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      
      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `talktome-history-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export history:', error);
    }
  };

  return (
    <nav className="w-full border-b border-border/50 bg-background/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-3 px-4 max-w-4xl">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <img 
              src="/pic_of_talk_to_me.jpg" 
              alt="Logo" 
              className="w-10 h-10 rounded-full shadow-lg object-cover ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300 group-hover:scale-110" 
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-background animate-pulse"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <Link to="/" className="font-bold text-xl gradient-text hover:scale-105 transition-transform duration-300 relative group">
            TalkToMe
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></div>
          </Link>
        </div>

        {/* Navigation Links */}
        {isLoggedIn && (
          <div className="hidden md:flex items-center gap-1">
            <Link 
              to="/chat" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 group"
            >
              <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              Chat
            </Link>
            <Link 
              to="/chapters" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 group"
            >
              <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              Chapters
            </Link>
            <Link 
              to="/progress" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 group"
            >
              <BarChart2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              Progress
            </Link>
            
            {/* Advanced Features Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 group"
                >
                  <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  Advanced
                  <ChevronDown className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-background/95 backdrop-blur-sm border border-border/50 shadow-xl"
              >
                <DropdownMenuItem asChild>
                  <Link to="/ai-learning" className="flex items-center gap-2 cursor-pointer">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Learning</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/mobile-experience" className="flex items-center gap-2 cursor-pointer">
                    <Smartphone className="w-4 h-4" />
                    <span>Mobile Experience</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/cultural-integration" className="flex items-center gap-2 cursor-pointer">
                    <Globe className="w-4 h-4" />
                    <span>Cultural Integration</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/learning-tools" className="flex items-center gap-2 cursor-pointer">
                    <Brain className="w-4 h-4" />
                    <span>Learning Tools</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/achievements" className="flex items-center gap-2 cursor-pointer">
                    <Trophy className="w-4 h-4" />
                    <span>Achievements</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ai-conversation-partner" className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    <span>AI Conversation Partner</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/music-learning" className="flex items-center gap-2 cursor-pointer">
                    <Music className="w-4 h-4" />
                    <span>Music Learning</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/private-lessons" className="flex items-center gap-2 cursor-pointer">
                    <GraduationCap className="w-4 h-4" />
                    <span>Private Lessons</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 group"
                >
                  <Settings className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  Settings
                  <ChevronDown className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-background/95 backdrop-blur-sm border border-border/50 shadow-xl"
              >
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="w-4 h-4" />
                    <span>Settings Page</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleExportHistory}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>Export History</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleResetProgress}
                  className="flex items-center gap-2 cursor-pointer text-orange-600 hover:text-orange-700"
                >
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span>Reset Progress</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-2 cursor-pointer text-destructive hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
      </div>
        )}

        {/* Right Side Controls */}
      <div className="flex items-center gap-3">
          {/* Theme Toggle with Enhanced Styling */}
          <div className="relative">
        <ModeToggle />
      </div>
          
        </div>
      </div>

      {/* Mobile Navigation */}
      {isLoggedIn && (
        <div className="md:hidden border-t border-border/50 bg-background/50 backdrop-blur-sm">
          <div className="flex justify-around py-2">
            <Link 
              to="/chat" 
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </Link>
            <Link 
              to="/chapters" 
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
            >
              <BookOpen className="w-4 h-4" />
              Chapters
            </Link>
            <Link 
              to="/progress" 
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
            >
              <BarChart2 className="w-4 h-4" />
              Progress
            </Link>
            
            {/* Advanced Features Dropdown for Mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4" />
                  Advanced
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="center" 
                className="w-48 bg-background/95 backdrop-blur-sm border border-border/50 shadow-xl"
              >
                <DropdownMenuItem asChild>
                  <Link to="/ai-learning" className="flex items-center gap-2 cursor-pointer">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Learning</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/mobile-experience" className="flex items-center gap-2 cursor-pointer">
                    <Smartphone className="w-4 h-4" />
                    <span>Mobile Experience</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/cultural-integration" className="flex items-center gap-2 cursor-pointer">
                    <Globe className="w-4 h-4" />
                    <span>Cultural Integration</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/learning-tools" className="flex items-center gap-2 cursor-pointer">
                    <Brain className="w-4 h-4" />
                    <span>Learning Tools</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/achievements" className="flex items-center gap-2 cursor-pointer">
                    <Trophy className="w-4 h-4" />
                    <span>Achievements</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ai-conversation-partner" className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    <span>AI Conversation Partner</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/music-learning" className="flex items-center gap-2 cursor-pointer">
                    <Music className="w-4 h-4" />
                    <span>Music Learning</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/private-lessons" className="flex items-center gap-2 cursor-pointer">
                    <GraduationCap className="w-4 h-4" />
                    <span>Private Lessons</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Settings Dropdown for Mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="center" 
                className="w-48 bg-background/95 backdrop-blur-sm border border-border/50 shadow-xl"
              >
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="w-4 h-4" />
                    <span>Settings Page</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleExportHistory}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>Export History</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleResetProgress}
                  className="flex items-center gap-2 cursor-pointer text-orange-600 hover:text-orange-700"
                >
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span>Reset Progress</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-2 cursor-pointer text-destructive hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
      </div>
    </div>
      )}
  </nav>
);
};

const SplashScreen = ({ onEnd }: { onEnd: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if ('speechSynthesis' in window) {
        const utter = new window.SpeechSynthesisUtterance('Talk to Me');
        utter.rate = 1.1;
        utter.pitch = 1.1;
        window.speechSynthesis.speak(utter);
      }
      setTimeout(onEnd, 700); // let the voice play a bit before fade out
    }, 1400); // start voice after most of the zoom
    return () => clearTimeout(timer);
  }, [onEnd]);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50 transition-all splash-fade-out">
      <img
        src="/pic_of_talk_to_me.jpg"
        alt="TalkToMe Logo"
        className="splash-zoom-animated"
        style={{ width: '320px', height: '320px', maxWidth: '80vw', maxHeight: '80vh' }}
      />
    </div>
  );
};

const useIsLoggedIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail');
      setIsLoggedIn(!!token && token !== 'undefined' && token !== 'null' && token.trim() !== '' && !!userEmail);
    };
    checkToken();
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);
  return isLoggedIn;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const queryClient = new QueryClient();
  const { i18n } = useTranslation();

  // Stop speech synthesis when component unmounts or route changes
  useEffect(() => {
    const stopSpeech = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };

    // Stop speech when component unmounts
    return () => {
      stopSpeech();
    };
  }, []);

  // Stop speech on route changes
  useEffect(() => {
    const handleRouteChange = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);
    
    // Listen for beforeunload (page close/refresh)
    window.addEventListener('beforeunload', handleRouteChange);
    
    // Listen for visibility change (tab switch)
    const handleVisibilityChange = () => {
      if (document.hidden && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('beforeunload', handleRouteChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    setIsLoggedIn(!!userEmail);
  }, []);

  useEffect(() => {
    // Set i18n language from localStorage if present
    const savedLang = localStorage.getItem('interfaceLanguage');
    if (savedLang && i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  useEffect(() => {
    if (!showSplash) {
      window.speechSynthesis.cancel(); // stop any splash voice
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen onEnd={() => setShowSplash(false)} />;
  }

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
          <div className="min-h-screen bg-background">
            <NavBar showChangeLanguage={window.location.pathname !== '/'} isLoggedIn={isLoggedIn} />
        <Routes>
              <Route path="/" element={
                isLoggedIn ? <Navigate to="/language-selection" replace /> : <WelcomePage isLoggedIn={isLoggedIn} />
              } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
              <Route path="/language-selection" element={<ProtectedRoute><LanguageSelectionPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              <Route path="/chapters" element={<ProtectedRoute><ChaptersPage /></ProtectedRoute>} />
          <Route path="/flashcards" element={<ProtectedRoute><FlashcardsPage /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
              
              {/* New Advanced Feature Routes */}
              <Route path="/ai-learning" element={<ProtectedRoute><AILearningSystem /></ProtectedRoute>} />
              <Route path="/mobile-experience" element={<ProtectedRoute><GestureControls /></ProtectedRoute>} />
              <Route path="/cultural-integration" element={<ProtectedRoute><CulturalIntegration /></ProtectedRoute>} />
              <Route path="/learning-tools" element={<ProtectedRoute><AdvancedLearningTools /></ProtectedRoute>} />
              <Route path="/achievements" element={<ProtectedRoute><AchievementSystem /></ProtectedRoute>} />
              <Route path="/ai-conversation-partner" element={<ProtectedRoute><AIConversationPartner /></ProtectedRoute>} />
              <Route path="/music-learning" element={<ProtectedRoute><MusicLearning /></ProtectedRoute>} />
              <Route path="/private-lessons" element={<ProtectedRoute><PrivateLessons /></ProtectedRoute>} />
              
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
            {/* <BottomNavBar /> */}
          </div>
          <Toaster />
          <Sonner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
}

export default App;
