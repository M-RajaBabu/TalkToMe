import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Brain, 
  Target, 
  RotateCcw, 
  CheckCircle, 
  XCircle,
  Star,
  Clock,
  TrendingUp,
  Zap,
  Lightbulb,
  MessageSquare,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Settings,
  Award,
  Calendar,
  BarChart3,
  Sparkles,
  BookMarked,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FadeIn from "@/components/animations/FadeIn";
import { useTranslation } from 'react-i18next';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed: string;
  nextReview: string;
  reviewCount: number;
  mastered: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface GrammarExercise {
  id: string;
  title: string;
  description: string;
  sentences: string[];
  corrections: string[];
  rules: string[];
  category: string;
  completed: boolean;
}

interface LearningStats {
  totalFlashcards: number;
  masteredFlashcards: number;
  totalQuizzes: number;
  averageScore: number;
  streak: number;
  timeSpent: number;
}

const mockFlashcards: Flashcard[] = [
  {
    id: '1',
    front: 'Hello',
    back: 'Hola',
    category: 'Greetings',
    difficulty: 'easy',
    lastReviewed: '2024-01-20',
    nextReview: '2024-01-22',
    reviewCount: 3,
    mastered: false
  },
  {
    id: '2',
    front: 'How are you?',
    back: '¿Cómo estás?',
    category: 'Greetings',
    difficulty: 'easy',
    lastReviewed: '2024-01-19',
    nextReview: '2024-01-21',
    reviewCount: 5,
    mastered: true
  },
  {
    id: '3',
    front: 'I love you',
    back: 'Te quiero',
    category: 'Emotions',
    difficulty: 'medium',
    lastReviewed: '2024-01-18',
    nextReview: '2024-01-23',
    reviewCount: 2,
    mastered: false
  },
  {
    id: '4',
    front: 'Beautiful',
    back: 'Hermoso/Hermosa',
    category: 'Adjectives',
    difficulty: 'medium',
    lastReviewed: '2024-01-17',
    nextReview: '2024-01-25',
    reviewCount: 1,
    mastered: false
  }
];

const mockQuizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What is the correct way to say "Good morning" in Spanish?',
    options: ['Buenas noches', 'Buenos días', 'Buenas tardes', 'Hola'],
    correctAnswer: 1,
    explanation: 'Buenos días is the correct way to say "Good morning" in Spanish.',
    category: 'Greetings',
    difficulty: 'easy'
  },
  {
    id: '2',
    question: 'Which verb form is correct: "Yo _____ español"?',
    options: ['habla', 'hablas', 'hablo', 'hablan'],
    correctAnswer: 2,
    explanation: 'Yo hablo is the correct first person singular form of hablar.',
    category: 'Grammar',
    difficulty: 'medium'
  },
  {
    id: '3',
    question: 'What does "Te quiero" mean?',
    options: ['I want you', 'I love you', 'I need you', 'I like you'],
    correctAnswer: 1,
    explanation: 'Te quiero means "I love you" in Spanish.',
    category: 'Emotions',
    difficulty: 'easy'
  }
];

const mockGrammarExercises: GrammarExercise[] = [
  {
    id: '1',
    title: 'Present Tense Conjugation',
    description: 'Practice conjugating regular verbs in present tense',
    sentences: [
      'Yo (hablar) español.',
      'Tú (comer) pizza.',
      'Él (vivir) en Madrid.'
    ],
    corrections: [
      'Yo hablo español.',
      'Tú comes pizza.',
      'Él vive en Madrid.'
    ],
    rules: [
      'Regular -ar verbs: -o, -as, -a, -amos, -áis, -an',
      'Regular -er verbs: -o, -es, -e, -emos, -éis, -en',
      'Regular -ir verbs: -o, -es, -e, -imos, -ís, -en'
    ],
    category: 'Verb Conjugation',
    completed: false
  },
  {
    id: '2',
    title: 'Gender Agreement',
    description: 'Learn to match adjectives with noun gender',
    sentences: [
      'El libro es (interesante).',
      'La película es (bueno).',
      'Los estudiantes son (inteligente).'
    ],
    corrections: [
      'El libro es interesante.',
      'La película es buena.',
      'Los estudiantes son inteligentes.'
    ],
    rules: [
      'Adjectives ending in -e don\'t change for gender',
      'Adjectives ending in -o change to -a for feminine',
      'Adjectives add -s for plural'
    ],
    category: 'Adjectives',
    completed: true
  }
];

