
import React, { useState, useRef } from 'react';
import { analyzeCBCDocument } from '../services/geminiService';
import { AnalysisResult } from '../types';

interface DocumentAnalyzerProps {
  onLog: (log: { name: string; category: string }) => void;
}

const DocumentAnalyzer: React.FC<DocumentAnalyzerProps> = ({ onLog }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (e.g., < 4MB)
      if (selectedFile.size > 4 * 1024 * 1024) {
        setError("File is too large. Please use an image under 4MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.onerror = () => setError("Failed to read the file. Try another image.");
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setLoading(true);
    setError(null);
    try {
      const base64Data = preview.includes(',') ? preview.split(',')[1] : preview;
      const analysis = await analyzeCBCDocument(base64Data);
      setResult(analysis);
      onLog({ name: analysis.documentName, category: analysis.category });
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please ensure the image is clear and you have an active internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Document Analyzer</h2>
        <p className="text-slate-400 text-sm font-medium">Classify KICD lesson plans, assessment rubrics, and learner profiles.</p>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto bg-rose-500/10 border border-rose-500/30 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="w-12 h-12 bg-rose-500/20 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="flex-grow">
            <p className="text-rose-200 text-sm font-bold">Analysis Interrupted</p>
            <p className="text-rose-300/70 text-xs mt-1">{error}</p>
          </div>
          <button onClick={reset} className="px-4 py-2 bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors">Dismiss</button>
        </div>
      )}

      {!preview ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group border border-emerald-900/20 rounded-3xl p-16 bg-slate-900/20 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 shadow-inner"
        >
          <div className="w-20 h-20 bg-emerald-600/10 text-emerald-500 rounded-[2rem] flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600/20 transition-all border border-emerald-500/10">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-white">Upload CBC Document</p>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">KICD Form • Rubric • Report Card</p>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden border border-emerald-500/20 bg-black aspect-square flex items-center justify-center shadow-2xl">
              <img src={preview} alt="Scan Preview" className="max-h-full max-w-full object-contain" />
              <button 
                onClick={reset} 
                className="absolute top-6 right-6 bg-black/80 backdrop-blur-md p-3 rounded-2xl text-rose-500 hover:text-rose-400 hover:scale-110 transition-all border border-white/10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            {!result && (
              <button 
                onClick={handleAnalyze} 
                disabled={loading}
                className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border shadow-xl ${
                  loading 
                    ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed' 
                    : 'bg-emerald-600 border-emerald-400 text-white hover:bg-emerald-500 hover:shadow-emerald-500/20 transform active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin"></span>
                    Running Diagnostics...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    Confirm Analysis
                  </>
                )}
              </button>
            )}
          </div>

          <div className="h-full min-h-[500px]">
            {result ? (
              <div className="bg-slate-900/40 border border-emerald-500/20 rounded-[2.5rem] p-10 space-y-10 animate-in slide-in-from-right-4 duration-500 shadow-2xl backdrop-blur-xl">
                <div className="border-b border-white/5 pb-8">
                  <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] block mb-2">Automated Classification</span>
                  <h3 className="text-3xl font-black text-white leading-tight">{result.documentName}</h3>
                  <div className="inline-flex mt-4 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 shadow-sm">
                    {result.category}
                  </div>
                </div>

                <div className="space-y-10">
                  <ReportSection title="Institutional Usage" content={result.usage} />
                  <ReportSection title="Standard Operating Procedure" content={result.howToFill} />
                  
                  <div className="bg-emerald-950/20 p-8 rounded-[2rem] border border-emerald-500/10">
                    <h4 className="text-amber-500 font-black uppercase text-[10px] tracking-[0.3em] mb-6 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM16.243 16.243a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414z" /></svg>
                      KICD Best Practices
                    </h4>
                    <ul className="space-y-4">
                      {result.tips.map((tip, i) => (
                        <li key={i} className="flex gap-4 text-sm font-medium text-slate-300 leading-relaxed">
                          <span className="text-emerald-500 font-black shrink-0">0{i+1}.</span> 
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-emerald-900/30 rounded-[2.5rem] bg-slate-900/10 p-12 text-center group">
                <div className="w-20 h-20 mb-6 bg-slate-800/50 rounded-3xl flex items-center justify-center text-slate-600 group-hover:text-emerald-500/50 transition-colors">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <h4 className="text-slate-500 font-bold uppercase text-xs tracking-widest">Awaiting Input</h4>
                <p className="text-slate-600 text-[11px] mt-2 max-w-[240px] leading-relaxed mx-auto">
                  {loading 
                    ? "Our neural engine is analyzing KICD rubrics and assessing the document's structure..." 
                    : "Upload a document on the left to begin the classification process."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ReportSection = ({ title, content }: { title: string, content: string }) => (
  <div className="space-y-4">
    <h4 className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em]">{title}</h4>
    <p className="text-slate-300 text-base leading-relaxed font-medium">{content}</p>
  </div>
);

export default DocumentAnalyzer;
