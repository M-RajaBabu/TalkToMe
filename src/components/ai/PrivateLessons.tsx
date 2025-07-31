import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Bot, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Settings,
  Sparkles,
  Brain,
  BookOpen,
  Target,
  Clock,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  MessageSquare,
  Send,
  RefreshCw,
  Zap,
  Award,
  Calendar,
  Timer,
  Bookmark,
  Heart,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  RotateCcw,
  Save,
  Download,
  Share2,
  Book,
  GraduationCap,
  Languages,
  Globe,
  Users,
  Coffee,
  ShoppingCart,
  Plane,
  Hotel,
  Utensils,
  Workflow,
  HeartHandshake,
  Trophy,
  Crown,
  Medal,
  Flag,
  Music,
  Camera,
  Video,
  Headphones,
  Speaker,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  WifiOff as NoSignal,
  Edit
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FadeIn from "@/components/animations/FadeIn";
import { useTranslation } from 'react-i18next';

interface LessonSession {
  id: string;
  title: string;
  description: string;
  type: 'conversation' | 'grammar' | 'pronunciation' | 'vocabulary' | 'writing' | 'listening' | 'reading';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  duration: number; // in minutes
  progress: number; // 0-100
  completed: boolean;
  aiTutor: string;
  focusAreas: string[];
  materials: string[];
  notes: string;
  rating?: number;
  feedback?: string;
  createdAt: Date;
  completedAt?: Date;
}

interface TutorProfile {
  id: string;
  name: string;
  avatar: string;
  specialty: string[];
  languages: string[];
  teachingStyle: string;
  experience: string;
  rating: number;
  totalStudents: number;
  totalLessons: number;
  availability: string[];
  bio: string;
  accent: string;
  personality: string;
}

