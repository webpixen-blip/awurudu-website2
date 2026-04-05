import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase, NakathTime, Question, RabanSound } from '../lib/supabase';
import { Plus, Trash2, Save, X, Settings, Clock, Calendar, HelpCircle, Music, CheckCircle2 } from 'lucide-react';

type AdminTab = 'nakath' | 'quiz' | 'raban';

export const AdminPortal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('nakath');
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [nakathTimes, setNakathTimes] = useState<NakathTime[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [rabanSounds, setRabanSounds] = useState<RabanSound[]>([]);
  
  // Editing States
  const [editingNakath, setEditingNakath] = useState<Partial<NakathTime> | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);
  const [editingSound, setEditingSound] = useState<Partial<RabanSound> | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'nakath') {
      const { data } = await supabase.from('nakath_times').select('*').order('created_at', { ascending: true });
      if (data) setNakathTimes(data);
    } else if (activeTab === 'quiz') {
      const { data } = await supabase.from('quiz_questions').select('*').order('created_at', { ascending: true });
      if (data) setQuestions(data);
    } else if (activeTab === 'raban') {
      const { data } = await supabase.from('raban_sounds').select('*');
      if (data) setRabanSounds(data);
    }
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'tttTttt222@#$') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  // --- Nakath Handlers ---
  const handleSaveNakath = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNakath?.title || !editingNakath?.time) return;
    setLoading(true);
    if (editingNakath.id) {
      await supabase.from('nakath_times').update(editingNakath).eq('id', editingNakath.id);
    } else {
      await supabase.from('nakath_times').insert([editingNakath]);
    }
    setEditingNakath(null);
    fetchData();
  };

  const handleDeleteNakath = async (id: string) => {
    if (!confirm('Delete this Nakath time?')) return;
    await supabase.from('nakath_times').delete().eq('id', id);
    fetchData();
  };

  // --- Quiz Handlers ---
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion?.question || !editingQuestion?.options) return;
    setLoading(true);
    if (editingQuestion.id) {
      await supabase.from('quiz_questions').update(editingQuestion).eq('id', editingQuestion.id);
    } else {
      await supabase.from('quiz_questions').insert([editingQuestion]);
    }
    setEditingQuestion(null);
    fetchData();
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    await supabase.from('quiz_questions').delete().eq('id', id);
    fetchData();
  };

  // --- Raban Sound Handlers ---
  const handleSaveSound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSound?.name || !editingSound?.url) return;
    setLoading(true);
    if (editingSound.id) {
      await supabase.from('raban_sounds').update(editingSound).eq('id', editingSound.id);
    } else {
      await supabase.from('raban_sounds').insert([editingSound]);
    }
    setEditingSound(null);
    fetchData();
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md bg-red-950 border-4 border-yellow-600/30 p-8 rounded-[2.5rem]">
          <div className="text-center mb-8">
            <Settings className="mx-auto text-yellow-500 mb-4" size={48} />
            <h2 className="text-3xl font-black text-yellow-500 uppercase italic">Admin Portal</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-red-900/40 border-2 border-yellow-600/20 rounded-2xl px-6 py-4 text-yellow-500 focus:border-yellow-500 outline-none" placeholder="Enter password..." />
            <div className="flex gap-4">
              <button type="button" onClick={onClose} className="flex-1 bg-red-900/40 text-yellow-500 font-black py-4 rounded-2xl uppercase tracking-widest">Cancel</button>
              <button type="submit" className="flex-1 bg-yellow-500 text-red-950 font-black py-4 rounded-2xl uppercase tracking-widest">Login</button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-5xl bg-red-950 border-4 border-yellow-600/30 p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] my-auto min-h-[80vh]">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-3xl font-black text-yellow-500 uppercase italic leading-tight">Admin Dashboard</h2>
          <button onClick={onClose} className="text-yellow-600 hover:text-yellow-500 shrink-0 ml-2"><X size={24} className="sm:w-8 sm:h-8" /></button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 bg-red-900/20 p-1 sm:p-2 rounded-xl sm:rounded-2xl overflow-x-auto no-scrollbar">
          {(['nakath', 'quiz', 'raban'] as AdminTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[80px] py-2 sm:py-3 rounded-lg sm:rounded-xl font-black uppercase text-[10px] sm:text-sm tracking-widest transition-all flex items-center justify-center gap-1 sm:gap-2 ${
                activeTab === tab ? 'bg-yellow-500 text-red-950' : 'text-yellow-600 hover:bg-white/5'
              }`}
            >
              {tab === 'nakath' && <Clock size={14} className="sm:w-[18px] sm:h-[18px]" />}
              {tab === 'quiz' && <HelpCircle size={14} className="sm:w-[18px] sm:h-[18px]" />}
              {tab === 'raban' && <Music size={14} className="sm:w-[18px] sm:h-[18px]" />}
              {tab}
            </button>
          ))}
        </div>

        {/* --- Nakath Tab --- */}
        {activeTab === 'nakath' && (
          <div className="space-y-4 sm:space-y-6">
            <button onClick={() => setEditingNakath({ title: '', time: '', description: '', icon: '🌞' })} className="w-full bg-yellow-500/10 border-2 border-dashed border-yellow-600/30 text-yellow-500 font-black py-3 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base">
              <Plus size={18} /> Add Nakath Time
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {nakathTimes.map(n => (
                <div key={n.id} className="bg-red-900/20 border-2 border-yellow-600/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex justify-between items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-yellow-500 uppercase text-sm sm:text-base truncate">{n.title}</h3>
                    <p className="text-yellow-600 text-xs sm:text-sm truncate">{n.time}</p>
                  </div>
                  <div className="flex gap-1.5 sm:gap-2 shrink-0">
                    <button onClick={() => setEditingNakath(n)} className="p-2 bg-yellow-500 text-red-950 rounded-lg"><Settings size={14} /></button>
                    <button onClick={() => handleDeleteNakath(n.id)} className="p-2 bg-red-600 text-white rounded-lg"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Quiz Tab --- */}
        {activeTab === 'quiz' && (
          <div className="space-y-4 sm:space-y-6">
            <button onClick={() => setEditingQuestion({ question: '', options: ['', '', '', ''], correct_answer: 0 })} className="w-full bg-yellow-500/10 border-2 border-dashed border-yellow-600/30 text-yellow-500 font-black py-3 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base">
              <Plus size={18} /> Add Quiz Question
            </button>
            <div className="space-y-3 sm:space-y-4">
              {questions.map(q => (
                <div key={q.id} className="bg-red-900/20 border-2 border-yellow-600/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex justify-between items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-yellow-500 text-sm sm:text-base truncate">{q.question}</h3>
                    <p className="text-yellow-600/60 text-[10px] sm:text-xs mt-1 truncate">{q.options.join(' | ')}</p>
                  </div>
                  <div className="flex gap-1.5 sm:gap-2 shrink-0">
                    <button onClick={() => setEditingQuestion(q)} className="p-2 bg-yellow-500 text-red-950 rounded-lg"><Settings size={14} /></button>
                    <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 bg-red-600 text-white rounded-lg"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Raban Tab --- */}
        {activeTab === 'raban' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-yellow-500/10 border-2 border-yellow-600/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
              <h3 className="text-yellow-500 font-black uppercase mb-1 sm:mb-2 text-sm sm:text-base">Raban Sound Settings</h3>
              <p className="text-yellow-200/50 text-[10px] sm:text-sm">Update the URLs for the Raban sounds. Use direct MP3 links.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {rabanSounds.map(s => (
                <div key={s.id} className="bg-red-900/20 border-2 border-yellow-600/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex justify-between items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-yellow-500 uppercase text-sm sm:text-base truncate">{s.name}</h3>
                    <p className="text-yellow-600 text-[10px] sm:text-xs truncate break-all">{s.url}</p>
                  </div>
                  <button onClick={() => setEditingSound(s)} className="p-2 bg-yellow-500 text-red-950 rounded-lg shrink-0"><Settings size={14} /></button>
                </div>
              ))}
              {rabanSounds.length === 0 && (
                <button onClick={() => setEditingSound({ name: 'raban_low', url: '' })} className="w-full bg-yellow-500/10 border-2 border-dashed border-yellow-600/30 text-yellow-500 font-black py-3 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base">
                  <Plus size={18} /> Initialize Raban Sounds
                </button>
              )}
            </div>
          </div>
        )}

        {/* --- Modals --- */}
        {editingNakath && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl bg-red-950 border-4 border-yellow-600/30 p-8 rounded-[2.5rem]">
              <h3 className="text-2xl font-black text-yellow-500 uppercase italic mb-8">{editingNakath.id ? 'Edit Nakath' : 'New Nakath'}</h3>
              <form onSubmit={handleSaveNakath} className="space-y-4">
                <input type="text" required value={editingNakath.title} onChange={e => setEditingNakath({...editingNakath, title: e.target.value})} className="w-full bg-red-900/40 border-2 border-yellow-600/20 rounded-xl px-4 py-3 text-yellow-500" placeholder="Title" />
                <input type="text" required value={editingNakath.time} onChange={e => setEditingNakath({...editingNakath, time: e.target.value})} className="w-full bg-red-900/40 border-2 border-yellow-600/20 rounded-xl px-4 py-3 text-yellow-500" placeholder="Time" />
                <textarea value={editingNakath.description} onChange={e => setEditingNakath({...editingNakath, description: e.target.value})} className="w-full bg-red-900/40 border-2 border-yellow-600/20 rounded-xl px-4 py-3 text-yellow-500 h-24" placeholder="Description" />
                <div className="flex gap-4">
                  <button type="button" onClick={() => setEditingNakath(null)} className="flex-1 bg-red-900/40 text-yellow-500 font-black py-3 rounded-xl">Cancel</button>
                  <button type="submit" className="flex-1 bg-yellow-500 text-red-950 font-black py-3 rounded-xl">Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {editingQuestion && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl bg-red-950 border-4 border-yellow-600/30 p-8 rounded-[2.5rem]">
              <h3 className="text-2xl font-black text-yellow-500 uppercase italic mb-8">Quiz Question</h3>
              <form onSubmit={handleSaveQuestion} className="space-y-4">
                <input type="text" required value={editingQuestion.question} onChange={e => setEditingQuestion({...editingQuestion, question: e.target.value})} className="w-full bg-red-900/40 border-2 border-yellow-600/20 rounded-xl px-4 py-3 text-yellow-500" placeholder="Question" />
                <div className="grid grid-cols-2 gap-4">
                  {editingQuestion.options?.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="text" required value={opt} onChange={e => {
                        const newOpts = [...(editingQuestion.options || [])];
                        newOpts[i] = e.target.value;
                        setEditingQuestion({...editingQuestion, options: newOpts});
                      }} className="flex-1 bg-red-900/40 border-2 border-yellow-600/20 rounded-xl px-4 py-3 text-yellow-500" placeholder={`Option ${i+1}`} />
                      <input type="radio" checked={editingQuestion.correct_answer === i} onChange={() => setEditingQuestion({...editingQuestion, correct_answer: i})} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setEditingQuestion(null)} className="flex-1 bg-red-900/40 text-yellow-500 font-black py-3 rounded-xl">Cancel</button>
                  <button type="submit" className="flex-1 bg-yellow-500 text-red-950 font-black py-3 rounded-xl">Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {editingSound && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl bg-red-950 border-4 border-yellow-600/30 p-8 rounded-[2.5rem]">
              <h3 className="text-2xl font-black text-yellow-500 uppercase italic mb-8">Raban Sound</h3>
              <form onSubmit={handleSaveSound} className="space-y-4">
                <input type="text" required value={editingSound.name} onChange={e => setEditingSound({...editingSound, name: e.target.value})} className="w-full bg-red-900/40 border-2 border-yellow-600/20 rounded-xl px-4 py-3 text-yellow-500" placeholder="Sound Name (e.g. raban_low)" />
                <input type="text" required value={editingSound.url} onChange={e => setEditingSound({...editingSound, url: e.target.value})} className="w-full bg-red-900/40 border-2 border-yellow-600/20 rounded-xl px-4 py-3 text-yellow-500" placeholder="MP3 URL" />
                <div className="flex gap-4">
                  <button type="button" onClick={() => setEditingSound(null)} className="flex-1 bg-red-900/40 text-yellow-500 font-black py-3 rounded-xl">Cancel</button>
                  <button type="submit" className="flex-1 bg-yellow-500 text-red-950 font-black py-3 rounded-xl">Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
