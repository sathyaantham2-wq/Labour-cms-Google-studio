
import React, { useState, useRef, useEffect } from 'react';
import { LaborCase, CaseStatus } from '../types';
import { 
  Save, X, Phone, User, Building, MapPin, 
  Calendar, FileText, Mail, ChevronDown,
  Clock, Store, Briefcase, Baby, HardHat, Scale,
  ChevronRight, ChevronLeft, AlertCircle, Shield, 
  Plus, Check, ClipboardList, Fingerprint, Search,
  Info,
  CheckCircle2,
  // Added missing IndianRupee icon
  IndianRupee
} from 'lucide-react';

interface CaseFormProps {
  onSubmit: (newCase: LaborCase) => void;
  onCancel: () => void;
}

const validateEmail = (email: string) => {
  if (!email) return true; // Optional field
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const SectionSelect = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options = [
    { label: 'Minimum Wages', icon: Clock, color: 'text-blue-500', desc: 'Complaints regarding basic pay scales' },
    { label: 'Payment of Wages', icon: Scale, color: 'text-emerald-500', desc: 'Arrears and deduction disputes' },
    { label: 'Shops & Establishments', icon: Store, color: 'text-orange-500', desc: 'Commercial entity regulations' },
    { label: 'Maternity Benefit', icon: Baby, color: 'text-pink-500', desc: 'Welfare and leave disputes' },
    { label: 'Contract Labour', icon: HardHat, color: 'text-amber-500', desc: 'Third-party workforce compliance' },
    { label: 'Industrial Relations', icon: Briefcase, color: 'text-indigo-500', desc: 'Direct employee-employer conflicts' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.label === value) || options[0];

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Administrative Section</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-[#C9A84C] transition-all text-sm group"
      >
        <div className="flex items-center gap-3">
          <selectedOption.icon size={20} className={selectedOption.color} />
          <div className="text-left">
             <p className="font-bold text-slate-700 leading-none">{selectedOption.label}</p>
             <p className="text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">{selectedOption.desc}</p>
          </div>
        </div>
        <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            {options.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  onChange(option.label);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all ${
                  value === option.label ? 'bg-[#0A1628] text-[#C9A84C]' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <option.icon size={18} className={value === option.label ? 'text-[#C9A84C]' : option.color} />
                <div className="text-left">
                  <span className="block font-bold leading-none">{option.label}</span>
                  <span className={`text-[9px] ${value === option.label ? 'text-[#C9A84C]/60' : 'text-slate-400'}`}>{option.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ReceivedFromSelect = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [options, setOptions] = useState(['By Hand', 'Post / Courier', 'Online Portal', 'Email', 'Representative']);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAddingNew(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addNew = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()]);
      onChange(newOption.trim());
      setNewOption('');
      setIsAddingNew(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex justify-between items-center mb-2 ml-1">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Channel</label>
        <button 
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsAddingNew(true);
          }}
          className="text-[#C9A84C] hover:text-[#0A1628] transition-colors"
          title="Custom Channel"
        >
          <Plus size={14} strokeWidth={3} />
        </button>
      </div>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-[#C9A84C] transition-all text-sm"
      >
        <span className={`font-bold ${value ? 'text-slate-700' : 'text-slate-400'}`}>
          {value || 'Select Channel'}
        </span>
        <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 space-y-1">
            {isAddingNew ? (
              <div className="p-2 flex gap-2">
                <input 
                  autoFocus
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#C9A84C]"
                  placeholder="Type channel..."
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addNew()}
                />
                <button 
                  type="button"
                  onClick={addNew}
                  className="p-2 bg-[#0A1628] text-[#C9A84C] rounded-xl"
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-2xl text-sm transition-all text-left font-bold ${
                    value === opt ? 'bg-[#0A1628] text-[#C9A84C]' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Fixed: Made children optional to avoid potential TypeScript errors in some environments
const FieldHint = ({ children }: { children?: React.ReactNode }) => (
  <div className="flex items-start gap-2 mt-2 px-1">
    <Info size={12} className="text-[#C9A84C] shrink-0 mt-0.5" />
    <p className="text-[9px] font-bold text-slate-400 leading-tight uppercase tracking-tighter">
      {children}
    </p>
  </div>
);

const ReviewField = ({ label, value }: { label: string, value: string | number }) => (
  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-[#C9A84C]/30 transition-all">
    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</label>
    <p className="text-sm font-bold text-[#0A1628]">{value || 'NOT SPECIFIED'}</p>
  </div>
);

const CaseForm: React.FC<CaseFormProps> = ({ onSubmit, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fileNumber: `A/${Math.floor(Math.random() * 9000 + 1000)}/2025`,
    receivedDate: new Date().toISOString().split('T')[0],
    receivedFrom: 'By Hand',
    section: 'Minimum Wages',
    applicantName: '',
    applicantPhones: [''],
    applicantEmail: '',
    applicantAddress: '',
    managementName: '',
    managementPerson: '',
    managementPhones: [''],
    managementEmail: '',
    managementAddress: '',
    subject: '',
    caseNotes: '',
    amountRecovered: '0'
  });

  const steps = [
    { id: 1, title: 'Identity', sub: 'Registry Protocol', icon: Fingerprint, hint: 'Establish the formal reference sequence' },
    { id: 2, title: 'Petitioner', sub: 'Complainant Profile', icon: User, hint: 'Identify the actor initiating grievance' },
    { id: 3, title: 'Respondent', sub: 'Establishment Info', icon: Building, hint: 'Define the target industry entity' },
    { id: 4, title: 'Conflict', sub: 'Subject Matter', icon: AlertCircle, hint: 'Document the core dispute parameters' },
    { id: 5, title: 'Verification', sub: 'Audit Projection', icon: Shield, hint: 'Confirm data integrity before commit' }
  ];

  const handleNext = () => {
    setErrors({});
    if (currentStep === 1 && !formData.fileNumber) return;
    if (currentStep === 2 && !formData.applicantName) return;
    if (currentStep === 3) {
      if (!formData.managementName) return;
      if (formData.managementEmail && !validateEmail(formData.managementEmail)) {
        setErrors({ managementEmail: 'Official email format is invalid.' });
        return;
      }
    }
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handlePhoneChange = (type: 'applicant' | 'management', index: number, value: string) => {
    const key = type === 'applicant' ? 'applicantPhones' : 'managementPhones';
    const newPhones = [...formData[key]];
    newPhones[index] = value;
    setFormData({ ...formData, [key]: newPhones });
  };

  const addPhone = (type: 'applicant' | 'management') => {
    const key = type === 'applicant' ? 'applicantPhones' : 'managementPhones';
    setFormData({ ...formData, [key]: [...formData[key], ''] });
  };

  const removePhone = (type: 'applicant' | 'management', index: number) => {
    const key = type === 'applicant' ? 'applicantPhones' : 'managementPhones';
    if (formData[key].length <= 1) return;
    const newPhones = formData[key].filter((_, i) => i !== index);
    setFormData({ ...formData, [key]: newPhones });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 5) {
      handleNext();
      return;
    }
    const newCase: LaborCase = {
      id: Date.now().toString(),
      ...formData,
      applicantPhones: formData.applicantPhones.filter(p => p.trim()),
      managementPhones: formData.managementPhones.filter(p => p.trim()),
      amountRecovered: parseFloat(formData.amountRecovered),
      status: CaseStatus.OPEN,
      hearings: [],
      createdAt: new Date().toISOString()
    };
    onSubmit(newCase);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header Deck */}
      <div className="flex justify-between items-start mb-12 px-2">
        <div className="space-y-2">
          <h1 className="serif text-4xl font-black text-[#0A1628] tracking-tight italic">Case Initiation</h1>
          <p className="text-[#C9A84C] text-[10px] font-black uppercase tracking-[0.3em]">Protocol sequence active • No authentication lapses detected</p>
        </div>
        <button 
          onClick={onCancel}
          className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:w-72 shrink-0 space-y-4">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-xl shadow-[#0A1628]/5 sticky top-8">
             <div className="mb-8 px-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Process Map</p>
                <div className="h-1 w-12 bg-[#C9A84C] rounded-full" />
             </div>
             <div className="space-y-1">
               {steps.map((step) => (
                 <button
                   key={step.id}
                   type="button"
                   disabled={currentStep < step.id}
                   onClick={() => setCurrentStep(step.id)}
                   className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-4 group ${
                     currentStep === step.id 
                       ? 'bg-[#0A1628] text-[#C9A84C] shadow-lg shadow-[#0A1628]/20' 
                       : currentStep > step.id 
                         ? 'text-emerald-600 bg-emerald-50/30' 
                         : 'text-slate-400 opacity-50 cursor-not-allowed'
                   }`}
                 >
                   <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border ${
                     currentStep === step.id ? 'border-[#C9A84C]/50' : 'border-slate-100'
                   }`}>
                      {currentStep > step.id ? <CheckCircle2 size={16} /> : <step.icon size={16} />}
                   </div>
                   <div>
                     <p className="text-[9px] font-black uppercase tracking-widest leading-none">{step.title}</p>
                     <p className={`text-[8px] font-bold mt-1 uppercase tracking-tighter ${currentStep === step.id ? 'text-[#C9A84C]/60' : 'text-slate-400'}`}>
                        {step.sub}
                     </p>
                   </div>
                 </button>
               ))}
             </div>
             
             <div className="mt-12 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-[#C9A84C] uppercase tracking-widest mb-2 flex items-center gap-2">
                   <Info size={12} /> Officer Insight
                </p>
                <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">
                   {steps[currentStep-1].hint}
                </p>
             </div>
          </div>
        </div>

        {/* Form Core */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
            <div className="h-1.5 w-full bg-slate-100">
               <div 
                 className="h-full bg-[#C9A84C] transition-all duration-700 ease-out" 
                 style={{ width: `${(currentStep / 5) * 100}%` }} 
               />
            </div>

            <div className="p-10 md:p-16 flex-1">
              {currentStep === 1 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="max-w-xl mx-auto space-y-8">
                    <div className="text-center space-y-2 mb-10">
                       <h2 className="serif text-3xl font-black text-[#0A1628]">Registry Initialization</h2>
                       <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Protocol Reference & Chronology</p>
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Protocol File Number</label>
                      <div className="relative group">
                        <FileText className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#C9A84C] transition-colors" size={20} />
                        <input 
                          required
                          className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-[#C9A84C]/10 focus:bg-white focus:border-[#C9A84C] transition-all text-sm font-bold outline-none" 
                          value={formData.fileNumber}
                          onChange={(e) => setFormData({...formData, fileNumber: e.target.value})}
                        />
                      </div>
                      <FieldHint>The unique identity used for all future district trace operations.</FieldHint>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Received Date</label>
                          <div className="relative group">
                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#C9A84C]" size={20} />
                            <input 
                              required
                              type="date"
                              className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:bg-white focus:border-[#C9A84C] text-sm font-bold outline-none" 
                              value={formData.receivedDate}
                              onChange={(e) => setFormData({...formData, receivedDate: e.target.value})}
                            />
                          </div>
                       </div>
                       <ReceivedFromSelect 
                        value={formData.receivedFrom}
                        onChange={(v) => setFormData({...formData, receivedFrom: v})}
                      />
                    </div>

                    <SectionSelect 
                      value={formData.section} 
                      onChange={(v) => setFormData({...formData, section: v})} 
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="max-w-2xl mx-auto space-y-8">
                    <div className="text-center space-y-2 mb-10">
                       <h2 className="serif text-3xl font-black text-[#0A1628]">Petitioner Credentials</h2>
                       <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Primary Actor (The Complainant)</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Full Legal Identity</label>
                        <div className="relative group">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#C9A84C]" size={20} />
                          <input 
                            required
                            placeholder="e.g. Sri A. Rajesh Kumar"
                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:bg-white focus:border-[#C9A84C] text-sm font-bold outline-none" 
                            value={formData.applicantName}
                            onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Lines</label>
                        {formData.applicantPhones.map((phone, idx) => (
                          <div key={idx} className="flex gap-4 items-center animate-in slide-in-from-left-4">
                            <div className="relative flex-1 group">
                               <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#C9A84C]" size={18} />
                               <input 
                                  required
                                  placeholder="Primary Phone..."
                                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 text-sm font-bold outline-none"
                                  value={phone}
                                  onChange={(e) => handlePhoneChange('applicant', idx, e.target.value)}
                               />
                            </div>
                            {formData.applicantPhones.length > 1 && (
                               <button 
                                 type="button" 
                                 onClick={() => removePhone('applicant', idx)}
                                 className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                               >
                                 <X size={20} />
                               </button>
                            )}
                          </div>
                        ))}
                        <button 
                          type="button" 
                          onClick={() => addPhone('applicant')}
                          className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all border-2 border-dashed border-indigo-200"
                        >
                          <Plus size={16} /> Add line
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Email Identity (Optional)</label>
                        <div className="relative group">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#C9A84C]" size={20} />
                          <input 
                            type="email"
                            placeholder="petitioner@domain.com"
                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:bg-white focus:border-[#C9A84C] text-sm font-bold outline-none" 
                            value={formData.applicantEmail}
                            onChange={(e) => setFormData({...formData, applicantEmail: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Communication Domicile</label>
                        <div className="relative group">
                          <MapPin className="absolute left-5 top-6 text-slate-300 group-focus-within:text-[#C9A84C]" size={20} />
                          <textarea 
                            required
                            rows={3}
                            placeholder="Full postal address for official dispatch..."
                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:bg-white focus:border-[#C9A84C] text-sm font-bold outline-none resize-none" 
                            value={formData.applicantAddress}
                            onChange={(e) => setFormData({...formData, applicantAddress: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="max-w-2xl mx-auto space-y-8">
                    <div className="text-center space-y-2 mb-10">
                       <h2 className="serif text-3xl font-black text-[#0A1628]">Respondent Mapping</h2>
                       <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">The Establishment / Industry Profile</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Entity Trade Name</label>
                        <div className="relative group">
                          <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#C9A84C]" size={20} />
                          <input 
                            required
                            placeholder="Registered Industry or Firm Name..."
                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:bg-white focus:border-[#C9A84C] text-sm font-bold outline-none" 
                            value={formData.managementName}
                            onChange={(e) => setFormData({...formData, managementName: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Authorized Officer</label>
                            <div className="relative group">
                              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#C9A84C]" size={18} />
                              <input 
                                placeholder="Manager Name..."
                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:bg-white focus:border-[#C9A84C] text-sm font-bold outline-none" 
                                value={formData.managementPerson}
                                onChange={(e) => setFormData({...formData, managementPerson: e.target.value})}
                              />
                            </div>
                         </div>
                         <div>
                            <label className={`block text-[10px] font-black uppercase mb-2 ml-1 tracking-widest ${errors.managementEmail ? 'text-red-500' : 'text-slate-400'}`}>Official Email</label>
                            <div className="relative group">
                              <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 ${errors.managementEmail ? 'text-red-500' : 'text-slate-300'}`} size={18} />
                              <input 
                                type="email"
                                placeholder="hr@industry.com"
                                className={`w-full pl-14 pr-6 py-5 bg-slate-50 border rounded-[1.5rem] focus:ring-4 text-sm font-bold outline-none ${
                                  errors.managementEmail ? 'border-red-500 ring-red-500/10' : 'border-slate-200 focus:border-[#C9A84C] focus:ring-[#C9A84C]/10'
                                }`} 
                                value={formData.managementEmail}
                                onChange={(e) => setFormData({...formData, managementEmail: e.target.value})}
                              />
                            </div>
                         </div>
                      </div>

                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Establishment Contact</label>
                        {formData.managementPhones.map((phone, idx) => (
                          <div key={idx} className="flex gap-4 items-center animate-in slide-in-from-left-4">
                            <div className="relative flex-1 group">
                               <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                               <input 
                                  placeholder="Board Line or Mobile..."
                                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 text-sm font-bold outline-none"
                                  value={phone}
                                  onChange={(e) => handlePhoneChange('management', idx, e.target.value)}
                               />
                            </div>
                            {formData.managementPhones.length > 1 && (
                               <button type="button" onClick={() => removePhone('management', idx)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                                 <X size={20} />
                               </button>
                            )}
                          </div>
                        ))}
                        <button type="button" onClick={() => addPhone('management')} className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-dashed border-indigo-200">
                          <Plus size={16} /> Add contact
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Site Domicile / Registered Office</label>
                        <div className="relative group">
                          <MapPin className="absolute left-5 top-6 text-slate-300" size={20} />
                          <textarea 
                            required
                            rows={3}
                            placeholder="Complete physical site address..."
                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:bg-white focus:border-[#C9A84C] text-sm font-bold outline-none resize-none" 
                            value={formData.managementAddress}
                            onChange={(e) => setFormData({...formData, managementAddress: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-12">
                    <div className="flex-1 space-y-8">
                       <div className="space-y-2 mb-6">
                          <h2 className="serif text-3xl font-black text-[#0A1628]">Conflict Parameters</h2>
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Dispute Narrative & Notes</p>
                       </div>

                       <div>
                         <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Official Subject Narrative</label>
                         <textarea 
                           required
                           rows={5}
                           placeholder="Detail the core grievance (e.g. Unpaid wages for Q4 2024)..."
                           className="w-full p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] focus:ring-4 focus:bg-white focus:border-[#C9A84C] text-lg font-black italic outline-none leading-relaxed text-[#0A1628]" 
                           value={formData.subject}
                           onChange={(e) => setFormData({...formData, subject: e.target.value})}
                         />
                         <FieldHint>Briefly summarize the primary demand for the meeting agenda.</FieldHint>
                       </div>

                       <div>
                         <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Internal Protocol Remarks</label>
                         <div className="relative group">
                           <ClipboardList className="absolute left-6 top-6 text-slate-300" size={20} />
                           <textarea 
                             rows={4}
                             placeholder="Internal investigator context or officer remarks..."
                             className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-200 rounded-[2.5rem] focus:ring-4 focus:bg-white focus:border-[#C9A84C] text-sm font-bold outline-none resize-none" 
                             value={formData.caseNotes}
                             onChange={(e) => setFormData({...formData, caseNotes: e.target.value})}
                           />
                         </div>
                       </div>
                    </div>

                    <div className="md:w-64 space-y-8 shrink-0">
                       <div className="p-8 bg-[#0A1628] rounded-[2.5rem] border-2 border-[#C9A84C]/30 shadow-2xl relative overflow-hidden group">
                          <IndianRupee className="absolute -right-4 -bottom-4 text-[#C9A84C]/5 scale-150 group-hover:scale-[1.8] transition-transform" size={120} />
                          <label className="block text-[10px] font-black text-[#C9A84C] uppercase mb-4 tracking-widest">Recovery Target</label>
                          <div className="relative">
                             <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#C9A84C] text-3xl font-black">₹</span>
                             <input 
                               type="number"
                               className="w-full pl-8 bg-transparent text-white serif text-5xl font-black focus:outline-none border-b border-white/10 pb-2"
                               value={formData.amountRecovered}
                               onChange={(e) => setFormData({...formData, amountRecovered: e.target.value})}
                             />
                          </div>
                          <p className="text-[8px] font-bold text-slate-500 uppercase mt-4 tracking-widest">Initial Claim Quantum</p>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-8 animate-in zoom-in-95 duration-500">
                   <div className="max-w-4xl mx-auto space-y-10">
                      <div className="flex items-center gap-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                         <div className="w-16 h-16 bg-[#0A1628] text-[#C9A84C] rounded-3xl flex items-center justify-center border border-[#C9A84C]/30 shadow-xl">
                            <Shield size={32} />
                         </div>
                         <div>
                            <h2 className="serif text-3xl font-black text-[#0A1628]">Final Protocol Verification</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit all credentials before committing to district registry</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="md:col-span-3 space-y-4">
                            <p className="text-[10px] font-black text-[#C9A84C] uppercase tracking-[0.2em] border-l-4 border-[#C9A84C] pl-3">Trace Identity</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                               <ReviewField label="Protocol File" value={formData.fileNumber} />
                               <ReviewField label="Receipt Date" value={formData.receivedDate} />
                               <ReviewField label="Entry Channel" value={formData.receivedFrom} />
                               <ReviewField label="Admin Section" value={formData.section} />
                            </div>
                         </div>

                         <div className="md:col-span-3 space-y-4 pt-6">
                            <p className="text-[10px] font-black text-[#C9A84C] uppercase tracking-[0.2em] border-l-4 border-[#C9A84C] pl-3">Actor Mapping</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div className="space-y-3">
                                  <ReviewField label="Petitioner Name" value={formData.applicantName} />
                                  <ReviewField label="Petitioner Contact" value={`${formData.applicantPhones.join(', ')}`} />
                               </div>
                               <div className="space-y-3">
                                  <ReviewField label="Respondent Entity" value={formData.managementName} />
                                  <ReviewField label="Respondent Contact" value={`${formData.managementPhones.join(', ')}`} />
                               </div>
                            </div>
                         </div>

                         <div className="md:col-span-3 space-y-4 pt-6">
                            <p className="text-[10px] font-black text-[#C9A84C] uppercase tracking-[0.2em] border-l-4 border-[#C9A84C] pl-3">Dispute Parameters</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                               <div className="md:col-span-2">
                                  <ReviewField label="Subject Narrative" value={formData.subject} />
                               </div>
                               <ReviewField label="Claim Quantum" value={`₹${parseFloat(formData.amountRecovered).toLocaleString()}`} />
                            </div>
                         </div>
                      </div>

                      <div className="p-8 bg-[#0A1628] rounded-[2.5rem] flex items-center gap-8 border border-[#C9A84C]/20 shadow-2xl">
                         <Search size={40} className="text-[#C9A84C] shrink-0" />
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed italic">
                           Commitment to the registry is a legal action. Once authorized, this identity record will be projected on the public search gateway and formal notice protocols will be initialized.
                         </p>
                      </div>
                   </div>
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="p-10 md:p-14 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button 
                type="button" 
                onClick={currentStep === 1 ? onCancel : handleBack}
                className="flex items-center gap-3 px-8 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-[#0A1628] transition-all"
              >
                <ChevronLeft size={20} />
                {currentStep === 1 ? 'Abort Entry' : 'Previous Step'}
              </button>
              
              <button 
                type="submit"
                className="px-12 py-5 bg-[#0A1628] text-[#C9A84C] rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-[#0A1628]/20 hover:bg-[#C9A84C] hover:text-[#0A1628] transition-all flex items-center gap-4 active:scale-95"
              >
                {currentStep === 5 ? (
                  <>
                    <Save size={20} />
                    Finalize & Register
                  </>
                ) : (
                  <>
                    Next Step
                    <ChevronRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CaseForm;