interface LessonMaterial {
  id: string;
  type: 'text' | 'audio' | 'video' | 'image' | 'interactive';
  title: string;
  content: string;
  duration?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

interface LessonMessage {
  id: string;
  sender: 'student' | 'tutor';
  content: string;
  timestamp: Date;
  type: 'text' | 'audio' | 'correction' | 'explanation' | 'question' | 'encouragement';
  translation?: string;
  pronunciation?: string;
  grammar?: string;
  confidence?: number;
  feedback?: string;
}

interface LessonStats {
  totalLessons: number;
  totalTime: number; // in minutes
  averageRating: number;
  favoriteTutor: string;
  mostPracticedSkill: string;
  currentStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  improvementAreas: string[];
  achievements: string[];
}

const PrivateLessons = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("sessions");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Hindi");
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentSession, setCurrentSession] = useState<LessonSession | null>(null);
  const [messages, setMessages] = useState<LessonMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [sessionActive, setSessionActive] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<TutorProfile | null>(null);
  const [lessonType, setLessonType] = useState<string>("conversation");
  const [sessionDuration, setSessionDuration] = useState(30);
  const [recognition, setRecognition] = useState<any>(null);
  const [selectedLessonType, setSelectedLessonType] = useState<string>("conversation");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState<LessonStats>({
    totalLessons: 24,
    totalTime: 720,
    averageRating: 4.6,
    favoriteTutor: "Professor Sharma",
    mostPracticedSkill: "Conversation",
    currentStreak: 7,
    weeklyGoal: 5,
    weeklyProgress: 3,
    improvementAreas: ['Grammar', 'Pronunciation', 'Vocabulary'],
    achievements: ['First Lesson', 'Week Streak', 'Grammar Master', 'Conversation Pro']
  });

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN'; // Hindi
      setRecognition(recognition);
    }
  }, []);

  // Auto-scroll to bottom
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

  const tutors: TutorProfile[] = [
    {
      id: "1",
      name: "Professor Sharma",
      avatar: "👨‍🏫",
      specialty: ["Conversation", "Grammar", "Business Hindi"],
      languages: ["Hindi", "English", "Sanskrit"],
      teachingStyle: "Patient and encouraging, focuses on practical usage",
      experience: "15+ years teaching Hindi to international students",
      rating: 4.8,
      totalStudents: 1200,
      totalLessons: 5000,
      availability: ["Mon-Fri 9AM-6PM", "Sat 10AM-2PM"],
      bio: "Expert in modern Hindi with deep knowledge of cultural context",
      accent: "Standard Hindi",
      personality: "Warm and professional"
    },
    {
      id: "2",
      name: "Priya Patel",
      avatar: "👩‍🏫",
      specialty: ["Pronunciation", "Slang", "Cultural Context"],
      languages: ["Hindi", "Gujarati", "English"],
      teachingStyle: "Interactive and fun, uses real-life examples",
      experience: "8 years specializing in conversational Hindi",
      rating: 4.9,
      totalStudents: 800,
      totalLessons: 3200,
      availability: ["Mon-Sun 8AM-8PM"],
      bio: "Makes learning Hindi enjoyable with cultural insights",
      accent: "Mumbai Hindi",
      personality: "Energetic and friendly"
    },
    {
      id: "3",
      name: "Dr. Rajesh Kumar",
      avatar: "👨‍🎓",
      specialty: ["Academic Writing", "Literature", "Advanced Grammar"],
      languages: ["Hindi", "English", "Urdu"],
      teachingStyle: "Structured and comprehensive, academic approach",
      experience: "20+ years in Hindi literature and linguistics",
      rating: 4.7,
      totalStudents: 600,
      totalLessons: 2800,
      availability: ["Mon-Fri 2PM-8PM", "Sat 9AM-5PM"],
      bio: "PhD in Hindi Literature, expert in classical and modern Hindi",
      accent: "Delhi Hindi",
      personality: "Scholarly and thorough"
    }
  ];

  const lessonTypes = [
    { id: "conversation", name: "Conversation Practice", icon: MessageSquare, description: "Practice everyday conversations" },
    { id: "grammar", name: "Grammar Focus", icon: BookOpen, description: "Master grammar rules and structures" },
    { id: "pronunciation", name: "Pronunciation", icon: Mic, description: "Perfect your accent and pronunciation" },
    { id: "vocabulary", name: "Vocabulary Building", icon: Brain, description: "Expand your word knowledge" },
    { id: "writing", name: "Writing Skills", icon: Edit, description: "Improve writing and composition" },
    { id: "listening", name: "Listening Comprehension", icon: Headphones, description: "Enhance listening skills" },
    { id: "reading", name: "Reading Practice", icon: Book, description: "Practice reading and comprehension" }
  ];

  const startLesson = useCallback((tutor: TutorProfile, type: string) => {
    const newSession: LessonSession = {
      id: Date.now().toString(),
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Lesson with ${tutor.name}`,
      description: `Personalized ${type} lesson with ${tutor.name}`,
      type: type as any,
      difficulty: 'intermediate',
      language: selectedLanguage,
      duration: sessionDuration,
      progress: 0,
      completed: false,
      aiTutor: tutor.name,
      focusAreas: tutor.specialty,
      materials: [],
      notes: "",
      createdAt: new Date()
    };

    setCurrentSession(newSession);
    setSelectedTutor(tutor);
    setLessonType(type);
    setSelectedLessonType(type);
    setSessionActive(true);
    setMessages([]);

    // Generate greeting inline
    const greetings = {
      conversation: `नमस्ते! मैं ${tutor.name} हूं। आज हम बातचीत का अभ्यास करेंगे। कैसे हैं आप?`,
      grammar: `नमस्ते! मैं ${tutor.name} हूं। आज हम व्याकरण पर ध्यान देंगे। तैयार हैं?`,
      pronunciation: `नमस्ते! मैं ${tutor.name} हूं। आज हम उच्चारण पर काम करेंगे। शुरू करते हैं!`,
      vocabulary: `नमस्ते! मैं ${tutor.name} हूं। आज हम नए शब्द सीखेंगे। तैयार हैं?`,
      writing: `नमस्ते! मैं ${tutor.name} हूं। आज हम लेखन कौशल पर काम करेंगे।`,
      listening: `नमस्ते! मैं ${tutor.name} हूं। आज हम सुनने की क्षमता बढ़ाएंगे।`,
      reading: `नमस्ते! मैं ${tutor.name} हूं। आज हम पढ़ने का अभ्यास करेंगे।`
    };
    const greeting = greetings[type as keyof typeof greetings] || greetings.conversation;

    // Add initial greeting
    const initialMessage: LessonMessage = {
      id: Date.now().toString(),
      sender: 'tutor',
      content: greeting,
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([initialMessage]);

    // Speak the greeting using a simple approach
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(greeting);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.8;
      utterance.volume = 1.0;
      speechSynthesis.speak(utterance);
    }

    // Switch to active lesson tab
    setActiveTab("active");

    toast({
      title: "Lesson Started!",
      description: `Your ${type} lesson with ${tutor.name} has begun.`,
    });
  }, [selectedLanguage, sessionDuration, toast, setActiveTab]);

  const generateTutorGreeting = useCallback((tutor: TutorProfile, type: string): string => {
    const greetings = {
      conversation: `नमस्ते! मैं ${tutor.name} हूं। आज हम बातचीत का अभ्यास करेंगे। कैसे हैं आप?`,
      grammar: `नमस्ते! मैं ${tutor.name} हूं। आज हम व्याकरण पर ध्यान देंगे। तैयार हैं?`,
      pronunciation: `नमस्ते! मैं ${tutor.name} हूं। आज हम उच्चारण पर काम करेंगे। शुरू करते हैं!`,
      vocabulary: `नमस्ते! मैं ${tutor.name} हूं। आज हम नए शब्द सीखेंगे। तैयार हैं?`,
      writing: `नमस्ते! मैं ${tutor.name} हूं। आज हम लेखन कौशल पर काम करेंगे।`,
      listening: `नमस्ते! मैं ${tutor.name} हूं। आज हम सुनने की क्षमता बढ़ाएंगे।`,
      reading: `नमस्ते! मैं ${tutor.name} हूं। आज हम पढ़ने का अभ्यास करेंगे।`
    };
    return greetings[type as keyof typeof greetings] || greetings.conversation;
  }, []);

  const generateFollowUpQuestion = useCallback((type: string): string | null => {
    const followUps = {
      conversation: [
        "क्या आप अपने परिवार के बारे में बात करना चाहते हैं?",
        "आपका पसंदीदा खाना क्या है?",
        "आप अपने दिन के बारे में क्या बता सकते हैं?"
      ],
      grammar: [
        "क्या आप इस वाक्य में कोई गलती ढूंढ सकते हैं?",
        "इस नियम को और अभ्यास करना चाहते हैं?",
        "क्या आपको कोई और व्याकरण नियम सीखना है?"
      ],
      pronunciation: [
        "क्या आप इस शब्द का उच्चारण करना चाहते हैं?",
        "अब एक और शब्द का अभ्यास करते हैं?",
        "क्या आपको कोई विशेष शब्द सीखना है?"
      ],
      vocabulary: [
        "क्या आप नए शब्द सीखना चाहते हैं?",
        "इस शब्द का वाक्य में प्रयोग करना चाहते हैं?",
        "क्या आपको कोई विशेष विषय के शब्द सीखने हैं?"
      ],
      writing: [
        "क्या आप एक छोटा निबंध लिखना चाहते हैं?",
        "इस विषय पर लिखना चाहते हैं?",
        "क्या आप एक पत्र लिखने का अभ्यास करना चाहते हैं?"
      ],
      listening: [
        "क्या आप कुछ और सुनना चाहते हैं?",
        "इस पर चर्चा करना चाहते हैं?",
        "क्या आप कोई विशेष विषय सुनना चाहते हैं?"
      ],
      reading: [
        "क्या आप कुछ और पढ़ना चाहते हैं?",
        "इस पाठ पर चर्चा करना चाहते हैं?",
        "क्या आप कोई विशेष विषय पढ़ना चाहते हैं?"
      ]
    };

    const typeFollowUps = followUps[type as keyof typeof followUps];
    if (typeFollowUps && Math.random() < 0.7) { // 70% chance of follow-up
      return typeFollowUps[Math.floor(Math.random() * typeFollowUps.length)];
    }
    return null;
  }, []);

  const speakText = useCallback((text: string, accent: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on selected language
      const languageMap: { [key: string]: string } = {
        'Hindi': 'hi-IN',
        'English': 'en-US',
        'Spanish': 'es-ES',
        'French': 'fr-FR',
        'German': 'de-DE',
        'Chinese': 'zh-CN',
        'Japanese': 'ja-JP',
        'Korean': 'ko-KR',
        'Arabic': 'ar-SA',
        'Russian': 'ru-RU',
        'Portuguese': 'pt-BR',
        'Italian': 'it-IT',
        'Telugu': 'te-IN',
        'Kannada': 'kn-IN',
        'Tamil': 'ta-IN'
      };
      
      utterance.lang = languageMap[selectedLanguage] || 'hi-IN';
      utterance.rate = 0.8; // Slightly slower for clarity
      utterance.volume = 1.0;
      utterance.pitch = 1.0;
      
      // Adjust voice based on tutor personality
      if (selectedTutor) {
        switch (selectedTutor.personality) {
          case 'Warm and professional':
            utterance.rate = 0.75; // Slower, more measured
            utterance.pitch = 0.9; // Slightly lower pitch
            break;
          case 'Energetic and friendly':
            utterance.rate = 0.85; // Faster, more enthusiastic
            utterance.pitch = 1.1; // Slightly higher pitch
            break;
          case 'Scholarly and thorough':
            utterance.rate = 0.7; // Slow and deliberate
            utterance.pitch = 0.95; // Neutral pitch
            break;
          default:
            utterance.rate = 0.8;
            utterance.pitch = 1.0;
        }
      }
      
      utterance.onstart = () => {
        setIsAISpeaking(true);
        toast({
          title: `${selectedTutor?.name || 'Tutor'} is speaking...`,
          description: "Listening to your tutor's response.",
        });
      };
      
      utterance.onend = () => {
        setIsAISpeaking(false);
        // Add a small delay before allowing next interaction
        setTimeout(() => {
          // Optional: Add follow-up question or prompt
          if (messages.length < 3) { // Early in conversation
            const followUp = generateFollowUpQuestion(lessonType);
            if (followUp) {
              setTimeout(() => {
                const followUpMessage: LessonMessage = {
                  id: Date.now().toString(),
                  sender: 'tutor',
                  content: followUp,
                  timestamp: new Date(),
                  type: 'question'
                };
                setMessages(prev => [...prev, followUpMessage]);
                speakText(followUp, selectedTutor?.accent || 'Standard Hindi');
              }, 2000);
            }
          }
        }, 1000);
      };
      
      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        setIsAISpeaking(false);
        toast({
          title: "Speech Error",
          description: "Failed to speak the response. Please continue with text.",
          variant: "destructive"
        });
      };
      
      speechSynthesis.speak(utterance);
    }
  }, [selectedLanguage, selectedTutor, messages.length, lessonType, generateFollowUpQuestion, toast]);

  const generateAIResponse = useCallback((userInput: string, tutor: TutorProfile, type: string): string => {
    const userInputLower = userInput.toLowerCase();
    
    // More sophisticated responses based on lesson type and user input
    const responses = {
      conversation: {
        greetings: [
          "नमस्ते! कैसे हैं आप? मैं आपकी कैसे मदद कर सकता हूं?",
          "स्वागत है! आज हम बातचीत का अभ्यास करेंगे। क्या आप तैयार हैं?",
          "हैलो! आपका दिन कैसा जा रहा है? चलिए हिंदी में बात करते हैं।"
        ],
        weather: [
          "आज मौसम कैसा है? क्या आप बाहर जाने की योजना बना रहे हैं?",
          "मौसम के बारे में बात करना एक अच्छा विषय है। आप किस मौसम में सबसे ज्यादा सहज महसूस करते हैं?",
          "हाँ, मौसम बहुत महत्वपूर्ण है। आप क्या पसंद करते हैं - गर्मी या सर्दी?"
        ],
        food: [
          "भोजन के बारे में बात करते हैं! आपका पसंदीदा भोजन क्या है?",
          "खाना एक बहुत अच्छा विषय है। आप क्या पकाते हैं?",
          "हाँ, भारतीय खाना बहुत स्वादिष्ट है। आप कौन सा व्यंजन पसंद करते हैं?"
        ],
        family: [
          "परिवार के बारे में बात करते हैं। आपके परिवार में कितने सदस्य हैं?",
          "परिवार बहुत महत्वपूर्ण है। आप अपने परिवार के साथ क्या करना पसंद करते हैं?",
          "हाँ, परिवार हमारा सबसे बड़ा सहारा है। आप अपने माता-पिता के साथ कैसे समय बिताते हैं?"
        ],
        work: [
          "काम के बारे में बात करते हैं। आप क्या काम करते हैं?",
          "पेशा बहुत महत्वपूर्ण है। आप अपने काम में क्या पसंद करते हैं?",
          "हाँ, काम हमारे जीवन का एक बड़ा हिस्सा है। आप अपने काम में क्या चुनौतियों का सामना करते हैं?"
        ],
        default: [
          "बहुत अच्छा! आपका उच्चारण सुधर रहा है।",
          "यह सही है! अब इस वाक्य को थोड़ा बदलकर बोलें।",
          "शानदार! आप तेजी से सीख रहे हैं।",
          "अच्छा प्रयास! थोड़ा और स्पष्ट बोलने की कोशिश करें।",
          "यह बहुत अच्छा है! आप हिंदी में बहुत अच्छी तरह से बात कर रहे हैं।",
          "बहुत बढ़िया! आपका व्याकरण सही है।",
          "अच्छा काम! आप नई शब्दावली सीख रहे हैं।"
        ]
      },
      grammar: {
        questions: [
          "यह एक अच्छा प्रश्न है। क्या आप इस वाक्य में व्याकरण की गलती ढूंढ सकते हैं?",
          "बहुत अच्छा! अब इस वाक्य को सही करें।",
          "यह सही है! यह व्याकरण नियम याद रखें।"
        ],
        corrections: [
          "सही है! यहाँ 'का' की जगह 'की' होना चाहिए।",
          "बहुत अच्छा! आपने सही सुधार किया।",
          "यह सही है! अब इस नियम का और अभ्यास करें।"
        ],
        explanations: [
          "यह व्याकरण नियम इस तरह काम करता है...",
          "हिंदी में यह नियम बहुत महत्वपूर्ण है।",
          "इस नियम को समझने के लिए कुछ उदाहरण देखते हैं।"
        ],
        default: [
          "सही है! यह व्याकरण नियम याद रखें।",
          "बहुत अच्छा! अब इस नियम का और अभ्यास करें।",
          "यह सही है! आप व्याकरण समझ रहे हैं।",
          "अच्छा! अब इस वाक्य में गलती ढूंढें।",
          "बहुत बढ़िया! आपका व्याकरण ज्ञान बढ़ रहा है।"
        ]
      },
      pronunciation: {
        practice: [
          "अब इस शब्द को धीरे-धीरे बोलें: 'शुभकामनाएं'",
          "बहुत अच्छा! अब 'धन्यवाद' शब्द का उच्चारण करें।",
          "यह सही है! अब 'स्वागत है' बोलने की कोशिश करें।"
        ],
        feedback: [
          "उच्चारण सही है! अब इसे थोड़ा धीमे बोलें।",
          "बहुत अच्छा! आपका उच्चारण सुधर रहा है।",
          "यह सही है! अब इस शब्द को दोहराएं।",
          "शानदार! आपका उच्चारण बिल्कुल सही है।",
          "अच्छा प्रयास! थोड़ा और स्पष्ट बोलने की कोशिश करें।"
        ],
        default: [
          "उच्चारण सही है! अब इसे थोड़ा धीमे बोलें।",
          "बहुत अच्छा! आपका उच्चारण सुधर रहा है।",
          "यह सही है! अब इस शब्द को दोहराएं।",
          "शानदार! आपका उच्चारण बिल्कुल सही है।"
        ]
      },
      vocabulary: {
        newWords: [
          "यह एक नया शब्द है। क्या आप इसका अर्थ जानते हैं?",
          "बहुत अच्छा! अब इस शब्द का वाक्य में प्रयोग करें।",
          "यह सही है! यह शब्द बहुत उपयोगी है।"
        ],
        explanations: [
          "इस शब्द का अर्थ है...",
          "यह शब्द इस संदर्भ में प्रयोग होता है...",
          "इस शब्द के कई अर्थ हैं..."
        ],
        default: [
          "बहुत अच्छा! आप नई शब्दावली सीख रहे हैं।",
          "यह सही है! यह शब्द बहुत उपयोगी है।",
          "शानदार! आपकी शब्दावली बढ़ रही है।",
          "अच्छा काम! अब इस शब्द का प्रयोग करें।"
        ]
      },
      writing: {
        prompts: [
          "अब एक छोटा निबंध लिखें।",
          "इस विषय पर अपने विचार लिखें।",
          "एक पत्र लिखने की कोशिश करें।"
        ],
        feedback: [
          "बहुत अच्छा लेखन! कुछ सुधार करें।",
          "यह सही है! आपका लेखन सुधर रहा है।",
          "शानदार! आपका लेखन बहुत अच्छा है।"
        ],
        default: [
          "बहुत अच्छा लेखन! कुछ सुधार करें।",
          "यह सही है! आपका लेखन सुधर रहा है।",
          "शानदार! आपका लेखन बहुत अच्छा है।",
          "अच्छा काम! अब इसे और बेहतर बनाएं।"
        ]
      },
      listening: {
        comprehension: [
          "अब ध्यान से सुनें और फिर प्रश्नों का उत्तर दें।",
          "बहुत अच्छा! आपने सही सुना।",
          "यह सही है! अब इस पर चर्चा करें।"
        ],
        default: [
          "बहुत अच्छा! आपकी सुनने की क्षमता बढ़ रही है।",
          "यह सही है! अब इस पर चर्चा करें।",
          "शानदार! आपने सही समझा।"
        ]
      },
      reading: {
        comprehension: [
          "अब इस पाठ को पढ़ें और प्रश्नों का उत्तर दें।",
          "बहुत अच्छा! आपने सही पढ़ा।",
          "यह सही है! अब इस पर चर्चा करें।"
        ],
        default: [
          "बहुत अच्छा! आपकी पढ़ने की क्षमता बढ़ रही है।",
          "यह सही है! अब इस पर चर्चा करें।",
          "शानदार! आपने सही समझा।"
        ]
      }
    };

    const typeResponses = responses[type as keyof typeof responses];
    if (!typeResponses) return "बहुत अच्छा! आप सीख रहे हैं।";

    // Check for specific keywords in user input
    if (type === 'conversation') {
      if (userInputLower.includes('नमस्ते') || userInputLower.includes('हैलो') || userInputLower.includes('hi')) {
        return typeResponses.greetings[Math.floor(Math.random() * typeResponses.greetings.length)];
      }
      if (userInputLower.includes('मौसम') || userInputLower.includes('weather')) {
        return typeResponses.weather[Math.floor(Math.random() * typeResponses.weather.length)];
      }
      if (userInputLower.includes('खाना') || userInputLower.includes('भोजन') || userInputLower.includes('food')) {
        return typeResponses.food[Math.floor(Math.random() * typeResponses.food.length)];
      }
      if (userInputLower.includes('परिवार') || userInputLower.includes('family')) {
        return typeResponses.family[Math.floor(Math.random() * typeResponses.family.length)];
      }
      if (userInputLower.includes('काम') || userInputLower.includes('work') || userInputLower.includes('job')) {
        return typeResponses.work[Math.floor(Math.random() * typeResponses.work.length)];
      }
    }

    if (type === 'grammar') {
      if (userInputLower.includes('प्रश्न') || userInputLower.includes('question')) {
        return typeResponses.questions[Math.floor(Math.random() * typeResponses.questions.length)];
      }
      if (userInputLower.includes('सुधार') || userInputLower.includes('correction')) {
        return typeResponses.corrections[Math.floor(Math.random() * typeResponses.corrections.length)];
      }
    }

    if (type === 'pronunciation') {
      if (userInputLower.includes('अभ्यास') || userInputLower.includes('practice')) {
        return typeResponses.practice[Math.floor(Math.random() * typeResponses.practice.length)];
      }
    }

    if (type === 'vocabulary') {
      if (userInputLower.includes('नया') || userInputLower.includes('new') || userInputLower.includes('शब्द')) {
        return typeResponses.newWords[Math.floor(Math.random() * typeResponses.newWords.length)];
      }
    }

    // Return default response for the lesson type
    const defaultResponses = typeResponses.default || typeResponses;
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || !currentSession) return;

    const userMessage: LessonMessage = {
      id: Date.now().toString(),
      sender: 'student',
      content,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput("");

    // Generate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(content, selectedTutor!, lessonType);
      const tutorMessage: LessonMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        content: aiResponse,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, tutorMessage]);
      speakText(aiResponse, selectedTutor!.accent);
    }, 1000);
  }, [currentSession, selectedTutor, lessonType, generateAIResponse, speakText]);

  const startVoiceRecognition = useCallback(() => {
    if (!recognition) {
      toast({
        title: "Voice Recognition Not Available",
        description: "Your browser doesn't support voice recognition. Please use text input.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Stop any ongoing speech synthesis
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak now! I'm listening to your voice.",
        });
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map(result => result.transcript)
          .join('');
        
        setUserInput(transcript);
        
        // Auto-send after a short delay if there's content
        if (transcript.trim()) {
          setTimeout(() => {
            sendMessage(transcript);
          }, 1000);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = "Voice recognition error. Please try again.";
        switch (event.error) {
          case 'no-speech':
            errorMessage = "No speech detected. Please speak clearly.";
            break;
          case 'audio-capture':
            errorMessage = "Microphone not available. Please check your microphone.";
            break;
          case 'not-allowed':
            errorMessage = "Microphone access denied. Please allow microphone access.";
            break;
          case 'network':
            errorMessage = "Network error. Please check your internet connection.";
            break;
          default:
            errorMessage = "Voice recognition error. Please use text input.";
        }
        
        toast({
          title: "Voice Recognition Error",
          description: errorMessage,
          variant: "destructive"
        });
      };

      recognition.onend = () => {
        setIsListening(false);
        toast({
          title: "Voice Recognition Stopped",
          description: "Voice recognition has stopped. You can start again or use text input.",
        });
      };

      // Set language based on selected language
      const languageMap: { [key: string]: string } = {
        'Hindi': 'hi-IN',
        'English': 'en-US',
        'Spanish': 'es-ES',
        'French': 'fr-FR',
        'German': 'de-DE',
        'Chinese': 'zh-CN',
        'Japanese': 'ja-JP',
        'Korean': 'ko-KR',
        'Arabic': 'ar-SA',
        'Russian': 'ru-RU',
        'Portuguese': 'pt-BR',
        'Italian': 'it-IT',
        'Telugu': 'te-IN',
        'Kannada': 'kn-IN',
        'Tamil': 'ta-IN'
      };

      recognition.lang = languageMap[selectedLanguage] || 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognition.start();
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
      toast({
        title: "Voice Recognition Error",
        description: "Failed to start voice recognition. Please use text input.",
        variant: "destructive"
      });
    }
  }, [recognition, selectedLanguage, sendMessage, toast]);

  const endSession = useCallback(() => {
    if (currentSession) {
      const updatedSession = { ...currentSession, completed: true, completedAt: new Date() };
      setCurrentSession(updatedSession);
    }
    setSessionActive(false);
    setMessages([]);
    setSelectedTutor(null);
    
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }

    toast({
      title: "Lesson Completed!",
      description: "Great job! Your lesson has been completed.",
    });
  }, [currentSession, toast]);

  const rateSession = useCallback((rating: number) => {
    if (currentSession) {
      const updatedSession = { ...currentSession, rating };
      setCurrentSession(updatedSession);
      
      toast({
        title: "Thank You!",
        description: `You rated this lesson ${rating} stars.`,
      });
    }
  }, [currentSession, toast]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Private AI Lessons</h1>
        <p className="text-muted-foreground">One-on-one personalized tutoring sessions</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-primary">{stats.totalLessons}</div>
          <div className="text-sm text-muted-foreground">Total Lessons</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-secondary">{stats.totalTime}</div>
          <div className="text-sm text-muted-foreground">Minutes Learned</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-accent">{stats.averageRating}</div>
          <div className="text-sm text-muted-foreground">Average Rating</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-green-500">{stats.currentStreak}</div>
          <div className="text-sm text-muted-foreground">Day Streak</div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="tutors">Tutors</TabsTrigger>
          <TabsTrigger value="active">Active Lesson</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessonTypes.map((type) => (
              <Card key={type.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <type.icon className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{type.name}</CardTitle>
                  </div>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Duration:</span>
                      <Badge variant="outline">{sessionDuration} min</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Language:</span>
                      <Badge variant="secondary">{selectedLanguage}</Badge>
                    </div>
                    <Button 
                      onClick={() => {
                        setActiveTab("tutors");
                        setSelectedLessonType(type.id);
                      }}
                      className="w-full"
                    >
                      Choose Tutor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tutors" className="space-y-4">
          {selectedLessonType && (
            <div className="mb-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="font-medium">Selected Lesson Type:</span>
                  <Badge variant="secondary" className="capitalize">
                    {selectedLessonType}
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveTab("sessions")}
                >
                  Back to Sessions
                </Button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tutors.map((tutor) => (
              <Card key={tutor.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{tutor.avatar}</div>
                    <div>
                      <CardTitle className="text-lg">{tutor.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{tutor.rating}</span>
                      </div>
                    </div>
                  </div>
                  <CardDescription>{tutor.bio}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-1">
                      {tutor.specialty.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Availability:</h4>
                    <div className="text-sm text-muted-foreground">
                      {tutor.availability.join(', ')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => startLesson(tutor, selectedLessonType)}
                      className="flex-1"
                    >
                      Start Lesson
                    </Button>
                    <Button variant="outline" className="flex-1">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {sessionActive && currentSession && selectedTutor ? (
            <div className="space-y-4">
              {/* Session Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{currentSession.title}</CardTitle>
                      <CardDescription>with {selectedTutor.name}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{currentSession.type}</Badge>
                      <Badge variant="secondary">{sessionDuration} min</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600">Session Active</span>
                    </div>
                    <Button onClick={endSession} variant="destructive" size="sm">
                      End Session
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Chat Interface */}
              <Card className="h-96">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Lesson Chat</CardTitle>
                    {isAISpeaking && (
                      <div className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm">Tutor speaking...</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="h-80 overflow-y-auto space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'student'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender === 'tutor' && (
                            <div className="text-lg">{selectedTutor.avatar}</div>
                          )}
                          <span className="text-xs opacity-70">
                            {message.sender === 'student' ? 'You' : selectedTutor.name}
                          </span>
                          {message.type === 'question' && (
                            <Badge variant="outline" className="text-xs">Question</Badge>
                          )}
                        </div>
                        <p>{message.content}</p>
                        {message.translation && (
                          <p className="text-xs opacity-70 mt-1 italic">
                            {message.translation}
                          </p>
                        )}
                        {message.feedback && (
                          <p className="text-xs text-green-600 mt-1">
                            ✅ {message.feedback}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </CardContent>
              </Card>

              {/* Input Area */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-2">
                    <Input
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder={isListening ? "Listening..." : "Type your message..."}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage(userInput)}
                      className="flex-1"
                      disabled={isAISpeaking}
                    />
                    <Button
                      onClick={startVoiceRecognition}
                      variant={isListening ? "destructive" : "outline"}
                      size="icon"
                      disabled={isAISpeaking}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                    <Button 
                      onClick={() => sendMessage(userInput)} 
                      size="icon"
                      disabled={isAISpeaking || !userInput.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  {isListening && (
                    <div className="mt-2 text-center">
                      <div className="flex items-center justify-center gap-2 text-blue-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm">Listening... Speak now!</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Session Controls */}
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => rateSession(5)}>
                  <Star className="w-4 h-4 mr-2" />
                  Rate 5 Stars
                </Button>
                <Button variant="outline" onClick={() => rateSession(4)}>
                  <Star className="w-4 h-4 mr-2" />
                  Rate 4 Stars
                </Button>
                <Button variant="outline" onClick={() => rateSession(3)}>
                  <Star className="w-4 h-4 mr-2" />
                  Rate 3 Stars
                </Button>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-6xl mb-4">👨‍🏫</div>
                <h3 className="text-xl font-semibold mb-2">No Active Session</h3>
                <p className="text-muted-foreground mb-4">
                  Start a lesson to begin your personalized tutoring session
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => setActiveTab("sessions")}>
                    Choose Lesson Type
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("tutors")}>
                    Browse Tutors
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrivateLessons; 