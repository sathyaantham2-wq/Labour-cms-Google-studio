
import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Settings as SettingsIcon,
  Search,
  Bell,
  LogOut,
  Menu,
  Shield,
  Users,
  BarChart3,
} from 'lucide-react';
import { LaborCase, ViewType, CaseStatus } from './types.ts';
import Dashboard from './components/Dashboard.tsx';
import CaseForm from './components/CaseForm.tsx';
import CaseDetails from './components/CaseDetails.tsx';
import NoticePreview from './components/NoticePreview.tsx';
import Settings from './components/Settings.tsx';
import PublicPortal from './components/PublicPortal.tsx';
import Login from './components/Login.tsx';
import UserManagement from './components/UserManagement.tsx';
import Reports from './components/Reports.tsx';
import { triggerAutomationWebhook } from './services/automationService.ts';
import { api } from './services/api.ts';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('portal');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [cases, setCases] = useState<LaborCase[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load cases from API when logged in
  useEffect(() => {
    if (isLoggedIn) {
      setIsLoading(true);
      api.getCases()
        .then(setCases)
        .catch((err) => console.error('Failed to load cases:', err))
        .finally(() => setIsLoading(false));
    }
  }, [isLoggedIn]);

  const handleCreateCase = async (newCase: LaborCase) => {
    try {
      await api.createCase(newCase);
      setCases((prev) => [newCase, ...prev]);
      triggerAutomationWebhook('case_created', newCase);
      setActiveView('dashboard');
    } catch (err: unknown) {
      alert(`Failed to save case: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleUpdateCase = async (updatedCase: LaborCase) => {
    try {
      await api.updateCase(updatedCase);
      setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
      triggerAutomationWebhook('case_updated', updatedCase);
    } catch (err: unknown) {
      alert(`Failed to update case: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleArchiveCase = async (id: string) => {
    const caseToArchive = cases.find((c) => c.id === id);
    if (!caseToArchive) return;

    const isArchived = caseToArchive.status === CaseStatus.ARCHIVED;
    const updatedCase = {
      ...caseToArchive,
      status: isArchived ? CaseStatus.OPEN : CaseStatus.ARCHIVED,
    };

    try {
      await api.updateCase(updatedCase);
      setCases((prev) => prev.map((c) => (c.id === id ? updatedCase : c)));
      triggerAutomationWebhook(isArchived ? 'case_restored' : 'case_archived', updatedCase);
    } catch (err: unknown) {
      alert(`Failed to archive case: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleIssueAdvice = (id: string, hearingId?: string) => {
    const c = cases.find((item) => item.id === id);
    if (c) {
      const hearing = hearingId ? c.hearings.find((h) => h.id === hearingId) : null;
      triggerAutomationWebhook('advice_letter_issued', { case: c, hearing });
      alert(`Advice Letter issued for ${c.fileNumber}. Automation triggered.`);
    }
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsLoggedIn(true);
      setActiveView('dashboard');
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setIsLoggedIn(false);
    setCases([]);
    setActiveView('portal');
  };

  const filteredCases = useMemo(
    () =>
      cases.filter(
        (c) =>
          c.fileNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.managementName.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [cases, searchQuery]
  );

  const selectedCase = useMemo(
    () => cases.find((c) => c.id === selectedCaseId) || null,
    [cases, selectedCaseId]
  );

  const renderView = () => {
    if (activeView === 'portal') {
      return <PublicPortal onAdminAccess={() => setActiveView('login')} />;
    }

    if (activeView === 'login' || !isLoggedIn) {
      return <Login onLogin={handleLogin} onBack={() => setActiveView('portal')} />;
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-400 font-bold animate-pulse">Loading cases…</p>
        </div>
      );
    }

    switch (activeView) {
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
              const c = cases.find((item) => item.id === id);
              if (c) triggerAutomationWebhook('notice_generation_started', c);
              setActiveView('notice');
            }}
            onArchive={handleArchiveCase}
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
            onNotice={() => {
              triggerAutomationWebhook('notice_generation_started', selectedCase);
              setActiveView('notice');
            }}
            onArchive={handleArchiveCase}
            onAdvice={(hearingId) => handleIssueAdvice(selectedCase.id, hearingId)}
          />
        ) : null;
      case 'notice':
        return selectedCase ? (
          <NoticePreview caseItem={selectedCase} onBack={() => setActiveView('details')} />
        ) : null;
      case 'settings':
        return <Settings />;
      case 'users':
        return <UserManagement />;
      case 'reports':
        return <Reports />;
      default:
        return <PublicPortal onAdminAccess={() => setActiveView('login')} />;
    }
  };

  const showSidebar = isLoggedIn && activeView !== 'portal' && activeView !== 'login';

  return (
    <div className="min-h-screen flex bg-[#FDFBF7]">
      {showSidebar && (
        <aside
          className={`
            ${isSidebarOpen ? 'w-72' : 'w-20'}
            bg-[#0A1628] text-[#F5F0E8] transition-all duration-300 flex flex-col no-print border-r border-[#C9A84C]/20
          `}
        >
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
              { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
              { id: 'users', label: 'User Management', icon: Users },
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
              onClick={handleLogout}
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
                <p className="text-xs font-black text-[#0A1628]">Office of the Asst. Commissioner of Labour</p>
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
