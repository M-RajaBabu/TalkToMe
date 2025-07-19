
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { cn } from "@/lib/utils";
import { History, MessageCircle, Settings, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface AppHeaderProps {
  className?: string;
}

const AppHeader = ({ className }: AppHeaderProps) => {
  const location = useLocation();
  
  const navigation = [
    { name: "Chat", href: "/chat", icon: MessageCircle },
    { name: "Progress", href: "/progress", icon: History },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 z-50 bg-background border-t", className)}>
      <div className="container max-w-md mx-auto">
        <nav className="flex justify-around py-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Button
                key={item.name}
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center gap-1 h-auto py-2",
                  isActive && "text-primary"
                )}
              >
                <Link to={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs">{item.name}</span>
                  {isActive && (
                    <div className="absolute -bottom-2 h-1 w-5 bg-primary rounded-full" />
                  )}
                </Link>
              </Button>
            );
          })}
          
        </nav>
      </div>
    </div>
  );
};

export default AppHeader;
