import React from 'react';
import { SavedEmail } from '../types';

interface SidebarProps {
  history: SavedEmail[];
  onSelectEmail: (email: SavedEmail) => void;
  activeView: 'compose' | 'templates' | 'history';
  setActiveView: (view: 'compose' | 'templates' | 'history') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ history, onSelectEmail, activeView, setActiveView }) => {
  return (
    <div className="w-72 border-r border-slate-200 bg-white h-full flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10 group cursor-default">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">DraftWise</h1>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">AI Suite</span>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'compose', label: 'Compose', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
            { id: 'templates', label: 'Templates', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { id: 'history', label: 'Library', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-4 transition-all duration-200 group ${
                activeView === item.id 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <svg className={`w-5 h-5 ${activeView === item.id ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Recent</h3>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <div className="space-y-1 custom-scrollbar overflow-y-auto max-h-[35vh]">
          {history.length === 0 ? (
            <div className="px-2 py-4 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
                <p className="text-[11px] text-slate-400">Your drafts appear here</p>
            </div>
          ) : (
            history.slice(0, 8).map(email => (
              <button
                key={email.id}
                onClick={() => onSelectEmail(email)}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-all group flex flex-col gap-0.5"
              >
                <div className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600 truncate">{email.subject || '(No Subject)'}</div>
                <div className="text-[10px] text-slate-400 font-medium">{new Date(email.timestamp).toLocaleDateString()}</div>
              </button>
            ))
          )}
        </div>
        
        <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100/50">
            <p className="text-[11px] font-bold text-indigo-700 mb-1">PRO TIP</p>
            <p className="text-[10px] text-indigo-600/80 leading-relaxed">Use A/B testing for sensitive client communications.</p>
        </div>
      </div>
    </div>
  );
};
