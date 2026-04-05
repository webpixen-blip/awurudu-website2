import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { playSound } from '../../lib/sounds';
import { triggerPopUnder, triggerVignette } from '../../lib/ads';

export const ElephantEye: React.FC<{ username: string; soundEnabled: boolean; onComplete: (score: number) => void }> = ({ username, soundEnabled, onComplete }) => {
  const [gameState, setGameState] = useState<'preview' | 'playing' | 'result'>('preview');
  const [eyePos] = useState({ x: 72, y: 35 }); // Correct eye position in percentage
  const [userPos, setUserPos] = useState<{ x: number; y: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (gameState === 'preview') {
      triggerPopUnder();
      const timer = setTimeout(() => setGameState('playing'), 5000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'playing') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const dist = Math.sqrt(Math.pow(x - eyePos.x, 2) + Math.pow(y - eyePos.y, 2));
    setUserPos({ x, y });
    setDistance(dist);
    setGameState('result');

    const score = Math.max(0, Math.round(100 - dist * 2));
    triggerVignette();
    if (score > 80) playSound('success', soundEnabled);
    else playSound('fail', soundEnabled);
    
    supabase.from('leaderboard').insert([{ username, game_id: 'elephant-eye', score }]);
    onComplete(score);
  };

  return (
    <div className="p-6 bg-red-900/20 rounded-3xl border-4 border-yellow-600/30">
      <h2 className="text-2xl font-black text-yellow-500 uppercase italic mb-4 text-center flex items-center justify-center gap-2">
        🐘 Aliyata Asa Thabeema
      </h2>
      
      <div className="relative aspect-[4/3] w-full bg-red-950 rounded-2xl overflow-hidden cursor-crosshair" onClick={handleClick}>
        <img 
          src="https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=800" 
          alt="Elephant"
          className={`w-full h-full object-cover transition-all duration-500 ${gameState === 'playing' ? 'blur-2xl grayscale' : ''}`}
          referrerPolicy="no-referrer"
        />
        
        {gameState === 'preview' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold text-xl">
            Memorize the eye position! (5s)
          </div>
        )}

        {gameState === 'result' && userPos && (
          <>
            <div className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2" style={{ left: `${userPos.x}%`, top: `${userPos.y}%` }} />
            <div className="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2" style={{ left: `${eyePos.x}%`, top: `${eyePos.y}%` }} />
          </>
        )}
      </div>

      {gameState === 'result' && distance !== null && (
        <div className="mt-6 text-center">
          <p className="text-yellow-500 text-xl font-bold flex items-center justify-center gap-2">
            🐘 Accuracy: {Math.max(0, Math.round(100 - distance * 2))}%
          </p>
          <button onClick={() => setGameState('preview')} className="mt-4 bg-yellow-500 text-red-900 font-bold px-8 py-2 rounded-xl">Try Again</button>
        </div>
      )}
    </div>
  );
};
