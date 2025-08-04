
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  Lightbulb,
  BookOpen,
  Target,
  Zap,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onVoiceInput: () => void;
  isListening: boolean;
  isProcessing: boolean;
  targetLanguage: string;
  sourceLanguage: string;
}

// AI-powered smart suggestions
const getSmartSuggestions = (context: string, targetLanguage: string) => {
  const suggestions = {
    "greeting": {
      "Spanish": ["¡Hola! ¿Cómo estás?", "Buenos días", "¿Qué tal?"],
      "French": ["Bonjour!", "Comment allez-vous?", "Salut!"],
      "German": ["Hallo!", "Wie geht es dir?", "Guten Tag!"],
      "Hindi": ["नमस्ते! कैसे हो?", "सुप्रभात", "क्या हाल है?"],
      "Telugu": ["నమస్కారం! మీరు ఎలా ఉన్నారు?", "శుభోదయం", "మీరు ఎలా ఉన్నారు?"],
      "Kannada": ["ನಮಸ್ಕಾರ! ನೀವು ಹೇಗಿದ್ದೀರಿ?", "ಶుಭోದಯ", "ನೀವು ಹೇಗಿದ್ದೀರಿ?"],
      "Tamil": ["வணக்கம்! நீங்கள் எப்படி இருக்கிறீர்கள்?", "காலை வணக்கம்", "நீங்கள் எப்படி இருக்கிறீர்கள்?"],
      "English": ["Hello! How are you?", "Good morning", "What's up?"]
    },
    "weather": {
      "Spanish": ["¿Qué tiempo hace hoy?", "¿Está lloviendo?", "Hace buen tiempo"],
      "French": ["Quel temps fait-il aujourd'hui?", "Il pleut?", "Il fait beau"],
      "German": ["Wie ist das Wetter heute?", "Regnet es?", "Es ist schön"],
      "Hindi": ["आज मौसम कैसा है?", "बारिश हो रही है?", "मौसम अच्छा है"],
      "Telugu": ["ఈరోజు వాతావరణం ఎలా ఉంది?", "వర్షం పడుతోందా?", "వాతావరణం మంచిది"],
      "Kannada": ["ಇಂದು ಹವಾಮಾನ ಹೇಗಿದೆ?", "ಮಳೆ ಬರುತ್ತಿದೆಯೇ?", "ಹವಾಮಾನ ಚೆನ್ನಾಗಿದೆ"],
      "Tamil": ["இன்று வானிலை எப்படி இருக்கிறது?", "மழை பெய்கிறதா?", "வானிலை நன்றாக இருக்கிறது"],
      "English": ["How's the weather today?", "Is it raining?", "It's nice weather"]
    },
    "food": {
      "Spanish": ["¿Qué te gusta comer?", "Me encanta la comida", "¿Tienes hambre?"],
      "French": ["Qu'est-ce que tu aimes manger?", "J'aime la nourriture", "Tu as faim?"],
      "German": ["Was isst du gerne?", "Ich liebe das Essen", "Hast du Hunger?"],
      "Hindi": ["आपको क्या खाना पसंद है?", "मुझे खाना बहुत पसंद है", "क्या आपको भूख लगी है?"],
      "Telugu": ["మీకు ఏమి తినడం ఇష్టం?", "నాకు ఆహారం చాలా ఇష్టం", "మీకు ఆకలి ఉందా?"],
      "Kannada": ["ನಿಮಗೆ ಏನು ತಿನ್ನಲು ಇಷ್ಟ?", "ನನಗೆ ಆಹಾರ ತುಂಬಾ ಇಷ್ಟ", "ನಿಮಗೆ ಹಸಿವಾಗಿದೆಯೇ?"],
      "Tamil": ["உங்களுக்கு என்ன சாப்பிட விருப்பம்?", "எனக்கு உணவு மிகவும் பிடிக்கும்", "உங்களுக்கு பசியா இருக்கிறதா?"],
      "English": ["What do you like to eat?", "I love food", "Are you hungry?"]
    }
  };

  // Simple context detection
  const contextLower = context.toLowerCase();
  if (contextLower.includes("hello") || contextLower.includes("hi") || contextLower.includes("greet")) {
    return suggestions.greeting[targetLanguage] || suggestions.greeting.English;
  }
  if (contextLower.includes("weather") || contextLower.includes("rain") || contextLower.includes("sun")) {
    return suggestions.weather[targetLanguage] || suggestions.weather.English;
  }
  if (contextLower.includes("food") || contextLower.includes("eat") || contextLower.includes("hungry")) {
    return suggestions.food[targetLanguage] || suggestions.food.English;
  }

  // Default suggestions
  return [
    `How do you say "hello" in ${targetLanguage}?`,
    `Can you teach me basic greetings in ${targetLanguage}?`,
    `What's the weather like in your country?`
  ];
};

