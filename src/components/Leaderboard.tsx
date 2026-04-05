import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal } from 'lucide-react';
import { supabase, Score } from '../lib/supabase';

export const Leaderboard: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();

    // Real-time subscription for leaderboard changes
    const subscription = supabase
      .channel('leaderboard-all-changes')
      .on(
        'postgres_changes' as any, 
        { event: '*', schema: 'public', table: 'leaderboard' }, 
        (payload: any) => {
          console.log('Real-time score update:', payload);
          // Refresh the board on any change (INSERT, UPDATE, DELETE)
          fetchScores();
        }
      )
      .subscribe((status) => {
        console.log('Real-time sync status:', status);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchScores = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(5);

      if (error) {
        console.error('LEADERBOARD FETCH ERROR:', error);
        // Alert if critical (like table missing)
        if (error.code === '42P01') {
          console.warn('The "leaderboard" table does not exist yet. Please run the SQL in your Supabase Dashboard.');
        }
      } else if (data) {
        setScores(data);
      }
    } catch (err) {
      console.error('Unexpected error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGameName = (id: string) => {
    const names: Record<string, string> = {
      'pillow-fight': 'Kotta Pora',
      'memory-match': 'Memory Match',
      'elephant-eye': 'Elephant Eye',
      'quiz': 'Avurudu Quiz',
      'pancha': 'Pancha Keliya',
      'pot-break': 'Kana Mutti',
      'raban': 'Virtual Raban',
      'word-search': 'Word Search',
      'greasy-pole': 'Grees Gahe'
    };
    return names[id] || id.replace('-', ' ');
  };

  return (
    <div className="bg-red-900/40 backdrop-blur-md rounded-3xl border-4 border-yellow-600/30 p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="text-yellow-500" size={32} />
        <h2 className="text-3xl font-black text-yellow-500 uppercase italic tracking-tighter">Top 5 Champions</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-4">
          {scores.map((score, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={score.id}
              className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                index === 0 
                  ? 'bg-yellow-500/20 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]' 
                  : 'bg-red-950/50 border-yellow-600/10'
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shadow-lg ${
                  index === 0 ? 'bg-yellow-500 text-red-900 scale-110' : 
                  index === 1 ? 'bg-slate-300 text-slate-800' :
                  index === 2 ? 'bg-orange-400 text-orange-900' :
                  'bg-red-900 text-yellow-500'
                }`}>
                  {index === 0 ? '👑' : index + 1}
                </div>
                <div>
                  <div className="font-black text-white text-xl uppercase italic leading-none mb-1">{score.username}</div>
                  <div className="text-[10px] text-yellow-500 font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Medal size={12} /> {getGameName(score.game_id)}
                  </div>
                </div>
              </div>
              <div className="text-3xl font-black text-yellow-500 tabular-nums">
                {score.score}
              </div>
            </motion.div>
          ))}
          {scores.length === 0 && (
            <div className="text-center py-12 text-yellow-600/50 font-bold italic">No scores yet. Be the first!</div>
          )}
        </div>
      )}
    </div>
  );
};
