import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, RefreshCw } from 'lucide-react';
import { ReportSummary } from '../types';
import { api } from '../services/api';

const StatCard: React.FC<{ label: string; value: string | number; sub?: string; dark?: boolean }> = ({ label, value, sub, dark }) => (
  <div className={`rounded-2xl p-6 ${dark ? 'bg-[#0A1628] text-white' : 'bg-white border border-slate-200'}`}>
    <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${dark ? 'text-[#C9A84C]' : 'text-slate-400'}`}>{label}</p>
    <p className={`serif text-4xl font-black ${dark ? 'text-white' : 'text-[#0A1628]'}`}>{value}</p>
    {sub && <p className={`text-xs font-bold mt-1 ${dark ? 'text-slate-400' : 'text-slate-400'}`}>{sub}</p>}
  </div>
);

const Reports: React.FC = () => {
  const [data, setData] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      setData(await api.getReportSummary());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="text-center py-16 text-slate-400 font-bold animate-pulse">Loading report data…</div>;
  if (error) return <div className="text-center py-16 text-red-500 font-bold">{error}</div>;
  if (!data) return null;

  const maxMonthly = Math.max(...data.monthly.map((m) => m.count), 1);
  const maxSection = Math.max(...data.bySection.map((s) => s.count), 1);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#0A1628] rounded-2xl flex items-center justify-center">
            <BarChart3 size={28} className="text-[#C9A84C]" />
          </div>
          <div>
            <h1 className="serif text-3xl font-black text-[#0A1628]">Reports & Analytics</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time caseload intelligence</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="flex items-center gap-2 px-4 py-3 bg-slate-100 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={() => api.exportCases()} className="flex items-center gap-2 px-6 py-3 bg-[#0A1628] text-[#C9A84C] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#C9A84C] hover:text-[#0A1628] transition-all shadow-lg">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard label="Total Cases" value={data.totalCases} dark />
        <StatCard label="Open Cases" value={data.openCases} sub="Awaiting resolution" />
        <StatCard label="Pending Cases" value={data.pendingCases} sub="Under review" />
        <StatCard label="Closed Cases" value={data.closedCases} sub="Successfully resolved" />
        <StatCard label="Archived" value={data.archivedCases} />
        <StatCard label="Total Amount Recovered" value={`₹${data.totalAmount.toLocaleString()}`} dark />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cases by Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <BarChart3 size={16} className="text-[#C9A84C]" /> Cases by Section
          </h3>
          <div className="space-y-4">
            {data.bySection.length === 0 ? (
              <p className="text-sm text-slate-400 font-bold text-center py-8">No data available</p>
            ) : data.bySection.map((s) => (
              <div key={s.section} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#0A1628]">{s.section}</span>
                  <span className="text-slate-400">{s.count}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C9A84C] rounded-full transition-all duration-700"
                    style={{ width: `${(s.count / maxSection) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#C9A84C]" /> Monthly Case Intake
          </h3>
          {data.monthly.length === 0 ? (
            <p className="text-sm text-slate-400 font-bold text-center py-8">No data available</p>
          ) : (
            <div className="flex items-end gap-2 h-40">
              {data.monthly.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-black text-slate-400">{m.count}</span>
                  <div
                    className="w-full bg-[#0A1628] rounded-t-lg transition-all duration-700"
                    style={{ height: `${Math.max((m.count / maxMonthly) * 120, 4)}px` }}
                  />
                  <span className="text-[8px] font-bold text-slate-400 rotate-45 origin-left">{m.month.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
