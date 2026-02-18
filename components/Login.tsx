
import React, { useState } from 'react';
import { Shield, ArrowLeft, Key, User, ChevronRight } from 'lucide-react';

interface LoginProps {
  onLogin: (success: boolean) => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified credential check for demonstration
    if (password === 'admin' || password === '1234') {
      onLogin(true);
    } else {
      alert("Invalid Security Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Visual Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <Shield size={600} className="absolute -top-40 -left-40 text-[#C9A84C]" />
      </div>

      <div className="max-w-md w-full relative z-10 space-y-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-[#C9A84C] transition-colors text-xs font-black uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Public Portal
        </button>

        <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-3xl border border-white/10 shadow-2xl space-y-8">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-[#C9A84C] text-[#0A1628] rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-[#C9A84C]/20">
              <Shield size={32} />
            </div>
            <h1 className="serif text-3xl font-black text-white tracking-tight mt-4">Security Gateway</h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Restricted Official Personnel Only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#C9A84C] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Officer ID"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#C9A84C] outline-none text-white font-bold transition-all placeholder-slate-600"
                  defaultValue="ASST_COMM_VK"
                  disabled
                />
              </div>
              <div className="relative group">
                <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#C9A84C] transition-colors" />
                <input 
                  type="password" 
                  placeholder="Personnel Key"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#C9A84C] outline-none text-white font-bold transition-all placeholder-slate-600"
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-[#C9A84C] text-[#0A1628] font-black text-sm uppercase tracking-widest rounded-xl hover:bg-white transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#C9A84C]/10"
            >
              Verify Session <ChevronRight size={18} />
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">
          Trace: 110.231.42.1 • Session Logged
        </p>
      </div>
    </div>
  );
};

export default Login;
