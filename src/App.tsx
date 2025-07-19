
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

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

// Add uuid dependency
import { v4 as uuidv4 } from "uuid";

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
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const NavBar = ({ showChangeLanguage = true, isLoggedIn }: { showChangeLanguage?: boolean, isLoggedIn: boolean }) => (
  <nav className="w-full border-b shadow-sm mb-4">
    <div className="container mx-auto flex justify-between items-center py-2 px-4 max-w-2xl">
      <div className="flex gap-4 items-center">
        <img src="/pic_of_talk_to_me.jpg" alt="Logo" className="w-8 h-8 rounded-full shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700" />
        <Link to="/" className="font-bold text-lg text-primary">TalkToMe</Link>
        {isLoggedIn && <Link to="/chat" className="text-muted-foreground hover:text-primary">Chat</Link>}
        {isLoggedIn && <Link to="/chapters" className="text-muted-foreground hover:text-primary">Chapters</Link>}
        {isLoggedIn && <Link to="/settings" className="text-muted-foreground hover:text-primary">Settings</Link>}
      </div>
      <div className="flex items-center gap-3">
        <ModeToggle />
      </div>
    </div>
  </nav>
);

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
      setIsLoggedIn(!!token && token !== 'undefined' && token !== 'null' && token.trim() !== '');
    };
    checkToken();
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);
  return isLoggedIn;
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const isLoggedIn = useIsLoggedIn();
  const { i18n } = useTranslation();
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
  if (showSplash) return <SplashScreen onEnd={() => setShowSplash(false)} />;
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
          <div className="min-h-screen bg-main-logo bg-center bg-no-repeat bg-cover bg-fixed bg-opacity-10">
            <NavBar showChangeLanguage={window.location.pathname !== '/'} isLoggedIn={isLoggedIn} />
        <Routes>
              <Route path="/" element={<WelcomePage isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/language-selection" element={
            <ProtectedRoute>
              <LanguageSelectionPage />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
              <Route path="/chapters" element={<ChaptersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
          </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
};

export default App;
