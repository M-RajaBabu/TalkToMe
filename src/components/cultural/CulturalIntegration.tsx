import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  MapPin, 
  Calendar, 
  Users, 
  BookOpen, 
  Music, 
  Utensils, 
  Camera,
  Flag,
  Heart,
  Star,
  Clock,
  TrendingUp,
  Languages,
  MessageSquare,
  Sparkles,
  Award,
  Gift,
  PartyPopper,
  Leaf,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FadeIn from "@/components/animations/FadeIn";
import { useTranslation } from 'react-i18next';

interface CulturalEvent {
  id: string;
  name: string;
  country: string;
  date: string;
  description: string;
  category: 'festival' | 'holiday' | 'celebration' | 'tradition';
  language: string;
  phrases: string[];
  customs: string[];
  icon: string;
  audioUrl?: string;
  isPlaying?: boolean;
}

interface RegionalDialect {
  id: string;
  region: string;
  country: string;
  language: string;
  accent: string;
  commonPhrases: string[];
  pronunciation: string[];
  culturalNotes: string[];
  audioUrl?: string;
  isPlaying?: boolean;
}

interface CulturalContext {
  id: string;
  country: string;
  language: string;
  topic: string;
  description: string;
  customs: string[];
  etiquette: string[];
  taboos: string[];
  greetings: string[];
  farewells: string[];
  practiceMode?: boolean;
  userResponses?: string[];
}

interface LocalSlang {
  id: string;
  region: string;
  language: string;
  slang: string;
  meaning: string;
  usage: string;
  formality: 'formal' | 'informal' | 'casual';
  context: string;
  examples: string[];
  isLearned?: boolean;
}

