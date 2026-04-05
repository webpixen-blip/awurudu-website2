import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Timer, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { triggerPopUnder, triggerVignette } from '../../lib/ads';

const QUESTIONS = [
  {
    question: "What is the traditional food eaten during Avurudu?",
    options: ["Kiribath", "Pizza", "Burger", "Pasta"],
    correct: 0
  },
  {
    question: "Which bird's sound signals the arrival of Avurudu?",
    options: ["Crow", "Koha", "Parrot", "Eagle"],
    correct: 1
  },
  {
    question: "What is the traditional game involving a pillow?",
    options: ["Cricket", "Kotta Pora", "Football", "Chess"],
    correct: 1
  }
];

export const AvuruduQuiz: React.FC<{ username: string; onComplete: (score: number) => void }> = ({ username, onComplete }) => {
  const [questions, setQuestions] = useState(QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'finished'>('loading');

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase.from('quiz_questions').select('*');
      if (!error && data && data.length > 0) {
        setQuestions(data.map(q => ({
          question: q.question,
          options: q.options,
          correct: q.correct_answer
        })));
      }
      setGameState('playing');
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && currentIdx === 0 && timeLeft === 15) {
      triggerPopUnder();
    }
    if (gameState !== 'playing') return;
    if (timeLeft === 0) {
      handleNext();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  const handleAnswer = (idx: number) => {
    if (idx === questions[currentIdx].correct) {
      setScore(s => s + 10);
    }
    handleNext();
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
      setTimeLeft(15);
    } else {
      setGameState('finished');
      triggerVignette();
      supabase.from('leaderboard').insert([{ username, game_id: 'quiz', score }]);
      onComplete(score);
    }
  };

  if (gameState === 'loading') {
    return (
      <div className="p-6 bg-red-900/20 rounded-3xl border-4 border-yellow-600/30 min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-red-900/20 rounded-3xl border-4 border-yellow-600/30 min-h-[400px]">
      <AnimatePresence mode="wait">
        {gameState === 'playing' ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-yellow-500 font-bold">Question {currentIdx + 1}/{questions.length}</span>
              <div className="flex items-center gap-2 bg-yellow-600 px-4 py-1 rounded-full text-red-900 font-bold">
                <Timer size={18} /> {timeLeft}s
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-8">{questions[currentIdx].question}</h3>

            <div className="grid gap-4">
              {questions[currentIdx].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className="w-full p-4 bg-red-800 hover:bg-red-700 border-2 border-yellow-600/30 rounded-2xl text-left text-white font-medium transition-colors flex justify-between items-center group"
                >
                  {opt}
                  <ChevronRight className="text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <Trophy className="text-yellow-500 mx-auto mb-4" size={80} />
            <h2 className="text-4xl font-black text-white mb-2 italic">QUIZ COMPLETE!</h2>
            <p className="text-yellow-500 text-2xl font-bold mb-8">Final Score: {score}</p>
            <button
              onClick={() => {
                setCurrentIdx(0);
                setScore(0);
                setTimeLeft(15);
                setGameState('playing');
              }}
              className="bg-yellow-500 text-red-900 font-black px-12 py-4 rounded-2xl text-xl"
            >
              RETRY
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
