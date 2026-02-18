import React, { useState, useRef, useEffect } from 'react';
import { LaborCase, CaseStatus } from '../types';
import { 
  Save, X, Phone, User, Building, MapPin, 
  Calendar, Info, FileText, Mail, ChevronDown,
  Clock, Store, Briefcase, Baby, HardHat, Scale,
  PlusCircle, ChevronRight, ChevronLeft, CheckCircle2
} from 'lucide-react';

interface CaseFormProps {
  onSubmit: (newCase: LaborCase) => void;
  onCancel: () => void;
}

const SectionSelect = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options = [
    { label: 'Minimum Wages', icon: Clock, color: 'text-blue-500' },
    { label: 'Payment of Wages', icon: Scale, color: 'text-emerald-500' },
    { label: 'Shops & Establishments', icon: Store, color: 'text-orange-500' },
    { label: 'Maternity Benefit', icon: Baby, color: 'text-pink-500' },
    { label: 'Contract Labour', icon: HardHat, color: 'text-amber-500' },
    { label: 'Industrial Relations', icon: Briefcase, color: 'text-indigo-500' },
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
      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Case Section</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-[#C9A84C] transition-all text-sm group"
      >
        <div className="flex items-center gap-3">
          <selectedOption.icon size={18} className={selectedOption.color} />
          <span className="font-bold text-slate-700">{selectedOption.label}</span>
        </div>
        <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            {options.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  onChange(option.label);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  value === option.label ? 'bg-[#0A1628] text-[#C9A84C]' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <option.icon size={18} className={value === option.label ? 'text-[#C9A84C]' : option.color} />
                <span className="flex-1 text-left font-bold">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CaseForm: React.FC<CaseFormProps> = ({ onSubmit, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fileNumber: `A/${Math.floor(Math.random() * 9000 + 1000)}/2025`,
    receivedDate: new Date().toISOString().split('T')[0],
    section: 'Minimum Wages',
    applicantName: '',
    applicantPhone: '',
    applicantEmail: '',
    applicantAddress: '',
    managementName: '',
    managementPerson: '',
    managementPhone: '',
    managementEmail: '',
    managementAddress: '',
    subject: '',
    amountRecovered: '0'
  });

  const steps = [
    { id: 1, title: 'Classification', sub: 'File Identity & Section' },
    { id: 2, title: 'Petitioner', sub: 'Applicant Credentials' },
    { id: 3, title: 'Respondent', sub: 'Management Entities' },
    { id: 4, title: 'Resolution', sub: 'Conflict & Quantum' }
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      handleNext();
      return;
    }

    const newCase: LaborCase = {
      id: Date.now().toString(),
      fileNumber: formData.fileNumber,
      receivedDate: formData.receivedDate,
      section: formData.section,
      applicantName: formData.applicantName,
      applicantPhones: [formData.applicantPhone],
      applicantEmail: formData.applicantEmail,
      applicantAddress: formData.applicantAddress,
      managementName: formData.managementName,
      managementPerson: formData.managementPerson,
      managementPhone: formData.managementPhone,
      managementEmail: formData.managementEmail,
      managementAddress: formData.managementAddress,
      subject: formData.subject,
      amountRecovered: parseFloat(formData.amountRecovered),
      status: CaseStatus.OPEN,
      hearings: [],
      createdAt: new Date().toISOString()
    };
    onSubmit(newCase);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="serif text-3xl font-black text-[#0A1628] flex items-center gap-3">
            <div className="p-2 bg-[#0A1628] rounded-xl text-[#C9A84C] shadow-lg shadow-[#0A1628]/10">
              <PlusCircle size={24} />
            </div>
            Registry Initiation
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">New Identity Record Creation • First Principles</p>
        </div>
        <button 
          onClick={onCancel}
          className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all self-start md:self-auto"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex items-start justify-between mb-12 relative px-4">
        <div className="absolute top-5 left-10 right-10 h-0.5 bg-slate-100 -z-10" />
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center gap-3 relative z-10">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 border-4 border-[#FDFBF7] shadow-sm ${
                currentStep === step.id 
                  ? 'bg-[#0A1628] text-[#C9A84C] scale-110 shadow-xl' 
                  : currentStep > step.id 
                    ? 'bg-[#C9A84C] text-[#0A1628]' 
                    : 'bg-slate-100 text-slate-400'
              }`}
            >
              {currentStep > step.id ? <CheckCircle2 size={18} /> : step.id}
            </div>
            <div className="text-center">
              <p className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= step.id ? 'text-[#0A1628]' : 'text-slate-300'}`}>
                {step.title}
              </p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5 hidden md:block">
                {step.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-[#0A1628]/5 overflow-hidden min-h-[400px] flex flex-col">
          <div className="h-1.5 w-full bg-[#C9A84C]/20">
            <div 
              className="h-full bg-[#0A1628] transition-all duration-700 ease-out" 
              style={{ width: `${(currentStep / 4) * 100}%` }} 
            />
          </div>
          
          <div className="p-10 flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Protocol File Number</label>
                    <div className="relative group">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#C9A84C] transition-colors" size={18} />
                      <input 
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#C9A84C] focus:bg-white transition-all text-sm font-bold outline-none" 
                        value={formData.fileNumber}
                        onChange={(e) => setFormData({...formData, fileNumber: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Identity Receipt Date</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#C9A84C] transition-colors" size={18} />
                      <input 
                        required
                        type="date"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#C9A84C] focus:bg-white transition-all text-sm font-bold outline-none" 
                        value={formData.receivedDate}
                        onChange={(e) => setFormData({...formData, receivedDate: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-end">
                  <SectionSelect 
                    value={formData.section} 
                    onChange={(v) => setFormData({...formData, section: v})} 
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Petitioner Legal Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#C9A84C]" size={18} />
                      <input 
                        required
                        placeholder="e.g. Sri A. Rajesh"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#C9A84C] focus:bg-white text-sm font-bold outline-none" 
                        value={formData.applicantName}
                        onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Electronic Mail Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#C9A84C]" size={18} />
                      <input 
                        type="email"
                        placeholder="applicant@example.com"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#C9A84C] text-sm font-bold outline-none" 
                        value={formData.applicantEmail}
                        onChange={(e) => setFormData({...formData, applicantEmail: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Primary Contact Line</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#C9A84C]" size={18} />
                      <input 
                        required
                        placeholder="+91-0000000000"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#C9A84C] text-sm font-bold outline-none" 
                        value={formData.applicantPhone}
                        onChange={(e) => setFormData({...formData, applicantPhone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Communication Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-5 text-slate-300 group-focus-within:text-[#C9A84C]" size={18} />
                    <textarea 
                      required
                      rows={3}
                      placeholder="Detailed residential or site address of the applicant"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#C9A84C] text-sm font-bold outline-none resize-none" 
                      value={formData.applicantAddress}
                      onChange={(e) => setFormData({...formData, applicantAddress: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Respondent Establishment</label>
                    <div className="relative group">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#C9A84C]" size={18} />
                      <input 
                        required
                        placeholder="Company or Industry Name"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#C9A84C] text-sm font-bold outline-none" 
                        value={formData.managementName}
                        onChange={(e) => setFormData({...formData, managementName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Representing Personnel</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#C9A84C]" size={18} />
                      <input 
                        placeholder="HR Manager / CEO Name"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#C9A84C] text-sm font-bold outline-none" 
                        value={formData.managementPerson}
                        onChange={(e) => setFormData({...formData, managementPerson: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Establishment Domicile</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-5 text-slate-300 group-focus-within:text-[#C9A84C]" size={18} />
                    <textarea 
                      required
                      rows={3}
                      placeholder="Registered office or site location address"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#C9A84C] text-sm font-bold outline-none resize-none" 
                      value={formData.managementAddress}
                      onChange={(e) => setFormData({...formData, managementAddress: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8 text-center md:text-left">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                   <div className="flex-1 w-full">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Conflict Narrative</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Specify the grievance core (e.g. Unpaid wages for Q3 2024)"
                      className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-[#C9A84C]/10 focus:border-[#C9A84C] text-sm font-bold outline-none italic" 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                   </div>
                   <div className="w-full md:w-64">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Initial Recovery Quantum</label>
                    <div className="relative h-full">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#C9A84C] serif text-2xl font-black">₹</span>
                      <input 
                        type="number"
                        placeholder="0.00"
                        className="w-full pl-12 pr-6 py-6 bg-[#0A1628] text-white border-none rounded-3xl serif text-3xl font-black focus:ring-4 focus:ring-[#C9A84C]/20 outline-none" 
                        value={formData.amountRecovered}
                        onChange={(e) => setFormData({...formData, amountRecovered: e.target.value})}
                      />
                    </div>
                   </div>
                </div>
                <div className="p-6 bg-[#C9A84C]/5 rounded-2xl border border-[#C9A84C]/20 flex items-center gap-4 text-left">
                  <div className="p-2 bg-[#C9A84C] text-[#0A1628] rounded-xl">
                    <Info size={20} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed">
                    By committing this record, you are initializing a permanent state trace in the Commissionerate database. Ensure all quantum values are verified.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <button 
              type="button" 
              onClick={currentStep === 1 ? onCancel : handleBack}
              className="flex items-center gap-2 px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-[#0A1628] transition-all"
            >
              <ChevronLeft size={16} />
              {currentStep === 1 ? 'Discard Trace' : 'Back Step'}
            </button>
            <button 
              type="submit"
              className="px-10 py-4 bg-[#0A1628] text-[#C9A84C] rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#0A1628]/20 hover:bg-[#C9A84C] hover:text-[#0A1628] transition-all flex items-center gap-3 active:scale-95"
            >
              {currentStep === 4 ? (
                <>
                  <Save size={18} />
                  Register Case Identity
                </>
              ) : (
                <>
                  Next Sequence
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CaseForm;