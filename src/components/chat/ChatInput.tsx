
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Language } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStartVoiceInput?: () => void;
  isLoading?: boolean;
  sourceLang?: Language;
  isVoiceMode?: boolean;
  onToggleVoiceMode?: (isVoice: boolean) => void;
}

const ChatInput = ({ 
  onSendMessage, 
  onStartVoiceInput,
  isLoading = false,
  sourceLang = "English",
  isVoiceMode = false,
  onToggleVoiceMode
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };
  
  const handleVoiceInput = () => {
    if (isListening) {
      // If already listening, stop recording
      setIsListening(false);
      // Stop any ongoing speech recognition
      if ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) {
        window.speechSynthesis.cancel();
      }
    } else {
      // If not listening, start recording
      setIsListening(true);
      if (onStartVoiceInput) {
        onStartVoiceInput();
      }
    }
  };
  
  // Reset listening state when loading is done
  useEffect(() => {
    if (!isLoading && isListening) {
      setIsListening(false);
    }
  }, [isLoading]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Switch 
            id="voice-mode" 
            checked={isVoiceMode} 
            onCheckedChange={onToggleVoiceMode}
            disabled={isLoading}
          />
          <Label htmlFor="voice-mode">
            {isVoiceMode ? "Voice Mode" : "Text Mode"}
          </Label>
        </div>
        
        {isVoiceMode && (
          <span className="text-xs text-muted-foreground">
            Tap microphone to speak in {sourceLang}
          </span>
        )}
      </div>
      
      {!isVoiceMode ? (
        <div className="flex items-end gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Type in ${sourceLang}...`}
            className={cn(
              "flex-1 min-h-[80px] max-h-[150px] resize-none",
              isLoading && "opacity-70"
            )}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || isLoading}
            className={cn(
              "rounded-full h-10 w-10",
              isLoading && "opacity-70"
            )}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button
            type="button" 
            size="lg"
            variant={isListening ? "destructive" : "default"}
            disabled={isLoading}
            onClick={handleVoiceInput}
            className={cn(
              "rounded-full h-16 w-16 transition-all flex items-center justify-center",
              isListening && "animate-pulse",
              isLoading && "opacity-70"
            )}
          >
            {isListening ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>
        </div>
      )}
      
      {/* Display browser compatibility warning if speech recognition not available */}
      {isVoiceMode && !((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) && (
        <div className="text-xs text-center text-destructive mt-2">
          Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.
        </div>
      )}
    </form>
  );
};

export default ChatInput;
