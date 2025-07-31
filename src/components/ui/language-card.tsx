
import { cn } from "@/lib/utils";
import { Language } from "@/types";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LanguageCardProps {
  language: Language;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'source' | 'target';
}

const languageData = {
  "Hindi": { 
    emoji: "🇮🇳", 
    nativeName: "हिन्दी", 
    nativeDescription: "भारत की राष्ट्रीय भाषा",
    color: "from-orange-400 to-red-500",
    bgColor: "from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50",
    borderColor: "border-orange-200 dark:border-orange-800",
    shadowColor: "shadow-orange-200 dark:shadow-orange-800",
    glowColor: "shadow-orange-400 dark:shadow-orange-600"
  },
  "Telugu": { 
    emoji: "🇮🇳", 
    nativeName: "తెలుగు", 
    nativeDescription: "ఆంధ్రప్రదేశ్ భాష",
    color: "from-green-400 to-blue-500",
    bgColor: "from-green-50 to-blue-50 dark:from-green-950/50 dark:to-blue-950/50",
    borderColor: "border-green-200 dark:border-green-800",
    shadowColor: "shadow-green-200 dark:shadow-green-800",
    glowColor: "shadow-green-400 dark:shadow-green-600"
  },
  "Kannada": { 
    emoji: "🇮🇳", 
    nativeName: "ಕನ್ನಡ", 
    nativeDescription: "ಕರ್ನಾಟಕದ ಭಾಷೆ",
    color: "from-yellow-400 to-red-500",
    bgColor: "from-yellow-50 to-red-50 dark:from-yellow-950/50 dark:to-red-950/50",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    shadowColor: "shadow-yellow-200 dark:shadow-yellow-800",
    glowColor: "shadow-yellow-400 dark:shadow-yellow-600"
  },
  "Tamil": { 
    emoji: "🇮🇳", 
    nativeName: "தமிழ்", 
    nativeDescription: "தமிழ்நாட்டின் மொழி",
    color: "from-red-400 to-orange-500",
    bgColor: "from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50",
    borderColor: "border-red-200 dark:border-red-800",
    shadowColor: "shadow-red-200 dark:shadow-red-800",
    glowColor: "shadow-red-400 dark:shadow-red-600"
  },
  "English": { 
    emoji: "🇺🇸", 
    nativeName: "English", 
    nativeDescription: "Global Language",
    color: "from-blue-400 to-purple-500",
    bgColor: "from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50",
    borderColor: "border-blue-200 dark:border-blue-800",
    shadowColor: "shadow-blue-200 dark:shadow-blue-800",
    glowColor: "shadow-blue-400 dark:shadow-blue-600"
  },
  "Spanish": { 
    emoji: "🇪🇸", 
    nativeName: "Español", 
    nativeDescription: "Lengua romance",
    color: "from-red-400 to-yellow-500",
    bgColor: "from-red-50 to-yellow-50 dark:from-red-950/50 dark:to-yellow-950/50",
    borderColor: "border-red-200 dark:border-red-800",
    shadowColor: "shadow-red-200 dark:shadow-red-800",
    glowColor: "shadow-red-400 dark:shadow-red-600"
  },
  "French": { 
    emoji: "🇫🇷", 
    nativeName: "Français", 
    nativeDescription: "Langue romane",
    color: "from-blue-400 to-red-500",
    bgColor: "from-blue-50 to-red-50 dark:from-blue-950/50 dark:to-red-950/50",
    borderColor: "border-blue-200 dark:border-blue-800",
    shadowColor: "shadow-blue-200 dark:shadow-blue-800",
    glowColor: "shadow-blue-400 dark:shadow-blue-600"
  },
  "German": { 
    emoji: "🇩🇪", 
    nativeName: "Deutsch", 
    nativeDescription: "Germanische Sprache",
    color: "from-yellow-400 to-red-500",
    bgColor: "from-yellow-50 to-red-50 dark:from-yellow-950/50 dark:to-red-950/50",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    shadowColor: "shadow-yellow-200 dark:shadow-yellow-800",
    glowColor: "shadow-yellow-400 dark:shadow-yellow-600"
  },
  "Chinese": { 
    emoji: "🇨🇳", 
    nativeName: "中文", 
    nativeDescription: "汉语言",
    color: "from-red-400 to-yellow-500",
    bgColor: "from-red-50 to-yellow-50 dark:from-red-950/50 dark:to-yellow-950/50",
    borderColor: "border-red-200 dark:border-red-800",
    shadowColor: "shadow-red-200 dark:shadow-red-800",
    glowColor: "shadow-red-400 dark:shadow-red-600"
  },
  "Japanese": { 
    emoji: "🇯🇵", 
    nativeName: "日本語", 
    nativeDescription: "日本の言語",
    color: "from-red-400 to-white",
    bgColor: "from-red-50 to-white dark:from-red-950/50 dark:to-gray-950/50",
    borderColor: "border-red-200 dark:border-red-800",
    shadowColor: "shadow-red-200 dark:shadow-red-800",
    glowColor: "shadow-red-400 dark:shadow-red-600"
  },
  "Russian": { 
    emoji: "🇷🇺", 
    nativeName: "Русский", 
    nativeDescription: "Славянский язык",
    color: "from-blue-400 to-red-500",
    bgColor: "from-blue-50 to-red-50 dark:from-blue-950/50 dark:to-red-950/50",
    borderColor: "border-blue-200 dark:border-blue-800",
    shadowColor: "shadow-blue-200 dark:shadow-blue-800",
    glowColor: "shadow-blue-400 dark:shadow-blue-600"
  },
  "Arabic": { 
    emoji: "🇸🇦", 
    nativeName: "العربية", 
    nativeDescription: "لغة سامية",
    color: "from-green-400 to-black",
    bgColor: "from-green-50 to-gray-50 dark:from-green-950/50 dark:to-gray-950/50",
    borderColor: "border-green-200 dark:border-green-800",
    shadowColor: "shadow-green-200 dark:shadow-green-800",
    glowColor: "shadow-green-400 dark:shadow-green-600"
  },
  "Portuguese": { 
    emoji: "🇵🇹", 
    nativeName: "Português", 
    nativeDescription: "Língua românica",
    color: "from-green-400 to-red-500",
    bgColor: "from-green-50 to-red-50 dark:from-green-950/50 dark:to-red-950/50",
    borderColor: "border-green-200 dark:border-green-800",
    shadowColor: "shadow-green-200 dark:shadow-green-800",
    glowColor: "shadow-green-400 dark:shadow-green-600"
  },
  "Italian": { 
    emoji: "🇮🇹", 
    nativeName: "Italiano", 
    nativeDescription: "Lingua romanza",
    color: "from-green-400 to-red-500",
    bgColor: "from-green-50 to-red-50 dark:from-green-950/50 dark:to-red-950/50",
    borderColor: "border-green-200 dark:border-green-800",
    shadowColor: "shadow-green-200 dark:shadow-green-800",
    glowColor: "shadow-green-400 dark:shadow-green-600"
  },
  "Korean": { 
    emoji: "🇰🇷", 
    nativeName: "한국어", 
    nativeDescription: "한반도 언어",
    color: "from-blue-400 to-red-500",
    bgColor: "from-blue-50 to-red-50 dark:from-blue-950/50 dark:to-red-950/50",
    borderColor: "border-blue-200 dark:border-blue-800",
    shadowColor: "shadow-blue-200 dark:shadow-blue-800",
    glowColor: "shadow-blue-400 dark:shadow-blue-600"
  }
};

