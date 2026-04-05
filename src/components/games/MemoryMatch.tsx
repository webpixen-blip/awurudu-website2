import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { playSound } from '../../lib/sounds';
import { triggerPopUnder, triggerVignette } from '../../lib/ads';

const FOOD_ICONS = ['🥮', '🍪', '🥥', '🍌', '🥭', '🍍', '🍯', '🥛'];
const CARDS = [...FOOD_ICONS, ...FOOD_ICONS];

export const MemoryMatch: React.FC<{ username: string; soundEnabled: boolean; onComplete: (score: number) => void }> = ({ username, soundEnabled, onComplete }) => {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    shuffle();
  }, []);

  const shuffle = () => {
    playSound('start', soundEnabled);
    triggerPopUnder();
    const shuffled = [...CARDS].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
  };

  const handleClick = (index: number) => {
    if (disabled || flipped.includes(index) || solved.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    playSound('tap', soundEnabled);

    if (newFlipped.length === 2) {
      setDisabled(true);
      setMoves(m => m + 1);
      
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setSolved([...solved, ...newFlipped]);
        setFlipped([]);
        setDisabled(false);
        playSound('success', soundEnabled);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
          playSound('fail', soundEnabled);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (solved.length === CARDS.length && CARDS.length > 0) {
      triggerVignette();
      const score = Math.max(100 - moves, 10);
      supabase.from('leaderboard').insert([{ username, game_id: 'memory-match', score }]);
      onComplete(score);
    }
  }, [solved]);

  return (
    <div className="p-6 bg-red-900/20 rounded-3xl border-4 border-yellow-600/30">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-yellow-500 uppercase italic">Memory Match</h2>
        <div className="bg-yellow-600 px-4 py-1 rounded-full text-red-900 font-bold">Moves: {moves}</div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || solved.includes(index);
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(index)}
              className={`aspect-square rounded-xl cursor-pointer flex items-center justify-center text-4xl shadow-lg transition-colors duration-300 ${
                isFlipped ? 'bg-yellow-500' : 'bg-red-800 border-2 border-yellow-600/50'
              }`}
            >
              {isFlipped ? card : '?'}
            </motion.div>
          );
        })}
      </div>

      {solved.length === CARDS.length && (
        <div className="mt-8 text-center">
          <Trophy className="text-yellow-500 mx-auto mb-2" size={48} />
          <h3 className="text-2xl font-bold text-white">Well Done!</h3>
          <button onClick={shuffle} className="mt-4 bg-yellow-500 text-red-900 font-bold px-8 py-2 rounded-xl">Play Again</button>
        </div>
      )}
    </div>
  );
};
