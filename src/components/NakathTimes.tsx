import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase, NakathTime } from '../lib/supabase';
import { Clock, Calendar, ChevronRight } from 'lucide-react';

export const NakathTimes: React.FC = () => {
  const [nakathTimes, setNakathTimes] = useState<NakathTime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNakathTimes();
  }, []);

  const fetchNakathTimes = async () => {
    const { data, error } = await supabase
      .from('nakath_times')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (!error && data) {
      setNakathTimes(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (nakathTimes.length === 0) {
    return (
      <div className="text-center p-12 bg-red-900/20 rounded-3xl border-2 border-yellow-600/20">
        <p className="text-yellow-200/50 font-black uppercase italic">Nakath times will be updated soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nakathTimes.map((nakath, index) => (
        <motion.div
          key={nakath.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-red-900/30 border-2 border-yellow-600/20 p-6 rounded-3xl hover:border-yellow-500/50 transition-all group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl bg-red-950/50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
              {nakath.icon || '🌞'}
            </div>
            <div>
              <h3 className="text-xl font-black text-yellow-500 uppercase italic leading-none mb-1">{nakath.title}</h3>
              <div className="flex items-center gap-1.5 text-yellow-600 font-black text-xs uppercase tracking-widest">
                <Clock size={12} /> {nakath.time}
              </div>
            </div>
          </div>
          <p className="text-yellow-200/60 text-sm font-medium leading-relaxed">
            {nakath.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
};