const LanguageCard = ({ 
  language, 
  selected = false, 
  onClick,
  className,
  disabled = false,
  type = 'source'
}: LanguageCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Get language data with fallback
  const data = languageData[language] || {
    emoji: "🌐",
    nativeName: language,
    nativeDescription: `${language} language`,
    color: "from-gray-400 to-gray-500",
    bgColor: "from-gray-50 to-gray-100 dark:from-gray-950/50 dark:to-gray-900/50",
    borderColor: "border-gray-200 dark:border-gray-800",
    shadowColor: "shadow-gray-200 dark:shadow-gray-800",
    glowColor: "shadow-gray-400 dark:shadow-gray-600"
  };
  
  console.log(`LanguageCard: ${language}`, data); // Debug log
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={disabled ? undefined : onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
      className={cn(
              "relative group cursor-pointer transition-all duration-500 ease-out",
              "rounded-2xl p-4 border-2 backdrop-blur-sm",
              "transform hover:scale-105 active:scale-95",
              "overflow-hidden",
              selected 
                ? `bg-gradient-to-br ${data.color} text-white border-transparent shadow-lg` 
                : `bg-gradient-to-br ${data.bgColor} hover:shadow-lg`,
              disabled && "opacity-50 pointer-events-none grayscale",
              isPressed && "scale-95",
        className
      )}
            style={{
              borderColor: selected ? 'transparent' : undefined,
              boxShadow: selected ? `0 0 20px ${data.glowColor.replace('shadow-', '').replace('dark:shadow-', '')}` : undefined
            }}
          >
            {/* Animated background gradient */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
              selected ? "opacity-100" : "group-hover:opacity-20",
              data.color
            )} />
            
            {/* Floating particles effect */}
            {selected && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-ping opacity-75" />
                <div className="absolute top-4 right-3 w-0.5 h-0.5 bg-white rounded-full animate-ping opacity-50" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-white rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }} />
      </div>
            )}
            
            {/* Selection indicator */}
      {selected && (
              <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse" />
              </div>
            )}
            
            {/* Type indicator */}
            {type && (
              <div className={cn(
                "absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium",
                type === 'source' 
                  ? "bg-blue-500 text-white" 
                  : "bg-green-500 text-white"
              )}>
                {type === 'source' ? 'From' : 'To'}
              </div>
            )}
            
            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Flag emoji with animation */}
              <div className={cn(
                "text-4xl mb-3 transition-transform duration-300",
                isHovered && "scale-110",
                selected && "animate-bounce"
              )}>
                {data.emoji}
              </div>
              
              {/* Language name with hover effect */}
              <div className="relative h-6 mb-1 overflow-hidden">
                {/* Native name (default) */}
                <h3 className={cn(
                  "text-lg font-bold transition-all duration-300 absolute inset-0 flex items-center justify-center",
                  selected ? "text-white" : "text-foreground dark:text-foreground",
                  isHovered ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
                )}>
                  {data.nativeName}
                </h3>
                
                {/* English name (on hover) */}
                <h3 className={cn(
                  "text-lg font-bold transition-all duration-300 absolute inset-0 flex items-center justify-center",
                  selected ? "text-white" : "text-foreground dark:text-foreground",
                  isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                )}>
                  {language}
                </h3>
                
                {/* Hover indicator */}
                {!selected && (
                  <div className={cn(
                    "absolute top-0 right-0 w-2 h-2 bg-current opacity-0 transition-opacity duration-300 rounded-full",
                    isHovered ? "opacity-30" : "opacity-0"
                  )} />
                )}
              </div>
              
              {/* Native description */}
              <p className={cn(
                "text-xs transition-colors duration-300 leading-tight",
                selected ? "text-white/60" : "text-muted-foreground/70 dark:text-muted-foreground/70"
              )}>
                {data.nativeDescription}
              </p>
            </div>
            
            {/* Hover effect overlay */}
            {!selected && (
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 rounded-2xl",
                "group-hover:opacity-10",
                data.color
              )} />
            )}
            
            {/* Ripple effect on click */}
            {isPressed && (
              <div className={cn(
                "absolute inset-0 bg-white opacity-30 rounded-2xl animate-ping"
              )} />
      )}
    </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Hover to see English name</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LanguageCard;
