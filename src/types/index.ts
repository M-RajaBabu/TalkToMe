
export type Language = 'Hindi' | 'Telugu' | 'English';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type InputMode = 'text' | 'voice';

export interface LanguagePreference {
  sourceLanguage: Language;
  targetLanguage: Language;
  difficultyLevel: DifficultyLevel;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  audioUrl?: string;
  grammarFeedback?: string;
  vocabularyTips?: string;
  romanization?: string; // Added for Telugu romanization
  inputMode?: InputMode; // Added to track how the message was inputted
  timestamp: Date;
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  profilePicture?: string;
}

export interface ProgressStats {
  fluencyScore: number;
  messagesExchanged: number;
  daysActive: number;
  grammarAccuracy: number;
}

export interface ChapterProgress {
  chapterId: string;
  chapterName: string;
  percentComplete: number;
  lastPracticed: Date;
  timeSpentMinutes: number;
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: Date;
}

export interface LanguagePairStats {
  sourceLang: Language;
  targetLang: Language;
  useCount: number;
  lastUsed: Date;
}

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      chat_history: {
        Row: {
          id: string;
          user_id: string;
          message_type: 'user' | 'ai';
          content: string;
          grammar_feedback: string | null;
          vocabulary_tips: string | null;
          romanization: string | null;
          source_language: string;
          target_language: string;
          input_mode: string;
          timestamp: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          message_type: 'user' | 'ai';
          content: string;
          grammar_feedback?: string | null;
          vocabulary_tips?: string | null;
          romanization?: string | null;
          source_language: string;
          target_language: string;
          input_mode: string;
          timestamp?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          message_type?: 'user' | 'ai';
          content?: string;
          grammar_feedback?: string | null;
          vocabulary_tips?: string | null;
          romanization?: string | null;
          source_language?: string;
          target_language?: string;
          input_mode?: string;
          timestamp?: string;
        };
      };
      user_streaks: {
        Row: {
          id: string;
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_practice_date: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_practice_date?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          current_streak?: number;
          longest_streak?: number;
          last_practice_date?: string;
        };
      };
      language_pair_stats: {
        Row: {
          id: string;
          user_id: string;
          source_lang: string;
          target_lang: string;
          use_count: number;
          last_used: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source_lang: string;
          target_lang: string;
          use_count?: number;
          last_used?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          source_lang?: string;
          target_lang?: string;
          use_count?: number;
          last_used?: string;
        };
      };
      chapter_progress: {
        Row: {
          id: string;
          user_id: string;
          chapter_id: string;
          chapter_name: string;
          percent_complete: number;
          last_practiced: string;
          time_spent_minutes: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          chapter_id: string;
          chapter_name: string;
          percent_complete?: number;
          last_practiced?: string;
          time_spent_minutes?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          chapter_id?: string;
          chapter_name?: string;
          percent_complete?: number;
          last_practiced?: string;
          time_spent_minutes?: number;
        };
      };
    };
  };
}
