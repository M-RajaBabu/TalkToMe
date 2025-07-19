
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types";
import { Info, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const GEMINI_API_KEY = "AIzaSyBgj3wA1VTtYyvWhd43k1CCeF0rsFd7yRE";
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
        "my-2 flex",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className="flex flex-col max-w-[80%]">
        <div className={cn(
          "p-3 rounded-lg",
          isUser 
            ? "bg-blue-100 text-blue-800" // User message (blue)
            : "bg-green-100 text-green-800" // AI message (green)
        )}>
          <p className="whitespace-pre-wrap">{messageContent}</p>
          
          {/* Show romanization for Telugu responses */}
          {hasRomanization && !isUser && (
            <div className="mt-2 pt-2 border-t border-green-200">
              <p className="text-sm">
                <span className="font-semibold">Pronunciation:</span> {romanization}
              </p>
            </div>
          )}
          
          {chatMode === 'chat' && !isUser && !showTranslation && (
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={handleTranslate}
              disabled={translating}
            >
              {translating ? "Translating..." : `Translate to ${sourceLanguage}`}
            </Button>
          )}
          {showTranslation && (
            <div className="bg-white border rounded p-2 text-sm text-gray-700 mt-2">
              <strong>Translation:</strong> {translation}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-muted-foreground">
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            
            <div className="flex items-center gap-2">
              {/* Voice playback button */}
              <button 
                onClick={handleSpeakMessage}
                className="p-1 hover:bg-white/20 rounded-full flex items-center"
                aria-label={isSpeaking ? "Stop speaking" : "Speak text"}
              >
                {isSpeaking ? (
                  <VolumeX className="w-3.5 h-3.5 text-red-500" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>
              
              {/* Feedback toggle button */}
              {hasFeedback && !isUser && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => setShowFeedback(!showFeedback)}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to view feedback</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
        
        {showFeedback && hasFeedback && !isUser && (
          <div className="mt-1 text-sm">
            {message.grammarFeedback && (
              <div className="bg-blue-50 text-blue-800 p-2 rounded-md mb-1">
                <span className="font-semibold">Grammar:</span> {ensureString(message.grammarFeedback)}
              </div>
            )}
            {message.vocabularyTips && (
              <div className="bg-amber-50 text-amber-800 p-2 rounded-md">
                <span className="font-semibold">Vocabulary:</span> {ensureString(message.vocabularyTips)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
