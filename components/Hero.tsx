
import React from 'react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center text-center py-24 md:py-48 relative overflow-hidden">
      {/* Subtle Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none select-none opacity-[0.015] tracking-[0.5em] font-black uppercase overflow-hidden whitespace-nowrap">
        <h2 className="text-[25vw] text-white">IN FIDE VADE</h2>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-4xl px-4">
        <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] mb-8 tracking-tighter">
          Master the <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-600">CBC Curriculum</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed font-medium">
          A digital framework from Limuru Girls' Secondary School. 
          Bridging the gap between classroom guidelines and real-world implementation.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button 
            onClick={onStart}
            className="group relative bg-emerald-600 text-white px-10 py-5 rounded-xl font-bold text-base shadow-xl shadow-emerald-950/20 hover:bg-emerald-500 transition-all active:scale-95 flex items-center justify-center gap-3 border border-emerald-400/20"
          >
            Start Analyzing
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        <div className="mt-32 flex flex-col items-center opacity-40">
          <h3 className="text-amber-500 font-black text-xl tracking-[0.6em] uppercase">IN FIDE VADE</h3>
          <p className="text-slate-500 text-[9px] uppercase tracking-[0.3em] mt-2 font-bold">Go In Faith</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
