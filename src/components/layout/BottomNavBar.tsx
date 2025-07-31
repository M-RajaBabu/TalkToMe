import { Link, useLocation } from 'react-router-dom';
import { User, BarChart2, Settings, MessageSquare, BookOpen, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';

const BottomNavBar = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const navItems = [
    { to: '/chat', icon: <MessageSquare className="h-5 w-5" />, label: 'Chat' },
    { to: '/chapters', icon: <BookOpen className="h-5 w-5" />, label: 'Chapters' },
    { to: '/profile', icon: <User className="h-5 w-5" />, label: 'Profile' },
    { to: '/progress', icon: <BarChart2 className="h-5 w-5" />, label: 'Progress' },
    { to: '/settings', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  ];

  // Auto-hide logic for left side
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      const windowWidth = window.innerWidth;
      const mouseX = e.clientX;
      const threshold = 120; // Show when mouse is within 120px of left edge

      if (mouseX < threshold) {
        setIsVisible(true);
        setIsHovering(true);
        clearTimeout(timeoutId);
      } else {
        setIsHovering(false);
        timeoutId = setTimeout(() => {
          if (!isHovering) {
            setIsVisible(false);
          }
        }, 2500); // Hide after 2.5 seconds of no hover
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 2500);
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeoutId);
    };
  }, [isHovering]);

  return (
    <>
      {/* Hover Zone Indicator */}
      {!isVisible && (
        <div className="fixed left-0 top-0 h-full w-8 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none z-40">
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-2 text-primary/60">
            <div className="w-1 h-1 bg-primary rounded-full footer-indicator"></div>
            <Menu className="w-4 h-4" />
            <div className="w-1 h-1 bg-primary rounded-full footer-indicator" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
      )}
      
      {/* Main Navigation Bar - Now on the left side */}
      <div 
        className={`fixed left-0 top-0 h-full bg-background/95 backdrop-blur-md border-r border-border/50 shadow-lg z-50 sidebar-slide ${
          isVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setTimeout(() => {
            if (!isHovering) {
              setIsVisible(false);
            }
          }, 2500);
        }}
      >
        <div className="flex flex-col justify-center items-center h-full py-8 px-4 space-y-6">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 group ${
                location.pathname === item.to 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              <div className="relative">
                {item.icon}
                {location.pathname === item.to && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                )}
              </div>
              <span className="text-xs font-medium text-center">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default BottomNavBar;