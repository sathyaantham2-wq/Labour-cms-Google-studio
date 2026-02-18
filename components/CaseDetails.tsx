
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
  CheckCircle2, 
  Edit3, 
  FileText,
  DollarSign,
  History,
  ShieldCheck,
  Send,
  AlertCircle
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
      amountRecovered: parseFloat(recoveryAmount)
    });
    setIsEditingAmount(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Atomic Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-5">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="h-10 w-px bg-slate-200" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{caseItem.fileNumber}</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                caseItem.status === CaseStatus.OPEN ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {caseItem.status}
              </span>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-tight mt-1">{caseItem.section} • Identity Record Created {new Date(caseItem.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onNotice}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <FileText size={18} />
            Generate Notice
          </button>
          <button 
            onClick={toggleStatus}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all ${
              caseItem.status === CaseStatus.OPEN 
                ? 'bg-slate-900 text-white hover:bg-black' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <ShieldCheck size={18} />
            {caseItem.status === CaseStatus.OPEN ? 'Finalize Case' : 'Re-open Conflict'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Conflict Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              {/* Fix: AlertCircle was missing from the lucide-react import list */}
              <AlertCircle size={14} className="text-orange-500" />
              The Conflict
            </h3>
            <p className="text-lg font-bold text-slate-800 leading-snug mb-6 italic">"{caseItem.subject}"</p>
            
            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Financial Quantum</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-blue-900 tracking-tighter">₹{caseItem.amountRecovered.toLocaleString()}</span>
                  <button onClick={() => setIsEditingAmount(true)} className="text-blue-400 hover:text-blue-600">
                    <Edit3 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Recovery Source</p>
                <p className="text-sm font-bold text-slate-700">{caseItem.managementName}</p>
              </div>
            </div>
          </div>

          {/* The Actors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <User size={18} />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">The Petitioner</h3>
               </div>
               <div className="space-y-4">
                  <div>
                    <p className="text-lg font-black text-slate-900">{caseItem.applicantName}</p>
                    <p className="text-sm font-bold text-blue-600">{caseItem.applicantPhones[0]}</p>
                    <p className="text-xs text-slate-500 italic mt-1">{caseItem.applicantEmail || 'No email provided'}</p>
                  </div>
                  <div className="flex gap-2 p-3 bg-slate-50 rounded-xl">
                    <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{caseItem.applicantAddress}</p>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-slate-900" />
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-100 text-slate-900 rounded-lg">
                    <Building size={18} />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">The Respondent</h3>
               </div>
               <div className="space-y-4">
                  <div>
                    <p className="text-lg font-black text-slate-900">{caseItem.managementName}</p>
                    <p className="text-xs font-bold text-slate-400 italic">Attn: {caseItem.managementPerson}</p>
                    <p className="text-sm font-bold text-indigo-600 mt-1">{caseItem.managementPhone}</p>
                  </div>
                  <div className="flex gap-2 p-3 bg-slate-50 rounded-xl">
                    <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{caseItem.managementAddress}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* The Events (Timeline) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm uppercase tracking-tight">
                <History size={18} className="text-slate-400" />
                Case Events
              </h3>
              <button 
                onClick={() => setIsAddingHearing(true)}
                className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"
              >
                <Plus size={18} />
              </button>
            </div>
            
            <div className="p-6 flex-1 space-y-6 overflow-y-auto">
              {isAddingHearing && (
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-4 animate-in fade-in slide-in-from-top-4">
                  <div className="space-y-3">
                    <input 
                      type="datetime-local" 
                      className="w-full text-xs font-bold p-3 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newHearing.date}
                      onChange={(e) => setNewHearing({...newHearing, date: e.target.value})}
                    />
                    <textarea 
                      placeholder="Specify meeting context (e.g., First joint meeting for wage verification)"
                      className="w-full text-xs font-medium p-3 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      rows={3}
                      value={newHearing.remarks}
                      onChange={(e) => setNewHearing({...newHearing, remarks: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleAddHearing}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-xs font-black shadow-lg shadow-indigo-100"
                    >
                      Commit Event
                    </button>
                    <button 
                      onClick={() => setIsAddingHearing(false)}
                      className="px-4 py-2 bg-white text-slate-400 rounded-xl text-xs font-bold"
                    >
                      Abort
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-8 relative">
                {caseItem.hearings.length > 0 ? (
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100" />
                ) : null}
                
                {caseItem.hearings.map((h, i) => (
                  <div key={h.id} className="relative pl-10">
                    <div className={`absolute left-2.5 top-0 w-3.5 h-3.5 rounded-full border-4 border-white shadow-md z-10 ${
                      h.isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`}>
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all cursor-default group">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-black text-slate-900">
                          {new Date(h.date).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </p>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${
                          h.isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {h.isCompleted ? 'VERIFIED' : 'SCHEDULED'}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic">"{h.remarks || 'Standard joint meeting session.'}"</p>
                      <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="text-[9px] font-bold text-indigo-600 hover:underline">Re-Schedule</button>
                         <button className="text-[9px] font-bold text-emerald-600 hover:underline">Mark Result</button>
                      </div>
                    </div>
                  </div>
                ))}

                {caseItem.hearings.length === 0 && !isAddingHearing && (
                  <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                    <Clock size={32} className="mx-auto mb-3 text-slate-200" />
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Awaiting First Event</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
