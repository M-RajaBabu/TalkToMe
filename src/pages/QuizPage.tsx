import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const QuizPage = () => {
  // Add these states for dynamic questions
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const navigate = useNavigate();

  // Example: get chapter and language from location or props (customize as needed)
  const chapter = 'Greetings'; // Replace with actual chapter/section
  const language = 'Hindi'; // Replace with actual language

  // Fetch questions from Gemini API
  useEffect(() => {
    setLoading(true);
    setError(null);
    setQuestions([]);
    const prompt = `Generate 20 multiple-choice quiz questions for the chapter '${chapter}' in ${language}. Each question should have: 'question', 'options' (array of 4), 'answer' (index of correct option), and 'explanation'. Respond in JSON array format.`;
    fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })
      .then(res => res.json())
      .then(data => {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        // Try to parse JSON from Gemini response
        let parsed: any[] = [];
        try {
          const match = text.match(/```json([\s\S]*?)```/) || text.match(/\[.*\]/s);
          if (match) {
            parsed = JSON.parse(match[1] ? match[1].trim() : match[0]);
          } else {
            parsed = JSON.parse(text);
          }
        } catch (e) {
          setError('Failed to parse questions.');
          setLoading(false);
          return;
        }
        setQuestions(parsed.slice(0, 20));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load quiz questions.');
        setLoading(false);
      });
  }, [chapter, language]);

  // Classic mode logic
  const current = questions[index];
  const handleSelect = (i: number) => {
    setSelected(i);
    setShowFeedback(true);
    if (i === current.answer) setScore(s => s + 1);
  };
  const handleNext = () => {
    setShowFeedback(false);
    setSelected(null);
    if (index + 1 < questions.length) {
      setIndex(i => i + 1);
    } else {
      setFinished(true);
    }
  };
  const handleRestart = () => {
    setIndex(0);
    setSelected(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="container max-w-md mx-auto flex-1 flex flex-col h-screen p-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-primary font-bold hover:underline focus:outline-none"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" /> Back
        </button>
        <h1 className="text-2xl font-bold mb-6">Chapter Quiz</h1>
        {loading ? (
          <div className="text-center text-muted-foreground">Loading quiz questions...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : questions.length > 0 ? (
          <Card className="mb-6 flex flex-col items-center justify-center min-h-[250px]">
            <CardHeader>
              <CardTitle>Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              {!finished ? (
                <div className="flex flex-col items-center w-full">
                  <div className="mb-4 font-medium text-lg text-center">{current.question}</div>
                  <div className="flex flex-col gap-2 w-full">
                    {current.options.map((opt: string, i: number) => (
                      <Button
                        key={i}
                        variant={selected === i ? (i === current.answer ? 'success' : 'destructive') : 'outline'}
                        className="w-full"
                        onClick={() => !showFeedback && handleSelect(i)}
                        disabled={showFeedback}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                  {showFeedback && (
                    <div className={`mt-4 text-sm ${selected === current.answer ? 'text-green-600' : 'text-red-600'}`}> 
                      {selected === current.answer ? 'Correct!' : 'Incorrect.'}
                      <div className="mt-1 text-muted-foreground">{current.explanation}</div>
                      <Button className="mt-4" onClick={handleNext}>{index + 1 < questions.length ? 'Next' : 'Finish'}</Button>
                    </div>
                  )}
                  <div className="mt-4 text-xs text-muted-foreground">Question {index + 1} of {questions.length}</div>
                </div>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <div className="mb-4 font-bold text-xl">Quiz Complete!</div>
                  <div className="mb-2 text-lg">Score: {score} / {questions.length}</div>
                  <div className="mb-4 text-sm text-muted-foreground">Review explanations above for any mistakes.</div>
                  <Button onClick={handleRestart}>Restart Quiz</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : null}
        <AppHeader className="md:hidden" />
      </div>
    </div>
  );
};

export default QuizPage; 