import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, ArrowUp, Zap, Flag } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface GreasyPoleProps {
  username: string;
  soundEnabled?: boolean;
  onComplete: (score: number) => void;
}

export const GreasyPole: React.FC<GreasyPoleProps> = ({ username, soundEnabled, onComplete }) => {
  const [height, setHeight] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [startTime, setStartTime] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  
  const poleRef = useRef<HTMLDivElement>(null);
  const gravityInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchHighScore();
    return () => {
      if (gravityInterval.current) clearInterval(gravityInterval.current);
    };
  }, []);

  const fetchHighScore = async () => {
    const { data } = await supabase
      .from('leaderboard')
      .select('score')
      .eq('game_id', 'greasy-pole')
      .eq('username', username)
      .order('score', { ascending: true }) // Lower time is better
      .limit(1);
    
    if (data && data.length > 0) {
      setHighScore(data[0].score);
    }
  };

  const startGame = () => {
    setHeight(0);
    setGameState('playing');
    setStartTime(Date.now());
    
    // Gravity effect: pull down over time
    gravityInterval.current = setInterval(() => {
      setHeight(prev => {
        const slideAmount = 0.5; // Constant slide down
        if (prev > 0) {
          setIsSliding(true);
          setTimeout(() => setIsSliding(false), 100);
          return Math.max(0, prev - slideAmount);
        }
        return prev;
      });
    }, 100);
  };

  const handleClimb = () => {
    if (gameState !== 'playing') return;
    
    setHeight(prev => {
      const nextHeight = prev + 4; // Climb amount per tap
      if (nextHeight >= 100) {
        finishGame();
        return 100;
      }
      return nextHeight;
    });
  };

  const finishGame = async () => {
    if (gravityInterval.current) clearInterval(gravityInterval.current);
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    setFinalTime(duration);
    setGameState('finished');

    // Save score (lower duration is better)
    const { error } = await supabase.from('leaderboard').insert([
      { username, game_id: 'greasy-pole', score: duration }
    ]);

    if (!error) {
      if (highScore === 0 || duration < highScore) {
        setHighScore(duration);
      }
    }
    onComplete(duration);
  };

  return (
    <div className="bg-red-900/40 backdrop-blur-md rounded-3xl border-4 border-yellow-600/30 p-4 sm:p-8 shadow-2xl overflow-hidden relative h-[650px] sm:h-[700px] flex flex-col">
      <div className="text-center mb-2 sm:mb-6 shrink-0">
        <h2 className="text-xl sm:text-3xl font-black text-yellow-500 uppercase italic tracking-tighter">Grees Gahe Nagima</h2>
        <p className="text-yellow-200/60 text-[10px] sm:text-sm">Tap rapidly to climb the greasy pole!</p>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row gap-4 sm:gap-8 min-h-0">
        {/* The Pole Area */}
        <div className="relative w-full sm:w-32 h-48 sm:h-auto bg-red-950/50 rounded-2xl sm:rounded-full border-2 border-yellow-600/20 flex sm:flex-col items-center justify-center sm:py-8 overflow-hidden shrink-0">
          {/* The Actual Pole (Vertical on desktop, Horizontal on mobile? No, keep it vertical but shorter) */}
          <div className="absolute inset-y-0 w-4 sm:w-6 bg-gradient-to-r from-yellow-900 via-yellow-600 to-yellow-900 rounded-full shadow-inner" />
          
          {/* The Prize at Top */}
          <div className="absolute top-2 sm:top-4 z-10">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-yellow-500 p-1.5 sm:p-2 rounded-full shadow-lg"
            >
              <Flag className="text-red-900" size={16} />
            </motion.div>
          </div>

          {/* The Climber */}
          <motion.div 
            className="absolute z-20"
            animate={{ bottom: `${height * 0.75 + 5}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className={`relative ${isSliding ? 'animate-bounce' : ''}`}>
              <div className="text-3xl sm:text-5xl">🧗</div>
              {gameState === 'playing' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-3 -right-3 bg-yellow-500 text-red-900 text-[8px] font-black px-1.5 py-0.5 rounded-full"
                >
                  {Math.round(height)}%
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Stats & Controls */}
        <div className="flex-1 flex flex-col justify-center gap-4 sm:gap-6">
          <div className="bg-red-950/50 p-3 sm:p-4 rounded-2xl border border-yellow-600/20 text-center sm:text-left">
            <div className="text-[10px] sm:text-xs font-black text-yellow-600 uppercase tracking-widest mb-1">Best Time</div>
            <div className="text-lg sm:text-2xl font-black text-yellow-500">
              {highScore > 0 ? `${highScore.toFixed(2)}s` : '--'}
            </div>
          </div>

          {gameState === 'idle' && (
            <button
              onClick={startGame}
              className="w-full bg-yellow-500 text-red-900 font-black py-4 sm:py-6 rounded-2xl text-lg sm:text-xl uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-[0_6px_0_rgb(180,130,0)] sm:shadow-[0_8px_0_rgb(180,130,0)] active:translate-y-1 active:shadow-[0_3px_0_rgb(180,130,0)]"
            >
              Start Climb
            </button>
          )}

          {gameState === 'playing' && (
            <button
              onPointerDown={handleClimb}
              className="w-full aspect-square max-w-[120px] sm:max-w-none mx-auto bg-yellow-500 text-red-900 font-black rounded-full flex flex-col items-center justify-center gap-1 sm:gap-2 shadow-[0_6px_0_rgb(180,130,0)] sm:shadow-[0_12px_0_rgb(180,130,0)] active:translate-y-2 active:shadow-[0_4px_0_rgb(180,130,0)] transition-all select-none touch-none"
            >
              <ArrowUp size={24} className="sm:w-12 sm:h-12" />
              <span className="text-sm sm:text-xl uppercase italic leading-none">Climb!</span>
            </button>
          )}

          <AnimatePresence>
            {gameState === 'finished' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-3 sm:space-y-4"
              >
                <div className="bg-yellow-500/20 p-4 sm:p-6 rounded-3xl border-2 border-yellow-500/50">
                  <Trophy className="text-yellow-500 mx-auto mb-1 sm:mb-2 sm:w-12 sm:h-12" size={32} />
                  <div className="text-2xl sm:text-3xl font-black text-yellow-500 uppercase italic">Success!</div>
                  <div className="text-yellow-200/80 text-xs sm:text-base mt-1">Reached the top in</div>
                  <div className="text-3xl sm:text-4xl font-black text-white mt-1 sm:mt-2">{finalTime.toFixed(2)}s</div>
                </div>
                <button
                  onClick={startGame}
                  className="w-full bg-yellow-500 text-red-900 font-black py-3 sm:py-4 rounded-2xl uppercase tracking-widest hover:bg-yellow-400 transition-all text-sm sm:text-base"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Background Accents */}
      <div className="absolute -right-20 -bottom-20 text-[15rem] opacity-5 rotate-12 pointer-events-none">🌴</div>
    </div>
  );
};
