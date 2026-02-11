
import React, { useState } from 'react';

interface CBCGuideProps {
  onDeepDive?: (query: string) => void;
}

const CBCGuide: React.FC<CBCGuideProps> = ({ onDeepDive }) => {
  const [active, setActive] = useState<'structure' | 'competencies' | 'assessment'>('structure');

  const competencies = [
    { name: 'Communication', icon: '🤝', desc: 'Working together and expressing ideas.' },
    { name: 'Critical Thinking', icon: '🧠', desc: 'Solving challenges logically.' },
    { name: 'Creativity', icon: '🎨', desc: 'Original thought and talent.' },
    { name: 'Self-Efficacy', icon: '👤', desc: 'Confidence to succeed independently.' },
    { name: 'Digital Literacy', icon: '💻', desc: 'Safe navigation of technology.' },
    { name: 'Learning to Learn', icon: '📚', desc: 'Assimilation of new knowledge.' },
  ];

  const handleCardClick = (title: string) => {
    if (onDeepDive) {
      onDeepDive(`Explain the KICD curriculum details for ${title} in Kenya, including subjects, learning areas, and latest updates.`);
    }
  };

  const handleIndicatorClick = (code: string, label: string) => {
    if (onDeepDive) {
      onDeepDive(`What are the KICD scoring criteria for '${code}' (${label})? How should teachers assess this?`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-16">
      <div className="text-center space-y-6">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Interactive Guide</h2>
        <p className="text-slate-400 text-sm font-medium">Click on any section below for a deep dive into official KICD guidelines.</p>
        <div className="flex bg-slate-900/40 p-1.5 rounded-2xl w-full max-w-md mx-auto border border-emerald-900/20 shadow-inner">
          {(['structure', 'competencies', 'assessment'] as const).map(s => (
            <button 
              key={s} 
              onClick={() => setActive(s)} 
              className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${active === s ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {active === 'structure' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {[
            { s: 'Pre-Primary', g: 'PP1 - PP2', d: 'Sensory-motor development and core values.' },
            { s: 'Primary', g: 'Grade 1-6', d: 'Foundational literacy and project-based learning.' },
            { s: 'Junior School', g: 'Grade 7-9', d: 'Exploration phase for identifying interests and Grade 9 transition.' },
            { s: 'Senior School', g: 'Grade 10-12', d: 'Pathway specialization in STEM, Arts, or Social Sciences.' },
          ].map((item, i) => (
            <div 
              key={i} 
              onClick={() => handleCardClick(item.s)}
              className="bg-slate-900/20 p-10 rounded-[2.5rem] border border-emerald-900/20 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group cursor-pointer relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
              <h4 className="font-black text-white text-2xl mb-2">{item.s}</h4>
              <p className="text-emerald-500 text-[11px] font-black uppercase tracking-[0.3em]">{item.g}</p>
              <p className="text-slate-400 text-base mt-6 font-medium leading-relaxed">{item.d}</p>
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500/60 group-hover:text-emerald-400">
                <span>Research Guidelines</span>
                <span className="w-4 h-px bg-emerald-500/20"></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {active === 'competencies' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {competencies.map((c, i) => (
            <div 
              key={i} 
              onClick={() => handleCardClick(`${c.name} Competency`)}
              className="bg-slate-900/20 p-8 rounded-3xl border border-emerald-900/20 flex flex-col items-center text-center hover:border-emerald-500/30 transition-all cursor-pointer group"
            >
              <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">{c.icon}</div>
              <h4 className="font-black text-white text-lg mb-2">{c.name}</h4>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      )}

      {active === 'assessment' && (
        <div className="bg-slate-900/20 p-16 rounded-[3rem] border border-emerald-900/20 text-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl">
          <div className="space-y-4">
            <h3 className="text-3xl font-black text-white">Performance Indicators</h3>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">Click any indicator to see official rubrics and assessment criteria.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { c: 'EE', l: 'Exceeding', b: 'bg-emerald-600', t: 'Exceeds Expectations' },
              { c: 'ME', l: 'Meeting', b: 'bg-blue-600', t: 'Meets Expectations' },
              { c: 'AE', l: 'Approaching', b: 'bg-amber-500', t: 'Approaching Expectations' },
              { c: 'BE', l: 'Below', b: 'bg-rose-500', t: 'Below Expectations' },
            ].map((lev, i) => (
              <div 
                key={i} 
                onClick={() => handleIndicatorClick(lev.c, lev.t)}
                className="space-y-4 cursor-pointer group"
              >
                <div className={`w-20 h-20 mx-auto ${lev.b} rounded-2xl flex items-center justify-center text-black font-black text-2xl shadow-xl group-hover:scale-110 transition-all border border-white/10 ring-4 ring-transparent group-hover:ring-emerald-500/10`}>{lev.c}</div>
                <p className="font-black text-slate-300 text-[11px] uppercase tracking-[0.2em] group-hover:text-white transition-colors">{lev.l}</p>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-white/5 italic text-slate-500 text-xs">
            Assessed through continuous observation and project evidence.
          </div>
        </div>
      )}
    </div>
  );
};

export default CBCGuide;
