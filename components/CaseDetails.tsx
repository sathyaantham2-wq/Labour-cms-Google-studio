
import React, { useState } from 'react';
import { LaborCase, CaseStatus, Hearing } from '../types';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Building, 
  Plus, 
  Edit3, 
  FileText,
  History,
  ShieldCheck,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  X,
  Save
} from 'lucide-react';

interface CaseDetailsProps {
  caseItem: LaborCase;
  onUpdate: (updatedCase: LaborCase) => void;
  onBack: () => void;
  onNotice: () => void;
}

const CaseDetails: React.FC<CaseDetailsProps> = ({ caseItem, onUpdate, onBack, onNotice }) => {
  const [isAddingHearing, setIsAddingHearing] = useState(false);
  const [newHearing, setNewHearing] = useState({ date: '', remarks: '' });
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [recoveryAmount, setRecoveryAmount] = useState(caseItem.amountRecovered.toString());

  const handleAddHearing = () => {
    if (!newHearing.date) return;
    const hearing: Hearing = {
      id: Date.now().toString(),
      date: newHearing.date,
      remarks: newHearing.remarks,
      isCompleted: false
    };
    onUpdate({
      ...caseItem,
      hearings: [...caseItem.hearings, hearing]
    });
    setIsAddingHearing(false);
    setNewHearing({ date: '', remarks: '' });
  };

  const toggleStatus = () => {
    onUpdate({
      ...caseItem,
      status: caseItem.status === CaseStatus.OPEN ? CaseStatus.CLOSED : CaseStatus.OPEN
    });
  };

  const saveAmount = () => {
    onUpdate({
      ...caseItem,
      amountRecovered: parseFloat(recoveryAmount) || 0
    });
    setIsEditingAmount(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Precision Header */}
      <div className="flex items-center justify-between bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-3 bg-slate-50 hover:bg-[#0A1628] hover:text-[#C9A84C] rounded-2xl text-slate-400 transition-all shadow-sm"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="h-12 w-px bg-slate-100" />
          <div>
            <div className="flex items-center gap-4">
              <h1 className="serif text-4xl font-black text-[#0A1628] tracking-tighter">{caseItem.fileNumber}</h1>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                caseItem.status === CaseStatus.OPEN ? 'bg-orange-100 text-orange-700' : 'bg-[#C9A84C]/20 text-[#C9A84C]'
              }`}>
                {caseItem.status} Status
              </span>
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Identity Atom • Established {new Date(caseItem.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onNotice}
            className="flex items-center gap-3 px-8 py-3.5 bg-[#0A1628] text-[#C9A84C] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#C9A84C] hover:text-[#0A1628] shadow-2xl shadow-[#C9A84C]/20 transition-all active:scale-95"
          >
            <FileText size={18} />
            Generate Notice
          </button>
          <button 
            onClick={toggleStatus}
            className="p-3.5 bg-slate-50 text-slate-400 hover:text-[#0A1628] rounded-2xl border border-slate-100 transition-all"
            title="Toggle Status"
          >
            <ShieldCheck size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Core Conflict & Actors (Source of Truth) */}
        <div className="lg:col-span-8 space-y-8">
          {/* The Conflict Atom */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                <AlertCircle size={16} className="text-[#C9A84C]" />
                Subject Conflict Trace
              </h3>
              <span className="text-xs font-black text-[#0A1628] underline underline-offset-4 decoration-[#C9A84C] decoration-2 uppercase">{caseItem.section}</span>
            </div>
            <p className="serif text-2xl font-black text-[#0A1628] leading-tight mb-8">"{caseItem.subject}"</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0A1628] rounded-2xl p-6 border border-[#C9A84C]/20">
                <p className="text-[10px] font-black text-[#C9A84C] uppercase tracking-widest mb-1">Financial Quantum Recovered</p>
                {isEditingAmount ? (
                  <div className="flex gap-2">
                    <input 
                      type="number"
                      value={recoveryAmount}
                      onChange={(e) => setRecoveryAmount(e.target.value)}
                      className="bg-white/10 text-white serif text-3xl font-black w-full border-b-2 border-[#C9A84C] outline-none"
                    />
                    <button onClick={saveAmount} className="p-2 bg-[#C9A84C] text-[#0A1628] rounded-lg">
                      <Save size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <p className="serif text-4xl font-black text-white tracking-tighter">₹{caseItem.amountRecovered.toLocaleString()}</p>
                    <button onClick={() => setIsEditingAmount(true)} className="text-white/30 hover:text-[#C9A84C] transition-colors">
                      <Edit3 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conflict Source</p>
                  <p className="text-sm font-black text-[#0A1628]">{caseItem.managementName}</p>
                </div>
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <ChevronRight size={20} className="text-slate-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Actor Polarization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 -mr-4 -mt-4 group-hover:scale-110 transition-transform">
                  <User size={120} />
               </div>
               <h3 className="text-[10px] font-black text-[#C9A84C] uppercase tracking-[0.2em] mb-6">Petitioner Entity</h3>
               <div className="space-y-6">
                  <div>
                    <p className="serif text-2xl font-black text-[#0A1628]">{caseItem.applicantName}</p>
                    <p className="text-xs font-black text-blue-600 mt-1 uppercase">{caseItem.applicantPhones[0]}</p>
                  </div>
                  <div className="flex gap-4 items-start p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <MapPin size={18} className="text-[#C9A84C] shrink-0" />
                    <p className="text-xs font-bold text-slate-600 leading-relaxed">{caseItem.applicantAddress}</p>
                  </div>
               </div>
            </div>

            <div className="bg-[#0A1628] rounded-3xl border border-[#C9A84C]/20 p-8 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 -mr-4 -mt-4 group-hover:scale-110 transition-transform">
                  <Building size={120} className="text-white" />
               </div>
               <h3 className="text-[10px] font-black text-[#C9A84C] uppercase tracking-[0.2em] mb-6">Respondent Entity</h3>
               <div className="space-y-6">
                  <div>
                    <p className="serif text-2xl font-black text-white">{caseItem.managementName}</p>
                    <p className="text-xs font-black text-[#C9A84C] mt-1 uppercase">Attn: {caseItem.managementPerson}</p>
                  </div>
                  <div className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/10">
                    <MapPin size={18} className="text-[#C9A84C] shrink-0" />
                    <p className="text-xs font-bold text-slate-400 leading-relaxed">{caseItem.managementAddress}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* The Chronicles (Event Atom) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="p-6 bg-[#0A1628] flex justify-between items-center border-b border-[#C9A84C]/20">
              <h3 className="serif text-lg font-black text-white flex items-center gap-3">
                <History size={20} className="text-[#C9A84C]" />
                Event Logs
              </h3>
              <button 
                onClick={() => setIsAddingHearing(true)}
                className="p-2 bg-[#C9A84C] text-[#0A1628] rounded-xl hover:bg-white transition-all shadow-lg"
              >
                <Plus size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-1 space-y-6 overflow-y-auto max-h-[600px] custom-scrollbar">
              {isAddingHearing && (
                <div className="p-5 bg-slate-50 rounded-2xl border-2 border-dashed border-[#C9A84C]/30 space-y-4 animate-in slide-in-from-top-4 duration-300">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Timestamp</label>
                    <input 
                      type="datetime-local" 
                      className="w-full text-xs font-black p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C9A84C] outline-none"
                      value={newHearing.date}
                      onChange={(e) => setNewHearing({...newHearing, date: e.target.value})}
                    />
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Remarks</label>
                    <textarea 
                      placeholder="Specify the focus of this session..."
                      className="w-full text-xs font-bold p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C9A84C] outline-none resize-none"
                      rows={3}
                      value={newHearing.remarks}
                      onChange={(e) => setNewHearing({...newHearing, remarks: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleAddHearing}
                      className="flex-1 bg-[#0A1628] text-[#C9A84C] py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl"
                    >
                      COMMIT
                    </button>
                    <button 
                      onClick={() => setIsAddingHearing(false)}
                      className="px-4 py-2.5 bg-white text-slate-400 border border-slate-200 rounded-xl text-xs font-bold"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}

              <div className="relative">
                {caseItem.hearings.length > 0 && (
                  <div className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-100" />
                )}
                
                <div className="space-y-8">
                  {caseItem.hearings.slice().reverse().map((h, i) => (
                    <div key={h.id} className="relative pl-12 group">
                      <div className={`absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-white shadow-md z-10 flex items-center justify-center text-white ${
                        h.isCompleted ? 'bg-[#C9A84C]' : 'bg-[#0A1628]'
                      }`}>
                        {h.isCompleted ? <ShieldCheck size={18} /> : <Clock size={18} />}
                      </div>
                      <div className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-[#C9A84C]/50 transition-all cursor-default shadow-sm group-hover:shadow-md">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-black text-[#0A1628]">
                            {new Date(h.date).toLocaleDateString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </p>
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                            {new Date(h.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 leading-relaxed italic">"{h.remarks || 'Standard case progression event.'}"</p>
                      </div>
                    </div>
                  ))}

                  {caseItem.hearings.length === 0 && !isAddingHearing && (
                    <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                      <History size={48} className="mx-auto mb-4 text-slate-200" />
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Chronicle Empty</p>
                      <p className="text-xs font-bold text-slate-400 mt-2">Initialize the first event to begin trace.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
