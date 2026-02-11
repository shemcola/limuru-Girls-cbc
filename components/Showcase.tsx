
import React from 'react';

const Showcase: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-24 py-16 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em]">Strategic Mission</p>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">Educational Integrity</h2>
        <p className="text-xl text-emerald-500 font-bold italic opacity-80 mt-4">"Developing the Total Person in a Secure Digital Environment."</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900/20 p-10 rounded-3xl border border-emerald-900/20 space-y-6">
          <h3 className="text-2xl font-black text-white">The Vision</h3>
          <p className="text-slate-400 text-base leading-relaxed font-medium">
            Automating CBC documentation so educators can return their primary focus to the learner's journey.
          </p>
          <div className="flex gap-3">
            <span className="text-[9px] font-black uppercase text-emerald-400 border border-emerald-400/20 px-3 py-1 rounded-md">Accuracy</span>
            <span className="text-[9px] font-black uppercase text-emerald-400 border border-emerald-400/20 px-3 py-1 rounded-md">Speed</span>
          </div>
        </div>

        <div className="bg-slate-900/20 p-10 rounded-3xl border border-emerald-900/20 flex flex-col justify-center space-y-6">
          <p className="text-2xl font-black text-emerald-400 leading-tight">"Technology is the ultimate tool for equity."</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl border border-white/5">👩‍🏫</div>
            <div>
              <p className="font-bold text-white text-base">Madam Nasimiyu</p>
              <p className="text-emerald-500 text-[9px] font-black uppercase tracking-widest">Project Patron</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 border-t border-emerald-900/10 text-center space-y-4">
        <h3 className="text-5xl md:text-8xl font-black text-white/5 tracking-[0.2em]">IN FIDE VADE</h3>
        <p className="text-slate-500 text-sm font-medium tracking-widest uppercase">Go in Faith • Limuru Girls'</p>
      </div>
    </div>
  );
};

export default Showcase;