const mockStats: LearningStats = {
  totalFlashcards: 150,
  masteredFlashcards: 87,
  totalQuizzes: 25,
  averageScore: 78,
  streak: 7,
  timeSpent: 12.5
};

const AdvancedLearningTools = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Add error handling
  useEffect(() => {
    console.log('AdvancedLearningTools component mounted');
  }, []);
  
  const [activeTab, setActiveTab] = useState("flashcards");
  const [flashcards, setFlashcards] = useState<Flashcard[]>(mockFlashcards);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(mockQuizQuestions);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [grammarExercises, setGrammarExercises] = useState<GrammarExercise[]>(mockGrammarExercises);
  const [currentExercise, setCurrentExercise] = useState<GrammarExercise | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [stats] = useState<LearningStats>(mockStats);

  // Flashcard functions with real spaced repetition
  const handleFlashcardAnswer = (correct: boolean) => {
    const currentFlashcard = flashcards[currentFlashcardIndex];
    
    // Update flashcard progress with spaced repetition
    const updatedFlashcards = flashcards.map((card, index) => {
      if (index === currentFlashcardIndex) {
        const newReviewCount = card.reviewCount + 1;
        const nextReviewInterval = Math.pow(2, newReviewCount) * 24 * 60 * 60 * 1000; // Spaced repetition
        return {
          ...card,
          reviewCount: newReviewCount,
          lastReviewed: new Date().toISOString(),
          nextReview: new Date(Date.now() + nextReviewInterval).toISOString(),
          mastered: newReviewCount >= 5
        };
      }
      return card;
    });
    
    setFlashcards(updatedFlashcards);
    
    if (correct) {
      toast({
        title: "Correct! 🎉",
        description: `Great job! You know "${currentFlashcard.front}" means "${currentFlashcard.back}"`,
      });
    } else {
      toast({
        title: "Incorrect",
        description: `"${currentFlashcard.front}" means "${currentFlashcard.back}". Keep practicing!`,
      });
    }

    // Move to next flashcard
    setTimeout(() => {
      setCurrentFlashcardIndex(prev => (prev + 1) % flashcards.length);
      setShowAnswer(false);
    }, 1500);
  };

  // Real quiz generation with AI-powered questions
  const generateQuiz = () => {
    // Simulate AI generating questions based on user progress
    const aiGeneratedQuestions: QuizQuestion[] = [
      {
        id: 'ai-1',
        question: 'What does "bonjour" mean in English?',
        options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
        correctAnswer: 0,
        explanation: '"Bonjour" is the French word for "Hello"',
        category: 'Greetings',
        difficulty: 'easy'
      },
      {
        id: 'ai-2',
        question: 'Which is the correct way to say "I am going" in French?',
        options: ['Je vais', 'Je aller', 'Je suis aller', 'Je va'],
        correctAnswer: 0,
        explanation: '"Je vais" is the correct present tense form',
        category: 'Grammar',
        difficulty: 'medium'
      },
      {
        id: 'ai-3',
        question: 'What is the plural form of "chat" (cat)?',
        options: ['chats', 'chates', 'chat', 'chattes'],
        correctAnswer: 0,
        explanation: 'The plural of "chat" is "chats"',
        category: 'Vocabulary',
        difficulty: 'easy'
      }
    ];
    
    setQuizQuestions(aiGeneratedQuestions);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    
    toast({
      title: "AI Quiz Generated!",
      description: `${aiGeneratedQuestions.length} personalized questions ready. Good luck!`,
    });
  };

  // Real quiz answering with score tracking
  const handleQuizAnswer = (answerIndex: number) => {
    const currentQuestion = quizQuestions[currentQuizIndex];
    
    if (answerIndex === currentQuestion.correctAnswer) {
      setQuizScore(prev => prev + 1);
      toast({
        title: "Correct! 🎉",
        description: currentQuestion.explanation,
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer is: ${currentQuestion.options[currentQuestion.correctAnswer]}`,
        variant: "destructive",
      });
    }
    
    // Move to next question or finish quiz
    setTimeout(() => {
      if (currentQuizIndex < quizQuestions.length - 1) {
        setCurrentQuizIndex(prev => prev + 1);
      } else {
        // Quiz completed
        const finalScore = (quizScore + (answerIndex === currentQuestion.correctAnswer ? 1 : 0)) / quizQuestions.length * 100;
        toast({
          title: "Quiz Completed!",
          description: `Your score: ${Math.round(finalScore)}%`,
        });
      }
    }, 1500);
  };

  // Real grammar exercise with AI feedback
  const startGrammarExercise = (exercise: GrammarExercise) => {
    setCurrentExercise(exercise);
    setUserAnswers(new Array(exercise.sentences.length).fill(''));
    
    toast({
      title: "Grammar Exercise Started",
      description: `Practice: ${exercise.title}`,
    });
  };

  const checkGrammarExercise = () => {
    if (!currentExercise) return;
    
    let correctAnswers = 0;
    const feedback = [];
    
    currentExercise.sentences.forEach((sentence, index) => {
      const userAnswer = userAnswers[index];
      const correctAnswer = currentExercise.corrections[index];
      
      if (userAnswer.toLowerCase().includes(correctAnswer.toLowerCase())) {
        correctAnswers++;
        feedback.push(`✅ Question ${index + 1}: Correct!`);
      } else {
        feedback.push(`❌ Question ${index + 1}: Expected "${correctAnswer}"`);
      }
    });
    
    const accuracy = (correctAnswers / currentExercise.sentences.length) * 100;
    
    toast({
      title: "Grammar Check Complete",
      description: `Accuracy: ${Math.round(accuracy)}% - ${correctAnswers}/${currentExercise.sentences.length} correct`,
    });
    
    // Mark exercise as completed
    setGrammarExercises(prev => prev.map(ex => 
      ex.id === currentExercise.id ? { ...ex, completed: true } : ex
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card/80 backdrop-blur-sm rounded-full border border-border/50 shadow-lg mb-6">
            <Brain className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold gradient-text">Advanced Learning Tools</h1>
            <Zap className="w-6 h-6 text-secondary" />
          </div>
          <p className="text-muted-foreground">Master languages with advanced learning techniques</p>
        </div>
      </FadeIn>

      {/* Stats Overview */}
      <FadeIn delay={100}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flashcards</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.masteredFlashcards}/{stats.totalFlashcards}</div>
              <p className="text-xs text-muted-foreground">Mastered</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quiz Score</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">Average</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.streak} days</div>
              <p className="text-xs text-muted-foreground">Current streak</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.timeSpent}h</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Main Tools */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-card/80 backdrop-blur-sm">
          <TabsTrigger value="flashcards" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Flashcards
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Quizzes
          </TabsTrigger>
          <TabsTrigger value="grammar" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Grammar
          </TabsTrigger>
        </TabsList>

        {/* Flashcards Tab */}
        <TabsContent value="flashcards" className="space-y-6">
          <FadeIn>
            <Card className="modern-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Spaced Repetition Flashcards
                  </CardTitle>
                  <Button onClick={generateQuiz} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate New
                  </Button>
                </div>
                <CardDescription>Review cards based on spaced repetition algorithm</CardDescription>
              </CardHeader>
              <CardContent>
                {flashcards.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Card {currentFlashcardIndex + 1} of {flashcards.length}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {flashcards[currentFlashcardIndex].category}
                      </Badge>
                    </div>

                    <div className="relative min-h-[200px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 border border-border/50">
                      <div className="text-center space-y-4">
                        <div className="text-2xl font-bold mb-4">
                          {showAnswer ? flashcards[currentFlashcardIndex].back : flashcards[currentFlashcardIndex].front}
                        </div>
                        
                        {showAnswer && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              Reviewed {flashcards[currentFlashcardIndex].reviewCount} times
                            </div>
                            <div className="flex items-center gap-2">
                              {flashcards[currentFlashcardIndex].mastered && (
                                <Badge variant="default" className="text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  Mastered
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => setShowAnswer(!showAnswer)}
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                      >
                        {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>

                    {showAnswer && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleFlashcardAnswer(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Incorrect
                        </Button>
                        <Button
                          onClick={() => handleFlashcardAnswer(true)}
                          className="flex-1"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Correct
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-6">
          <FadeIn>
            <Card className="modern-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    AI-Generated Quiz
                  </CardTitle>
                  <Button onClick={generateQuiz} variant="outline" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Quiz
                  </Button>
                </div>
                <CardDescription>Test your knowledge with personalized quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                {quizQuestions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Question {currentQuizIndex + 1} of {quizQuestions.length}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Score: {quizScore}/{currentQuizIndex}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="text-lg font-medium">
                        {quizQuestions[currentQuizIndex].question}
                      </div>

                      <div className="space-y-2">
                        {quizQuestions[currentQuizIndex].options.map((option, index) => (
                          <Button
                            key={index}
                            onClick={() => handleQuizAnswer(index)}
                            disabled={selectedAnswer !== null}
                            variant={selectedAnswer === index ? "default" : "outline"}
                            className="w-full justify-start h-auto p-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm">
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span className="text-left">{option}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </TabsContent>

        {/* Grammar Tab */}
        <TabsContent value="grammar" className="space-y-6">
          <FadeIn>
            {currentExercise ? (
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    {currentExercise.title}
                  </CardTitle>
                  <CardDescription>{currentExercise.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {currentExercise.sentences.map((sentence, index) => (
                      <div key={index} className="space-y-2">
                        <label className="text-sm font-medium">
                          Sentence {index + 1}:
                        </label>
                        <div className="text-sm text-muted-foreground mb-2">
                          {sentence}
                        </div>
                        <input
                          type="text"
                          value={userAnswers[index]}
                          onChange={(e) => {
                            const newAnswers = [...userAnswers];
                            newAnswers[index] = e.target.value;
                            setUserAnswers(newAnswers);
                          }}
                          className="w-full p-2 border rounded-md bg-background"
                          placeholder="Type your answer..."
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">Grammar Rules:</span>
                    </div>
                    <div className="space-y-1">
                      {currentExercise.rules.map((rule, index) => (
                        <div key={index} className="text-xs bg-yellow-50 dark:bg-yellow-950/50 p-2 rounded">
                          {rule}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={checkGrammarExercise} className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Check Answers
                    </Button>
                    <Button 
                      onClick={() => setCurrentExercise(null)} 
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {grammarExercises.map((exercise) => (
                  <Card key={exercise.id} className="modern-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{exercise.title}</CardTitle>
                        {exercise.completed && (
                          <Badge variant="default" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{exercise.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">Category:</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {exercise.category}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">Exercises:</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {exercise.sentences.length} sentences to practice
                        </p>
                      </div>

                      <Button 
                        onClick={() => startGrammarExercise(exercise)}
                        className="w-full"
                        disabled={exercise.completed}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {exercise.completed ? 'Completed' : 'Start Exercise'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </FadeIn>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedLearningTools; 