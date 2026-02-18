
import React, { useState } from 'react';
import { LaborCase, CaseStatus } from '../types';
import { Search, Shield, ChevronRight, Clock, FileText, CheckCircle2, History, AlertCircle } from 'lucide-react';

interface PublicPortalProps {
  cases: LaborCase[];
  onAdminAccess: () => void;
}

const PublicPortal: React.FC<PublicPortalProps> = ({ cases, onAdminAccess }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<LaborCase | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = cases.find(c => 
      c.fileNumber.toLowerCase() === query.toLowerCase().trim()
    );
    setResult(found || null);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      {/* Header Bar */}
      <header className="p-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#0A1628] border border-[#C9A84C]/50 rounded-xl flex items-center justify-center text-[#C9A84C]">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="serif font-black text-[#0A1628] text-lg tracking-tight">LABOUR COMMISSIONERATE</h2>
            <p className="text-[10px] font-black text-[#C9A84C] uppercase tracking-[0.2em]">Government of Telangana</p>
          </div>
        </div>
        <button 
          onClick={onAdminAccess}
          className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#0A1628] transition-colors flex items-center gap-2"
        >
          Officer Access <ChevronRight size={14} />
        </button>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-20">
        <div className="max-w-2xl w-full space-y-12">
          <div className="text-center space-y-4">
            <h1 className="serif text-5xl font-black text-[#0A1628] tracking-tighter leading-none">
              Track Your Case Identity
            </h1>
            <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
              Verify the current legal status, scheduled hearings, and resolution progress of your labor representation by entering your official File Number.
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-0 bg-[#C9A84C]/10 blur-2xl group-hover:bg-[#C9A84C]/20 transition-all rounded-3xl" />
            <div className="relative flex bg-white p-3 rounded-2xl border border-slate-200 shadow-2xl">
              <div className="flex-1 flex items-center px-4">
                <Search size={22} className="text-slate-300 mr-4" />
                <input 
                  type="text" 
                  placeholder="Enter File Number (e.g. TG/LC/2025/001)"
                  className="w-full bg-transparent outline-none text-lg font-bold text-[#0A1628] placeholder-slate-300"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="px-8 py-4 bg-[#0A1628] text-[#C9A84C] font-black text-sm uppercase tracking-widest rounded-xl hover:bg-[#C9A84C] hover:text-[#0A1628] transition-all shadow-xl shadow-[#0A1628]/20"
              >
                Track Status
              </button>
            </div>
          </form>

          {/* Search Result Projection */}
          {hasSearched && (
            <div className="animate-in fade-in slide-in-from-top-8 duration-500">
              {result ? (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                  <div className="bg-[#0A1628] p-8 text-white flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black text-[#C9A84C] uppercase tracking-[0.3em] mb-2 block">Found Identity Trace</span>
                      <h3 className="serif text-3xl font-black">{result.fileNumber}</h3>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      result.status === CaseStatus.OPEN ? 'bg-orange-500/20 text-orange-400' : 'bg-[#C9A84C]/20 text-[#C9A84C]'
                    }`}>
                      {result.status}
                    </div>
                  </div>

                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Actors Involved</p>
                        <p className="text-sm font-black text-slate-800">{result.applicantName}</p>
                        <p className="text-xs text-slate-400 font-bold italic">vs</p>
                        <p className="text-sm font-black text-slate-800">{result.managementName}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <FileText size={12} />
                          Subject Matter
                        </p>
                        <p className="text-xs font-bold text-slate-600 leading-relaxed">"{result.subject}"</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Resolution Chronicle</p>
                      <div className="space-y-3">
                        {result.hearings.slice().reverse().map((h) => (
                          <div key={h.id} className="flex gap-3">
                            <div className="mt-1">
                              {h.isCompleted ? (
                                <CheckCircle2 size={16} className="text-[#C9A84C]" />
                              ) : (
                                <Clock size={16} className="text-slate-300" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-800">
                                {new Date(h.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase italic">
                                {h.isCompleted ? 'Resolution Event Recorded' : 'Joint Meeting Scheduled'}
                              </p>
                            </div>
                          </div>
                        ))}
                        {result.hearings.length === 0 && (
                          <div className="flex items-center gap-3 text-slate-300">
                            <History size={16} />
                            <p className="text-xs font-bold uppercase tracking-widest">Awaiting First Event</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 shadow-xl">
                  <AlertCircle size={48} className="mx-auto text-red-100 mb-4" />
                  <h3 className="serif text-xl font-black text-[#0A1628]">Identity Not Found</h3>
                  <p className="text-slate-400 text-sm font-medium mt-1">Please verify the file number or contact the Commissionerate office.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="p-8 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Official Public Access Gateway • No Login Required</p>
      </footer>
    </div>
  );
};

export default PublicPortal;
