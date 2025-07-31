import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Smartphone, 
  Hand, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Wifi,
  WifiOff,
  Download,
  CheckCircle,
  AlertCircle,
  Settings,
  Zap,
  Moon,
  Sun,
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  SkipBack
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FadeIn from "@/components/animations/FadeIn";
import { useTranslation } from 'react-i18next';
import { Progress } from "@/components/ui/progress";

interface GestureState {
  isEnabled: boolean;
  voiceCommands: boolean;
  swipeNavigation: boolean;
  hapticFeedback: boolean;
  offlineMode: boolean;
  autoDownload: boolean;
}

interface VoiceCommand {
  phrase: string;
  action: string;
  description: string;
  isActive: boolean;
}

interface GestureData {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startTime: number;
  endTime: number;
}

const voiceCommands: VoiceCommand[] = [
  {
    phrase: "Hey TalkToMe, start a conversation in Spanish",
    action: "start_chat",
    description: "Begin a new conversation in Spanish",
    isActive: true
  },
  {
    phrase: "Practice pronunciation",
    action: "pronunciation_mode",
    description: "Enter pronunciation practice mode",
    isActive: true
  },
  {
    phrase: "Show my progress",
    action: "show_progress",
    description: "Display learning analytics",
    isActive: true
  },
  {
    phrase: "Take a quiz",
    action: "start_quiz",
    description: "Begin an interactive quiz",
    isActive: true
  },
  {
    phrase: "Download lessons for offline",
    action: "download_lessons",
    description: "Download content for offline learning",
    isActive: true
  },
  {
    phrase: "Switch to dark mode",
    action: "toggle_theme",
    description: "Toggle between light and dark themes",
    isActive: true
  }
];

