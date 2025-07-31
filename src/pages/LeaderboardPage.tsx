import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LeaderboardPage = () => {
  const navigate = useNavigate();
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
        <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>
        <div className="text-muted-foreground mb-4">The leaderboard will display top users by XP, streak, and messages. (Coming soon!)</div>
      </div>
    </div>
  );
};

export default LeaderboardPage; 