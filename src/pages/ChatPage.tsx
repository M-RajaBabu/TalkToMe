import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatBubble from "@/components/chat/ChatBubble";
import AppHeader from "@/components/layout/AppHeader";
import { ChatMessage, Language, LanguagePreference, InputMode, Database } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Mic, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Gemini API key
const GEMINI_API_KEY = "AIzaSyBgj3wA1VTtYyvWhd43k1CCeF0rsFd7yRE";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const getUserIdFromToken = () => {
  // Optionally decode JWT if you want userId, but for now, just use email from localStorage
  return localStorage.getItem('userEmail');
};

const ChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Get language preferences from localStorage
  const [languagePreference, setLanguagePreference] = useState<LanguagePreference | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [chatMode, setChatMode] = useState<'chat' | 'translate'>('chat');
  
  // Auth check - redirect if not logged in
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      navigate('/login');
      return;
    }
    setUserEmail(email);
  }, [navigate]);
  
  // Load language preferences and chat history
  useEffect(() => {
    const storedPreference = localStorage.getItem('languagePreference');
    
    if (!storedPreference) {
      // If no language preference is found, redirect to language selection
      navigate('/language-selection');
      return;
    }
    
    try {
      const parsedPreference = JSON.parse(storedPreference) as LanguagePreference;
      setLanguagePreference(parsedPreference);
      
      // Set initial welcome message based on target language
      const welcomeMessage = getWelcomeMessage(parsedPreference.targetLanguage);
      setMessages([
        {
          id: uuidv4(),
          type: "ai",
          content: welcomeMessage.content,
          grammarFeedback: "",
          vocabularyTips: welcomeMessage.vocabularyTips || "",
          romanization: welcomeMessage.romanization,
          timestamp: new Date(),
        }
      ]);
      
      // Load chat history if user is authenticated
      if (userEmail) {
        loadChatHistory(parsedPreference);
      }
    } catch (error) {
      console.error("Error parsing language preference:", error);
      navigate('/language-selection');
    }
  }, [navigate, userEmail]);
  
  // Load chat history from backend
  const loadChatHistory = async (preference: LanguagePreference) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/chat?sourceLanguage=${encodeURIComponent(preference.sourceLanguage)}&targetLanguage=${encodeURIComponent(preference.targetLanguage)}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load chat history');
      if (data && data.length > 0) {
        setMessages(data.map(item => ({
          id: item._id,
          type: item.type,
          content: item.content,
          grammarFeedback: item.grammarFeedback,
          vocabularyTips: item.vocabularyTips,
          romanization: item.romanization,
          inputMode: item.inputMode,
          timestamp: new Date(item.timestamp),
        })));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };
  
  // Save message to backend
  const saveMessageToHistory = async (message: ChatMessage) => {
    if (!userEmail || !languagePreference) return;
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: message.type,
          content: message.content,
          grammarFeedback: message.grammarFeedback,
          vocabularyTips: message.vocabularyTips,
          romanization: message.romanization,
          inputMode: message.inputMode,
          sourceLanguage: languagePreference.sourceLanguage,
          targetLanguage: languagePreference.targetLanguage,
          timestamp: message.timestamp,
        }),
      });
      // Update streak if it's a user message
      if (message.type === 'user') {
        await updateUserStreak();
      }
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  };
  
  // Load and update user streak from backend
  const loadUserStreak = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/streak', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load streak');
      return data;
    } catch (error) {
      console.error('Error loading streak:', error);
      return null;
    }
  };

  const updateUserStreak = async () => {
    try {
      const streak = await loadUserStreak();
      if (!streak) return;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastPracticeDate = new Date(streak.lastPracticeDate);
      lastPracticeDate.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      let newStreak = streak.currentStreak;
      if (lastPracticeDate.getTime() === today.getTime()) {
        return;
      } else if (lastPracticeDate.getTime() === yesterday.getTime()) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/streak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, streak.longestStreak),
          lastPracticeDate: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };
  
  // Removed the entire updateLanguagePairStats function since it only used supabase
  
  const getWelcomeMessage = (language: Language) => {
    switch (language) {
      case "Hindi":
        return {
          content: "नमस्ते! मैं आपकी हिंदी सीखने में मदद करने के लिए यहाँ हूँ। आप कैसे हैं?",
          vocabularyTips: "नमस्ते (Namaste) - Hello\nकैसे हैं (Kaise hain) - How are you",
          romanization: null
        };
      case "Telugu":
        return {
          content: "నమస్కారం! నేను మీకు తెలుగు నేర్చుకోవడంలో సహాయం చేయడానికి ఇక్కడ ఉన్నాను. మీరు ఎలా ఉన్నారు?",
          vocabularyTips: "నమస్కారం (Namaskaram) - Hello\nఎలా ఉన్నారు (Ela unnaru) - How are you",
          romanization: "Namaskaram! Nenu meeku Telugu nerchukovadamlo sahayam cheyadaniki ikkada unnanu. Meeru ela unnaru?"
        };
      default:
        return {
          content: "Hello! I'm here to help you learn. How are you today?",
          vocabularyTips: "Welcome to your language learning session",
          romanization: null
        };
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Function to convert object to string if needed
  const ensureString = (content: any): string => {
    if (typeof content === 'object') {
      return JSON.stringify(content);
    }
    return String(content || '');
  };
  
  // Always speak AI response
  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = lang;
      utter.rate = 1.05;
      utter.pitch = 1.05;
      window.speechSynthesis.speak(utter);
    }
  };
  
  const translateWithGemini = async (content: string, inputMode: InputMode): Promise<ChatMessage> => {
    if (!languagePreference) {
      throw new Error("Language preference not set");
    }
    
    const { sourceLanguage, targetLanguage } = languagePreference;
    
    let prompt = "";
    if (chatMode === 'translate') {
      prompt = `You are a language teacher helping someone learn ${targetLanguage}. The user speaks ${sourceLanguage} and is learning ${targetLanguage}. Translate the following ${sourceLanguage} text to ${targetLanguage}: \"${content}\"`;
      if (targetLanguage === "Telugu") {
        prompt += `\nPlease provide both the Telugu script and its Romanized version in English.\nPlease respond in the following JSON format only:{\n  \"translation\": \"The translated text in Telugu script\",\n  \"romanization\": \"The romanized/phonetic version in English letters\",\n  \"grammarTip\": \"A brief grammar tip related to this phrase\", \n  \"vocabularyTips\": \"Key vocabulary words and their meanings\"\n}`;
      } else {
        prompt += `\nPlease respond in the following JSON format only:{\n  \"translation\": \"The translated text in ${targetLanguage}\",\n  \"pronunciation\": \"Pronunciation guide if applicable\",\n  \"grammarTip\": \"A brief grammar tip related to this phrase\", \n  \"vocabularyTips\": \"Key vocabulary words and their meanings\"\n}`;
      }
    } else {
      prompt = `You are a friendly, helpful language tutor. The user is learning ${targetLanguage} and speaks ${sourceLanguage}. Respond conversationally and helpfully to the user's message. If appropriate, correct mistakes, give tips, or ask follow-up questions.\nUser: ${content}`;
    }
    
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API error:", errorText);
        throw new Error(`Gemini API error: ${response.status}`);
      }
      
      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      // Extract JSON from response (sometimes Gemini wraps it in markdown)
      const jsonMatch = responseText.match(/```(?:json)?([\s\S]*?)```/) || 
                         responseText.match(/{[\s\S]*}/);
                         
      let parsedResponse;
      
      if (jsonMatch && jsonMatch[1]) {
        try {
          parsedResponse = JSON.parse(jsonMatch[1].trim());
        } catch (e) {
          console.error("Error parsing JSON from response:", e);
          parsedResponse = { translation: responseText };
        }
      } else {
        try {
          parsedResponse = JSON.parse(responseText);
        } catch (e) {
          console.error("Error parsing direct JSON:", e);
          parsedResponse = { translation: responseText };
        }
      }
      
      // Ensure we have a string content - not an object
      const translation = typeof parsedResponse.translation === 'object'
        ? JSON.stringify(parsedResponse.translation)
        : parsedResponse.translation || responseText;
      
      // Get romanization for Telugu
      let romanization = null;
      if (targetLanguage === "Telugu") {
        romanization = parsedResponse.romanization || parsedResponse.pronunciation || null;
      }
      
      // Create chat message from API response
      return {
        id: uuidv4(),
        type: "ai",
        content: translation,
        grammarFeedback: parsedResponse.grammarTip || "",
        vocabularyTips: parsedResponse.vocabularyTips || "",
        romanization: romanization,
        inputMode: inputMode,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw error;
    }
  };
  
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      type: "user",
      content: content.trim(),
      inputMode: isVoiceMode ? 'voice' : 'text',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    // Save user message to history
    if (userEmail) {
      await saveMessageToHistory(userMessage);
    }
    
    try {
      // Call Gemini API for translation/response
      const aiResponse = await translateWithGemini(content, isVoiceMode ? 'voice' : 'text');
      setMessages((prev) => [...prev, aiResponse]);
      
      // Save AI response to history
      if (userEmail) {
        await saveMessageToHistory(aiResponse);
      }
      
      // Read response aloud
      if (languagePreference) {
        const voiceFeedbackEnabled = localStorage.getItem('voiceFeedbackEnabled');
        if (voiceFeedbackEnabled === null || voiceFeedbackEnabled === 'true') {
          speakText(
            ensureString(aiResponse.content),
            languagePreference.targetLanguage === "Hindi" ? "hi-IN" :
            languagePreference.targetLanguage === "Telugu" ? "te-IN" : "en-US"
          );
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Voice input handler
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast({
        title: "Voice input not supported",
        description: "Your browser does not support voice input. Please use Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }
    setIsListening(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = languagePreference?.sourceLanguage === "Hindi" ? "hi-IN" : 
                     languagePreference?.sourceLanguage === "Telugu" ? "te-IN" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.start();
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      if (transcript) {
        handleSendMessage(transcript);
      }
    };
    recognition.onerror = (event: any) => {
      setIsListening(false);
      toast({
        title: "Voice recognition error",
        description: "Could not recognize speech. Please try again or use text input.",
        variant: "destructive",
      });
    };
  };

  if (!languagePreference) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="container max-w-md mx-auto flex-1 flex flex-col h-screen">
        <ChatHeader 
          sourceLanguage={languagePreference.sourceLanguage} 
          targetLanguage={languagePreference.targetLanguage}
        />
        
        <div className="flex flex-col gap-2">
          <div className="flex justify-center mb-2">
            <ToggleGroup type="single" value={chatMode} onValueChange={v => v && setChatMode(v as 'chat' | 'translate')}>
              <ToggleGroupItem value="chat">Chat</ToggleGroupItem>
              <ToggleGroupItem value="translate">Translate</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <ChatBubble 
                key={message.id} 
                message={message} 
                targetLanguage={languagePreference.targetLanguage} 
                sourceLanguage={languagePreference.sourceLanguage}
                chatMode={chatMode}
              />
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-green-100 text-green-800 p-3 rounded-lg flex gap-1 items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            )}
            
            {isSpeaking && (
              <div className="flex justify-center my-2">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                  <span className="animate-pulse mr-2">🔊</span> Speaking...
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t flex flex-col gap-2">
            <ChatInput
              onSendMessage={handleSendMessage}
              onStartVoiceInput={handleVoiceInput}
              isLoading={isLoading || isSpeaking}
              sourceLang={languagePreference?.sourceLanguage}
              isVoiceMode={isVoiceMode}
              onToggleVoiceMode={setIsVoiceMode}
            />
          </div>
        </div>
        
        <AppHeader className="md:hidden" />
      </div>
    </div>
  );
};

export default ChatPage;