// Grammar correction suggestions
const getGrammarCorrections = (text: string, targetLanguage: string) => {
  const corrections = {
    "English": {
      "i am": "I am",
      "i like": "I like",
      "i want": "I want",
      "i have": "I have"
    },
    "Spanish": {
      "yo soy": "Yo soy",
      "yo quiero": "Yo quiero",
      "yo tengo": "Yo tengo"
    },
    "French": {
      "je suis": "Je suis",
      "je veux": "Je veux",
      "j'ai": "J'ai"
    },
    "Hindi": {
      "मैं हूं": "मैं हूँ",
      "मैं चाहता": "मैं चाहता हूँ",
      "मुझे पसंद": "मुझे पसंद है"
    },
    "Telugu": {
      "నేను ఉన్నాను": "నేను ఉన్నాను",
      "నాకు ఇష్టం": "నాకు ఇష్టం",
      "నేను కోరుకుంటున్నాను": "నేను కోరుకుంటున్నాను"
    },
    "Kannada": {
      "ನಾನು ಇದ್ದೇನೆ": "ನಾನು ಇದ್ದೇನೆ",
      "ನನಗೆ ಇಷ್ಟ": "ನನಗೆ ಇಷ್ಟ",
      "ನಾನು ಬಯಸುತ್ತೇನೆ": "ನಾನು ಬಯಸುತ್ತೇನೆ"
    },
    "Tamil": {
      "நான் இருக்கிறேன்": "நான் இருக்கிறேன்",
      "எனக்கு பிடிக்கும்": "எனக்கு பிடிக்கும்",
      "நான் விரும்புகிறேன்": "நான் விரும்புகிறேன்"
    }
  };

  const langCorrections = corrections[targetLanguage] || corrections.English;
  const suggestions = [];

  for (const [incorrect, correct] of Object.entries(langCorrections)) {
    if (text.toLowerCase().includes(incorrect)) {
      suggestions.push({
        original: incorrect,
        corrected: correct,
        message: `Consider capitalizing "${correct}"`
      });
    }
  }

  return suggestions;
};

// Pronunciation analysis
const getPronunciationTips = (text: string, targetLanguage: string) => {
  const tips = {
    "Spanish": {
      "ñ": "Pronounced like 'ny' in 'canyon'",
      "rr": "Roll your 'r' sound",
      "ll": "Pronounced like 'y' in 'yes'"
    },
    "French": {
      "r": "Guttural 'r' sound from the back of throat",
      "u": "Purse your lips and say 'ee'",
      "eu": "Say 'uh' with rounded lips"
    },
    "German": {
      "ä": "Like 'e' in 'bed' but with rounded lips",
      "ö": "Like 'e' in 'bed' but with rounded lips",
      "ü": "Like 'ee' in 'see' but with rounded lips"
    },
    "Hindi": {
      "ठ": "Retroflex 'th' sound",
      "ड": "Retroflex 'd' sound",
      "ण": "Retroflex 'n' sound"
    },
    "Telugu": {
      "ఠ": "Retroflex 'th' sound",
      "డ": "Retroflex 'd' sound",
      "ణ": "Retroflex 'n' sound"
    },
    "Kannada": {
      "ಠ": "Retroflex 'th' sound",
      "ಡ": "Retroflex 'd' sound",
      "ಣ": "Retroflex 'n' sound"
    },
    "Tamil": {
      "ட": "Retroflex 't' sound",
      "ண": "Retroflex 'n' sound",
      "ற": "Retroflex 'r' sound"
    }
  };

  const langTips = tips[targetLanguage] || {};
  const foundTips = [];

  for (const [sound, tip] of Object.entries(langTips)) {
    if (text.includes(sound)) {
      foundTips.push({ sound, tip });
    }
  }

  return foundTips;
};

