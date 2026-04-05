import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Share2, Heart, Sparkles, Palette, Type, X, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';

interface Template {
  id: string;
  name: string;
  bg: string;
  accent: string;
  text: string;
  pattern?: string;
  greeting: string;
  subGreeting: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'traditional',
    name: 'Traditional Gold',
    bg: 'bg-gradient-to-br from-red-800 to-red-950',
    accent: 'text-yellow-500',
    text: 'text-yellow-100/90',
    pattern: 'radial-gradient(circle at 2px 2px, rgba(234, 179, 8, 0.1) 1px, transparent 0)',
    greeting: 'Subha Aluth Avuruddak Wewa!',
    subGreeting: 'May this New Year bring you joy, prosperity, and happiness.'
  },
  {
    id: 'nature',
    name: 'Nature Green',
    bg: 'bg-gradient-to-br from-emerald-800 to-emerald-950',
    accent: 'text-yellow-400',
    text: 'text-emerald-50/90',
    pattern: 'linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 75%, transparent 75%, transparent)',
    greeting: 'Puthu Varuda Vazhthukkal!',
    subGreeting: 'Wishing you a year filled with peace and abundance.'
  },
  {
    id: 'vibrant',
    name: 'Festive Orange',
    bg: 'bg-gradient-to-br from-orange-600 to-red-700',
    accent: 'text-white',
    text: 'text-orange-50/90',
    pattern: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
    greeting: 'Happy Sinhala & Tamil New Year!',
    subGreeting: 'Let the festivities begin! Enjoy the traditional games and sweets.'
  },
  {
    id: 'modern',
    name: 'Modern Minimal',
    bg: 'bg-stone-900',
    accent: 'text-yellow-500',
    text: 'text-stone-400',
    greeting: 'Avurudu Greetings!',
    subGreeting: 'Sending warm wishes to you and your family this festive season.'
  }
];

export const GreetingCardCreator: React.FC<{ onClose: () => void; defaultName: string }> = ({ onClose, defaultName }) => {
  const [name, setName] = useState(defaultName);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = `Avurudu_Greeting_${name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#eab308', '#ef4444', '#ffffff']
      });
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex items-center justify-center p-2 sm:p-8 overflow-y-auto">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-5xl bg-red-950/50 border-2 border-yellow-600/20 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl my-auto"
      >
        {/* Left: Preview Area */}
        <div className="flex-1 p-4 sm:p-12 flex flex-col items-center justify-center bg-black/20">
          <div className="w-full max-w-[280px] sm:max-w-md aspect-[4/5] relative group" ref={cardRef}>
            <div className={`absolute inset-0 ${selectedTemplate.bg} rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border-2 sm:border-4 border-yellow-600/30 overflow-hidden`}>
              {/* Pattern Overlay */}
              {selectedTemplate.pattern && (
                <div 
                  className="absolute inset-0 opacity-20" 
                  style={{ 
                    backgroundImage: selectedTemplate.pattern,
                    backgroundSize: selectedTemplate.id === 'traditional' ? '20px 20px' : '40px 40px'
                  }} 
                />
              )}
              
              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center p-4 sm:p-8 text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-6">🌞</div>
                <h3 className={`text-xl sm:text-4xl font-black uppercase italic leading-tight mb-2 sm:mb-4 ${selectedTemplate.accent}`}>
                  {selectedTemplate.greeting}
                </h3>
                <p className={`text-[10px] sm:text-base font-medium mb-4 sm:mb-8 max-w-[200px] sm:max-w-[250px] ${selectedTemplate.text}`}>
                  {selectedTemplate.subGreeting}
                </p>
                
                <div className="mt-auto pt-4 sm:pt-8 border-t border-white/10 w-full">
                  <p className={`text-[8px] sm:text-[10px] uppercase tracking-[0.3em] mb-1 ${selectedTemplate.text} opacity-60`}>With Love From</p>
                  <p className={`text-lg sm:text-2xl font-black italic ${selectedTemplate.accent}`}>{name || 'Your Name'}</p>
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-10 text-6xl sm:text-9xl opacity-10 rotate-12">🪔</div>
            </div>
          </div>
          
          <p className="mt-4 sm:mt-6 text-yellow-600/50 text-[10px] sm:text-xs italic">Preview of your beautiful greeting card</p>
        </div>

        {/* Right: Controls Area */}
        <div className="w-full lg:w-[400px] bg-red-950 p-6 sm:p-10 border-t lg:border-t-0 lg:border-l border-yellow-600/10 flex flex-col gap-6 sm:gap-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-black text-yellow-500 uppercase italic">Create Card</h2>
            <button onClick={onClose} className="text-yellow-600 hover:text-yellow-500 transition-colors">
              <X size={24} className="sm:w-7 sm:h-7" />
            </button>
          </div>

          {/* Name Input */}
          <div className="space-y-2 sm:space-y-3">
            <label className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-yellow-600 uppercase tracking-widest">
              <Type size={12} className="sm:w-3.5 sm:h-3.5" /> Your Name
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full bg-red-900/40 border-2 border-yellow-600/20 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-yellow-500 focus:border-yellow-500 outline-none transition-all"
            />
          </div>

          {/* Template Selection */}
          <div className="space-y-3 sm:space-y-4">
            <label className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-yellow-600 uppercase tracking-widest">
              <Palette size={12} className="sm:w-3.5 sm:h-3.5" /> Choose Template
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t)}
                  className={`relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all text-left overflow-hidden group ${
                    selectedTemplate.id === t.id 
                      ? 'border-yellow-500 bg-yellow-500/10' 
                      : 'border-yellow-600/10 bg-red-900/20 hover:border-yellow-600/30'
                  }`}
                >
                  <div className={`absolute inset-0 opacity-10 ${t.bg}`} />
                  <div className="relative z-10">
                    <div className="text-[8px] sm:text-[10px] font-black text-yellow-500 uppercase mb-1">{t.name}</div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${t.bg}`} />
                        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500`} />
                      </div>
                      {selectedTemplate.id === t.id && <Check size={12} className="text-yellow-500 sm:w-3.5 sm:h-3.5" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto pt-4 sm:pt-8 flex flex-col gap-3 sm:gap-4">
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className={`w-full bg-yellow-500 text-red-950 font-black py-4 sm:py-5 rounded-xl sm:rounded-2xl uppercase text-xs sm:text-sm tracking-widest flex items-center justify-center gap-2 sm:gap-3 hover:bg-yellow-400 transition-all shadow-lg active:scale-95 ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isDownloading ? (
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-red-950 border-t-transparent" />
              ) : (
                <Download size={18} className="sm:w-5 sm:h-5" />
              )}
              {isDownloading ? 'Creating...' : 'Download Card'}
            </button>
            
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('App link copied! Share it with your friends.');
              }}
              className="w-full bg-red-900/40 border-2 border-yellow-600/20 text-yellow-500 font-black py-3 sm:py-4 rounded-xl sm:rounded-2xl uppercase text-[10px] sm:text-xs tracking-widest flex items-center justify-center gap-2 sm:gap-3 hover:bg-red-900/60 transition-all"
            >
              <Share2 size={16} className="sm:w-[18px] sm:h-[18px]" /> Share App
            </button>
          </div>

          <div className="text-center">
            <p className="text-[10px] text-yellow-600/50 uppercase font-black tracking-widest flex items-center justify-center gap-1">
              Made with <Heart size={10} className="text-red-500 fill-red-500" /> for Avurudu 2026
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
