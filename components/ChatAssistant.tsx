
import React, { useState, useRef, useEffect } from 'react';
import { askCBCAssistant } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: { uri: string; title: string }[];
  error?: boolean;
}

interface ChatAssistantProps {
  isFloating?: boolean;
  initialQuery?: string | null;
  onClearQuery?: () => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ isFloating = false, initialQuery, onClearQuery }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Jambo! I am Lucy, your specialized CBC research assistant. I have direct access to national curriculum data. What would you like to explore today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (initialQuery && !hasInitialized.current) {
      handleSend(initialQuery);
      hasInitialized.current = true;
      if (onClearQuery) onClearQuery();
    }
  }, [initialQuery]);

  const suggestions = [
    "Explain the Grade 9 Junior School transition.",
    "What are the core competencies for Primary?",
    "How does formative assessment work in CBC?",
    "Latest KICD guidelines for Senior School pathways."
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    try {
      const response = await askCBCAssistant(text, !isFloating);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.text,
        sources: response.sources 
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        error: true,
        content: `Connection to KICD node interrupted. ${err.message || "Please check your network."}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      handleSend(lastUserMsg.content);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: "Jambo! I've cleared my current context. Ready for new research." }]);
  };

  return (
    <div className={`flex flex-col bg-slate-950 border border-emerald-900/40 overflow-hidden shadow-2xl transition-all duration-300 ${isFloating ? 'h-full rounded-2xl' : 'h-[80vh] rounded-[3rem] max-w-5xl mx-auto border-emerald-500/20'}`}>
      {/* Dynamic Header */}
      <div className={`px-8 py-6 bg-emerald-950/20 border-b border-emerald-900/20 flex items-center justify-between ${!isFloating ? 'bg-gradient-to-r from-emerald-950/40 via-transparent to-transparent' : ''}`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`bg-emerald-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg border border-emerald-400/20 ${isFloating ? 'w-10 h-10 text-lg' : 'w-14 h-14 text-2xl'}`}>L</div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse"></div>
          </div>
          <div>
            <h4 className={`font-black text-white tracking-tight ${isFloating ? 'text-base' : 'text-xl'}`}>Lucy</h4>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 text-[9px] font-black uppercase tracking-[0.2em]">KICD National Knowledge Hub</span>
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-3 text-slate-500 hover:text-rose-400 transition-colors bg-white/5 rounded-xl hover:bg-rose-500/10"
          title="Clear research session"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>

      {/* Messages & Hub Content */}
      <div ref={scrollRef} className="flex-grow p-8 overflow-y-auto space-y-8 bg-gradient-to-b from-slate-950 via-black to-slate-950 custom-scrollbar">
        {messages.length === 1 && !isFloating && (
          <div className="py-12 text-center space-y-8 animate-in fade-in zoom-in duration-700">
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className="text-3xl font-black text-white">Advanced CBC Research</h3>
              <p className="text-slate-400 text-base leading-relaxed">Ask anything about the Competency-Based Curriculum. I am grounded in live Ministry of Education data and KICD standards.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {suggestions.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(s)}
                  className="p-5 text-left bg-slate-900/50 border border-emerald-900/30 rounded-2xl text-xs font-bold text-slate-300 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all group shadow-inner"
                >
                  <span className="block text-emerald-500 mb-2 font-black group-hover:translate-x-1 transition-transform">→ Topic {i+1}</span>
                  {s}
                </button>
              ))}
            </div>
            <div className="h-px w-24 bg-emerald-900/30 mx-auto"></div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`relative px-6 py-4 rounded-[1.8rem] text-[15px] leading-relaxed shadow-2xl ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none max-w-[70%] border border-emerald-400/20' 
                : msg.error 
                  ? 'bg-rose-950/40 border border-rose-500/30 text-rose-200 rounded-tl-none max-w-[85%]'
                  : 'bg-slate-900/80 border border-emerald-900/30 text-slate-200 rounded-tl-none max-w-[85%] backdrop-blur-md'
            }`}>
              {msg.content}
              
              {msg.error && (
                <button 
                  onClick={handleRetry}
                  className="mt-4 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-200 flex items-center gap-2 transition-all"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Retry Connection
                </button>
              )}

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-5 pt-4 border-t border-emerald-900/30">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-3">Verified Research Sources:</p>
                  <div className="flex flex-wrap gap-3">
                    {msg.sources.map((s, i) => (
                      <a 
                        key={i} 
                        href={s.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-2 shadow-sm"
                      >
                        {s.title}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-900/50 px-6 py-4 rounded-3xl rounded-tl-none flex gap-3 items-center border border-emerald-900/20">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-duration:0.6s]"></span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]"></span>
              </div>
              <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest ml-1">Consulting KICD Archives...</span>
            </div>
          </div>
        )}
      </div>

      {/* Futuristic Input Area */}
      <div className={`p-8 bg-black/40 border-t border-emerald-900/20 ${!isFloating ? 'py-10' : ''}`}>
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); setInput(''); }} 
          className="max-w-4xl mx-auto flex gap-4 items-center"
        >
          <div className="relative flex-grow group">
            <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl blur-lg group-focus-within:bg-emerald-500/10 transition-all"></div>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query any CBC topic, rubrics, or guidelines..." 
              className="relative w-full bg-slate-900/90 border border-emerald-900/50 rounded-2xl px-8 py-5 text-white text-[15px] focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600 shadow-2xl"
            />
          </div>
          <button 
            disabled={loading || !input.trim()}
            className="relative w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-500 transition-all disabled:opacity-20 active:scale-90 shadow-xl shadow-emerald-950 border border-emerald-400/20 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
            <svg className="w-6 h-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant;
