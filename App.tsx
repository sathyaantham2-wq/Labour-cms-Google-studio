
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
  X,
  ChevronRight
} from 'lucide-react';
import { LaborCase, ViewType, CaseStatus } from './types';
import Dashboard from './components/Dashboard';
import CaseForm from './components/CaseForm';
import CaseDetails from './components/CaseDetails';
import NoticePreview from './components/NoticePreview';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [cases, setCases] = useState<LaborCase[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial mock data
  useEffect(() => {
    const savedCases = localStorage.getItem('labor_cases');
    if (savedCases) {
      setCases(JSON.parse(savedCases));
    } else {
      const mockCases: LaborCase[] = [
        {
          id: '1',
          fileNumber: 'A/1024/2024',
          receivedDate: '2024-02-15',
          section: 'Wages',
          applicantName: 'M. Ramesh',
          applicantPhones: ['9876543210'],
          applicantEmail: 'ramesh.m@example.com',
          applicantAddress: 'Plot 45, Jubilee Hills, Hyderabad',
          managementName: 'Innova Tech Solutions',
          managementPerson: 'Sanjay Kumar',
          managementPhone: '8887776660',
          managementEmail: 'hr@innovatech.com',
          managementAddress: 'HITEC City, Phase 2, Hyderabad',
          subject: 'Non-payment of overtime wages for 6 months',
          amountRecovered: 45000,
          status: CaseStatus.OPEN,
          hearings: [
            { id: 'h1', date: '2024-03-01', remarks: 'Preliminary hearing scheduled', isCompleted: true }
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
        return <div className="p-8 text-center text-gray-500">View under construction</div>;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        bg-slate-900 text-white transition-all duration-300 flex flex-col no-print
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-lg">L</div>
          {isSidebarOpen && <span className="font-bold text-sm tracking-tight leading-tight">LABOR COMMISSIONER <br/><span className="text-blue-400">RANGAREDDY</span></span>}
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-2">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeView === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} />
            {isSidebarOpen && <span>Dashboard</span>}
          </button>
          <button 
            onClick={() => setActiveView('create')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeView === 'create' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <PlusCircle size={20} />
            {isSidebarOpen && <span>Create Case</span>}
          </button>
          <button 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <Users size={20} />
            {isSidebarOpen && <span>Staff Management</span>}
          </button>
          <button 
            onClick={() => setActiveView('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeView === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <SettingsIcon size={20} />
            {isSidebarOpen && <span>Settings</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 no-print">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 hover:bg-gray-100 rounded md:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search File No, Applicant, Management..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">Asst. Commissioner</p>
                <p className="text-xs text-gray-500">Labour Department</p>
              </div>
              <img src="https://picsum.photos/seed/admin/40" alt="Admin" className="w-9 h-9 rounded-full bg-gray-200" />
            </div>
          </div>
        </header>

        {/* View Port */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
