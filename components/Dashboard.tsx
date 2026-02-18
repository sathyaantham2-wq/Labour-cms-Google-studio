
import React, { useState, useMemo } from 'react';
import { LaborCase, CaseStatus } from '../types';
import { 
  FileText, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight,
  Printer,
  Calendar,
  Layers,
  Search,
  Filter,
  IndianRupee
} from 'lucide-react';

interface DashboardProps {
  cases: LaborCase[];
  onViewDetails: (id: string) => void;
  onGenerateNotice: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ cases, onViewDetails, onGenerateNotice }) => {
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'ALL'>('ALL');

  const stats = [
    { label: 'Atomic Records', value: cases.length, icon: Layers, color: 'blue' },
    { label: 'Capital Recovered', value: `₹${cases.reduce((sum, c) => sum + (c.amountRecovered || 0), 0).toLocaleString()}`, icon: TrendingUp, color: 'gold' },
    { label: 'Open Conflicts', value: cases.filter(c => c.status === CaseStatus.OPEN).length, icon: AlertCircle, color: 'orange' },
    { label: 'Resolved Events', value: cases.filter(c => c.status === CaseStatus.CLOSED).length, icon: CheckCircle, color: 'emerald' },
  ];

  const displayedCases = useMemo(() => {
    if (statusFilter === 'ALL') return cases;
    return cases.filter(c => c.status === statusFilter);
  }, [cases, statusFilter]);

  const filterOptions = [
    { label: 'All Records', value: 'ALL' },
    { label: 'Open', value: CaseStatus.OPEN },
    { label: 'Pending', value: CaseStatus.PENDING },
    { label: 'Closed', value: CaseStatus.CLOSED },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header Atom */}
      <div className="flex justify-between items-center bg-[#0A1628] p-8 rounded-3xl border border-[#C9A84C]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
          <Layers size={200} className="text-[#C9A84C]" />
        </div>
        <div className="relative z-10">
          <h1 className="serif text-4xl font-black text-[#F5F0E8] tracking-tight">COMMAND CENTER</h1>
          <p className="text-[#C9A84C] text-xs font-black uppercase tracking-[0.3em] mt-2">Atomic State Observation • Rangareddy</p>
        </div>
        <div className="flex gap-4 relative z-10">
          <button className="px-6 py-3 bg-[#C9A84C] text-[#0A1628] font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#F5F0E8] transition-all flex items-center gap-2 shadow-xl shadow-[#C9A84C]/10">
            <Printer size={16} />
            System Audit
          </button>
        </div>
      </div>

      {/* Stats Deconstruction */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#C9A84C]/50 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 group-hover:opacity-10 transition-opacity`}>
              <stat.icon size={96} className="text-slate-900" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className={`serif text-4xl font-black ${stat.color === 'gold' ? 'text-[#C9A84C]' : 'text-[#0A1628]'}`}>
                {stat.value}
              </p>
              <div className={`p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:text-[#C9A84C] transition-colors`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* The List View: The Projection of Reality */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="serif text-xl font-black text-[#0A1628] flex items-center gap-3">
            <Search size={22} className="text-[#C9A84C]" />
            Active Case Trace
          </h2>
          
          {/* Status Filter Component */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-200/50 rounded-2xl border border-slate-200">
            <div className="px-3 text-[#0A1628] opacity-40">
              <Filter size={14} />
            </div>
            <div className="flex gap-1">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value as any)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    statusFilter === opt.value
                      ? 'bg-[#0A1628] text-[#C9A84C] shadow-lg'
                      : 'text-slate-500 hover:text-[#0A1628] hover:bg-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">
                <th className="px-8 py-5">File Identity</th>
                <th className="px-8 py-5">The Actors</th>
                <th className="px-8 py-5">Subject Matter</th>
                <th className="px-8 py-5">Recovered Capital</th>
                <th className="px-8 py-5">Event Pulse</th>
                <th className="px-8 py-5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayedCases.length > 0 ? (
                displayedCases.map((c) => (
                  <tr key={c.id} className="hover:bg-[#C9A84C]/5 transition-all group cursor-pointer" onClick={() => onViewDetails(c.id)}>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="serif font-black text-[#0A1628] text-lg tracking-tight group-hover:text-[#C9A84C] transition-colors">{c.fileNumber}</span>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{c.section}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800">{c.applicantName}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Petitioner</span>
                        </div>
                        <div className="h-6 w-px bg-slate-200 rotate-12" />
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800">{c.managementName}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Respondent</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="max-w-[220px]">
                        <p className="text-xs font-bold text-slate-600 line-clamp-2 italic">"{c.subject}"</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1.5">
                        <div className="p-1.5 bg-[#C9A84C]/10 rounded-lg text-[#C9A84C]">
                          <IndianRupee size={14} />
                        </div>
                        <span className="serif text-lg font-black text-[#0A1628]">
                          {c.amountRecovered.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                          c.status === CaseStatus.OPEN ? 'bg-orange-100 text-orange-700' : 
                          c.status === CaseStatus.CLOSED ? 'bg-emerald-100 text-emerald-700' : 
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {c.status}
                        </span>
                        {c.hearings.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
                            <span className="text-xs font-black text-[#0A1628]">
                              {new Date(c.hearings[c.hearings.length-1].date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end items-center gap-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onGenerateNotice(c.id); }}
                          className="p-2.5 text-[#0A1628] hover:bg-[#0A1628] hover:text-[#C9A84C] rounded-xl transition-all border border-slate-200"
                        >
                          <FileText size={18} />
                        </button>
                        <div className="p-2 text-slate-300 group-hover:text-[#C9A84C] transition-colors">
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-20">
                      <Layers size={48} />
                      <p className="serif text-xl font-black">NO TRACES FOUND</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest">Adjust filters to broaden observation</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
