
import React, { useState, useRef, useEffect } from 'react';
import { LaborCase, CaseStatus } from '../types';
import { 
  Save, X, Phone, User, Building, MapPin, 
  Calendar, Info, FileText, Mail, ChevronDown,
  Clock, Store, Briefcase, Baby, HardHat, Scale,
  PlusCircle
} from 'lucide-react';

interface CaseFormProps {
  onSubmit: (newCase: LaborCase) => void;
  onCancel: () => void;
}

// Creative Custom Dropdown Component
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
      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Case Section</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-400 transition-all text-sm group"
      >
        <div className="flex items-center gap-2">
          <selectedOption.icon size={16} className={selectedOption.color} />
          <span className="font-medium text-gray-700">{selectedOption.label}</span>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-1">
            {options.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  onChange(option.label);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  value === option.label ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <option.icon size={16} className={option.color} />
                <span className="flex-1 text-left font-medium">{option.label}</span>
                {value === option.label && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CaseForm: React.FC<CaseFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fileNumber: `A/${Math.floor(Math.random() * 9000 + 1000)}/2024`,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
              <PlusCircle size={20} />
            </div>
            New Representation Entry
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">Rangareddy Labour Commissionerate Case Intake</p>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Core Case Grid */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-blue-600 w-full" />
          <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">File Number</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  required
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm outline-none" 
                  value={formData.fileNumber}
                  onChange={(e) => setFormData({...formData, fileNumber: e.target.value})}
                />
              </div>
            </div>
            <div className="md:col-span-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Date Received</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  required
                  type="date"
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm outline-none" 
                  value={formData.receivedDate}
                  onChange={(e) => setFormData({...formData, receivedDate: e.target.value})}
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <SectionSelect 
                value={formData.section} 
                onChange={(v) => setFormData({...formData, section: v})} 
              />
            </div>
          </div>
        </div>

        {/* Multi-Column Data Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Worker Info Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <User size={16} />
                </div>
                <h2 className="font-bold text-gray-800 text-sm">Applicant Details</h2>
              </div>
            </div>
            <div className="space-y-3">
              <input 
                required
                placeholder="Full Name of Worker"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm outline-none transition-all" 
                value={formData.applicantName}
                onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    required
                    placeholder="Phone No."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none" 
                    value={formData.applicantPhone}
                    onChange={(e) => setFormData({...formData, applicantPhone: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    type="email"
                    placeholder="Email (Optional)"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none" 
                    value={formData.applicantEmail}
                    onChange={(e) => setFormData({...formData, applicantEmail: e.target.value})}
                  />
                </div>
              </div>
              <textarea 
                required
                rows={2}
                placeholder="Residential Address"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none resize-none" 
                value={formData.applicantAddress}
                onChange={(e) => setFormData({...formData, applicantAddress: e.target.value})}
              />
            </div>
          </div>

          {/* Management Info Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Building size={16} />
                </div>
                <h2 className="font-bold text-gray-800 text-sm">Management Details</h2>
              </div>
            </div>
            <div className="space-y-3">
              <input 
                required
                placeholder="Establishment / Company Name"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none transition-all" 
                value={formData.managementName}
                onChange={(e) => setFormData({...formData, managementName: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  placeholder="Manager Phone"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none" 
                  value={formData.managementPhone}
                  onChange={(e) => setFormData({...formData, managementPhone: e.target.value})}
                />
                <input 
                  type="email"
                  placeholder="HR Email"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none" 
                  value={formData.managementEmail}
                  onChange={(e) => setFormData({...formData, managementEmail: e.target.value})}
                />
              </div>
              <input 
                placeholder="HR / Contact Person Name"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none" 
                value={formData.managementPerson}
                onChange={(e) => setFormData({...formData, managementPerson: e.target.value})}
              />
              <textarea 
                required
                rows={1}
                placeholder="Registered Address"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none resize-none" 
                value={formData.managementAddress}
                onChange={(e) => setFormData({...formData, managementAddress: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Narrative & Finance Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <FileText size={16} />
            </div>
            <h2 className="font-bold text-gray-800 text-sm">Complaint & Recovery</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <textarea 
                required
                rows={2}
                placeholder="Subject of Representation (e.g., Termination, Arrears, etc.)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm outline-none" 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>
            <div className="md:col-span-1">
              <div className="relative h-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                <input 
                  type="number"
                  placeholder="Initial Recovery"
                  className="w-full h-full pl-8 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-bold outline-none" 
                  value={formData.amountRecovered}
                  onChange={(e) => setFormData({...formData, amountRecovered: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-[10px] text-gray-400 italic">Form validates automatically. Ensure all required fields are marked.</p>
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Discard
            </button>
            <button 
              type="submit"
              className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-2 active:scale-95"
            >
              <Save size={18} />
              Register Case
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CaseForm;
