import React, { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import confetti from 'canvas-confetti';
import { triggerPopUnder, triggerVignette } from '../../lib/ads';

export const PotBreaking: React.FC<{ username: string; onComplete: (score: number) => void }> = ({ username, onComplete }) => {
  const [pots, setPots] = useState([
    { id: 1, broken: false, reward: false },
    { id: 2, broken: false, reward: true },
    { id: 3, broken: false, reward: false },
    { id: 4, broken: false, reward: false },
  ]);
  const [gameOver, setGameOver] = useState(false);

  const breakPot = (id: number) => {
    if (gameOver) return;
    if (pots.every(p => !p.broken)) triggerPopUnder();
    
    const newPots = pots.map(p => p.id === id ? { ...p, broken: true } : p);
    setPots(newPots);
    
    const pot = pots.find(p => p.id === id);
    if (pot?.reward) {
      confetti();
      setGameOver(true);
      triggerVignette();
      supabase.from('leaderboard').insert([{ username, game_id: 'pot-break', score: 100 }]);
      onComplete(100);
    }
  };

  return (
    <div className="p-8 bg-red-900/20 rounded-3xl border-4 border-yellow-600/30 text-center">
      <h2 className="text-3xl font-black text-yellow-500 uppercase italic mb-8">Kana Mutti</h2>
      <p className="text-yellow-200/50 mb-8">One pot has the prize. Can you find it?</p>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12">
        {pots.map((pot) => (
          <motion.div
            key={pot.id}
            whileHover={{ y: -10 }}
            onPointerDown={() => breakPot(pot.id)}
            className={`w-20 h-28 sm:w-24 sm:h-32 cursor-pointer flex items-center justify-center text-4xl sm:text-5xl relative ${
              pot.broken ? 'opacity-50' : ''
            }`}
          >
            {pot.broken ? (pot.reward ? '🎁' : '💨') : '🏺'}
            {!pot.broken && (
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                🏺
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {gameOver && (
        <div className="text-center">
          <h3 className="text-2xl font-bold text-yellow-500 mb-4">You Found the Prize!</h3>
          <button onClick={() => { setPots(pots.map(p => ({ ...p, broken: false }))); setGameOver(false); }} className="bg-yellow-500 text-red-900 font-bold px-8 py-2 rounded-xl">Play Again</button>
        </div>
      )}
    </div>
  );
};
