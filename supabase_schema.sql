/**
 * Avurudu Hub - Complete Supabase SQL Schema
 * 
 * Instructions:
 * 1. Open your Supabase Dashboard
 * 2. Go to the "SQL Editor"
 * 3. Click "New Query"
 * 4. Paste this entire code and click "Run"
 */

-- 1. Create Tables
-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  game_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nakath_times table
CREATE TABLE IF NOT EXISTS nakath_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  time TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create raban_sounds table
CREATE TABLE IF NOT EXISTS raban_sounds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Realtime
-- This ensures the system publication includes our tables
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE leaderboard;
ALTER TABLE leaderboard REPLICA IDENTITY FULL; -- Ensures updates carry full old/new data

-- 3. Enable RLS (Row Level Security)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nakath_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE raban_sounds ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- Leaderboard: Anyone can read, insert (submit scores), update, or delete
CREATE POLICY "Allow public read leaderboard" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Allow public insert leaderboard" ON leaderboard FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update leaderboard" ON leaderboard FOR UPDATE USING (true);
CREATE POLICY "Allow public delete leaderboard" ON leaderboard FOR DELETE USING (true);

-- Quiz Questions: Full CRUD for public (client-side password protection)
CREATE POLICY "Allow public read quiz_questions" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Allow public insert quiz_questions" ON quiz_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update quiz_questions" ON quiz_questions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete quiz_questions" ON quiz_questions FOR DELETE USING (true);

-- Nakath Times: Full CRUD for public
CREATE POLICY "Allow public read nakath_times" ON nakath_times FOR SELECT USING (true);
CREATE POLICY "Allow public insert nakath_times" ON nakath_times FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update nakath_times" ON nakath_times FOR UPDATE USING (true);
CREATE POLICY "Allow public delete nakath_times" ON nakath_times FOR DELETE USING (true);

-- Raban Sounds: Full CRUD for public
CREATE POLICY "Allow public read raban_sounds" ON raban_sounds FOR SELECT USING (true);
CREATE POLICY "Allow public insert raban_sounds" ON raban_sounds FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update raban_sounds" ON raban_sounds FOR UPDATE USING (true);
CREATE POLICY "Allow public delete raban_sounds" ON raban_sounds FOR DELETE USING (true);


-- 5. Insert Seed Data
-- Initial Quiz Questions
INSERT INTO quiz_questions (question, options, correct_answer) VALUES
('What is the traditional food eaten during Avurudu?', ARRAY['Kiribath', 'Pizza', 'Burger', 'Pasta'], 0),
('Which bird''s sound signals the arrival of Avurudu?', ARRAY['Crow', 'Koha', 'Parrot', 'Eagle'], 1),
('What is the traditional game involving a pillow?', ARRAY['Cricket', 'Kotta Pora', 'Football', 'Chess'], 1),
('What is the traditional game involving an elephant?', ARRAY['Aliya Thabeema', 'Cricket', 'Tag', 'Hide & Seek'], 0),
('What is the main ingredient of Kavum?', ARRAY['Rice Flour', 'Wheat Flour', 'Corn Flour', 'Barley'], 0);

-- Initial Nakath Times (2026 Example)
INSERT INTO nakath_times (title, time, description, icon, created_at) VALUES
('Dawn of New Year', '08:42 AM', 'The auspicious time of the new year arrival.', '🌅', NOW()),
('Punya Kalaya', '02:18 AM to 03:06 PM', 'Time for religious observances.', '🙏', NOW()),
('Cooking Food', '09:17 AM', 'Lighting the hearth and cooking the first meal.', '🔥', NOW()),
('First Meal', '11:04 AM', 'Partaking in the first traditional meal.', '🍚', NOW()),
('Transactions', '11:04 AM', 'Starting work and engaging in financial transactions.', '💰', NOW());
