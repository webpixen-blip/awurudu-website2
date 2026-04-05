import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Timer, Zap, User } from 'lucide-react';
import { supabase, GameId } from '../../lib/supabase';
import confetti from 'canvas-confetti';

import { playSound } from '../../lib/sounds';
import { triggerPopUnder, triggerVignette, triggerRewardAd } from '../../lib/ads';

interface PillowFightProps {
  username: string;
  soundEnabled: boolean;
  onComplete: (score: number) => void;
}

export const PillowFight: React.FC<PillowFightProps> = ({ username, soundEnabled, onComplete }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [power, setPower] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      finishGame();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    playSound('start', soundEnabled);
    triggerPopUnder();
    setGameState('playing');
    setScore(0);
    setTimeLeft(10);
    setPower(0);
  };

  const handleTap = () => {
    if (gameState !== 'playing') return;
    playSound('tap', soundEnabled);
    setScore((prev) => prev + 1);
    setPower((prev) => Math.min(prev + 10, 100));
    
    // Decay power
    setTimeout(() => {
      setPower((prev) => Math.max(prev - 5, 0));
    }, 100);
  };

  const finishGame = async () => {
    setGameState('finished');
    playSound('success', soundEnabled);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    triggerVignette();

    if (score > 0) {
      console.log(`Submitting score: ${score} for ${username}`);
      const { data, error } = await supabase.from('leaderboard').insert([
        { username, game_id: 'pillow-fight', score }
      ]);
      
      if (error) {
        console.error('SCORE SUBMISSION FAILED:', error);
      } else {
        console.log('Score submitted successfully!', data);
      }
    }
    onComplete(score);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-red-900/20 rounded-3xl border-4 border-yellow-600/30 min-h-[500px] relative overflow-hidden">
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-yellow-600 px-4 py-1 rounded-full text-red-900 font-bold">
        <Timer size={18} />
        {timeLeft}s
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <h2 className="text-4xl font-black text-yellow-500 mb-4 uppercase tracking-tighter">Kotta Pora</h2>
            <p className="text-yellow-200/70 mb-8 max-w-xs">Tap as fast as you can to knock your opponent off the beam!</p>
            <button
              onClick={startGame}
              className="bg-yellow-500 hover:bg-yellow-400 text-red-900 font-black px-12 py-4 rounded-2xl text-xl shadow-[0_8px_0_rgb(180,130,0)] active:translate-y-1 active:shadow-[0_4px_0_rgb(180,130,0)] transition-all"
            >
              START FIGHT
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center"
          >
            <div className="relative w-full h-64 flex items-center justify-center mb-12">
              {/* Characters */}
              <motion.div
                animate={{ 
                  x: score % 2 === 0 ? -10 : 10,
                  rotate: score % 2 === 0 ? -5 : 5
                }}
                className="w-32 h-32 bg-yellow-500 rounded-2xl flex items-center justify-center text-4xl shadow-xl"
              >
                🥊
              </motion.div>
              <div className="w-full h-4 bg-yellow-900/50 absolute bottom-0 rounded-full" />
            </div>

            <div className="w-full max-w-xs mb-8">
              <div className="flex justify-between mb-2 text-yellow-500 font-bold uppercase text-xs tracking-widest">
                <span>Power Meter</span>
                <span>{power}%</span>
              </div>
              <div className="h-4 bg-red-950 rounded-full overflow-hidden border border-yellow-600/30">
                <motion.div
                  animate={{ width: `${power}%` }}
                  className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
                />
              </div>
            </div>

            <button
              onPointerDown={handleTap}
              className="w-48 h-48 rounded-full bg-red-600 border-8 border-yellow-500 flex flex-col items-center justify-center shadow-2xl active:scale-95 transition-transform select-none touch-none"
            >
              <Zap className="text-yellow-400 mb-2" size={48} fill="currentColor" />
              <span className="text-white font-black text-2xl uppercase">TAP!</span>
            </button>
            
            <div className="mt-8 text-5xl font-black text-yellow-500 italic">
              {score}
            </div>
          </motion.div>
        )}

        {gameState === 'finished' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Trophy className="text-yellow-500 mx-auto mb-4" size={80} />
            <h2 className="text-5xl font-black text-white mb-2 italic">GAME OVER!</h2>
            <p className="text-yellow-500 text-2xl font-bold mb-8">Score: {score}</p>
            <div className="flex flex-col gap-4">
              <button
                onClick={startGame}
                className="bg-yellow-500 hover:bg-yellow-400 text-red-900 font-black px-12 py-4 rounded-2xl text-xl shadow-[0_8px_0_rgb(180,130,0)] active:translate-y-1 active:shadow-[0_4px_0_rgb(180,130,0)] transition-all"
              >
                PLAY AGAIN
              </button>
              <button
                onClick={() => triggerRewardAd(() => {
                  setGameState('playing');
                  setTimeLeft(5); // Extra 5 seconds
                })}
                className="bg-red-600 hover:bg-red-500 text-white font-black px-8 py-3 rounded-xl text-sm flex items-center justify-center gap-2 border-2 border-yellow-500/30 transition-all"
              >
                <Zap size={16} fill="currentColor" /> GET EXTRA LIFE (WATCH AD)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
