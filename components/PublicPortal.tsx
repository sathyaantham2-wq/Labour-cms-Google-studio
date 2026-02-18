
import React, { useState, useMemo } from 'react';
import { LaborCase, CaseStatus, Hearing } from '../types';
import { 
  Search, 
  Shield, 
  ChevronRight, 
  Clock, 
  FileText, 
  CheckCircle2, 
  History, 
  AlertCircle, 
  ArrowLeft,
  Building,
  User,
  Phone,
  Layers,
  CalendarDays,
  Timer,
  Info
} from 'lucide-react';

interface PublicPortalProps {
  cases: LaborCase[];
  onAdminAccess: () => void;
}

const PublicPortal: React.FC<PublicPortalProps> = ({ cases, onAdminAccess }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LaborCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<LaborCase | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.toLowerCase().trim();
    
    if (!q) {
      setSearchResults([]);
      setHasSearched(false);
      setSelectedCase(null);
      return;
    }

    // Normalized digit-only query for phone searching
    const digitsOnlyQuery = q.replace(/\D/g, '');

    const filtered = cases.filter(c => {
      // String identity matching (Fractional)
      const matchFile = c.fileNumber.toLowerCase().includes(q);
      const matchApplicant = c.applicantName.toLowerCase().includes(q);
      const matchManagement = c.managementName.toLowerCase().includes(q);
      
      // Phone matching logic (Fraction of raw phone or normalized digits)
      const matchAppPhone = c.applicantPhones.some(p => {
        const cleanP = p.replace(/\D/g, '');
        return p.toLowerCase().includes(q) || (digitsOnlyQuery.length > 0 && cleanP.includes(digitsOnlyQuery));
      });
      
      const matchMgmtPhone = c.managementPhones.some(p => {
        const cleanP = p.replace(/\D/g, '');
        return p.toLowerCase().includes(q) || (digitsOnlyQuery.length > 0 && cleanP.includes(digitsOnlyQuery));
      });

      return matchFile || matchApplicant || matchManagement || matchAppPhone || matchMgmtPhone;
    });

    setSearchResults(filtered);
    setHasSearched(true);
    setSelectedCase(null); 
  };

  const getNextEvent = (caseItem: LaborCase) => {
    if (!caseItem.hearings.length) return null;
    const now = new Date();
    // Sort hearings by date to find the true next one
    const sortedHearings = [...caseItem.hearings].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const upcoming = sortedHearings.find(h => new Date(h.date) >= now);
    return upcoming || sortedHearings[sortedHearings.length - 1]; // Return upcoming or the most recent past one
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      {/* Header Bar */}
      <header className="relative z-50 p-8 flex justify-between items-center border-b border-slate-100 bg-white/50 backdrop-blur-sm no-print">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#0A1628] border border-[#C9A84C]/50 rounded-xl flex items-center justify-center text-[#C9A84C]">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="serif font-black text-[#0A1628] text-lg tracking-tight uppercase leading-tight">Asst. Commissioner of Labour</h2>
            <p className="text-[10px] font-black text-[#C9A84C] uppercase tracking-[0.2em]">Rangareddy District • Telangana</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAdminAccess();
          }}
          className="cursor-pointer px-5 py-2.5 bg-[#0A1628] text-[#C9A84C] border border-[#C9A84C]/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-[#0A1628] hover:border-[#0A1628] transition-all flex items-center gap-2 group shadow-lg shadow-[#0A1628]/10"
        >
          Officer Access <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </header>

      {/* Main Experience */}
      <div className="flex-1 flex flex-col items-center py-20 px-6">
        <div className="max-w-4xl w-full space-y-12">
          
          {/* Search Header and Input */}
          <div className={`text-center space-y-4 transition-all duration-700 ${hasSearched ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            <h1 className="serif text-5xl font-black text-[#0A1628] tracking-tighter leading-none">
              Track Your Case Identity
            </h1>
            <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
              Verify legal status, scheduled hearings, and progress. Search by any part of your file number, name, or phone number.
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative group no-print">
            <div className="absolute inset-0 bg-[#C9A84C]/10 blur-2xl group-hover:bg-[#C9A84C]/20 transition-all rounded-3xl" />
            <div className="relative flex bg-white p-3 rounded-2xl border border-slate-200 shadow-2xl">
              <div className="flex-1 flex items-center px-4">
                <Search size={22} className="text-slate-300 mr-4" />
                <input 
                  type="text" 
                  placeholder="Enter File ID, Name, or Mobile fraction..."
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

          {/* Result Projection */}
          {hasSearched && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              {searchResults.length > 0 ? (
                <div className="space-y-6">
                  
                  {/* Results Sub-header */}
                  {!selectedCase && (
                    <div className="flex items-center justify-between px-4">
                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                         <Layers size={14} /> Matching Records Found ({searchResults.length})
                       </h3>
                       <button onClick={() => setHasSearched(false)} className="text-[10px] font-black text-[#C9A84C] uppercase tracking-widest hover:underline">
                         New Search
                       </button>
                    </div>
                  )}

                  {/* Case Detail View */}
                  {selectedCase ? (
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                      <div className="bg-[#0A1628] p-8 text-white flex justify-between items-center border-b border-[#C9A84C]/30">
                        <button 
                          onClick={() => setSelectedCase(null)}
                          className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                        >
                          <ArrowLeft size={16} /> All Results
                        </button>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-[#C9A84C] uppercase tracking-[0.3em] mb-1 block">Full Case Identity</span>
                          <h3 className="serif text-3xl font-black">{selectedCase.fileNumber}</h3>
                        </div>
                      </div>

                      <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                          {/* Petitioner / Respondent Info Cards */}
                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative group overflow-hidden">
                             <User className="absolute -right-4 -bottom-4 text-[#C9A84C]/5 scale-150 transition-transform group-hover:scale-[1.7]" size={100} />
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Petitioner Profile</p>
                             <p className="text-lg font-black text-slate-800">{selectedCase.applicantName}</p>
                             <div className="space-y-1 mt-2">
                                {selectedCase.applicantPhones.map((p, i) => (
                                   <p key={i} className="text-xs font-bold text-blue-600 flex items-center gap-2">
                                     <Phone size={12} /> {p}
                                   </p>
                                ))}
                             </div>
                          </div>

                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative group overflow-hidden">
                             <Building className="absolute -right-4 -bottom-4 text-[#0A1628]/5 scale-150 transition-transform group-hover:scale-[1.7]" size={100} />
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Respondent Profile</p>
                             <p className="text-lg font-black text-slate-800">{selectedCase.managementName}</p>
                             <div className="space-y-1 mt-2">
                                {selectedCase.managementPhones.map((p, i) => (
                                   <p key={i} className="text-xs font-bold text-slate-500 flex items-center gap-2">
                                     <Phone size={12} /> {p}
                                   </p>
                                ))}
                             </div>
                          </div>

                          <div className="p-6 bg-amber-50/50 rounded-3xl border border-amber-100 flex items-start gap-4">
                             <Info className="text-amber-500 shrink-0 mt-1" size={20} />
                             <div>
                               <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Conflict Summary</p>
                               <p className="text-sm font-bold text-slate-700 leading-relaxed italic">"{selectedCase.subject}"</p>
                             </div>
                          </div>
                        </div>

                        <div className="space-y-8">
                          {/* Case Pulse Timeline */}
                          <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                               <Timer size={14} className="text-[#C9A84C]" /> Official Event Pulse & Logs
                            </h3>
                            <div className="space-y-6 relative">
                              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100" />
                              {selectedCase.hearings.slice().reverse().map((h) => {
                                const isFuture = new Date(h.date) > new Date();
                                return (
                                  <div key={h.id} className="flex gap-4 items-start relative group/item">
                                    <div className="mt-1 relative z-10">
                                      {h.isCompleted ? (
                                        <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center border-4 border-white shadow-sm ring-2 ring-emerald-500/10">
                                           <CheckCircle2 size={14} />
                                        </div>
                                      ) : isFuture ? (
                                        <div className="w-8 h-8 bg-[#0A1628] text-[#C9A84C] rounded-full flex items-center justify-center border-4 border-white shadow-md ring-2 ring-[#0A1628]/20 animate-pulse">
                                           <Timer size={14} />
                                        </div>
                                      ) : (
                                        <div className="w-8 h-8 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                                           <Clock size={14} />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 p-4 bg-slate-50/50 rounded-2xl border border-transparent group-hover/item:border-slate-200 transition-all">
                                      <div className="flex justify-between items-start">
                                        <p className="text-sm font-black text-slate-800">
                                          {new Date(h.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </p>
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                          h.isCompleted ? 'bg-emerald-100 text-emerald-700' : isFuture ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                          {h.isCompleted ? 'Concluded' : isFuture ? 'Scheduled' : 'Past Event'}
                                        </span>
                                      </div>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                        {new Date(h.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                      {h.remarks && (
                                        <div className="mt-2 text-xs font-medium text-slate-500 italic leading-relaxed bg-white/50 p-3 rounded-lg border border-slate-100">
                                          <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter mb-1">Official Remark</p>
                                          {h.remarks}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                              {selectedCase.hearings.length === 0 && (
                                <div className="flex flex-col items-center gap-3 text-slate-300 py-10 border-2 border-dashed border-slate-100 rounded-[2rem]">
                                  <History size={40} className="opacity-20" />
                                  <p className="text-xs font-black uppercase tracking-widest">No timeline entries established</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Search Result Card List */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {searchResults.map((c) => {
                        const nextEvent = getNextEvent(c);
                        const isUpcoming = nextEvent && new Date(nextEvent.date) > new Date();
                        
                        return (
                          <button
                            key={c.id}
                            onClick={() => setSelectedCase(c)}
                            className="group text-left bg-white p-7 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-[#C9A84C] transition-all relative overflow-hidden flex flex-col h-full"
                          >
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-all -mr-6 -mt-6">
                              <FileText size={120} />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-6">
                                <div>
                                  <h4 className="serif text-2xl font-black text-[#0A1628] tracking-tight">{c.fileNumber}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{c.section}</span>
                                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                                      c.status === CaseStatus.OPEN ? 'text-orange-500' : 'text-emerald-500'
                                    }`}>{c.status} Status</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
                                    <User size={14} />
                                  </div>
                                  <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Petitioner</p>
                                    <p className="text-sm font-black text-slate-800 line-clamp-1">{c.applicantName}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 border border-slate-100">
                                    <Building size={14} />
                                  </div>
                                  <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Respondent</p>
                                    <p className="text-sm font-black text-slate-800 line-clamp-1">{c.managementName}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Enhanced Next Hearing Projection */}
                            <div className="mt-auto pt-6 border-t border-slate-50">
                               {nextEvent ? (
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isUpcoming ? 'bg-indigo-50 text-indigo-600 animate-pulse border border-indigo-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                        <CalendarDays size={20} />
                                      </div>
                                      <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{isUpcoming ? 'Next sequence' : 'Latest event'}</p>
                                        <p className="text-sm font-black text-slate-800">
                                          {new Date(nextEvent.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                        <p className="text-[9px] font-bold text-slate-500">
                                          {new Date(nextEvent.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-[#C9A84C] translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all flex flex-col items-center">
                                      <span className="text-[8px] font-black uppercase mb-1">View Timeline</span>
                                      <ChevronRight size={20} />
                                    </div>
                                  </div>
                               ) : (
                                  <div className="flex items-center justify-between text-slate-300">
                                     <span className="text-[9px] font-black uppercase tracking-widest italic">No events scheduled</span>
                                     <ChevronRight size={18} className="translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                  </div>
                               )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* Enhanced No Results State */
                <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-200 shadow-2xl">
                  <div className="w-24 h-24 bg-red-50 text-red-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <AlertCircle size={48} />
                  </div>
                  <h3 className="serif text-3xl font-black text-[#0A1628]">Identity Trace Failed</h3>
                  <p className="text-slate-400 text-sm font-medium mt-3 max-w-sm mx-auto leading-relaxed">
                    The query "<span className="text-slate-900 font-black">{query}</span>" did not align with any established record. 
                    Verify the file number, actor name, or any part of your phone number and attempt the sequence again.
                  </p>
                  <button onClick={() => setHasSearched(false)} className="mt-10 px-8 py-3 bg-[#0A1628] rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A1628] transition-all shadow-xl shadow-[#0A1628]/10">
                    Restart Trace
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="p-12 text-center border-t border-slate-100 no-print mt-auto">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Official District Registry Gateway • No Authentication Required</p>
      </footer>
    </div>
  );
};

export default PublicPortal;
