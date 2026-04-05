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
-- Note: Check if the publication exists before trying to add to it, or just use this standard command
ALTER PUBLICATION supabase_realtime ADD TABLE leaderboard;

-- 3. Enable RLS (Row Level Security)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nakath_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE raban_sounds ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- Leaderboard: Anyone can read, anyone can insert (to submit scores)
CREATE POLICY "Allow public read leaderboard" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Allow public insert leaderboard" ON leaderboard FOR INSERT WITH CHECK (true);

-- Quiz Questions: Anyone can read
CREATE POLICY "Allow public read quiz_questions" ON quiz_questions FOR SELECT USING (true);

-- Nakath Times: Anyone can read
CREATE POLICY "Allow public read nakath_times" ON nakath_times FOR SELECT USING (true);

-- Raban Sounds: Anyone can read
CREATE POLICY "Allow public read raban_sounds" ON raban_sounds FOR SELECT USING (true);

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
