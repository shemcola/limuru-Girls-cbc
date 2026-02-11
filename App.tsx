
import React, { useState, useEffect } from 'react';
import { Tab, DocLog } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import DocumentAnalyzer from './components/DocumentAnalyzer';
import CBCGuide from './components/CBCGuide';
import ChatAssistant from './components/ChatAssistant';
import Showcase from './components/Showcase';
import TeacherPortal from './components/TeacherPortal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [logs, setLogs] = useState<DocLog[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialAssistantQuery, setInitialAssistantQuery] = useState<string | null>(null);

  useEffect(() => {
    const savedLogs = localStorage.getItem('cbc_doc_logs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  const addLog = (log: Omit<DocLog, 'id' | 'timestamp'>) => {
    const newLog: DocLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString(),
    };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('cbc_doc_logs', JSON.stringify(updatedLogs));
  };

  const handleDeepDive = (query: string) => {
    setInitialAssistantQuery(query);
    setActiveTab(Tab.ASSISTANT);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.HOME:
        return <Hero onStart={() => setActiveTab(Tab.ANALYZER)} />;
      case Tab.ANALYZER:
        return <DocumentAnalyzer onLog={addLog} />;
      case Tab.GUIDE:
        return <CBCGuide onDeepDive={handleDeepDive} />;
      case Tab.ASSISTANT:
        return (
          <ChatAssistant 
            initialQuery={initialAssistantQuery} 
            onClearQuery={() => setInitialAssistantQuery(null)} 
          />
        );
      case Tab.SHOWCASE:
        return <Showcase />;
      case Tab.TEACHER_PORTAL:
        return <TeacherPortal logs={logs} />;
      default:
        return <Hero onStart={() => setActiveTab(Tab.ANALYZER)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#061612] text-slate-200 selection:bg-emerald-500/30 relative overflow-x-hidden">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-grow container mx-auto px-6 py-12 max-w-7xl">
        {renderContent()}
      </main>

      {/* Refined Floating Chat */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
        {isChatOpen && (
          <div className="w-[380px] h-[550px] mb-2 animate-in slide-in-from-bottom-4 fade-in duration-300 shadow-2xl">
            <ChatAssistant isFloating={true} />
          </div>
        )}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95 border ${
            isChatOpen 
            ? 'bg-rose-500 border-rose-400 rotate-90' 
            : 'bg-emerald-600 border-emerald-400 shadow-emerald-950/40'
          }`}
        >
          {isChatOpen ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </button>
      </div>

      <footer className="bg-[#04100d] border-t border-emerald-900/10 py-20 text-center relative">
        <div className="container mx-auto px-6 max-w-4xl flex flex-col items-center gap-8">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-xl">L</div>
          
          <div className="space-y-3">
            <h3 className="text-white font-bold text-2xl tracking-tight">Limuru Girls' Secondary School</h3>
            <p className="text-amber-500 font-black text-2xl tracking-[0.4em] uppercase opacity-60">IN FIDE VADE</p>
          </div>

          <p className="text-slate-500 text-sm max-w-md font-medium leading-relaxed italic border-t border-white/5 pt-8">
            "Developing the Total Person in a Secure and Friendly Environment."
          </p>
          
          <p className="text-slate-600 text-[10px] mt-8 uppercase tracking-[0.3em] font-black">
            © {new Date().getFullYear()} ElimuCBC • Tech Hub
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