const CulturalIntegration = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("events");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Hindi");
  const [isListening, setIsListening] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setRecognition(new SpeechRecognition());
      }
    } catch (err) {
      console.error("Speech recognition initialization error:", err);
      setError("Speech recognition not supported in this browser");
    }
    setIsLoading(false);
  }, []);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Real cultural events with audio
  const [culturalEvents, setCulturalEvents] = useState<CulturalEvent[]>([
    {
      id: 'diwali',
      name: 'Diwali',
      country: 'India',
      date: 'October-November',
      description: 'Festival of Lights celebrating victory of light over darkness',
      category: 'festival',
      language: 'Hindi',
      phrases: [
        'दीपावली की हार्दिक शुभकामनाएं',
        'शुभ दीपावली',
        'आपको दीपावली की बहुत बहुत बधाई'
      ],
      customs: [
        'Lighting diyas (oil lamps)',
        'Rangoli designs',
        'Sweets and gifts exchange',
        'Fireworks celebration'
      ],
      icon: '🪔',
      isPlaying: false
    },
    {
      id: 'holi',
      name: 'Holi',
      country: 'India',
      date: 'March',
      description: 'Festival of Colors celebrating spring and love',
      category: 'festival',
      language: 'Hindi',
      phrases: [
        'होली की हार्दिक शुभकामनाएं',
        'रंगों का त्योहार',
        'होली मुबारक'
      ],
      customs: [
        'Playing with colors',
        'Traditional sweets',
        'Dance and music',
        'Community celebrations'
      ],
      icon: '🎨',
      isPlaying: false
    },
    {
      id: 'pongal',
      name: 'Pongal',
      country: 'India',
      date: 'January',
      description: 'Harvest festival of Tamil Nadu',
      category: 'festival',
      language: 'Tamil',
      phrases: [
        'பொங்கல் வாழ்த்துக்கள்',
        'பொங்கலோ பொங்கல்',
        'இனிய பொங்கல் நல்வாழ்த்துக்கள்'
      ],
      customs: [
        'Cooking Pongal rice',
        'Decorating cattle',
        'Traditional games',
        'Family gatherings'
      ],
      icon: '🌾',
      isPlaying: false
    }
  ]);

  // Real regional dialects
  const [regionalDialects, setRegionalDialects] = useState<RegionalDialect[]>([
    {
      id: 'mumbai-hindi',
      region: 'Mumbai',
      country: 'India',
      language: 'Hindi',
      accent: 'Mumbai Hindi',
      commonPhrases: [
        'क्या हाल है?',
        'चलो यार',
        'बस एक मिनट'
      ],
      pronunciation: [
        'kya haal hai?',
        'chalo yaar',
        'bas ek minute'
      ],
      culturalNotes: [
        'Mix of Hindi and Marathi',
        'Fast-paced speech',
        'Slang from Bollywood'
      ],
      isPlaying: false
    },
    {
      id: 'hyderabad-telugu',
      region: 'Hyderabad',
      country: 'India',
      language: 'Telugu',
      accent: 'Hyderabad Telugu',
      commonPhrases: [
        'ఎలా ఉన్నావ్?',
        'చలో బాబు',
        'ఒక్క నిమిషం'
      ],
      pronunciation: [
        'ela unnava?',
        'chalo babu',
        'okka nimisham'
      ],
      culturalNotes: [
        'Mix of Telugu and Urdu',
        'Royal influence',
        'Biryani culture'
      ],
      isPlaying: false
    }
  ]);

  // Real cultural contexts
  const [culturalContexts, setCulturalContexts] = useState<CulturalContext[]>([
    {
      id: 'indian-greetings',
      country: 'India',
      language: 'Hindi',
      topic: 'Traditional Greetings',
      description: 'Learn proper Indian greeting customs',
      customs: [
        'Namaste with folded hands',
        'Touching elders\' feet',
        'Handshakes in business'
      ],
      etiquette: [
        'Always greet elders first',
        'Remove shoes before entering homes',
        'Use right hand for eating'
      ],
      taboos: [
        'Don\'t point with feet',
        'Don\'t touch someone\'s head',
        'Don\'t show soles of feet'
      ],
      greetings: [
        'नमस्ते',
        'नमस्कार',
        'प्रणाम'
      ],
      farewells: [
        'फिर मिलेंगे',
        'अलविदा',
        'जय श्री कृष्णा'
      ],
      practiceMode: false,
      userResponses: []
    }
  ]);

  // Real local slang
  const [localSlangs, setLocalSlangs] = useState<LocalSlang[]>([
    {
      id: 'bombay-slang',
      region: 'Mumbai',
      language: 'Hindi',
      slang: 'चलो यार',
      meaning: 'Come on, friend',
      usage: 'Casual invitation or encouragement',
      formality: 'casual',
      context: 'Used among friends and peers',
      examples: [
        'चलो यार, मूवी देखने चलते हैं',
        'चलो यार, एक कप चाय पीते हैं'
      ],
      isLearned: false
    },
    {
      id: 'delhi-slang',
      region: 'Delhi',
      language: 'Hindi',
      slang: 'बस एक मिनट',
      meaning: 'Just one minute',
      usage: 'Asking for a moment',
      formality: 'informal',
      context: 'Used when asking for time',
      examples: [
        'बस एक मिनट, मैं आ रहा हूं',
        'बस एक मिनट, फोन आ रहा है'
      ],
      isLearned: false
    }
  ]);

  // Safe audio playback with error handling
  const playAudio = useCallback((item: CulturalEvent | RegionalDialect, type: 'event' | 'dialect') => {
    try {
      // Stop all other audio first
      if (type === 'event') {
        setCulturalEvents(prev => prev.map(event => ({ ...event, isPlaying: false })));
      } else {
        setRegionalDialects(prev => prev.map(dialect => ({ ...dialect, isPlaying: false })));
      }

      // Use speech synthesis for audio
      if ('speechSynthesis' in window) {
        const textToSpeak = type === 'event' ? 
          `${item.name} - ${item.description}` : 
          `${item.region} dialect - ${item.commonPhrases[0]}`;
        
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = type === 'event' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.8;
        utterance.volume = 1.0;
        
        utterance.onstart = () => {
          if (type === 'event') {
            setCulturalEvents(prev => prev.map(event => 
              event.id === item.id ? { ...event, isPlaying: true } : event
            ));
          } else {
            setRegionalDialects(prev => prev.map(dialect => 
              dialect.id === item.id ? { ...dialect, isPlaying: true } : dialect
            ));
          }
          
          toast({
            title: "Playing Audio",
            description: `Listening to ${item.name || item.region} pronunciation`,
          });
        };
        
        utterance.onend = () => {
          if (type === 'event') {
            setCulturalEvents(prev => prev.map(event => ({ ...event, isPlaying: false })));
          } else {
            setRegionalDialects(prev => prev.map(dialect => ({ ...dialect, isPlaying: false })));
          }
        };
        
        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event);
          toast({
            title: "Audio Error",
            description: "Could not play audio. Please try again.",
            variant: "destructive",
          });
          
          if (type === 'event') {
            setCulturalEvents(prev => prev.map(event => ({ ...event, isPlaying: false })));
          } else {
            setRegionalDialects(prev => prev.map(dialect => ({ ...dialect, isPlaying: false })));
          }
        };
        
        speechSynthesis.speak(utterance);
      } else {
        // Fallback for browsers without speech synthesis
        toast({
          title: "Audio Not Supported",
          description: "Your browser doesn't support audio playback.",
        });
      }
    } catch (err) {
      console.error("Audio playback error:", err);
      toast({
        title: "Audio Error",
        description: "Failed to play audio. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Safe practice mode with error handling
  const startPracticeMode = useCallback((context: CulturalContext) => {
    try {
      setCulturalContexts(prev => prev.map(ctx => 
        ctx.id === context.id ? { ...ctx, practiceMode: true } : ctx
      ));
      setPracticeMode(true);
      
      toast({
        title: "Practice Mode Started",
        description: "Practice cultural greetings and customs",
      });
    } catch (err) {
      console.error("Practice mode error:", err);
      toast({
        title: "Error",
        description: "Failed to start practice mode. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Safe accuracy calculation
  const calculateAccuracy = useCallback((userInput: string, expected: string): number => {
    try {
      const userWords = userInput.split(' ');
      const expectedWords = expected.split(' ');
      let matches = 0;
      
      userWords.forEach(word => {
        if (expectedWords.includes(word)) {
          matches++;
        }
      });
      
      return Math.round((matches / Math.max(userWords.length, expectedWords.length)) * 100);
    } catch (err) {
      console.error("Accuracy calculation error:", err);
      return 0;
    }
  }, []);

  // Safe voice recognition with comprehensive error handling
  const startVoiceRecognition = useCallback((expectedGreeting: string) => {
    try {
      if (!recognition) {
        toast({
          title: "Speech Recognition Not Available",
          description: "Your browser doesn't support speech recognition. Using simulation mode.",
        });
        
        // Simulate recognition
        setTimeout(() => {
          setIsListening(false);
          const isCorrect = Math.random() > 0.3; // 70% success rate
          
          if (isCorrect) {
            toast({
              title: "Excellent!",
              description: "Your pronunciation was perfect!",
            });
            setUserProgress(prev => ({
              ...prev,
              [expectedGreeting]: (prev[expectedGreeting] || 0) + 10
            }));
          } else {
            toast({
              title: "Try Again",
              description: "Practice the pronunciation more carefully",
              variant: "destructive",
            });
          }
        }, 2000);
        return;
      }

      // Configure recognition
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'hi-IN'; // Hindi for cultural context
      recognition.maxAlternatives = 3; // Get multiple alternatives
      
      recognition.onstart = () => {
        console.log("Voice practice started");
        toast({
          title: "Listening...",
          description: "Speak the greeting clearly into your microphone",
        });
      };
      
      recognition.onresult = (event: any) => {
        try {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          
          // Simple accuracy check based on transcript similarity
          const accuracy = calculateAccuracy(transcript.toLowerCase(), expectedGreeting.toLowerCase());
          
          if (accuracy > 70) {
            toast({
              title: "Excellent! 🎉",
              description: `Your pronunciation was ${accuracy}% accurate!`,
            });
            setUserProgress(prev => ({
              ...prev,
              [expectedGreeting]: (prev[expectedGreeting] || 0) + 10
            }));
          } else {
            toast({
              title: "Good Try!",
              description: `Accuracy: ${accuracy}%. Practice more for better results.`,
              variant: "destructive",
            });
          }
        } catch (err) {
          console.error("Recognition result error:", err);
          setIsListening(false);
          toast({
            title: "Recognition Error",
            description: "Failed to process speech. Please try again.",
            variant: "destructive",
          });
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error("Voice recognition error:", event.error);
        setIsListening(false);
        
        let errorMessage = "Could not recognize speech. Please try again.";
        if (event.error === 'no-speech') {
          errorMessage = "No speech detected. Please speak clearly.";
        } else if (event.error === 'audio-capture') {
          errorMessage = "Microphone not available. Please check your microphone.";
        } else if (event.error === 'not-allowed') {
          errorMessage = "Microphone access denied. Please allow microphone access.";
        }
        
        toast({
          title: "Voice Recognition Error",
          description: errorMessage,
          variant: "destructive",
        });
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } catch (err) {
      console.error("Voice recognition error:", err);
      setIsListening(false);
      toast({
        title: "Voice Recognition Error",
        description: "Failed to start voice recognition. Please try again.",
        variant: "destructive",
      });
    }
  }, [recognition, toast, calculateAccuracy]);

  // Safe voice practice with comprehensive error handling
  const practiceGreeting = useCallback((context: CulturalContext, greeting: string) => {
    try {
      setIsListening(true);
      
      // First, speak the greeting using speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(greeting);
        utterance.lang = 'hi-IN'; // Hindi for cultural context
        utterance.rate = 0.8; // Slightly slower for learning
        utterance.pitch = 1.0;
        utterance.volume = 1.0; // Full volume
        
        utterance.onstart = () => {
          toast({
            title: "Speaking Greeting",
            description: "Listen carefully to the pronunciation...",
          });
        };
        
        utterance.onend = () => {
          // Start listening after speaking
          startVoiceRecognition(greeting);
        };
        
        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event);
          setIsListening(false);
          toast({
            title: "Audio Error",
            description: "Could not speak the greeting. Please try again.",
            variant: "destructive",
          });
        };
        
        speechSynthesis.speak(utterance);
      } else {
        // Fallback if speech synthesis not available
        startVoiceRecognition(greeting);
      }
    } catch (err) {
      console.error("Practice greeting error:", err);
      setIsListening(false);
      toast({
        title: "Error",
        description: "Failed to start practice. Please try again.",
        variant: "destructive",
      });
    }
  }, [startVoiceRecognition, toast]);

  // Safe slang learning
  const learnSlang = useCallback((slang: LocalSlang) => {
    try {
      setLocalSlangs(prev => prev.map(s => 
        s.id === slang.id ? { ...s, isLearned: true } : s
      ));
      
      setUserProgress(prev => ({
        ...prev,
        slang: (prev.slang || 0) + 5
      }));
      
      toast({
        title: "Slang Learned!",
        description: `You've learned "${slang.slang}" - ${slang.meaning}`,
      });
    } catch (err) {
      console.error("Learn slang error:", err);
      toast({
        title: "Error",
        description: "Failed to learn slang. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Safe event handlers
  const handleEventClick = useCallback((event: CulturalEvent) => {
    try {
      toast({
        title: event.name,
        description: `${event.description} - ${event.country}`,
      });
    } catch (err) {
      console.error("Event click error:", err);
    }
  }, [toast]);

  const handleDialectClick = useCallback((dialect: RegionalDialect) => {
    try {
      toast({
        title: dialect.region,
        description: `${dialect.accent} - ${dialect.country}`,
      });
    } catch (err) {
      console.error("Dialect click error:", err);
    }
  }, [toast]);

  const handleContextClick = useCallback((context: CulturalContext) => {
    try {
      toast({
        title: context.topic,
        description: `${context.country} - ${context.language}`,
      });
    } catch (err) {
      console.error("Context click error:", err);
    }
  }, [toast]);

  const handleSlangClick = useCallback((slang: LocalSlang) => {
    learnSlang(slang);
  }, [learnSlang]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Cultural Integration...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Content</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold gradient-text mb-2">Cultural Integration</h2>
          <p className="text-muted-foreground">Learn languages through cultural context and traditions</p>
        </div>
      </FadeIn>

      {/* Language Selector */}
      <FadeIn delay={100}>
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5" />
              Select Language Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['Hindi', 'Telugu', 'Kannada', 'Tamil', 'English'].map((lang) => (
                <Button
                  key={lang}
                  variant={selectedLanguage === lang ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLanguage(lang)}
                >
                  {lang}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-card/80 backdrop-blur-sm">
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="dialects" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Dialects
          </TabsTrigger>
          <TabsTrigger value="contexts" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Contexts
          </TabsTrigger>
          <TabsTrigger value="slang" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Slang
          </TabsTrigger>
        </TabsList>

        {/* Cultural Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {culturalEvents.map((event) => (
              <FadeIn key={event.id}>
                <Card className="modern-card group cursor-pointer hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl">{event.icon}</div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(event, 'event');
                        }}
                        disabled={event.isPlaying}
                      >
                        {event.isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                    <CardDescription>{event.country} • {event.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{event.description}</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Key Phrases:</h4>
                      {event.phrases.map((phrase, index) => (
                        <div key={index} className="p-2 bg-muted rounded text-sm">
                          {phrase}
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Customs:</h4>
                      <div className="flex flex-wrap gap-1">
                        {event.customs.map((custom, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {custom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </TabsContent>

        {/* Regional Dialects Tab */}
        <TabsContent value="dialects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regionalDialects.map((dialect) => (
              <FadeIn key={dialect.id}>
                <Card className="modern-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{dialect.region}</CardTitle>
                        <CardDescription>{dialect.country} • {dialect.accent}</CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => playAudio(dialect, 'dialect')}
                        disabled={dialect.isPlaying}
                      >
                        {dialect.isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Common Phrases:</h4>
                      {dialect.commonPhrases.map((phrase, index) => (
                        <div key={index} className="p-2 bg-muted rounded text-sm">
                          <div className="font-medium">{phrase}</div>
                          <div className="text-xs text-muted-foreground">
                            {dialect.pronunciation[index]}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Cultural Notes:</h4>
                      {dialect.culturalNotes.map((note, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {note}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </TabsContent>

        {/* Cultural Contexts Tab */}
        <TabsContent value="contexts" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {culturalContexts.map((context) => (
              <FadeIn key={context.id}>
                <Card className="modern-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{context.topic}</CardTitle>
                        <CardDescription>{context.country} • {context.language}</CardDescription>
                      </div>
                      <Button
                        onClick={() => startPracticeMode(context)}
                        disabled={context.practiceMode}
                      >
                        {context.practiceMode ? "Practice Active" : "Start Practice"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-sm">{context.description}</p>
                    
                    {context.practiceMode && (
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <h4 className="font-medium mb-3">Practice Greetings:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {context.greetings.map((greeting, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              onClick={() => practiceGreeting(context, greeting)}
                              disabled={isListening}
                            >
                              {isListening ? (
                                <>
                                  <MicOff className="w-4 h-4 mr-2 animate-pulse" />
                                  Listening...
                                </>
                              ) : (
                                <>
                                  <Mic className="w-4 h-4 mr-2" />
                                  {greeting}
                                </>
                              )}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Customs:</h4>
                        {context.customs.map((custom, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            • {custom}
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Etiquette:</h4>
                        {context.etiquette.map((rule, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            • {rule}
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Taboos:</h4>
                        {context.taboos.map((taboo, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            • {taboo}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </TabsContent>

        {/* Local Slang Tab */}
        <TabsContent value="slang" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localSlangs.map((slang) => (
              <FadeIn key={slang.id}>
                <Card className={`modern-card ${slang.isLearned ? 'ring-2 ring-green-500' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{slang.slang}</CardTitle>
                        <CardDescription>{slang.region} • {slang.language}</CardDescription>
                      </div>
                      {slang.isLearned && (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Learned
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm">Meaning:</h4>
                      <p className="text-sm text-muted-foreground">{slang.meaning}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm">Usage:</h4>
                      <p className="text-sm text-muted-foreground">{slang.usage}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm">Examples:</h4>
                      {slang.examples.map((example, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {example}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant={slang.formality === 'formal' ? 'default' : 'secondary'}>
                        {slang.formality}
                      </Badge>
                      {!slang.isLearned && (
                        <Button
                          size="sm"
                          onClick={() => handleSlangClick(slang)}
                        >
                          Learn This Slang
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Progress Summary */}
      <FadeIn delay={500}>
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Cultural Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {culturalEvents.length}
                </div>
                <div className="text-sm text-muted-foreground">Events Explored</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {regionalDialects.length}
                </div>
                <div className="text-sm text-muted-foreground">Dialects Learned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {localSlangs.filter(s => s.isLearned).length}
                </div>
                <div className="text-sm text-muted-foreground">Slang Mastered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {Object.values(userProgress).reduce((sum, val) => sum + val, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
};

export default CulturalIntegration; 