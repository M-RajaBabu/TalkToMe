import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import BottomNavBar from '@/components/layout/BottomNavBar';

const mockVocab = [
  { word: 'Hello', translation: 'नमस्ते', language: 'Hindi' },
  { word: 'Thank you', translation: 'धन्यवाद', language: 'Hindi' },
  { word: 'Goodbye', translation: 'विदा', language: 'Hindi' },
  { word: 'Water', translation: 'पानी', language: 'Hindi' },
  { word: 'Food', translation: 'भोजन', language: 'Hindi' },
];

const FlashcardsPage = () => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<boolean[]>(Array(mockVocab.length).fill(false));
  const [reviewCount, setReviewCount] = useState<number[]>(Array(mockVocab.length).fill(0));
  const [smartReview, setSmartReview] = useState(false);
  const navigate = useNavigate();

  // Smart review: only review cards not yet known
  const reviewOrder = smartReview ? mockVocab.map((_, i) => i).filter(i => !known[i]) : mockVocab.map((_, i) => i);
  const currentReviewIdx = reviewOrder[index % reviewOrder.length];
  const card = mockVocab[currentReviewIdx];

  const handleFlip = () => setFlipped(f => !f);
  const handleKnow = () => {
    setKnown(k => k.map((val, i) => (i === currentReviewIdx ? true : val)));
    setFlipped(false);
    setIndex(i => (i + 1) % reviewOrder.length);
  };
  const handleReview = () => {
    setReviewCount(rc => rc.map((val, i) => (i === currentReviewIdx ? val + 1 : val)));
    setFlipped(false);
    setIndex(i => (i + 1) % reviewOrder.length);
  };
  const handleSmartReview = () => {
    setSmartReview(s => !s);
    setIndex(0);
    setFlipped(false);
  };
  const progress = known.filter(Boolean).length / mockVocab.length * 100;

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
        <h1 className="text-2xl font-bold mb-6">Flashcards</h1>
        <Progress value={progress} className="mb-4 h-2" />
        <div className="flex justify-end mb-2">
          <Button variant={smartReview ? 'success' : 'outline'} size="sm" onClick={handleSmartReview}>
            {smartReview ? 'Smart Review: On' : 'Smart Review'}
          </Button>
        </div>
        <Card className="mb-6 flex flex-col items-center justify-center min-h-[250px]">
          <CardHeader>
            <CardTitle>Vocabulary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div
                className={`w-64 h-32 flex items-center justify-center text-2xl font-semibold rounded-lg shadow-lg bg-card cursor-pointer mb-4 transition-transform duration-300 ${flipped ? 'rotate-y-180' : ''}`}
                style={{ perspective: 1000 }}
                onClick={handleFlip}
              >
                {flipped ? card.translation : card.word}
              </div>
              <div className="flex gap-4">
                <Button onClick={handleKnow} variant="success">I know this</Button>
                <Button onClick={handleReview} variant="outline">Review again</Button>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Card {currentReviewIdx + 1} of {mockVocab.length} {known[currentReviewIdx] && <span className="text-green-600 ml-2">✔️ Known</span>}
                <span className="ml-2">(Reviewed {reviewCount[currentReviewIdx]}x)</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <AppHeader className="md:hidden" />
        <BottomNavBar />
      </div>
    </div>
  );
};

export default FlashcardsPage; 