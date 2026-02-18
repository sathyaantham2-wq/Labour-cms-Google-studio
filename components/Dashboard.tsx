
import React from 'react';
import { LaborCase, CaseStatus } from '../types';
import { 
  FileText, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  Printer,
  Users,
  AlertCircle,
  Calendar
} from 'lucide-react';

interface DashboardProps {
  cases: LaborCase[];
  onViewDetails: (id: string) => void;
  onGenerateNotice: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ cases, onViewDetails, onGenerateNotice }) => {
  const stats = [
    { label: 'Total Identity Records', value: cases.length, icon: FileText, color: 'blue' },
    { label: 'Wealth Recovered', value: `₹${cases.reduce((sum, c) => sum + (c.amountRecovered || 0), 0).toLocaleString()}`, icon: TrendingUp, color: 'emerald' },
    { label: 'Active Conflicts', value: cases.filter(c => c.status === CaseStatus.OPEN).length, icon: AlertCircle, color: 'orange' },
    { label: 'Resolved Events', value: cases.filter(c => c.status === CaseStatus.CLOSED).length, icon: CheckCircle, color: 'indigo' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">COMMAND CENTER</h1>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Labour Commissionerate • Rangareddy</p>
        </div>
        <button className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all flex items-center gap-2">
          <Printer size={16} />
          Full System Audit
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-300 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-300 uppercase">Live Trace</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Atomic Case Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 italic">
            <FileText size={18} className="text-blue-600" />
            Atomic Case List
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">The Identity</th>
                <th className="px-6 py-4">The Actors (Worker vs Mgt)</th>
                <th className="px-6 py-4">The Conflict</th>
                <th className="px-6 py-4">The Next Event</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-black text-blue-700 text-sm tracking-tighter">{c.fileNumber}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{c.section}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{c.applicantName}</span>
                        <span className="text-[10px] text-slate-400">Petitioner</span>
                      </div>
                      <div className="h-4 w-px bg-slate-200" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{c.managementName}</span>
                        <span className="text-[10px] text-slate-400">Respondent</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-[200px]">
                      <p className="text-xs font-medium text-slate-600 line-clamp-1 italic">"{c.subject}"</p>
                      <div className="mt-1 flex gap-1">
                        <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase ${
                          c.status === CaseStatus.OPEN ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {c.hearings.filter(h => !h.isCompleted).length > 0 ? (
                      <div className="flex items-center gap-2 text-indigo-600">
                        <Calendar size={14} />
                        <span className="text-xs font-black">{new Date(c.hearings.filter(h => !h.isCompleted)[0].date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-300 uppercase">No Event Scheduled</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onGenerateNotice(c.id)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        title="Project Notice View"
                      >
                        <FileText size={18} />
                      </button>
                      <button 
                        onClick={() => onViewDetails(c.id)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
