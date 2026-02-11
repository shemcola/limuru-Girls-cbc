
import React, { useState } from 'react';
import { DocLog } from '../types';

interface TeacherPortalProps {
  logs: DocLog[];
}

const TeacherPortal: React.FC<TeacherPortalProps> = ({ logs }) => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '2026') {
      setIsAuthorized(true);
      setError('');
    } else {
      setError('Invalid Access Code. Please consult the Administration.');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto mt-20 p-12 bg-slate-900/50 backdrop-blur-3xl rounded-[3rem] border border-emerald-900/50 shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/20 shadow-xl shadow-amber-500/10">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white">Teacher Portal</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Secure Educator Login Required</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Access Code</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password" 
                className="w-full px-8 py-5 bg-black/50 border-2 border-emerald-900/50 rounded-2xl text-white font-black text-center tracking-[0.5em] focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
              />
            </div>
            {error && <p className="text-rose-400 text-xs font-bold animate-pulse">{error}</p>}
            <button className="w-full py-5 bg-amber-500 text-black font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95">
              Unlock Portal
            </button>
          </form>
          <p className="text-slate-600 text-[10px] pt-4 leading-relaxed font-medium">
            This portal is for Limuru Girls' Educators only. All access is logged under the supervision of Madam Nasimiyu. <span className="text-amber-500/50 block mt-2">IN FIDE VADE</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white tracking-tighter">Educator Activity Log</h2>
          <p className="text-emerald-500 font-bold uppercase text-[10px] tracking-[0.2em]">Tracking Document Usage and Context Analysis</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-emerald-900/30 rounded-2xl border border-emerald-500/20 text-center">
            <p className="text-2xl font-black text-white leading-none">{logs.length}</p>
            <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-1">Total Scans</p>
          </div>
          <button 
            onClick={() => setIsAuthorized(false)}
            className="px-6 py-3 bg-slate-900 text-slate-400 border border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-900/20 hover:text-rose-500 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-3xl rounded-[3rem] border border-emerald-900/50 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-emerald-900/20 border-b border-emerald-900/50">
                <th className="px-10 py-6 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-10 py-6 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Document Name</th>
                <th className="px-10 py-6 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Category</th>
                <th className="px-10 py-6 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/30">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center text-slate-500 font-bold italic">No documents analyzed yet. Active tracking enabled.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-10 py-6 text-sm text-slate-400 font-mono">{log.timestamp}</td>
                    <td className="px-10 py-6 text-sm text-white font-bold">{log.name}</td>
                    <td className="px-10 py-6 text-xs text-emerald-500 font-black uppercase tracking-widest">{log.category}</td>
                    <td className="px-10 py-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-full border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Verified
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-10 bg-emerald-900/10 rounded-[2.5rem] border border-emerald-500/10 space-y-4">
          <h3 className="text-xl font-black text-white">System Health</h3>
          <p className="text-slate-400 text-sm leading-relaxed">The logic-engine is currently syncing with national KICD standards. Transition to Grade 9 protocols is 85% complete. Decentralized monitoring active across national nodes.</p>
        </div>
        <div className="p-10 bg-amber-500/5 rounded-[2.5rem] border border-amber-500/10 space-y-4 relative overflow-hidden">
          <div className="absolute top-2 right-4 opacity-10">
            <span className="text-xs font-black italic uppercase tracking-[0.2em]">In Fide Vade</span>
          </div>
          <h3 className="text-xl font-black text-amber-500">Madam Nasimiyu's Directive</h3>
          <p className="text-slate-400 text-sm leading-relaxed italic">"Teachers should focus on the 'Total Person' while our digital tools handle the technical complexities of CBC documentation. Integrity in assessment data is paramount. Let us <strong>Go in Faith</strong> towards a digital future."</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherPortal;
