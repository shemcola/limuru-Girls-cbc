
import React from 'react';
import { Tab } from '../types';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: Tab.HOME, label: 'Home' },
    { id: Tab.ANALYZER, label: 'Analyzer' },
    { id: Tab.ASSISTANT, label: 'Ask Lucy' },
    { id: Tab.GUIDE, label: 'Curriculum' },
    { id: Tab.SHOWCASE, label: 'Project' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#061612]/80 backdrop-blur-md border-b border-emerald-900/20">
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between h-20">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setActiveTab(Tab.HOME)}
        >
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-all">
            <span className="text-white font-black text-xl">L</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white leading-none">Limuru Girls'</span>
            <span className="text-emerald-500 font-bold text-[9px] tracking-[0.2em] uppercase mt-0.5">CBC Bridge</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${
                activeTab === item.id 
                  ? 'text-emerald-400 bg-emerald-500/5' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="w-px h-4 bg-emerald-900/30 mx-2" />
          <button 
            onClick={() => setActiveTab(Tab.TEACHER_PORTAL)}
            className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${
              activeTab === Tab.TEACHER_PORTAL ? 'text-amber-400 bg-amber-500/5' : 'text-slate-500 hover:text-amber-400'
            }`}
          >
            Portal
          </button>
        </nav>

        <button 
          onClick={() => setActiveTab(Tab.ANALYZER)}
          className="md:hidden p-2 text-emerald-500"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
