
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TemplateGallery } from './components/TemplateGallery';
import { EnhancementPanel } from './components/EnhancementPanel';
import { generateEmail, enhanceEmail, generateABTest } from './services/geminiService';
import { EmailTone, EmailLength, EmailTemplate, GeneratedEmail, EnhancementResult, SavedEmail, ABTestResult } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'compose' | 'templates' | 'history' | 'abtest'>('compose');
  const [history, setHistory] = useState<SavedEmail[]>([]);
  
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [outcome, setOutcome] = useState('');
  const [tone, setTone] = useState<EmailTone>(EmailTone.PROFESSIONAL);
  const [length, setLength] = useState<EmailLength>(EmailLength.STANDARD);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [generatedDraft, setGeneratedDraft] = useState<GeneratedEmail | null>(null);
  const [abResult, setAbResult] = useState<ABTestResult | null>(null);
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentBody, setCurrentBody] = useState('');
  const [enhancement, setEnhancement] = useState<EnhancementResult | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('gemini-mail-history');
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const saveToHistory = useCallback((subject: string, body: string) => {
    if (!subject && !body) return;
    const newEmail: SavedEmail = {
      id: Date.now().toString(),
      subject: subject || "Untitled Draft",
      body: body || "",
      timestamp: Date.now(),
      category: 'Draft'
    };
    setHistory(prev => {
      const updated = [newEmail, ...prev].slice(0, 50);
      localStorage.setItem('gemini-mail-history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Fix: Implemented the missing useTemplate function
  const useTemplate = (template: EmailTemplate) => {
    setPurpose(template.prompt);
    setActiveView('compose');
  };

  const handleGenerate = async () => {
    if (!recipient || !purpose) return;
    setIsGenerating(true);
    setEnhancement(null);
    setAbResult(null);
    try {
      const result = await generateEmail({ recipient, purpose, keyPoints, tone, length });
      if (result && result.body) {
        setGeneratedDraft(result);
        const initialSubject = result.subjectLines?.[0] || "";
        const initialBody = `${result.salutation || ""}\n\n${result.body}\n\n${result.closing || ""}`;
        setCurrentSubject(initialSubject);
        setCurrentBody(initialBody);
        saveToHistory(initialSubject, result.body);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Generation failed", error);
      alert("Failed to generate email. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAB = async () => {
    if (!recipient || !purpose || !outcome) return;
    setIsGenerating(true);
    setGeneratedDraft(null);
    try {
      const result = await generateABTest({ recipient, purpose, keyPoints, outcome });
      if (result && result.versionA) {
        setAbResult(result);
        setShowModal(true);
      }
    } catch (error) {
      console.error("A/B generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhance = async () => {
    if (!currentBody) return;
    setIsEnhancing(true);
    try {
      const result = await enhanceEmail(currentBody);
      setEnhancement(result);
    } catch (error) {
      console.error("Enhancement failed", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const stats = useMemo(() => {
    const words = currentBody.trim().split(/\s+/).filter(x => x).length;
    const readTime = Math.ceil(words / 200);
    const sentences = currentBody.split(/[.!?]+/).filter(x => x).length;
    const readability = sentences > 0 ? Math.min(10, Math.max(1, Math.round(words / sentences / 2))) : 0;
    return { words, readTime, readability };
  }, [currentBody]);

  const loadFromHistory = (email: SavedEmail) => {
    setCurrentSubject(email.subject);
    setCurrentBody(email.body);
    setGeneratedDraft(null);
    setEnhancement(null);
    setAbResult(null);
    setActiveView('compose');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 selection:bg-indigo-200">
      <Sidebar 
        history={history} 
        onSelectEmail={loadFromHistory} 
        activeView={activeView === 'abtest' ? 'compose' : (activeView as any)} 
        setActiveView={setActiveView as any} 
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">AI Generated Draft</h2>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
                {abResult ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-2 border-indigo-100 rounded-3xl p-6 bg-indigo-50/30">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4 block">Option A ({abResult.versionA.strategy})</span>
                      <h4 className="font-black text-slate-900 mb-2 leading-tight">Subject: {abResult.versionA.subject}</h4>
                      <div className="text-sm text-slate-800 font-bold whitespace-pre-wrap leading-relaxed h-[200px] overflow-y-auto custom-scrollbar border-t border-indigo-100 pt-4 mt-4">
                        {abResult.versionA.body}
                      </div>
                      <button onClick={() => copyToClipboard(`Subject: ${abResult.versionA.subject}\n\n${abResult.versionA.body}`)} className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700">Copy Option A</button>
                    </div>
                    <div className="border-2 border-rose-100 rounded-3xl p-6 bg-rose-50/30">
                      <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-4 block">Option B ({abResult.versionB.strategy})</span>
                      <h4 className="font-black text-slate-900 mb-2 leading-tight">Subject: {abResult.versionB.subject}</h4>
                      <div className="text-sm text-slate-800 font-bold whitespace-pre-wrap leading-relaxed h-[200px] overflow-y-auto custom-scrollbar border-t border-rose-100 pt-4 mt-4">
                        {abResult.versionB.body}
                      </div>
                      <button onClick={() => copyToClipboard(`Subject: ${abResult.versionB.subject}\n\n${abResult.versionB.body}`)} className="mt-6 w-full py-3 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-700">Copy Option B</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
                      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-200">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">Subject</span>
                        <h4 className="text-xl font-black text-slate-900 flex-1">{currentSubject}</h4>
                      </div>
                      <div className="text-lg text-slate-900 font-bold leading-relaxed whitespace-pre-wrap min-h-[250px]">
                        {currentBody}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <button 
                  onClick={() => {
                    setShowModal(false);
                    activeView === 'abtest' ? handleGenerateAB() : handleGenerate();
                  }}
                  className="px-6 py-3 border-2 border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                >
                  Regenerate
                </button>
                {!abResult && (
                  <button onClick={() => { copyToClipboard(`Subject: ${currentSubject}\n\n${currentBody}`); setShowModal(false); }} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                    Copy & Exit
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeView === 'templates' && <TemplateGallery onSelect={useTemplate} />}
        
        {activeView === 'history' && (
          <div className="p-12 w-full overflow-y-auto custom-scrollbar">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Library</h2>
              <div className="grid grid-cols-1 gap-4">
                {history.map(email => (
                  <div key={email.id} className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all cursor-pointer" onClick={() => loadFromHistory(email)}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-slate-900 text-lg">{email.subject}</h3>
                      <span className="text-[11px] font-bold text-slate-400">{new Date(email.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-800 line-clamp-2 font-medium">{email.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(activeView === 'compose' || activeView === 'abtest') && (
          <div className="flex-1 flex overflow-hidden">
            <div className="w-full md:w-[380px] p-8 bg-white border-r border-slate-200 overflow-y-auto custom-scrollbar flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{activeView === 'abtest' ? 'A/B Test' : 'Compose'}</h2>
                <div className="flex gap-1">
                    <button onClick={() => setActiveView('compose')} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${activeView === 'compose' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-400'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => setActiveView('abtest')} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${activeView === 'abtest' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-400'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </button>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Recipient</label>
                  <input type="text" placeholder="e.g. Sales Director" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-bold text-slate-900" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">The Mission</label>
                  <textarea placeholder="What are we trying to achieve?" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl h-24 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-bold text-slate-900 resize-none" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
                </div>
                {activeView === 'abtest' && (
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Success Metric</label>
                    <input type="text" placeholder="e.g. Booked call" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-bold text-slate-900" value={outcome} onChange={(e) => setOutcome(e.target.value)} />
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Key Ingredients</label>
                  <textarea placeholder="Add specific facts or data points..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl h-24 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-bold text-slate-900 resize-none" value={keyPoints} onChange={(e) => setKeyPoints(e.target.value)} />
                </div>

                {activeView === 'compose' && (
                  <div className="grid grid-cols-2 gap-3">
                    <select value={tone} onChange={(e) => setTone(e.target.value as EmailTone)} className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-900 outline-none">
                      {Object.values(EmailTone).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select value={length} onChange={(e) => setLength(e.target.value as EmailLength)} className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-900 outline-none">
                      {Object.values(EmailLength).map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                )}

                <button onClick={activeView === 'abtest' ? handleGenerateAB : handleGenerate} disabled={isGenerating || !recipient || !purpose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-xl flex items-center justify-center gap-3">
                  {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Execute Magic"}
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col p-8 bg-[#F4F7FA] overflow-y-auto relative">
              <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex flex-col h-full max-w-5xl mx-auto w-full overflow-hidden">
                {/* Visual Analytics Bar */}
                <div className="h-1 bg-slate-100 w-full flex">
                    <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${Math.min(100, stats.readability * 10)}%` }}></div>
                </div>

                <div className="px-10 py-6 border-b border-slate-100 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                      <div className="flex gap-4 items-center">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Analytics</span>
                        <div className="flex gap-3">
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Grade {stats.readability}</span>
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> {stats.readTime}m read</span>
                        </div>
                      </div>
                      {generatedDraft && (
                        <div className="flex gap-2">
                           {generatedDraft.subjectLines.map((s, i) => (
                             <button key={i} onClick={() => setCurrentSubject(s)} className={`px-3 py-1 text-[9px] font-black rounded-full border transition-all ${currentSubject === s ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-indigo-300'}`}>VARIATION {i+1}</button>
                           ))}
                        </div>
                      )}
                  </div>
                  <input className="text-2xl font-black text-slate-900 outline-none bg-transparent placeholder:text-slate-200" value={currentSubject} onChange={(e) => setCurrentSubject(e.target.value)} placeholder="Captivating Subject Line..." />
                </div>
                
                <textarea className="flex-1 px-10 py-8 outline-none resize-none leading-relaxed text-slate-900 text-lg font-bold bg-white placeholder:text-slate-100" value={currentBody} onChange={(e) => setCurrentBody(e.target.value)} placeholder="Type or use the generator to fill the canvas..." />

                <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button onClick={() => { copyToClipboard(`Subject: ${currentSubject}\n\n${currentBody}`); }} className="p-3 bg-white border border-slate-200 text-slate-900 rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg></button>
                    <button onClick={() => { setCurrentBody(''); setCurrentSubject(''); setGeneratedDraft(null); }} className="p-3 bg-white border border-slate-200 text-slate-900 rounded-xl hover:border-rose-600 hover:text-rose-600 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-900 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{stats.words} Words</span>
                        <div className="w-px h-3 bg-white/20"></div>
                        <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Export .PDF</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Word Count Bubble */}
              <div className="absolute bottom-12 right-12 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-xl flex items-center gap-2 animate-bounce hover:animate-none">
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                 <span className="text-[10px] font-black text-slate-900 uppercase">Live Canvas</span>
              </div>
            </div>

            {activeView !== 'abtest' && (
              <EnhancementPanel 
                result={enhancement} 
                loading={isEnhancing} 
                onEnhance={handleEnhance} 
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