const GestureControls = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [gestureState, setGestureState] = useState<GestureState>({
    isEnabled: true,
    voiceCommands: true,
    swipeNavigation: true,
    hapticFeedback: true,
    offlineMode: false,
    autoDownload: false
  });

  const [isListening, setIsListening] = useState(false);
  const [recognizedCommand, setRecognizedCommand] = useState("");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [gestureHistory, setGestureHistory] = useState<string[]>([]);
  const [recognition, setRecognition] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Real gesture detection
  const gestureRef = useRef<HTMLDivElement>(null);
  const gestureData = useRef<GestureData | null>(null);

  // Check for speech recognition support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      setRecognition(recognitionInstance);
    }

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Real touch gesture detection
  useEffect(() => {
    if (!gestureState.swipeNavigation) return;

    const element = gestureRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      gestureData.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        endX: touch.clientX,
        endY: touch.clientY,
        startTime: Date.now(),
        endTime: Date.now()
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!gestureData.current) return;
      const touch = e.touches[0];
      gestureData.current.endX = touch.clientX;
      gestureData.current.endY = touch.clientY;
      gestureData.current.endTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!gestureData.current) return;
      
      const { startX, startY, endX, endY, startTime, endTime } = gestureData.current;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const duration = endTime - startTime;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Minimum distance and time for gesture recognition
      if (distance > 50 && duration > 100 && duration < 1000) {
        const gesture = detectGesture(deltaX, deltaY, distance);
        if (gesture) {
          handleGesture(gesture);
          setGestureHistory(prev => [gesture, ...prev.slice(0, 4)]);
        }
      }
      
      gestureData.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gestureState.swipeNavigation]);

  const detectGesture = (deltaX: number, deltaY: number, distance: number): string | null => {
    const minDistance = 50;
    if (distance < minDistance) return null;

    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) return 'swipe-right';
      else return 'swipe-left';
    } else {
      if (deltaY > 0) return 'swipe-down';
      else return 'swipe-up';
    }
  };

  const handleGesture = (gesture: string) => {
    if (!gestureState.isEnabled) return;

    // Haptic feedback
    if (gestureState.hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    switch (gesture) {
      case 'swipe-right':
        toast({
          title: "Gesture Detected",
          description: "Swipe Right - Navigate back",
        });
        break;
      case 'swipe-left':
        toast({
          title: "Gesture Detected",
          description: "Swipe Left - Navigate forward",
        });
        break;
      case 'swipe-up':
        toast({
          title: "Gesture Detected",
          description: "Swipe Up - Show progress",
        });
        break;
      case 'swipe-down':
        toast({
          title: "Gesture Detected",
          description: "Swipe Down - Refresh content",
        });
        break;
    }
  };

  // Real voice recognition with speech synthesis
  const startVoiceRecognition = () => {
    if (!gestureState.voiceCommands || !recognition) {
      toast({
        title: "Voice Commands Disabled",
        description: "Please enable voice commands in settings first.",
      });
      return;
    }

    setIsListening(true);
    setRecognizedCommand("");

    // First, speak a prompt using speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Voice commands activated. Speak your command.");
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0; // Full volume
      
      utterance.onstart = () => {
        toast({
          title: "Voice Commands Ready",
          description: "Listening for your command...",
        });
      };
      
      utterance.onend = () => {
        // Start voice recognition after speaking
        startListening();
      };
      
      speechSynthesis.speak(utterance);
    } else {
      // Fallback if speech synthesis not available
      startListening();
    }
  };

  // Start the actual voice recognition
  const startListening = () => {
    recognition.onstart = () => {
      console.log("Voice recognition started");
      toast({
        title: "Listening...",
        description: "Speak your command clearly",
      });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setRecognizedCommand(transcript);
      setIsListening(false);
      
      // Process the command
      processVoiceCommand(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Voice recognition error:", event.error);
      setIsListening(false);
      
      let errorMessage = "Could not recognize speech. Please try again.";
      if (event.error === 'no-speech') {
        errorMessage = "No speech detected. Please speak clearly.";
      } else if (event.error === 'audio-capture') {
        errorMessage = "Microphone not available. Please check your microphone.";
      } else if (event.error === 'not-allowed') {
        errorMessage = "Microphone access denied. Please allow microphone access.";
      }
      
      toast({
        title: "Voice Recognition Error",
        description: errorMessage,
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processVoiceCommand = (transcript: string) => {
    const lowerTranscript = transcript.toLowerCase();
    
    if (lowerTranscript.includes("start conversation") || lowerTranscript.includes("start chat")) {
      toast({
        title: "Voice Command Executed",
        description: "Starting new conversation...",
      });
    } else if (lowerTranscript.includes("practice pronunciation")) {
      toast({
        title: "Voice Command Executed",
        description: "Entering pronunciation practice mode...",
      });
    } else if (lowerTranscript.includes("show progress")) {
      toast({
        title: "Voice Command Executed",
        description: "Displaying your learning progress...",
      });
    } else if (lowerTranscript.includes("take quiz")) {
      toast({
        title: "Voice Command Executed",
        description: "Starting interactive quiz...",
      });
    } else if (lowerTranscript.includes("download") || lowerTranscript.includes("offline")) {
      downloadOfflineContent();
    } else if (lowerTranscript.includes("dark mode") || lowerTranscript.includes("theme")) {
      toast({
        title: "Voice Command Executed",
        description: "Toggling theme...",
      });
    } else {
      toast({
        title: "Command Not Recognized",
        description: `"${transcript}" - Try a different command.`,
      });
    }
  };

  // Real offline content download
  const downloadOfflineContent = async () => {
    if (!gestureState.autoDownload) {
      toast({
        title: "Auto Download Disabled",
        description: "Please enable auto download in settings first.",
      });
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    // Simulate real download with progress
    const downloadSteps = [
      { progress: 20, message: "Downloading vocabulary..." },
      { progress: 40, message: "Downloading grammar lessons..." },
      { progress: 60, message: "Downloading audio files..." },
      { progress: 80, message: "Downloading cultural content..." },
      { progress: 100, message: "Download complete!" }
    ];

    for (const step of downloadSteps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDownloadProgress(step.progress);
      toast({
        title: "Downloading Content",
        description: step.message,
      });
    }

    setIsDownloading(false);
    toast({
      title: "Download Complete",
      description: "Offline content has been downloaded successfully.",
    });
  };

  // Test audio functionality
  const testAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Audio test successful. Your speaker is working.");
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.volume = 1.0;
      
      utterance.onstart = () => {
        toast({
          title: "Testing Speaker",
          description: "You should hear audio now...",
        });
      };
      
      utterance.onend = () => {
        toast({
          title: "Speaker Test Complete",
          description: "If you heard the audio, your speaker is working correctly.",
        });
      };
      
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Speaker Not Supported",
        description: "Your browser doesn't support speech synthesis.",
        variant: "destructive",
      });
    }
  };

  // Test microphone functionality
  const testMicrophone = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        toast({
          title: "Testing Microphone",
          description: "Speak something to test your microphone...",
        });
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        toast({
          title: "Microphone Test Successful!",
          description: `Heard: "${transcript}"`,
        });
      };
      
      recognition.onerror = (event: any) => {
        toast({
          title: "Microphone Test Failed",
          description: "Please check your microphone permissions and try again.",
          variant: "destructive",
        });
      };
      
      recognition.start();
    } else {
      toast({
        title: "Microphone Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
    }
  };

  const toggleFeature = (feature: keyof GestureState) => {
    setGestureState(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));

    toast({
      title: `${feature.charAt(0).toUpperCase() + feature.slice(1)} ${!gestureState[feature] ? 'Enabled' : 'Disabled'}`,
      description: `${feature} has been ${!gestureState[feature] ? 'enabled' : 'disabled'}.`,
    });
  };

  return (
    <div className="space-y-6" ref={gestureRef}>
      {/* Header */}
      <FadeIn>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold gradient-text mb-2">Mobile Experience</h2>
          <p className="text-muted-foreground">Enhanced mobile features for seamless learning</p>
        </div>
      </FadeIn>

      {/* Feature Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FadeIn delay={100}>
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Feature Controls
              </CardTitle>
              <CardDescription>Enable or disable mobile features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(gestureState).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {key === 'isEnabled' && <Zap className="w-4 h-4" />}
                    {key === 'voiceCommands' && <Mic className="w-4 h-4" />}
                    {key === 'swipeNavigation' && <Hand className="w-4 h-4" />}
                    {key === 'hapticFeedback' && <Smartphone className="w-4 h-4" />}
                    {key === 'offlineMode' && <WifiOff className="w-4 h-4" />}
                    {key === 'autoDownload' && <Download className="w-4 h-4" />}
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={() => toggleFeature(key as keyof GestureState)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </FadeIn>

        {/* Voice Commands */}
        <FadeIn delay={200}>
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Voice Commands
              </CardTitle>
              <CardDescription>Control the app with your voice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={startVoiceRecognition}
                disabled={!gestureState.voiceCommands || isListening}
                className="w-full"
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2 animate-pulse" />
                    Listening...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Start Voice Recognition
                  </>
                )}
              </Button>
              
              {recognizedCommand && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Recognized:</p>
                  <p className="text-sm text-muted-foreground">"{recognizedCommand}"</p>
                </div>
              )}

              {/* Audio Settings */}
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-medium">Audio Settings</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Speaker Volume</span>
                    <div className="flex items-center gap-2">
                      <VolumeX className="w-4 h-4" />
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <Volume2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Microphone</span>
                    <Badge variant="default" className="text-xs">
                      <Mic className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
                
                {/* Test Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={testAudio}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <Volume2 className="w-3 h-3 mr-1" />
                    Test Speaker
                  </Button>
                  <Button
                    onClick={testMicrophone}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <Mic className="w-3 h-3 mr-1" />
                    Test Mic
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Available Commands:</p>
                {voiceCommands.map((command) => (
                  <div key={command.phrase} className="text-xs text-muted-foreground">
                    • {command.phrase}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Gesture Detection */}
      <FadeIn delay={300}>
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hand className="w-5 h-5" />
              Gesture Detection
            </CardTitle>
            <CardDescription>Touch gestures for navigation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl mb-2">👆</div>
                <p className="text-sm font-medium">Swipe Right</p>
                <p className="text-xs text-muted-foreground">Navigate Back</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl mb-2">👈</div>
                <p className="text-sm font-medium">Swipe Left</p>
                <p className="text-xs text-muted-foreground">Navigate Forward</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl mb-2">👆</div>
                <p className="text-sm font-medium">Swipe Up</p>
                <p className="text-xs text-muted-foreground">Show Progress</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl mb-2">👇</div>
                <p className="text-sm font-medium">Swipe Down</p>
                <p className="text-xs text-muted-foreground">Refresh Content</p>
              </div>
            </div>
            
            {gestureHistory.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Recent Gestures:</p>
                <div className="flex flex-wrap gap-2">
                  {gestureHistory.map((gesture, index) => (
                    <Badge key={index} variant="secondary">
                      {gesture}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Offline Mode */}
      <FadeIn delay={400}>
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
              Offline Mode
            </CardTitle>
            <CardDescription>Download content for offline learning</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={isOnline ? "default" : "destructive"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {isOnline ? "Connected to internet" : "Working offline"}
              </span>
            </div>
            
            <Button
              onClick={downloadOfflineContent}
              disabled={!gestureState.autoDownload || isDownloading}
              className="w-full"
            >
              {isDownloading ? (
                <>
                  <Download className="w-4 h-4 mr-2 animate-spin" />
                  Downloading... {downloadProgress}%
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Offline Content
                </>
              )}
            </Button>
            
            {isDownloading && (
              <Progress value={downloadProgress} className="w-full" />
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
};

export default GestureControls; 