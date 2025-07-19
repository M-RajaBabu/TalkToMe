
import React from "react";
import { cn } from "@/lib/utils";

interface SlideUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const SlideUp: React.FC<SlideUpProps> = ({ 
  children, 
  delay = 0, 
  className 
}) => {
  return (
    <div 
      className={cn("animate-slide-up", className)}
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'both' 
      }}
    >
      {children}
    </div>
  );
};

export default SlideUp;
