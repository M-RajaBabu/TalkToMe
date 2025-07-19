
import { cn } from "@/lib/utils";
import { Language } from "@/types";

interface LanguageCardProps {
  language: Language;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const languageEmoji = {
  "Hindi": "🇮🇳",
  "Telugu": "🇮🇳",
  "English": "🇺🇸"
};

const LanguageCard = ({ 
  language, 
  selected = false, 
  onClick,
  className
}: LanguageCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "language-card p-6 cursor-pointer text-center",
        selected ? "ring-2 ring-primary bg-primary-100" : "",
        className
      )}
    >
      <div className="text-4xl mb-2">
        {languageEmoji[language]}
      </div>
      <h3 className="text-lg font-medium">{language}</h3>
      {selected && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default LanguageCard;
