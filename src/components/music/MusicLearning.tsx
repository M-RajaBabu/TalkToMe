import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Music, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Mic,
  MicOff,
  Heart,
  Star,
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  BookOpen,
  Languages,
  Sparkles,
  Zap,
  RefreshCw,
  Send,
  User,
  Bot,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  Users,
  Coffee,
  ShoppingCart,
  Plane,
  Hotel,
  Restaurant,
  GraduationCap,
  Heart as HeartIcon,
  Music2,
  Headphones,
  Radio,
  Disc3,
  ListMusic,
  Search,
  Filter,
  Shuffle,
  Repeat,
  Repeat1
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FadeIn from "@/components/animations/FadeIn";
import { useTranslation } from 'react-i18next';

interface Song {
  id: string;
  title: string;
  artist: string;
  language: string;
  genre: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in seconds
  lyrics: string[];
  translations: string[];
  vocabulary: VocabularyWord[];
  audioUrl?: string;
  isPlaying?: boolean;
  isLiked?: boolean;
  playCount: number;
  rating: number;
  releaseYear: number;
  country: string;
  culturalNotes: string[];
}

interface VocabularyWord {
  word: string;
  translation: string;
  pronunciation: string;
  partOfSpeech: string;
  example: string;
  isLearned?: boolean;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  category: 'learning' | 'cultural' | 'popular' | 'traditional';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface MusicStats {
  totalSongs: number;
  totalPlayTime: number;
  favoriteGenres: string[];
  learnedWords: number;
  streak: number;
  averageRating: number;
}

const MusicLearning = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("songs");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Hindi");
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [stats, setStats] = useState<MusicStats>({
    totalSongs: 45,
    totalPlayTime: 12.5,
    favoriteGenres: ['Bollywood', 'Folk', 'Classical'],
    learnedWords: 234,
    streak: 7,
    averageRating: 4.2
  });
  const [recognition, setRecognition] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setRecognition(new SpeechRecognition());
      }
    } catch (err) {
      console.error("Speech recognition initialization error:", err);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Sample songs data
  const songs: Song[] = [
    {
      id: 'lag-ja-gale',
      title: 'Lag Ja Gale',
      artist: 'Lata Mangeshkar',
      language: 'Hindi',
      genre: 'Bollywood',
      difficulty: 'intermediate',
      duration: 240,
      lyrics: [
        'लग जा गले के फिर ये हंसी रात हो न हो',
        'शायद फिर इस जनम में मुलाकात हो न हो',
        'लग जा गले के फिर ये हंसी रात हो न हो',
        'शायद फिर इस जनम में मुलाकात हो न हो'
      ],
      translations: [
        'Hold me close, for this night of laughter may not come again',
        'Perhaps we may not meet again in this lifetime',
        'Hold me close, for this night of laughter may not come again',
        'Perhaps we may not meet again in this lifetime'
      ],
      vocabulary: [
        {
          word: 'लग जा गले',
          translation: 'Hold me close',
          pronunciation: 'lag ja gale',
          partOfSpeech: 'phrase',
          example: 'लग जा गले के फिर ये हंसी रात'
        },
        {
          word: 'मुलाकात',
          translation: 'Meeting',
          pronunciation: 'mulaakat',
          partOfSpeech: 'noun',
          example: 'शायद फिर इस जनम में मुलाकात हो न हो'
        }
      ],
      playCount: 1250,
      rating: 4.8,
      releaseYear: 1964,
      country: 'India',
      culturalNotes: [
        'Classic Bollywood romantic song',
        'Represents traditional Indian romance',
        'Popular in wedding celebrations'
      ],
      isLiked: true
    },
    {
      id: 'tum-hi-ho',
      title: 'Tum Hi Ho',
      artist: 'Arijit Singh',
      language: 'Hindi',
      genre: 'Bollywood',
      difficulty: 'beginner',
      duration: 280,
      lyrics: [
        'तुम ही हो तुम ही हो',
        'अब तुम ही हो जीने का सहारा',
        'तुम ही हो तुम ही हो',
        'अब तुम ही हो जीने का सहारा'
      ],
      translations: [
        'You are the one, you are the one',
        'Now you are the support of my life',
        'You are the one, you are the one',
        'Now you are the support of my life'
      ],
      vocabulary: [
        {
          word: 'तुम ही हो',
          translation: 'You are the one',
          pronunciation: 'tum hi ho',
          partOfSpeech: 'phrase',
          example: 'तुम ही हो जीने का सहारा'
        },
        {
          word: 'सहारा',
          translation: 'Support',
          pronunciation: 'sahara',
          partOfSpeech: 'noun',
          example: 'जीने का सहारा'
        }
      ],
      playCount: 2100,
      rating: 4.9,
      releaseYear: 2013,
      country: 'India',
      culturalNotes: [
        'Modern Bollywood romantic song',
        'Very popular among youth',
        'Often played at parties and gatherings'
      ],
      isLiked: false
    },
    {
      id: 'chaiyya-chaiyya',
      title: 'Chaiyya Chaiyya',
      artist: 'A.R. Rahman',
      language: 'Hindi',
      genre: 'Bollywood',
      difficulty: 'advanced',
      duration: 320,
      lyrics: [
        'चैय्या चैय्या चैय्या चैय्या',
        'दिल से दिल मिला दे चैय्या',
        'चैय्या चैय्या चैय्या चैय्या',
        'दिल से दिल मिला दे चैय्या'
      ],
      translations: [
        'Chaiyya chaiyya chaiyya chaiyya',
        'Let hearts meet, chaiyya',
        'Chaiyya chaiyya chaiyya chaiyya',
        'Let hearts meet, chaiyya'
      ],
      vocabulary: [
        {
          word: 'चैय्या',
          translation: 'Chaiyya (expression of joy)',
          pronunciation: 'chaiyya',
          partOfSpeech: 'interjection',
          example: 'चैय्या चैय्या चैय्या चैय्या'
        },
        {
          word: 'दिल से दिल',
          translation: 'Heart to heart',
          pronunciation: 'dil se dil',
          partOfSpeech: 'phrase',
          example: 'दिल से दिल मिला दे'
        }
      ],
      playCount: 890,
      rating: 4.7,
      releaseYear: 1998,
      country: 'India',
      culturalNotes: [
        'Iconic Bollywood song from Dil Se',
        'Represents Indian folk music fusion',
        'Popular in dance performances'
      ],
      isLiked: true
    }
  ];

  // Playlists
  const playlists: Playlist[] = [
    {
      id: 'beginner-hindi',
      name: 'Beginner Hindi Songs',
      description: 'Easy songs for Hindi learners',
      songs: songs.filter(s => s.difficulty === 'beginner'),
      category: 'learning',
      difficulty: 'beginner'
    },
    {
      id: 'bollywood-hits',
      name: 'Bollywood Hits',
      description: 'Popular Bollywood songs',
      songs: songs.filter(s => s.genre === 'Bollywood'),
      category: 'popular',
      difficulty: 'intermediate'
    },
    {
      id: 'cultural-songs',
      name: 'Cultural Songs',
      description: 'Traditional and cultural songs',
      songs: songs,
      category: 'cultural',
      difficulty: 'advanced'
    }
  ];

  // Play song with speech synthesis
  const playSong = useCallback((song: Song) => {
    try {
      setCurrentSong(song);
      setIsPlaying(true);
      setCurrentLyricIndex(0);
      
      // Simulate audio playback with speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(song.lyrics[0]);
        utterance.lang = 'hi-IN';
        utterance.rate = 0.8;
        utterance.volume = volume / 100;
        
        utterance.onstart = () => {
          console.log("Playing song:", song.title);
        };
        
        utterance.onend = () => {
          // Move to next lyric
          if (currentLyricIndex < song.lyrics.length - 1) {
            setCurrentLyricIndex(prev => prev + 1);
            // Continue with next lyric
            setTimeout(() => {
              const nextUtterance = new SpeechSynthesisUtterance(song.lyrics[currentLyricIndex + 1]);
              nextUtterance.lang = 'hi-IN';
              nextUtterance.rate = 0.8;
              nextUtterance.volume = volume / 100;
              speechSynthesis.speak(nextUtterance);
            }, 1000);
          } else {
            setIsPlaying(false);
            setCurrentLyricIndex(0);
          }
        };
        
        speechSynthesis.speak(utterance);
      }
      
      toast({
        title: "Now Playing",
        description: `${song.title} by ${song.artist}`,
      });
    } catch (err) {
      console.error("Play song error:", err);
      toast({
        title: "Error",
        description: "Failed to play song. Please try again.",
        variant: "destructive",
      });
    }
  }, [volume, currentLyricIndex, toast]);

  // Pause/Resume song
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      if ('speechSynthesis' in window) {
        speechSynthesis.pause();
      }
      setIsPlaying(false);
    } else {
      if ('speechSynthesis' in window) {
        speechSynthesis.resume();
      }
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Stop song
  const stopSong = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentSong(null);
    setCurrentLyricIndex(0);
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    if ('speechSynthesis' in window) {
      // Note: speechSynthesis doesn't have direct volume control
      // This is simulated for demonstration
    }
  }, [isMuted]);

  // Practice pronunciation
  const practicePronunciation = useCallback((word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.6; // Slower for learning
      utterance.volume = volume / 100;
      
      utterance.onstart = () => {
        toast({
          title: "Speaking Word",
          description: "Listen carefully to the pronunciation",
        });
      };
      
      speechSynthesis.speak(utterance);
    }
  }, [volume, toast]);

  // Start voice recognition for singing
  const startVoiceRecognition = useCallback(() => {
    if (!recognition || !currentSong) {
      toast({
        title: "Voice Recognition Not Available",
        description: "Please check your microphone permissions.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsListening(true);
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'hi-IN';
      
      recognition.onstart = () => {
        toast({
          title: "Sing Along!",
          description: "Sing the lyrics you see on screen",
        });
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        
        // Check accuracy against current lyric
        const currentLyric = currentSong.lyrics[currentLyricIndex];
        const accuracy = calculateAccuracy(transcript.toLowerCase(), currentLyric.toLowerCase());
        
        if (accuracy > 70) {
          toast({
            title: "Excellent Singing! 🎵",
            description: `Your pronunciation was ${accuracy}% accurate!`,
          });
        } else {
          toast({
            title: "Good Try!",
            description: `Accuracy: ${accuracy}%. Keep practicing!`,
            variant: "destructive",
          });
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error("Voice recognition error:", event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } catch (err) {
      console.error("Voice recognition error:", err);
      setIsListening(false);
    }
  }, [recognition, currentSong, currentLyricIndex, toast]);

  // Calculate accuracy
  const calculateAccuracy = useCallback((userInput: string, expected: string): number => {
    try {
      const userWords = userInput.split(' ');
      const expectedWords = expected.split(' ');
      let matches = 0;
      
      userWords.forEach(word => {
        if (expectedWords.includes(word)) {
          matches++;
        }
      });
      
      return Math.round((matches / Math.max(userWords.length, expectedWords.length)) * 100);
    } catch (err) {
      console.error("Accuracy calculation error:", err);
      return 0;
    }
  }, []);

  // Toggle like song
  const toggleLike = useCallback((song: Song) => {
    song.isLiked = !song.isLiked;
    toast({
      title: song.isLiked ? "Added to Favorites" : "Removed from Favorites",
      description: song.isLiked ? "Song added to your favorites" : "Song removed from favorites",
    });
  }, [toast]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card/80 backdrop-blur-sm rounded-full border border-border/50 shadow-lg mb-6">
            <Music className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold gradient-text">Music Learning</h1>
            <Headphones className="w-6 h-6 text-secondary" />
          </div>
          <p className="text-muted-foreground">Learn languages through songs, lyrics, and music</p>
        </div>
      </FadeIn>

      {/* Stats Overview */}
      <FadeIn delay={100}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Songs</CardTitle>
              <Music className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSongs}</div>
              <p className="text-xs text-muted-foreground">Total songs</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Play Time</CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPlayTime}h</div>
              <p className="text-xs text-muted-foreground">Total listening</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Words Learned</CardTitle>
              <BookOpen className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.learnedWords}</div>
              <p className="text-xs text-muted-foreground">Vocabulary mastered</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}/5</div>
              <p className="text-xs text-muted-foreground">Average rating</p>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-card/80 backdrop-blur-sm">
          <TabsTrigger value="songs" className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            Songs
          </TabsTrigger>
          <TabsTrigger value="playlists" className="flex items-center gap-2">
            <ListMusic className="w-4 h-4" />
            Playlists
          </TabsTrigger>
          <TabsTrigger value="player" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Player
          </TabsTrigger>
        </TabsList>

        {/* Songs Tab */}
        <TabsContent value="songs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map((song) => (
              <FadeIn key={song.id}>
                <Card className="modern-card group cursor-pointer hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl">🎵</div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(song);
                          }}
                        >
                          <HeartIcon className={`w-4 h-4 ${song.isLiked ? 'text-red-500 fill-current' : ''}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            playSong(song);
                          }}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{song.title}</CardTitle>
                    <CardDescription>{song.artist} • {song.genre}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Difficulty: {song.difficulty}</span>
                      <span>{Math.floor(song.duration / 60)}:{song.duration % 60}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Sample Lyrics:</h4>
                      <div className="p-2 bg-muted rounded text-sm">
                        {song.lyrics[0]}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-sm">{song.rating}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {song.playCount} plays
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </TabsContent>

        {/* Playlists Tab */}
        <TabsContent value="playlists" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {playlists.map((playlist) => (
              <FadeIn key={playlist.id}>
                <Card className="modern-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{playlist.name}</CardTitle>
                        <CardDescription>{playlist.description}</CardDescription>
                      </div>
                      <Badge variant={playlist.difficulty === 'beginner' ? 'default' : 'secondary'}>
                        {playlist.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Songs ({playlist.songs.length}):</h4>
                      <div className="space-y-1">
                        {playlist.songs.slice(0, 3).map((song, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            • {song.title} - {song.artist}
                          </div>
                        ))}
                        {playlist.songs.length > 3 && (
                          <div className="text-sm text-muted-foreground">
                            +{playlist.songs.length - 3} more songs
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Play Playlist
                    </Button>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </TabsContent>

        {/* Player Tab */}
        <TabsContent value="player" className="space-y-6">
          {currentSong ? (
            <FadeIn>
              <Card className="modern-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{currentSong.title}</CardTitle>
                      <CardDescription>{currentSong.artist} • {currentSong.genre}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={togglePlayPause}
                        size="sm"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        onClick={stopSong}
                        variant="outline"
                        size="sm"
                      >
                        <SkipBack className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Lyrics Display */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Current Lyric:</h4>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-lg mb-2">{currentSong.lyrics[currentLyricIndex]}</p>
                      {showTranslation && (
                        <p className="text-sm text-muted-foreground">
                          {currentSong.translations[currentLyricIndex]}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setShowTranslation(!showTranslation)}
                        variant="outline"
                        size="sm"
                      >
                        {showTranslation ? 'Hide' : 'Show'} Translation
                      </Button>
                      <Button
                        onClick={startVoiceRecognition}
                        disabled={isListening}
                        variant="outline"
                        size="sm"
                      >
                        {isListening ? (
                          <MicOff className="w-4 h-4 animate-pulse" />
                        ) : (
                          <Mic className="w-4 h-4" />
                        )}
                        Sing Along
                      </Button>
                    </div>
                  </div>

                  {/* Vocabulary */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Vocabulary from this song:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentSong.vocabulary.map((word, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{word.word}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => practicePronunciation(word.word)}
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">{word.translation}</p>
                          <p className="text-xs text-muted-foreground">Pronunciation: {word.pronunciation}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cultural Notes */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Cultural Notes:</h4>
                    <div className="space-y-2">
                      {currentSong.culturalNotes.map((note, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {note}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ) : (
            <FadeIn>
              <Card className="modern-card">
                <CardContent className="text-center py-12">
                  <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Song Playing</h3>
                  <p className="text-muted-foreground mb-4">
                    Select a song from the Songs tab to start learning
                  </p>
                  <Button onClick={() => setActiveTab("songs")}>
                    Browse Songs
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicLearning; 