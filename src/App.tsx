import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Trophy, Info, Volume2, VolumeX, User, ChevronRight, Settings } from 'lucide-react';
import { PillowFight } from './components/games/PillowFight';
import { MemoryMatch } from './components/games/MemoryMatch';
import { ElephantEye } from './components/games/ElephantEye';
import { AvuruduQuiz } from './components/games/AvuruduQuiz';
import { PanchaKeliya } from './components/games/PanchaKeliya';
import { PotBreaking } from './components/games/PotBreaking';
import { RabanPlaying } from './components/games/RabanPlaying';
import { WordSearch } from './components/games/WordSearch';
import { GreasyPole } from './components/games/GreasyPole';
import { Countdown } from './components/Countdown';
import { Leaderboard } from './components/Leaderboard';
import { AdminPortal } from './components/AdminPortal';
import { NakathTimes } from './components/NakathTimes';
import { GreetingCardCreator } from './components/GreetingCardCreator';
import { AdsterraSystem, MonetagSystem, DirectLinkButton, FloatingDirectLink, RewardDirectLink, StickyPromoBar } from './components/AdSystem';

const GAMES = [
  { id: 'pillow-fight', name: 'Kotta Pora', icon: '🥊', description: 'Fast-paced tapping battle' },
  { id: 'memory-match', name: 'Memory Match', icon: '🥮', description: 'Match traditional food pairs' },
  { id: 'elephant-eye', name: 'Elephant Eye', icon: '🐘', description: 'Mark the eye precisely' },
  { id: 'quiz', name: 'Avurudu Quiz', icon: '❓', description: 'Test your knowledge' },
  { id: 'pancha', name: 'Pancha Keliya', icon: '🐚', description: 'Roll the kavadi shells' },
  { id: 'pot-break', name: 'Kana Mutti', icon: '🏺', description: 'Find the hidden prize' },
  { id: 'raban', name: 'Virtual Raban', icon: '🥁', description: 'Play traditional rhythms' },
  { id: 'word-search', name: 'Word Search', icon: '🔍', description: 'Find Avurudu words' },
  { id: 'greasy-pole', name: 'Grees Gahe', icon: '🧗', description: 'Climb the greasy pole' },
];

