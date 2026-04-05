import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Music } from 'lucide-react';
import { playSound } from '../../lib/sounds';
import { supabase } from '../../lib/supabase';

interface RabanPlayingProps {
  soundEnabled?: boolean;
}

export const RabanPlaying: React.FC<RabanPlayingProps> = ({ soundEnabled = true }) => {
  const [activeZone, setActiveZone] = useState<number | null>(null);
  const [rhythm, setRhythm] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);
  const [customSounds, setCustomSounds] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSounds = async () => {
      const { data } = await supabase.from('raban_sounds').select('*');
      if (data) {
        const soundMap: Record<string, string> = {};
        data.forEach(s => {
          soundMap[s.name] = s.url;
        });
        setCustomSounds(soundMap);
      }
    };
    fetchSounds();
  }, []);

  const playZone = (id: number) => {
    setActiveZone(id);
    setRhythm(prev => [...prev.slice(-9), id]);
    
    // Play sound based on zone
    const soundName = id === 0 ? 'raban_low' : 'raban_high';
    
    if (customSounds[soundName]) {
      const audio = new Audio(customSounds[soundName]);
      if (soundEnabled) audio.play().catch(() => {});
    } else {
      playSound(soundName as any, soundEnabled);
    }
    
    // Simulate sound vibration
    if (window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }

    setTimeout(() => setActiveZone(null), 150);
  };

  const playRhythm = async () => {
    if (rolling) return;
    setRolling(true);
    const pattern = [0, 1, 0, 2, 0, 3, 0, 4, 0]; // Simple rhythm
    for (const id of pattern) {
      playZone(id);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    setRolling(false);
  };

  return (
    <div className="p-8 bg-red-900/20 rounded-3xl border-4 border-yellow-600/30 text-center">
      <h2 className="text-3xl font-black text-yellow-500 uppercase italic mb-4">Virtual Raban</h2>
      <p className="text-yellow-200/50 mb-8">Click different parts of the Raban to play a rhythm!</p>

      <div className="relative w-64 h-64 mx-auto mb-12">
        {/* Raban Body */}
        <div className="absolute inset-0 rounded-full bg-orange-900 border-[12px] border-yellow-700 shadow-2xl" />
        <div className="absolute inset-4 rounded-full bg-[#d2b48c] border-4 border-orange-950 shadow-inner" />
        
        {/* Click Zones */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 rounded-full overflow-hidden">
          {[1, 2, 3, 4].map((id) => (
            <motion.div
              key={id}
              whileTap={{ scale: 0.95 }}
              onClick={() => playZone(id)}
              className={`cursor-pointer transition-colors ${
                activeZone === id ? 'bg-yellow-500/30' : 'hover:bg-white/5'
              }`}
            />
          ))}
        </div>
        
        {/* Center Zone */}
        <motion.div
          whileTap={{ scale: 0.9 }}
          onClick={() => playZone(0)}
          className={`absolute inset-[30%] rounded-full border-2 border-orange-950/30 cursor-pointer flex items-center justify-center ${
            activeZone === 0 ? 'bg-yellow-500/40' : 'hover:bg-white/10'
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-orange-950/20" />
        </motion.div>
      </div>

      <div className="flex justify-center gap-2 h-8">
        {rhythm.map((id, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-3 h-3 rounded-full ${
              id === 0 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <button
          disabled={rolling}
          onClick={playRhythm}
          className="bg-yellow-500 hover:bg-yellow-400 text-red-900 font-black px-8 py-3 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <Music size={20} /> Play Traditional Rhythm
        </button>
        <div className="flex items-center justify-center gap-2 text-yellow-600 font-bold italic">
          <Music size={18} />
          <span>Keep the rhythm going!</span>
        </div>
      </div>
    </div>
  );
};