const ChatInput = ({ 
  onSendMessage, 
  onVoiceInput, 
  isListening, 
  isProcessing,
  targetLanguage,
  sourceLanguage
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [grammarCorrections, setGrammarCorrections] = useState<any[]>([]);
  const [pronunciationTips, setPronunciationTips] = useState<any[]>([]);
  const [showAI, setShowAI] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Auto-resize textarea with better mobile handling
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 150);
      textareaRef.current.style.height = newHeight + 'px';
    }
  }, [message]);

  // Generate suggestions when message changes
  useEffect(() => {
    if (message.length > 3) {
      const newSuggestions = getSmartSuggestions(message, targetLanguage);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }

    // Grammar corrections
    const corrections = getGrammarCorrections(message, targetLanguage);
    setGrammarCorrections(corrections);

    // Pronunciation tips
    const tips = getPronunciationTips(message, targetLanguage);
    setPronunciationTips(tips);
  }, [message, targetLanguage]);

  const handleSend = () => {
    if (message.trim() && !isProcessing) {
      onSendMessage(message.trim());
      setMessage("");
      setShowSuggestions(false);
      setGrammarCorrections([]);
      setPronunciationTips([]);
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setShowSuggestions(false);
    toast({
      title: "Suggestion applied",
      description: "Smart suggestion added to your message",
    });
  };

  const handleVoiceToggle = () => {
    if (mode === "text") {
      setMode("voice");
      onVoiceInput();
    } else {
      setMode("text");
    }
  };

  const clearMessage = () => {
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="space-y-3">
      {/* AI Features Toggle - Hidden on mobile for space */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAI(!showAI)}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI Assistant
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            {targetLanguage}
          </Badge>
        </div>
      </div>

      {/* Mobile Language Badge - Enhanced */}
      <div className="md:hidden flex justify-center">
        <Badge variant="outline" className="flex items-center gap-1 text-xs px-3 py-1 bg-background/80 backdrop-blur-sm">
          <Target className="w-3 h-3" />
          {targetLanguage}
        </Badge>
      </div>

      {/* AI Features Panel - Mobile Optimized */}
      {showAI && (
        <Card className="modern-card p-3 md:p-4 space-y-3 max-h-48 overflow-y-auto border-2 border-primary/20 mobile-ai-panel">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              AI Assistant
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAI(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          {/* Smart Suggestions - Mobile Optimized */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground font-medium">💡 Smart Suggestions:</div>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.slice(0, 2).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs h-auto py-2 px-3 text-left bg-primary/5 hover:bg-primary/10 border-primary/20"
                  >
                    {suggestion.length > 25 ? suggestion.substring(0, 25) + '...' : suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Grammar Corrections - Mobile Optimized */}
          {grammarCorrections.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Grammar Tips:
              </div>
              <div className="space-y-1.5">
                {grammarCorrections.map((correction, index) => (
                  <div key={index} className="text-xs bg-green-50 dark:bg-green-950/50 p-2.5 rounded-lg border border-green-200 dark:border-green-800">
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {correction.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pronunciation Tips - Mobile Optimized */}
          {pronunciationTips.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                <Volume2 className="w-3 h-3 text-blue-500" />
                Pronunciation Tips:
              </div>
              <div className="space-y-1.5">
                {pronunciationTips.map((tip, index) => (
                  <div key={index} className="text-xs bg-blue-50 dark:bg-blue-950/50 p-2.5 rounded-lg border border-blue-200 dark:border-blue-800">
                    <span className="font-medium text-blue-600 dark:text-blue-400">{tip.sound}:</span> {tip.tip}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Main Input Area - Phone Optimized */}
      <Card className={cn(
        "modern-card p-3 md:p-4 transition-all duration-300 phone-optimized phone-shadow",
        isFocused && "ring-2 ring-primary/30 shadow-xl",
        "border-2 border-border/50",
        "bg-gradient-to-r from-background/95 to-background/90 backdrop-blur-md mobile-gradient-bg"
      )}>
        <div className="flex items-end gap-2 md:gap-3">
          {/* Mode Toggle - Phone Optimized */}
          <div className="flex items-center gap-1 bg-muted/80 rounded-xl p-1.5 shadow-inner mobile-mode-toggle-container">
            <Button
              variant={mode === "text" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("text")}
              className="h-12 px-4 md:px-5 rounded-lg font-medium phone-button phone-tap mobile-voice-button transition-all duration-200"
            >
              <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
            <Button
              variant={mode === "voice" ? "default" : "ghost"}
              size="sm"
              onClick={handleVoiceToggle}
              className="h-12 px-4 md:px-5 rounded-lg font-medium phone-button phone-tap mobile-voice-button transition-all duration-200"
            >
              {isListening ? <MicOff className="w-5 h-5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 md:w-6 md:h-6" />}
            </Button>
          </div>
      
          {/* Enhanced Text Input - Phone Optimized */}
          <div className="flex-1 relative mobile-textarea-container">
            <div className="relative bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-inner">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={
                  mode === "text" 
                    ? `Type your message in ${targetLanguage}...` 
                    : "Tap the microphone to start voice input"
                }
                className={cn(
                  "min-h-[80px] md:min-h-[90px] resize-none border-0 focus:ring-0 bg-transparent",
                  "text-base md:text-lg leading-relaxed px-4 py-3",
                  "placeholder:text-muted-foreground/70 placeholder:font-medium",
                  "transition-all duration-200 rounded-xl",
                  "chat-input-mobile chat-textarea",
                  isFocused && "chat-input-focus"
                )}
                disabled={mode === "voice" || isProcessing}
              />
              
              {/* Clear Button - Phone Optimized */}
              {message.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearMessage}
                  className="absolute top-3 right-3 h-8 w-8 p-0 opacity-70 hover:opacity-100 mobile-clear-button transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              
              {/* Character count - Phone Optimized */}
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground/60 font-medium mobile-char-count">
                {message.length}/500
              </div>
            </div>
          </div>

          {/* Enhanced Send Button - Phone Optimized */}
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isProcessing || mode === "voice"}
            className={cn(
              "h-14 w-14 md:h-16 md:w-16 p-0 transition-all duration-200 rounded-xl phone-button phone-tap mobile-send-button",
              "hover:scale-105 active:scale-95",
              "shadow-lg hover:shadow-xl",
              "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/80 hover:to-primary/70",
              "disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed",
              "flex items-center justify-center"
            )}
          >
            {isProcessing ? (
              <div className="w-6 h-6 md:w-7 md:h-7 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-6 h-6 md:w-7 md:h-7" />
            )}
          </Button>
        </div>

        {/* Voice Input Status - Phone Optimized */}
        {mode === "voice" && (
          <div className="mt-4 flex items-center justify-center gap-3 text-sm bg-muted/50 rounded-lg p-4 border border-border/30 mobile-voice-status">
            {isListening ? (
              <>
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-600 dark:text-red-400 font-semibold">Listening...</span>
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-5 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">Tap microphone to start</span>
              </>
            )}
          </div>
        )}

        {/* Mobile AI Toggle - Phone Optimized */}
        <div className="md:hidden mt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAI(!showAI)}
            className="flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-200 mobile-ai-toggle"
          >
            <Sparkles className="w-4 h-4" />
            {showAI ? "Hide AI Assistant" : "Show AI Assistant"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatInput;
