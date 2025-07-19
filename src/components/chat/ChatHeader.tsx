
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Language } from "@/types";
import { ChevronLeft, MoreHorizontal, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ChatHeaderProps {
  sourceLanguage: Language;
  targetLanguage: Language;
  className?: string;
}

const ChatHeader = ({ 
  sourceLanguage, 
  targetLanguage,
  className 
}: ChatHeaderProps) => {
  return (
    <div className={cn("flex items-center justify-between py-3 border-b", className)}>
      <div className="flex items-center gap-2">
        <Button 
          asChild 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
        >
          <Link to="/language-selection">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        
        <div className="flex items-center">
          <span className="font-medium">{sourceLanguage}</span>
          <span className="mx-2 text-muted-foreground">→</span>
          <span className="font-medium">{targetLanguage}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Volume2 className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
