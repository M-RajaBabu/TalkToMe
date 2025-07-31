
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Eye, EyeOff, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import FadeIn from "@/components/animations/FadeIn";
import SlideUp from "@/components/animations/SlideUp";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from 'react-i18next';
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/language-selection');
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Store JWT token and user email in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', data.email);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
        duration: 3000,
      });
      navigate('/language-selection');
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center p-4">
        <FadeIn>
          <Card className="w-full max-w-md modern-card">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-between mb-4">
                <Button 
                  asChild 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-primary/10"
                >
                  <Link to="/">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
                
                <div className="flex items-center gap-2">
                  <img src="/pic_of_talk_to_me.jpg" alt="Logo" className="w-8 h-8 rounded-full" />
                  <span className="font-semibold gradient-text">TalkToMe</span>
                </div>
                
                <div className="w-10"></div> {/* Spacer for centering */}
              </div>
              
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              
              <CardTitle className="text-3xl font-bold gradient-text mb-2">
                {t('Welcome Back')}
              </CardTitle>
              <CardDescription className="text-base">
                {t('Login to continue your language learning journey')}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <SlideUp delay={0.1}>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        required
                        className="pl-10 h-12 border-2 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                </SlideUp>
                
                <SlideUp delay={0.2}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <Link 
                        to="/forgot-password" 
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                        className="pl-10 pr-10 h-12 border-2 focus:border-primary transition-colors"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </SlideUp>
                
                <SlideUp delay={0.3}>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Logging in...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </SlideUp>
              </form>
              
              <SlideUp delay={0.4}>
                <div className="flex items-center my-6">
                  <Separator className="flex-1" />
                  <span className="px-4 text-sm text-muted-foreground font-medium">OR</span>
                  <Separator className="flex-1" />
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-12 border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1" 
                  onClick={() => window.location.href = 'https://982972c8f1f7.ngrok-free.app/api/auth/google'}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Continue with Google
                </Button>
              </SlideUp>
            </CardContent>
            
            <CardFooter className="flex flex-col pt-6">
              <SlideUp delay={0.5}>
                <div className="text-sm text-center text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary hover:underline font-medium">
                    Sign up
                  </Link>
                </div>
              </SlideUp>
            </CardFooter>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
};

export default LoginPage;
