
import React from 'react';
import { EnhancementResult } from '../types';

interface EnhancementPanelProps {
  result: EnhancementResult | null;
  loading: boolean;
  onEnhance: () => void;
}

export const EnhancementPanel: React.FC<EnhancementPanelProps> = ({ result, loading, onEnhance }) => {
  if (loading) {
    return (
      <div className="w-80 border-l border-slate-100 bg-white p-8 h-full overflow-y-auto">
        <div className="shimmer h-8 w-3/4 rounded-xl mb-10"></div>
        <div className="space-y-10">
          <div className="shimmer h-32 w-full rounded-3xl"></div>
          <div className="shimmer h-48 w-full rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[340px] border-l border-slate-200 bg-white p-8 h-full overflow-y-auto custom-scrollbar flex flex-col">
      {!result ? (
        <div className="flex flex-col items-center justify-center h-full text-center py-10">
          <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm border border-indigo-100">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Enhance Copy</h3>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed px-4">Our AI will scan for tone, clarity, and structural impact.</p>
          <button 
            onClick={onEnhance}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg"
          >
            Audit Draft
          </button>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
          <section>
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Impact Score</h3>
              <span className="text-2xl font-black text-indigo-600 leading-none">{result.effectivenessScore}<span className="text-[10px] text-slate-300 font-bold">/10</span></span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-700" 
                style={{ width: `${result.effectivenessScore * 10}%` }}
              ></div>
            </div>
          </section>

          <section>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Audience Reception</h4>
            <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-[13px] text-slate-600 leading-relaxed font-medium">
              {result.toneAssessment}
            </div>
          </section>

          <section>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Refinements Needed</h4>
            <div className="space-y-3">
              {result.corrections.map((item, i) => (
                <div key={i} className="flex gap-3 text-xs text-slate-600 bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                  <span className="text-rose-500 font-bold shrink-0">!</span>
                  <span>{item}</span>
                </div>
              ))}
              {result.corrections.length === 0 && (
                <div className="flex gap-3 text-xs text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-100 font-bold">
                    <span>✓ Perfectly Optimized</span>
                </div>
              )}
            </div>
          </section>

          <section className="pb-10">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Semantic Options</h4>
            <div className="space-y-4">
              {result.alternativePhrasing.map((text, i) => (
                <div key={i} className="text-xs p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 hover:border-indigo-400 hover:bg-white hover:shadow-md transition-all cursor-pointer font-medium italic">
                  "{text}"
                </div>
              ))}
            </div>
          </section>
          
          <div className="mt-auto pt-6 border-t border-slate-100 sticky bottom-0 bg-white">
            <button 
                onClick={onEnhance}
                className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
            >
                Refresh Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
