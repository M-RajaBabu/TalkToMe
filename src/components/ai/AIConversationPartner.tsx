import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Settings,
  Sparkles,
  Brain,
  Users,
  Coffee,
  ShoppingCart,
  Plane,
  Hotel,
  Utensils,
  GraduationCap,
  Heart,
  Workflow,
  Zap,
  RefreshCw,
  Send,
  Bot,
  User,
  Star,
  TrendingUp,
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FadeIn from "@/components/animations/FadeIn";
import { useTranslation } from 'react-i18next';

interface ConversationMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  language: string;
  translation?: string;
  pronunciation?: string;
  feedback?: string;
  confidence?: number;
}

interface ConversationScenario {
  id: string;
  title: string;
  description: string;
  category: 'casual' | 'business' | 'travel' | 'academic' | 'social';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  context: string;
  suggestedPhrases: string[];
  aiPersonality: string;
  icon: any;
}

interface ConversationStats {
  totalConversations: number;
  averageConfidence: number;
  totalMessages: number;
  languagesPracticed: string[];
  favoriteScenarios: string[];
  streak: number;
  timeSpent: number;
}

const AIConversationPartner = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("conversations");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Hindi");
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<ConversationScenario | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [conversationActive, setConversationActive] = useState(false);
  const [stats, setStats] = useState<ConversationStats>({
    totalConversations: 12,
    averageConfidence: 78,
    totalMessages: 156,
    languagesPracticed: ['Hindi', 'Spanish', 'French'],
    favoriteScenarios: ['Casual Chat', 'Restaurant Ordering'],
    streak: 5,
    timeSpent: 8.5
  });
  const [recognition, setRecognition] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setRecognition(new SpeechRecognition());
      }
    } catch (err) {
      console.error("Speech recognition initialization error:", err);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Conversation scenarios
  const conversationScenarios: ConversationScenario[] = [
    {
      id: 'casual-chat',
      title: 'Casual Chat',
      description: 'Practice everyday conversations with friends',
      category: 'casual',
      difficulty: 'beginner',
      language: 'Hindi',
      context: 'You meet a friend at a coffee shop and want to catch up',
      suggestedPhrases: [
        'कैसे हो? (How are you?)',
        'क्या हाल है? (What\'s up?)',
        'बहुत दिनों बाद मिले (Long time no see)',
        'क्या कर रहे हो? (What are you doing?)'
      ],
      aiPersonality: 'Friendly and casual, like talking to a close friend',
      icon: Coffee
    },
    {
      id: 'restaurant-ordering',
      title: 'Restaurant Ordering',
      description: 'Learn to order food and interact with waiters',
      category: 'travel',
      difficulty: 'intermediate',
      language: 'Hindi',
      context: 'You are at a restaurant and need to order food',
      suggestedPhrases: [
        'मेनू कार्ड दिखाइए (Please show me the menu)',
        'मुझे यह पसंद है (I like this)',
        'बिल लाइए (Please bring the bill)',
        'धन्यवाद (Thank you)'
      ],
      aiPersonality: 'Professional waiter, helpful and polite',
      icon: Utensils
    },
    {
      id: 'business-meeting',
      title: 'Business Meeting',
      description: 'Practice professional conversations in the workplace',
      category: 'business',
      difficulty: 'advanced',
      language: 'Hindi',
      context: 'You are in a business meeting discussing a project',
      suggestedPhrases: [
        'प्रोजेक्ट के बारे में बात करते हैं (Let\'s talk about the project)',
        'क्या आपकी राय है? (What\'s your opinion?)',
        'मैं सहमत हूं (I agree)',
        'कल मिलते हैं (See you tomorrow)'
      ],
      aiPersonality: 'Professional colleague, formal and business-like',
      icon: Workflow
    },
    {
      id: 'travel-booking',
      title: 'Travel Booking',
      description: 'Learn to book flights, hotels, and travel arrangements',
      category: 'travel',
      difficulty: 'intermediate',
      language: 'Hindi',
      context: 'You are calling a travel agency to book a trip',
      suggestedPhrases: [
        'मुझे टिकट बुक करना है (I want to book a ticket)',
        'कीमत क्या है? (What\'s the price?)',
        'कब की फ्लाइट है? (When is the flight?)',
        'कन्फर्म करें (Please confirm)'
      ],
      aiPersonality: 'Travel agent, helpful and informative',
      icon: Plane
    },
    {
      id: 'shopping',
      title: 'Shopping',
      description: 'Practice shopping conversations and bargaining',
      category: 'casual',
      difficulty: 'intermediate',
      language: 'Hindi',
      context: 'You are shopping for clothes at a market',
      suggestedPhrases: [
        'यह कितने का है? (How much is this?)',
        'थोड़ा कम कर दीजिए (Please reduce the price a bit)',
        'मुझे यह पसंद है (I like this)',
        'पैकेट कर दीजिए (Please pack it)'
      ],
      aiPersonality: 'Shopkeeper, friendly and willing to bargain',
      icon: ShoppingCart
    },
    {
      id: 'academic-discussion',
      title: 'Academic Discussion',
      description: 'Practice academic conversations and presentations',
      category: 'academic',
      difficulty: 'advanced',
      language: 'Hindi',
      context: 'You are presenting your research to a professor',
      suggestedPhrases: [
        'मेरा शोध विषय है (My research topic is)',
        'मैंने पाया कि (I found that)',
        'क्या आपके कोई प्रश्न हैं? (Do you have any questions?)',
        'धन्यवाद (Thank you)'
      ],
      aiPersonality: 'Professor, knowledgeable and encouraging',
      icon: GraduationCap
    }
  ];

  // Start a new conversation
  const startConversation = useCallback((scenario: ConversationScenario) => {
    try {
      setCurrentScenario(scenario);
      setConversationActive(true);
      setMessages([]);
      
      // Add initial AI greeting
      const greeting = generateAIGreeting(scenario);
      const aiMessage: ConversationMessage = {
        id: Date.now().toString(),
        text: greeting,
        sender: 'ai',
        timestamp: new Date(),
        language: scenario.language,
        confidence: 95
      };
      
      setMessages([aiMessage]);
      
      // Speak the greeting
      speakText(greeting, scenario.language);
      
      toast({
        title: "Conversation Started!",
        description: `You're now chatting with ${scenario.aiPersonality}`,
      });
    } catch (err) {
      console.error("Start conversation error:", err);
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Generate AI greeting based on scenario
  const generateAIGreeting = useCallback((scenario: ConversationScenario): string => {
    const greetings = {
      'casual-chat': 'नमस्ते! कैसे हो? क्या हाल है?',
      'restaurant-ordering': 'नमस्ते! स्वागत है। आप क्या खाना चाहेंगे?',
      'business-meeting': 'नमस्ते! आज की मीटिंग के लिए धन्यवाद।',
      'travel-booking': 'नमस्ते! मैं आपकी यात्रा में कैसे मदद कर सकता हूं?',
      'shopping': 'नमस्ते! क्या आपको कुछ चाहिए?',
      'academic-discussion': 'नमस्ते! आपका शोध कैसा चल रहा है?'
    };
    
    return greetings[scenario.id as keyof typeof greetings] || 'नमस्ते! कैसे हो?';
  }, []);

  // Speak text using speech synthesis
  const speakText = useCallback((text: string, language: string) => {
    if ('speechSynthesis' in window) {
      setIsAISpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.8;
      utterance.volume = 1.0;
      
      utterance.onstart = () => {
        console.log("AI speaking started");
      };
      
      utterance.onend = () => {
        setIsAISpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsAISpeaking(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Send user message
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !currentScenario) return;
    
    try {
      // Add user message
      const userMessage: ConversationMessage = {
        id: Date.now().toString(),
        text: text,
        sender: 'user',
        timestamp: new Date(),
        language: currentScenario.language,
        confidence: 85
      };
      
      setMessages(prev => [...prev, userMessage]);
      setUserInput("");
      
      // Generate AI response
      const aiResponse = await generateAIResponse(text, currentScenario);
      const aiMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        language: currentScenario.language,
        confidence: 90
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Speak AI response
      speakText(aiResponse, currentScenario.language);
      
    } catch (err) {
      console.error("Send message error:", err);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  }, [currentScenario, speakText, toast]);

  // Generate AI response based on user input and scenario
  const generateAIResponse = useCallback(async (userInput: string, scenario: ConversationScenario): Promise<string> => {
    // Simulate AI response generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = {
      'casual-chat': [
        'मैं बिल्कुल ठीक हूं! तुम कैसे हो?',
        'हाँ, बहुत अच्छा लग रहा है। तुम्हारा क्या हाल है?',
        'बिल्कुल! क्या तुम भी यहाँ रहते हो?',
        'हाँ, मैं भी यहाँ हूं। कब से आए हो?'
      ],
      'restaurant-ordering': [
        'बहुत अच्छा चुनाव है! क्या आप कुछ और चाहेंगे?',
        'ठीक है, मैं आपका ऑर्डर ले लेता हूं।',
        'क्या आपको कोई स्पेशल डिश चाहिए?',
        'आपका ऑर्डर 10 मिनट में तैयार हो जाएगा।'
      ],
      'business-meeting': [
        'हाँ, मैं भी यही सोच रहा था।',
        'क्या आपको कोई और जानकारी चाहिए?',
        'मैं इस पर काम करूंगा और आपको अपडेट दूंगा।',
        'बहुत अच्छा प्रेजेंटेशन था।'
      ],
      'travel-booking': [
        'हाँ, मैं आपके लिए बुकिंग कर देता हूं।',
        'क्या आपको कोई स्पेशल आवश्यकता है?',
        'मैं आपको सबसे अच्छा डील दे सकता हूं।',
        'आपकी बुकिंग कन्फर्म हो गई है।'
      ],
      'shopping': [
        'हाँ, यह बहुत अच्छा है। क्या आप इसे लेना चाहेंगे?',
        'मैं आपको छूट दे सकता हूं।',
        'क्या आपको कोई और रंग चाहिए?',
        'यह आप पर बहुत अच्छा लग रहा है।'
      ],
      'academic-discussion': [
        'यह बहुत दिलचस्प शोध है।',
        'क्या आपने इसे प्रकाशित किया है?',
        'मैं आपके काम से बहुत प्रभावित हूं।',
        'क्या आपको कोई सहायता चाहिए?'
      ]
    };
    
    const scenarioResponses = responses[scenario.id as keyof typeof responses] || responses['casual-chat'];
    return scenarioResponses[Math.floor(Math.random() * scenarioResponses.length)];
  }, []);

  // Start voice recognition
  const startVoiceRecognition = useCallback(() => {
    if (!recognition || !currentScenario) {
      toast({
        title: "Voice Recognition Not Available",
        description: "Please check your microphone permissions.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsListening(true);
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentScenario.language === 'Hindi' ? 'hi-IN' : 'en-US';
      
      recognition.onstart = () => {
        toast({
          title: "Listening...",
          description: "Speak your message clearly",
        });
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setUserInput(transcript);
        sendMessage(transcript);
      };
      
      recognition.onerror = (event: any) => {
        console.error("Voice recognition error:", event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Could not recognize speech. Please try again.",
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
    }
  }, [recognition, currentScenario, sendMessage, toast]);

  // End conversation
  const endConversation = useCallback(() => {
    setConversationActive(false);
    setCurrentScenario(null);
    setMessages([]);
    setUserInput("");
    
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    toast({
      title: "Conversation Ended",
      description: "Great practice session! Keep learning!",
    });
  }, [toast]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card/80 backdrop-blur-sm rounded-full border border-border/50 shadow-lg mb-6">
            <Bot className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold gradient-text">AI Conversation Partner</h1>
            <Sparkles className="w-6 h-6 text-secondary" />
          </div>
          <p className="text-muted-foreground">Practice real conversations with AI in your target language</p>
        </div>
      </FadeIn>

      {/* Stats Overview */}
      <FadeIn delay={100}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalConversations}</div>
              <p className="text-xs text-muted-foreground">Total sessions</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confidence</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageConfidence}%</div>
              <p className="text-xs text-muted-foreground">Average score</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <Star className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.streak} days</div>
              <p className="text-xs text-muted-foreground">Current streak</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.timeSpent}h</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-card/80 backdrop-blur-sm">
          <TabsTrigger value="conversations" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Conversations
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Scenarios
          </TabsTrigger>
        </TabsList>

        {/* Active Conversation */}
        {conversationActive && currentScenario && (
          <FadeIn>
            <Card className="modern-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <currentScenario.icon className="w-5 h-5" />
                      {currentScenario.title}
                    </CardTitle>
                    <CardDescription>{currentScenario.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={endConversation}
                      variant="outline"
                      size="sm"
                    >
                      End Chat
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Conversation Messages */}
                <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.text}</p>
                        {message.confidence && (
                          <div className="flex items-center gap-1 mt-1">
                            <Target className="w-3 h-3" />
                            <span className="text-xs opacity-70">
                              Confidence: {message.confidence}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && userInput.trim()) {
                          sendMessage(userInput);
                        }
                      }}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (userInput.trim()) {
                        sendMessage(userInput);
                      }
                    }}
                    disabled={!userInput.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={startVoiceRecognition}
                    disabled={isListening}
                    variant="outline"
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4 animate-pulse" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Suggested Phrases */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Suggested Phrases:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentScenario.suggestedPhrases.map((phrase, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => sendMessage(phrase.split(' (')[0])}
                      >
                        {phrase}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        )}

        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conversationScenarios.map((scenario) => (
              <FadeIn key={scenario.id}>
                <Card className="modern-card group cursor-pointer hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl">
                        <scenario.icon className="w-8 h-8" />
                      </div>
                      <Badge variant={scenario.difficulty === 'beginner' ? 'default' : 'secondary'}>
                        {scenario.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{scenario.title}</CardTitle>
                    <CardDescription>{scenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{scenario.context}</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">AI Personality:</h4>
                      <p className="text-sm text-muted-foreground">{scenario.aiPersonality}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Suggested Phrases:</h4>
                      <div className="space-y-1">
                        {scenario.suggestedPhrases.slice(0, 2).map((phrase, index) => (
                          <div key={index} className="text-xs text-muted-foreground">
                            • {phrase}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => startConversation(scenario)}
                      className="w-full"
                      disabled={conversationActive}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Start Conversation
                    </Button>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIConversationPartner; 