export default function App() {
  const [username, setUsername] = useState<string>(localStorage.getItem('avurudu_user') || '');
  const [tempName, setTempName] = useState('');
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showCardCreator, setShowCardCreator] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [rewardContent, setRewardContent] = useState({ title: '', message: '' });
  const [soundEnabled, setSoundEnabled] = useState(true);

  const triggerReward = (title: string, message: string) => {
    setRewardContent({ title, message });
    setShowReward(true);
  };

  useEffect(() => {
    // Randomly show reward when returning to hub
    if (!activeGame && !showLeaderboard && username) {
      const shouldShow = Math.random() < 0.15; // 15% chance
      if (shouldShow) {
        const timer = setTimeout(() => {
          triggerReward(
            "Exclusive Hub Bonus!",
            "You've unlocked a special hub visitor reward. Claim your Avurudu gift now!"
          );
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [activeGame, showLeaderboard, username]);

  const handleGameComplete = () => {
    // Always show reward on game completion for high earnings
    setTimeout(() => {
      triggerReward(
        "Victory Reward!",
        "Amazing performance! As a winner, you've earned an exclusive Avurudu Mega Prize. Claim it below!"
      );
    }, 1000);
  };

  const handleSetUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setUsername(tempName.trim());
      localStorage.setItem('avurudu_user', tempName.trim());
    }
  };

  if (!username) {
    return (
      <div className="min-h-screen bg-[#4a0404] flex items-center justify-center p-6 font-sans">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500 via-transparent to-transparent" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-red-900/40 backdrop-blur-xl p-10 rounded-[2.5rem] border-4 border-yellow-600/30 shadow-2xl relative z-10"
        >
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">🌞</div>
            <h1 className="text-5xl font-black text-yellow-500 uppercase italic tracking-tighter leading-none mb-2">Avurudu Hub</h1>
            <p className="text-yellow-200/60 font-medium">Digital New Year Celebrations</p>
          </div>

          <form onSubmit={handleSetUsername} className="space-y-6">
            <div>
              <label className="block text-yellow-500 text-xs font-black uppercase tracking-widest mb-2 ml-1">Enter Your Name</label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="e.g. Kasun"
                className="w-full bg-red-950/50 border-2 border-yellow-600/20 rounded-2xl px-6 py-4 text-white placeholder:text-red-900/50 focus:border-yellow-500 outline-none transition-all text-lg font-bold"
                maxLength={15}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-red-900 font-black py-5 rounded-2xl text-xl shadow-[0_8px_0_rgb(180,130,0)] active:translate-y-1 active:shadow-[0_4px_0_rgb(180,130,0)] transition-all uppercase tracking-tight"
            >
              Enter Hub
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4a0404] text-white font-sans pb-20">
      <StickyPromoBar />
      <AdsterraSystem />
      <MonetagSystem />
      <FloatingDirectLink />
      {showReward && (
        <RewardDirectLink 
          title={rewardContent.title}
          message={rewardContent.message}
          onClose={() => setShowReward(false)} 
        />
      )}
      {/* Header */}
      <header className="sticky top-0 z-50 bg-red-950/80 backdrop-blur-md border-b-2 border-yellow-600/20 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => { setActiveGame(null); setShowLeaderboard(false); }}>
          <span className="text-2xl sm:text-3xl">🌞</span>
          <h1 className="text-xl sm:text-2xl font-black text-yellow-500 uppercase italic tracking-tighter">Avurudu Hub</h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 sm:p-2 bg-red-900/50 rounded-xl border border-yellow-600/20 text-yellow-500"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <div className="flex items-center gap-2 bg-yellow-600/20 border border-yellow-600/30 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full">
            <User size={14} className="text-yellow-500" />
            <span className="text-xs sm:text-sm font-black text-yellow-500 uppercase">{username}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {!activeGame && !showLeaderboard && (
            <motion.div
              key="hub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <section className="bg-gradient-to-br from-red-800 to-red-950 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-4 border-yellow-600/30 relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl sm:text-4xl font-black text-yellow-500 mb-2 uppercase italic leading-tight">Subha Aluth Avuruddak Wewa!</h2>
                  <p className="text-yellow-200/70 mb-6 max-w-md text-sm sm:text-base">Celebrate the Sinhala & Tamil New Year with our digital traditional games. Compete globally!</p>
                  
                  <div className="mb-8 max-w-sm">
                    <p className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.3em] mb-3">Countdown to Avurudu</p>
                    <Countdown />
                  </div>

                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <button 
                      onClick={() => setShowLeaderboard(true)}
                      className="flex-1 sm:flex-none bg-yellow-500 text-red-900 font-black px-4 sm:px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors text-sm sm:text-base"
                    >
                      <Trophy size={18} /> Leaderboard
                    </button>
                    <button 
                      onClick={() => setShowAdmin(true)}
                      className="flex-1 sm:flex-none bg-red-900/40 border-2 border-yellow-600/30 text-yellow-500 font-black px-4 sm:px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-900/60 transition-colors text-sm sm:text-base"
                    >
                      <Settings size={18} /> Admin
                    </button>
                  </div>
                </div>
                <div className="absolute -right-10 -bottom-10 text-[8rem] sm:text-[12rem] opacity-10 rotate-12">🌞</div>
              </section>

              {/* Greeting Card Section */}
              <section className="bg-yellow-500/10 border-4 border-yellow-600/20 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative overflow-hidden group">
                <div className="text-4xl sm:text-6xl bg-yellow-500/20 w-20 sm:w-28 h-20 sm:h-28 flex items-center justify-center rounded-3xl shrink-0 group-hover:scale-110 transition-transform">
                  ✉️
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl font-black text-yellow-500 uppercase italic mb-2">Create Your Greeting Card</h3>
                  <p className="text-yellow-200/60 text-sm sm:text-base mb-6">Send beautiful Avurudu wishes to your loved ones with our custom card creator!</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => setShowCardCreator(true)}
                      className="flex-1 bg-yellow-500 text-red-950 font-black px-8 py-3 rounded-xl uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg active:scale-95"
                    >
                      Start Creating
                    </button>
                    <DirectLinkButton className="flex-1" />
                  </div>
                </div>
                <div className="absolute -right-4 -top-4 text-6xl opacity-10 rotate-45">✨</div>
              </section>

              {/* Games Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {GAMES.map((game) => (
                  <motion.div
                    key={game.id}
                    whileHover={{ y: -5 }}
                    onClick={() => setActiveGame(game.id)}
                    className="bg-red-900/30 border-2 border-yellow-600/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl cursor-pointer hover:border-yellow-500/50 transition-all group flex items-center gap-4 sm:gap-6"
                  >
                    <div className="text-3xl sm:text-5xl bg-red-950/50 w-14 sm:w-20 h-14 sm:h-20 flex items-center justify-center rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform shrink-0">
                      {game.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-2xl font-black text-yellow-500 uppercase italic tracking-tight leading-tight">{game.name}</h3>
                      <p className="text-yellow-200/50 text-xs sm:text-sm font-medium">{game.description}</p>
                    </div>
                    <ChevronRight className="text-yellow-600 shrink-0" size={20} />
                  </motion.div>
                ))}
              </div>

              {/* Nakath Times Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-yellow-500 uppercase italic tracking-tight">Auspicious Times (Nakath)</h2>
                </div>
                <NakathTimes />
              </section>
            </motion.div>
          )}

          {activeGame && (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <button 
                onClick={() => setActiveGame(null)}
                className="text-yellow-500 font-black uppercase tracking-widest flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
              >
                ← Back to Hub
              </button>

              {activeGame === 'pillow-fight' && <PillowFight username={username} soundEnabled={soundEnabled} onComplete={handleGameComplete} />}
              {activeGame === 'memory-match' && <MemoryMatch username={username} soundEnabled={soundEnabled} onComplete={handleGameComplete} />}
              {activeGame === 'elephant-eye' && <ElephantEye username={username} soundEnabled={soundEnabled} onComplete={handleGameComplete} />}
              {activeGame === 'quiz' && <AvuruduQuiz username={username} onComplete={handleGameComplete} />}
              {activeGame === 'pancha' && <PanchaKeliya username={username} onComplete={handleGameComplete} />}
              {activeGame === 'pot-break' && <PotBreaking username={username} onComplete={handleGameComplete} />}
              {activeGame === 'raban' && <RabanPlaying soundEnabled={soundEnabled} />}
              {activeGame === 'word-search' && <WordSearch username={username} onComplete={handleGameComplete} />}
              {activeGame === 'greasy-pole' && <GreasyPole username={username} onComplete={handleGameComplete} />}
            </motion.div>
          )}

          {showLeaderboard && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <button 
                onClick={() => setShowLeaderboard(false)}
                className="text-yellow-500 font-black uppercase tracking-widest flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
              >
                ← Back to Hub
              </button>
              <Leaderboard />
            </motion.div>
          )}

          {showAdmin && <AdminPortal onClose={() => setShowAdmin(false)} />}
          {showCardCreator && <GreetingCardCreator defaultName={username} onClose={() => setShowCardCreator(false)} />}
        </AnimatePresence>
      </main>
    </div>
  );
}
