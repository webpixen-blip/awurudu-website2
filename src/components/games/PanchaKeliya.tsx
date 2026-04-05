import React, { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { triggerPopUnder, triggerVignette } from '../../lib/ads';

export const PanchaKeliya: React.FC<{ username: string; onComplete: (score: number) => void }> = ({ username, onComplete }) => {
  const [kavadis, setKavadis] = useState<boolean[]>([false, false, false, false, false, false]);
  const [rolling, setRolling] = useState(false);
  const [score, setScore] = useState(0);

  const roll = () => {
    if (score === 0) triggerPopUnder();
    setRolling(true);
    setTimeout(() => {
      const results = kavadis.map(() => Math.random() > 0.5);
      setKavadis(results);
      const heads = results.filter(h => h).length;
      
      // Traditional scoring (simplified)
      let points = 0;
      if (heads === 0) points = 6;
      else if (heads === 1) points = 10;
      else points = heads;

      setScore(s => s + points);
      setRolling(false);
      
      if (points > 0) {
        supabase.from('leaderboard').insert([{ username, game_id: 'pancha', score: points }]);
      }
    }, 1000);
  };

  return (
    <div className="p-8 bg-red-900/20 rounded-3xl border-4 border-yellow-600/30 text-center">
      <h2 className="text-3xl font-black text-yellow-500 uppercase italic mb-8">Pancha Keliya</h2>
      
      <div className="flex justify-center gap-4 mb-12">
        {kavadis.map((isHead, i) => (
          <motion.div
            key={i}
            animate={rolling ? { rotateY: 360 } : { rotateY: isHead ? 180 : 0 }}
            transition={{ duration: 0.5, repeat: rolling ? Infinity : 0 }}
            className={`w-12 h-16 rounded-full border-2 border-yellow-600/50 flex items-center justify-center text-2xl shadow-lg ${
              isHead ? 'bg-yellow-500' : 'bg-red-800'
            }`}
          >
            {isHead ? '🐚' : '🕳️'}
          </motion.div>
        ))}
      </div>

      <div className="text-4xl font-black text-white mb-8">Score: {score}</div>

      <button
        disabled={rolling}
        onClick={roll}
        className="bg-yellow-500 hover:bg-yellow-400 text-red-900 font-black px-12 py-4 rounded-2xl text-xl shadow-[0_8px_0_rgb(180,130,0)] active:translate-y-1 transition-all disabled:opacity-50"
      >
        {rolling ? 'ROLLING...' : 'ROLL KAVADI'}
      </button>
    </div>
  );
};
