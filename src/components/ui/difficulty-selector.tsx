
import { cn } from "@/lib/utils";
import { DifficultyLevel } from "@/types";

interface DifficultySelectorProps {
  value: DifficultyLevel;
  onChange: (value: DifficultyLevel) => void;
  className?: string;
}

const difficultyOptions: DifficultyLevel[] = ["Beginner", "Intermediate", "Advanced"];

const DifficultySelector = ({ value, onChange, className }: DifficultySelectorProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="text-sm font-medium text-muted-foreground">Difficulty Level</label>
      <div className="flex gap-3">
        {difficultyOptions.map((level) => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={cn(
              "px-4 py-2 rounded-full text-sm transition-all",
              value === level
                ? "bg-primary text-white"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
