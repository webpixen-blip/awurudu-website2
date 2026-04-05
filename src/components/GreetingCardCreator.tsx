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
  icon: string;
  secondaryIcon?: string;
  greeting: string;
  subGreeting: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'golden-sun',
    name: 'Golden Sun',
    bg: 'linear-gradient(135deg, #7c0000 0%, #d4af37 100%)',
    accent: '#ffdf00',
    text: '#ffffff',
    icon: '🌞',
    secondaryIcon: '🏵️',
    greeting: 'Subha Aluth Avuruddak Wewa!',
    subGreeting: 'Wishing you a year filled with the brightness of the sun and the sweetness of prosperity.'
  },
  {
    id: 'midnight-puja',
    name: 'Midnight Puja',
    bg: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)',
    accent: '#fbbf24',
    text: '#f3f4f6',
    icon: '🪔',
    secondaryIcon: '✨',
    greeting: 'Joyful New Year Greetings!',
    subGreeting: 'May the light of traditional oil lamps guide your path to peace and infinite happiness.'
  },
  {
    id: 'emerald-fields',
    name: 'Emerald Fields',
    bg: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
    accent: '#fde047',
    text: '#f0fdf4',
    icon: '🌾',
    secondaryIcon: '🎋',
    greeting: 'Harvest of Happiness!',
    subGreeting: 'Celebrating the bountiful harvest and the unity of our families this festive season.'
  },
  {
    id: 'silk-lotus',
    name: 'Silk Lotus',
    bg: 'linear-gradient(135deg, #831843 0%, #9d174d 100%)',
    accent: '#f9a8d4',
    text: '#fff1f2',
    icon: '🪷',
    secondaryIcon: '🌸',
    greeting: 'Peaceful New Year!',
    subGreeting: 'May your heart bloom like a lotus with love and tranquility throughout the coming year.'
  }
];

export const GreetingCardCreator: React.FC<{ onClose: () => void; defaultName: string }> = ({ onClose, defaultName }) => {
  const [name, setName] = useState(defaultName);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [isDownloading, setIsDownloading] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!captureRef.current) return;
    setIsDownloading(true);
    
    try {
      // Small delay to ensure all animations and hidden styles are settled
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const canvas = await html2canvas(captureRef.current, {
        scale: 1, // Pre-scaled to 800x1000px for perfect quality
        useCORS: true,
        allowTaint: true,
        logging: true,
        backgroundColor: null
      });
      
      const link = document.createElement('a');
      const safeName = name.replace(/[<>:"/\\|?*]|\s+/g, '_') || 'Avurudu_Friend';
      link.download = `Avurudu_Card_${safeName}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#eab308', '#ef4444', '#ffffff'],
        zIndex: 9999
      });
    } catch (err: any) {
      console.error('CAPTURE ENGINE FAILURE:', err);
      alert(`Download failed: ${err?.message || 'Unknown error'}. Please try a different name.`);
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
          {/* USER VIEW CARD */}
          <div className="w-full max-w-[280px] sm:max-w-md aspect-[4/5] relative group scale-100 origin-center">
            <div 
              className={`absolute inset-0 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border-2 sm:border-4 border-yellow-600/30 overflow-hidden transition-all duration-500`}
              style={{ background: selectedTemplate.bg }}
            >
              <div className="relative h-full flex flex-col items-center justify-center p-4 sm:p-8 text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-6">{selectedTemplate.icon}</div>
                <h3 
                  className={`text-xl sm:text-4xl font-black uppercase italic leading-tight mb-2 sm:mb-4`}
                  style={{ color: selectedTemplate.accent }}
                >
                  {selectedTemplate.greeting}
                </h3>
                <p 
                  className={`text-[10px] sm:text-base font-medium mb-4 sm:mb-8 max-w-[200px] sm:max-w-[250px]`}
                  style={{ color: selectedTemplate.text }}
                >
                  {selectedTemplate.subGreeting}
                </p>
                
                <div className="mt-auto pt-4 sm:pt-8 border-t border-white/10 w-full">
                  <p 
                    className={`text-[8px] sm:text-[10px] uppercase tracking-[0.3em] mb-1 opacity-60`}
                    style={{ color: selectedTemplate.text }}
                  >With Love From</p>
                  <p 
                    className={`text-lg sm:text-2xl font-black italic`}
                    style={{ color: selectedTemplate.accent }}
                  >{name || 'Your Name'}</p>
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-10 text-6xl sm:text-9xl opacity-10 rotate-12">
                {selectedTemplate.secondaryIcon || '🌞'}
              </div>
            </div>
          </div>
          
          <p className="mt-4 sm:mt-6 text-yellow-600/50 text-[10px] sm:text-xs italic">Live Preview • Designer Template: {selectedTemplate.name}</p>
        </div>

        {/* HIDDEN CAPTURE CARD (800x1000 for perfect export) */}
        <div className="fixed -left-[2000px] top-0 pointer-events-none opacity-0">
          <div 
            ref={captureRef}
            className="flex flex-col items-center justify-center text-center overflow-hidden"
            style={{ 
              width: '800px', 
              height: '1000px', 
              background: selectedTemplate.bg,
              fontFamily: 'sans-serif'
            }}
          >
            <div style={{ fontSize: '120px', marginBottom: '40px' }}>{selectedTemplate.icon}</div>
            <h3 
              style={{ 
                fontSize: '72px', 
                fontWeight: '900', 
                textTransform: 'uppercase', 
                fontStyle: 'italic',
                lineHeight: '1.1',
                marginBottom: '40px',
                padding: '0 40px',
                color: selectedTemplate.accent 
              }}
            >
              {selectedTemplate.greeting}
            </h3>
            <p 
              style={{ 
                fontSize: '28px', 
                fontWeight: '500', 
                marginBottom: '100px',
                maxWidth: '600px',
                color: selectedTemplate.text 
              }}
            >
              {selectedTemplate.subGreeting}
            </p>
            
            <div style={{ marginTop: 'auto', padding: '60px', borderTop: '2px solid rgba(255,255,255,0.1)', width: '85%' }}>
              <p style={{ fontSize: '18px', textTransform: 'uppercase', letterSpacing: '8px', marginBottom: '15px', color: selectedTemplate.text, opacity: '0.6' }}>With Love From</p>
              <p style={{ fontSize: '48px', fontWeight: '900', fontStyle: 'italic', color: selectedTemplate.accent }}>{name || 'Your Name'}</p>
            </div>

            <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', fontSize: '250px', opacity: '0.1', transform: 'rotate(12deg)' }}>
              {selectedTemplate.secondaryIcon || '🌞'}
            </div>
          </div>
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
