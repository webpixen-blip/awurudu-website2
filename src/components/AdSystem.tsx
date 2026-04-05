import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  zoneId?: string;
  className?: string;
}

/**
 * Adsterra Banner Component
 * Usage: <AdUnit zoneId="your_zone_id" />
 */
export const AdUnit: React.FC<AdUnitProps> = ({ zoneId, className = '' }) => {
  const defaultZoneId = import.meta.env.VITE_ADSTERRA_BANNER_ID;
  const activeZoneId = zoneId || defaultZoneId;
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeZoneId && adRef.current) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = `//www.highperformanceformat.com/${activeZoneId}/invoke.js`;
      
      const container = adRef.current;
      container.innerHTML = ''; // Clear previous ad
      
      // Adsterra requires a specific global variable for the script to pick up
      const configScript = document.createElement('script');
      configScript.type = 'text/javascript';
      configScript.innerHTML = `
        atOptions = {
          'key' : '${activeZoneId}',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
      
      container.appendChild(configScript);
      container.appendChild(script);
    }
  }, [activeZoneId]);

  if (!activeZoneId) {
    return (
      <div className={`bg-yellow-500/5 border-2 border-dashed border-yellow-600/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center ${className}`}>
        <p className="text-yellow-600/40 text-[10px] font-black uppercase tracking-widest">Ad Space</p>
        <p className="text-yellow-600/20 text-[8px] mt-1 italic">Configure Adsterra in Secrets to monetize</p>
      </div>
    );
  }

  return (
    <div ref={adRef} className={`overflow-hidden rounded-2xl flex justify-center ${className}`} />
  );
};

/**
 * Adsterra Popunder / Social Bar
 */
export const AdsterraSystem: React.FC = () => {
  const popunderId = import.meta.env.VITE_ADSTERRA_POPUNDER_ID;

  useEffect(() => {
    if (popunderId) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//pl25946111.highperformanceformat.com/${popunderId}/invoke.js`;
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [popunderId]);

  return null;
};

/**
 * Monetag System (Popunder/Direct Link)
 */
export const MonetagSystem: React.FC = () => {
  const zoneId = import.meta.env.VITE_MONETAG_ZONE_ID;

  useEffect(() => {
    if (zoneId) {
      const script = document.createElement('script');
      script.src = `https://alwingulla.com/tag.min.js?z=${zoneId}`;
      script.async = true;
      script.dataset.cfasync = 'false';
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [zoneId]);

  return null;
};

/**
 * Monetag Direct Link System
 * Provides multiple ways to interact with Monetag Direct Links
 */
export const DirectLinkButton: React.FC<{ 
  label?: string; 
  className?: string;
  variant?: 'primary' | 'outline' | 'ghost' | 'gift';
}> = ({ 
  label = "🎁 Special Avurudu Gift", 
  className = "",
  variant = 'primary'
}) => {
  const directLink = import.meta.env.VITE_MONETAG_DIRECT_LINK || import.meta.env.VITE_MONETAG_SMART_LINK;

  if (!directLink) return null;

  const baseStyles = "inline-flex items-center justify-center gap-2 font-black px-6 py-3 rounded-xl uppercase tracking-widest transition-all shadow-lg active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-yellow-500 to-orange-500 text-red-950 hover:scale-105 animate-pulse",
    outline: "border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10",
    ghost: "text-yellow-500/60 hover:text-yellow-500 hover:bg-yellow-500/5 shadow-none",
    gift: "bg-red-600 text-white hover:bg-red-500 animate-bounce"
  };

  return (
    <a
      href={directLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <span>{label}</span>
    </a>
  );
};

/**
 * Floating Direct Link (Gift)
 */
export const FloatingDirectLink: React.FC = () => {
  const directLink = import.meta.env.VITE_MONETAG_DIRECT_LINK || import.meta.env.VITE_MONETAG_SMART_LINK;

  if (!directLink) return null;

  return (
    <a
      href={directLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-[60] w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center text-3xl shadow-2xl hover:scale-110 transition-transform animate-bounce border-4 border-white/20"
      title="Claim Your Avurudu Gift!"
    >
      🎁
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
        NEW
      </span>
    </a>
  );
};

/**
 * Sticky Promo Bar (Top)
 */
export const StickyPromoBar: React.FC = () => {
  const directLink = import.meta.env.VITE_MONETAG_DIRECT_LINK || import.meta.env.VITE_MONETAG_SMART_LINK;

  if (!directLink) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white py-2 px-4 text-center relative z-[100] shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-white/10 animate-shimmer pointer-events-none" />
      <a 
        href={directLink}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]"
      >
        <span>🔥 Limited Time: Claim Your Avurudu Mega Prize Now! 🔥</span>
        <span className="bg-white text-red-600 px-2 py-0.5 rounded-full animate-pulse">CLICK HERE</span>
      </a>
    </div>
  );
};

/**
 * Direct Link Interstitial (High Conversion Reward)
 */
export const RewardDirectLink: React.FC<{ onClose: () => void; title?: string; message?: string }> = ({ 
  onClose, 
  title = "Congratulations!", 
  message = "You've been selected for a special Avurudu Mega Prize. Claim it now before it's gone!" 
}) => {
  const directLink = import.meta.env.VITE_MONETAG_DIRECT_LINK || import.meta.env.VITE_MONETAG_SMART_LINK;

  if (!directLink) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-md">
      <div className="bg-red-950 border-4 border-yellow-500 p-6 sm:p-10 rounded-[2.5rem] max-w-sm w-full text-center relative overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.3)]">
        {/* Animated Background Elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative z-10">
          <div className="text-7xl mb-6 animate-tada drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">🎁</div>
          <h2 className="text-3xl sm:text-4xl font-black text-yellow-500 uppercase italic mb-4 leading-tight">{title}</h2>
          <p className="text-yellow-200/80 mb-8 font-medium leading-relaxed">{message}</p>
          
          <div className="space-y-4">
            <a
              href={directLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="block w-full bg-gradient-to-b from-yellow-400 to-yellow-600 text-red-950 font-black py-5 rounded-2xl text-xl uppercase tracking-widest hover:scale-105 transition-all shadow-[0_8px_0_rgb(180,130,0)] active:translate-y-1 active:shadow-[0_4px_0_rgb(180,130,0)]"
            >
              Claim Now
            </a>
            <button 
              onClick={onClose}
              className="text-yellow-500/30 text-xs font-black uppercase tracking-[0.2em] hover:text-yellow-500 transition-colors"
            >
              No thanks, I'll pass
            </button>
          </div>
        </div>
        
        {/* Progress Bar (Fake Loading) */}
        <div className="mt-8 h-1 w-full bg-red-900/50 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-500 animate-shimmer w-full" />
        </div>
      </div>
    </div>
  );
};
