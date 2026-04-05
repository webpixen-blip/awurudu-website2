import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://twuzhrcqovphzwqgjaam.supabase.co';
const supabaseKey = 'sb_publishable_ph9FnjJ0TZ0vp87AZ9aGwA_rBaoscbK';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    fetch: (input, init) => fetch(input, init),
  },
});

export type GameId = 'pillow-fight' | 'memory-match' | 'elephant-eye' | 'quiz' | 'word-search' | 'pancha' | 'raban' | 'pot-break' | 'greasy-pole';

export interface Score {
  id: string;
  username: string;
  game_id: GameId;
  score: number;
  created_at: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  created_at?: string;
}

export interface RabanSound {
  id: string;
  name: string;
  url: string;
  updated_at?: string;
}

export interface NakathTime {
  id: string;
  title: string;
  time: string;
  description: string;
  icon: string;
  created_at: string;
}
