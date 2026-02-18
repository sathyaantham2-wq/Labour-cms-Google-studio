
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  Settings as SettingsIcon, 
  FileText, 
  Search,
  Bell,
  LogOut,
  Menu,
  Shield,
  Briefcase
} from 'lucide-react';
import { LaborCase, ViewType, CaseStatus } from './types.ts';
import Dashboard from './components/Dashboard.tsx';
import CaseForm from './components/CaseForm.tsx';
import CaseDetails from './components/CaseDetails.tsx';
import NoticePreview from './components/NoticePreview.tsx';
import Settings from './components/Settings.tsx';
import PublicPortal from './components/PublicPortal.tsx';
import Login from './components/Login.tsx';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('portal');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [cases, setCases] = useState<LaborCase[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedCases = localStorage.getItem('labor_cases');
    if (savedCases) {
      try {
        const parsed = JSON.parse(savedCases);
        setCases(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error("Failed to parse local cases", e);
        setCases([]);
      }
    } else {
      const mockCases: LaborCase[] = [
        {
          id: '1',
          fileNumber: 'TG/LC/2025/001',
          receivedDate: '2025-01-15',
          section: 'Minimum Wages',
          applicantName: 'Rajesh Kumar Yadav',
          applicantPhones: ['9876543210'],
          applicantEmail: 'rajesh.yadav@example.com',
          applicantAddress: 'Plot 45, Jubilee Hills, Hyderabad',
          managementName: 'Sunrise Textiles Pvt Ltd',
          managementPerson: 'Sri K. Venkatesh',
          managementPhone: '8887776660',
          managementEmail: 'hr@sunrisetextiles.com',
          managementAddress: 'HITEC City, Phase 2, Hyderabad',
          subject: 'Unpaid Wages – 6 Months Arrears',
          amountRecovered: 148000,
          status: CaseStatus.OPEN,
          hearings: [
            { id: 'h1', date: '2025-02-10T10:30', remarks: 'Case registered. Notice issued to Management.', isCompleted: true }
          ],
          createdAt: new Date().toISOString()
        }
      ];
      setCases(mockCases);
      localStorage.setItem('labor_cases', JSON.stringify(mockCases));
    }
  }, []);

  const saveCases = (updatedCases: LaborCase[]) => {
    setCases(updatedCases);
    localStorage.setItem('labor_cases', JSON.stringify(updatedCases));
  };

  const handleCreateCase = (newCase: LaborCase) => {
    saveCases([newCase, ...cases]);
    setActiveView('dashboard');
  };

  const handleUpdateCase = (updatedCase: LaborCase) => {
    saveCases(cases.map(c => c.id === updatedCase.id ? updatedCase : c));
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsLoggedIn(true);
      setActiveView('dashboard');
    }
  };

  const filteredCases = useMemo(() => {
    return cases.filter(c => 
      c.fileNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.managementName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cases, searchQuery]);

  const selectedCase = useMemo(() => {
    return cases.find(c => c.id === selectedCaseId) || null;
  }, [cases, selectedCaseId]);

  const renderView = () => {
    if (!isLoggedIn && activeView !== 'portal') {
      return <Login onLogin={handleLogin} onBack={() => setActiveView('portal')} />;
    }

    switch (activeView) {
      case 'portal':
        return <PublicPortal cases={cases} onAdminAccess={() => setActiveView('login')} />;
      case 'dashboard':
        return (
          <Dashboard 
            cases={filteredCases} 
            onViewDetails={(id) => {
              setSelectedCaseId(id);
              setActiveView('details');
            }}
            onGenerateNotice={(id) => {
              setSelectedCaseId(id);
              setActiveView('notice');
            }}
          />
        );
      case 'create':
        return <CaseForm onSubmit={handleCreateCase} onCancel={() => setActiveView('dashboard')} />;
      case 'details':
        return selectedCase ? (
          <CaseDetails 
            caseItem={selectedCase} 
            onUpdate={handleUpdateCase} 
            onBack={() => setActiveView('dashboard')} 
            onNotice={() => setActiveView('notice')}
          />
        ) : null;
      case 'notice':
        return selectedCase ? (
          <NoticePreview 
            caseItem={selectedCase} 
            onBack={() => setActiveView('details')} 
          />
        ) : null;
      case 'settings':
        return <Settings />;
      default:
        return <PublicPortal cases={cases} onAdminAccess={() => setActiveView('login')} />;
    }
  };

  const showSidebar = isLoggedIn && activeView !== 'portal' && activeView !== 'login';

  return (
    <div className="min-h-screen flex bg-[#FDFBF7]">
      {showSidebar && (
        <aside className={`
          ${isSidebarOpen ? 'w-72' : 'w-20'} 
          bg-[#0A1628] text-[#F5F0E8] transition-all duration-300 flex flex-col no-print border-r border-[#C9A84C]/20
        `}>
          <div className="p-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#C9A84C]/20 border-2 border-[#C9A84C] rounded-xl flex items-center justify-center font-bold text-2xl text-[#C9A84C] shadow-lg shadow-[#C9A84C]/10">
              <Shield size={24} />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="serif font-black text-lg text-[#C9A84C] leading-none tracking-tight">LABOUR ADMIN</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">First Principles OS</span>
              </div>
            )}
          </div>
          
          <nav className="flex-1 mt-6 px-4 space-y-1">
            {[
              { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
              { id: 'create', label: 'New Identity Record', icon: PlusCircle },
              { id: 'settings', label: 'System Logic', icon: SettingsIcon },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveView(item.id as ViewType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeView === item.id 
                    ? 'bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30 shadow-sm' 
                    : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <item.icon size={20} />
                {isSidebarOpen && <span className="text-sm font-bold">{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-white/5 bg-[#0F2044]">
            <button 
              onClick={() => {
                setIsLoggedIn(false);
                setActiveView('portal');
              }}
              className="w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
            >
              <LogOut size={16} />
              {isSidebarOpen && <span>TERMINATE SESSION</span>}
            </button>
          </div>
        </aside>
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        {showSidebar && (
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-[#C9A84C]/10 flex items-center justify-between px-8 no-print">
            <div className="flex items-center gap-6 flex-1">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg text-[#0A1628] transition-colors"
              >
                <Menu size={24} />
              </button>
              <div className="relative max-w-xl w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Query file identity, petitioner, or respondent..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:bg-white text-sm font-medium transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden lg:flex flex-col text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Project</p>
                <p className="text-xs font-black text-[#0A1628]">Rangareddy Labour Directorate</p>
              </div>
              <button className="relative p-2.5 bg-slate-100 text-[#0A1628] hover:bg-slate-200 rounded-xl transition-all">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#C9A84C] rounded-full border-2 border-white"></span>
              </button>
            </div>
          </header>
        )}

        <div className={`flex-1 overflow-y-auto ${!showSidebar ? '' : 'p-8'} custom-scrollbar`}>
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
