
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types";
import { Info, Volume2, VolumeX, MessageSquare, User, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSpeechCleanup } from "@/hooks/use-mobile";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

interface ChatBubbleProps {
  message: ChatMessage;
  targetLanguage?: string;
  sourceLanguage?: string;
  chatMode?: 'chat' | 'translate';
}

const ChatBubble = ({ message, targetLanguage = "English", sourceLanguage = "English", chatMode = 'chat' }: ChatBubbleProps) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translation, setTranslation] = useState("");
  const [translating, setTranslating] = useState(false);
  
  const isUser = message.type === "user";
  const hasFeedback = !!message.grammarFeedback || !!message.vocabularyTips;
  const hasRomanization = !!message.romanization && targetLanguage === "Telugu";

  // Use the speech cleanup hook
  useSpeechCleanup();

  // Ensure content is always rendered as a string
  const ensureString = (content: any): string => {
    if (typeof content === 'object') {
      return JSON.stringify(content);
    }
    return String(content || '');
  };
    
  // Get message content as string
  const messageContent = ensureString(message.content);
  
  // Format romanization if available
  const romanization = ensureString(message.romanization);

  const handleSpeakMessage = () => {
    if (window.speechSynthesis) {
      if (isSpeaking) {
        // Stop speaking if already in progress
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      
      // Determine language based on message content and target language
      let lang = 'en-US';
      
      if (targetLanguage === "Hindi" || /[\u0900-\u097F]/.test(messageContent)) {
        lang = 'hi-IN'; // Hindi
      } else if (targetLanguage === "Telugu" || /[\u0C00-\u0C7F]/.test(messageContent)) {
        lang = 'te-IN'; // Telugu
      }
      
      const speech = new SpeechSynthesisUtterance(messageContent);
      speech.lang = lang;
      
      // Set event handlers
      speech.onstart = () => setIsSpeaking(true);
      speech.onend = () => setIsSpeaking(false);
      speech.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(speech);
    }
  };

  const handleTranslate = async () => {
    setTranslating(true);
    setShowTranslation(true);
    const prompt = `Translate the following text from ${targetLanguage} to ${sourceLanguage} in a clear, natural way.\nText: ${messageContent}`;
    try {
      const res = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await res.json();
      const translationText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setTranslation(translationText.replace(/\*\*|__|\*|_/g, "").replace(/^#+\s?/gm, ""));
    } catch {
      setTranslation("Translation failed.");
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div
      className={cn(
        "my-3 flex items-end gap-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar for AI messages */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[85%]",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Message bubble */}
        <Card className={cn(
          "p-4 rounded-2xl shadow-lg backdrop-blur-sm border-0",
          isUser 
            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground" 
            : "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground"
        )}>
          <div className="flex items-start gap-2">
            {isUser && (
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3 h-3 text-white" />
              </div>
            )}
            
            <div className="flex-1">
              <p className="whitespace-pre-wrap leading-relaxed">{messageContent}</p>
              
              {/* Show romanization for Telugu responses */}
              {hasRomanization && !isUser && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <p className="text-sm opacity-90">
                    <span className="font-semibold">Pronunciation:</span> {romanization}
                  </p>
                </div>
              )}
              
              {/* Translation button and result */}
              {chatMode === 'chat' && !isUser && !showTranslation && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 bg-white/20 border-white/30 text-white hover:bg-white/30"
                  onClick={handleTranslate}
                  disabled={translating}
                >
                  {translating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                      Translating...
                    </div>
                  ) : (
                    `Translate to ${sourceLanguage}`
                  )}
                </Button>
              )}
              
              {showTranslation && (
                <Card className="mt-3 p-3 bg-white/10 border-white/20">
                  <p className="text-sm">
                    <span className="font-semibold">Translation:</span> {translation}
                  </p>
                </Card>
              )}
            </div>
          </div>
        </Card>
        
        {/* Message metadata */}
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          
          <div className="flex items-center gap-1">
            {/* Voice playback button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSpeakMessage}
              className="h-6 w-6 p-0 hover:bg-primary/10"
              aria-label={isSpeaking ? "Stop speaking" : "Speak text"}
            >
              {isSpeaking ? (
                <VolumeX className="w-3 h-3 text-destructive" />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
            </Button>
            
            {/* Feedback toggle button */}
            {hasFeedback && !isUser && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowFeedback(!showFeedback)}
                      className="h-6 w-6 p-0 hover:bg-primary/10"
                    >
                      <Info className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View feedback</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        
        {/* Feedback section */}
        {showFeedback && hasFeedback && !isUser && (
          <div className="mt-3 space-y-2 w-full">
            {message.grammarFeedback && (
              <Card className="p-3 bg-blue-50/80 border-blue-200/50">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-xs font-semibold text-blue-700 mb-1">Grammar Tip</p>
                    <p className="text-sm text-blue-800">{ensureString(message.grammarFeedback)}</p>
                  </div>
                </div>
              </Card>
            )}
            {message.vocabularyTips && (
              <Card className="p-3 bg-amber-50/80 border-amber-200/50">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-xs font-semibold text-amber-700 mb-1">Vocabulary Tip</p>
                    <p className="text-sm text-amber-800">{ensureString(message.vocabularyTips)}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
      
      {/* Avatar for user messages */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
