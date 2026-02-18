import React, { useState, useMemo } from 'react';
import { LaborCase, Hearing } from '../types';
import { Printer, ArrowLeft, Send, CheckCircle, AlertCircle, Loader2, ChevronDown, Calendar } from 'lucide-react';

interface NoticePreviewProps {
  caseItem: LaborCase;
  onBack: () => void;
}

const NoticePreview: React.FC<NoticePreviewProps> = ({ caseItem, onBack }) => {
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // First Principles: The Notice is a "View" of a specific Hearing "Event"
  // If multiple hearings exist, the Commissioner can choose which one to generate a notice for.
  const [selectedHearingId, setSelectedHearingId] = useState<string>(
    caseItem.hearings.length > 0 ? caseItem.hearings[caseItem.hearings.length - 1].id : ''
  );

  const selectedEvent = useMemo(() => {
    return caseItem.hearings.find(h => h.id === selectedHearingId) || null;
  }, [caseItem.hearings, selectedHearingId]);

  const handlePrint = () => {
    window.print();
  };

  const handleSendAutomation = async () => {
    const webhookUrl = localStorage.getItem('make_webhook_url');
    if (!webhookUrl) {
      alert("Please configure the Make.com Webhook URL in Settings first!");
      return;
    }

    setIsSending(true);
    setSendStatus('idle');

    try {
      const payload = {
        timestamp: new Date().toISOString(),
        fileNumber: caseItem.fileNumber,
        section: caseItem.section,
        subject: caseItem.subject,
        applicant: {
          name: caseItem.applicantName,
          phone: caseItem.applicantPhones[0],
          email: caseItem.applicantEmail,
          address: caseItem.applicantAddress
        },
        management: {
          name: caseItem.managementName,
          person: caseItem.managementPerson,
          phones: caseItem.managementPhones,
          email: caseItem.managementEmail,
          address: caseItem.managementAddress
        },
        hearingDate: selectedEvent ? selectedEvent.date : 'TBD',
        noticeContent: `OFFICIAL JOINT MEETING NOTICE: Reference File ${caseItem.fileNumber}. You are hereby directed to attend a joint meeting regarding ${caseItem.subject} on ${selectedEvent ? new Date(selectedEvent.date).toLocaleString() : 'TBD'}.`
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSendStatus('success');
      } else {
        setSendStatus('error');
      }
    } catch (error) {
      console.error("Webhook Error:", error);
      setSendStatus('error');
    } finally {
      setIsSending(false);
      setTimeout(() => setSendStatus('idle'), 5000);
    }
  };

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 no-print p-4 bg-slate-900 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-white font-black text-sm uppercase tracking-widest">Notice Projection</h2>
            <p className="text-slate-500 text-[10px] font-bold tracking-tight">DATA SOURCE: {caseItem.fileNumber}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Event Selector Atom */}
          <div className="relative flex items-center bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <Calendar size={14} className="text-indigo-400 mr-2" />
            <select 
              value={selectedHearingId}
              onChange={(e) => setSelectedHearingId(e.target.value)}
              className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer appearance-none pr-6"
            >
              {caseItem.hearings.length > 0 ? (
                caseItem.hearings.map((h, i) => (
                  <option key={h.id} value={h.id} className="bg-slate-900 text-white">
                    Event {i+1}: {new Date(h.date).toLocaleDateString()}
                  </option>
                ))
              ) : (
                <option value="">No Events Available</option>
              )}
            </select>
            <ChevronDown size={12} className="text-slate-500 absolute right-2 pointer-events-none" />
          </div>

          <button 
            disabled={isSending || !selectedEvent}
            onClick={handleSendAutomation}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95 ${
              sendStatus === 'success' ? 'bg-emerald-600 text-white' :
              sendStatus === 'error' ? 'bg-red-600 text-white' :
              'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/40'
            } disabled:opacity-50`}
          >
            {isSending ? <Loader2 size={16} className="animate-spin" /> : 
             sendStatus === 'success' ? <CheckCircle size={16} /> :
             sendStatus === 'error' ? <AlertCircle size={16} /> :
             <Send size={16} />}
            {isSending ? 'PRODUCING...' : sendStatus === 'success' ? 'SENT' : 'COMMIT TO MAKE.COM'}
          </button>
          
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-xs font-black text-white hover:bg-slate-600"
          >
            <Printer size={16} />
            PRINT HARDCOPY
          </button>
        </div>
      </div>

      {/* Atomic Notice Template */}
      <div className="bg-white p-[0.75in] md:p-[1in] shadow-2xl mx-auto border border-slate-200 print:shadow-none print:border-none print:p-0 min-h-[11in] w-full max-w-[8.5in] transition-all duration-300 transform">
        <div className="text-center border-b-2 border-slate-900 pb-4 mb-8">
          <h1 className="text-2xl font-black uppercase tracking-widest text-slate-900 leading-tight">Government of Telangana</h1>
          <h2 className="text-lg font-bold mt-1 text-slate-800">Labour Department</h2>
          <p className="text-sm font-medium text-slate-600 mt-1">OFFICE OF THE ASSISTANT COMMISSIONER OF LABOUR</p>
          <p className="text-xs font-bold text-slate-500 tracking-wider">RANGAREDDY DISTRICT</p>
        </div>

        <div className="flex justify-between items-start mb-10">
          <div className="space-y-1">
            <p className="text-sm font-bold">Case Ref No: <span className="font-black underline ml-1">{caseItem.fileNumber}</span></p>
            <p className="text-sm font-bold">Category: <span className="font-medium ml-1">{caseItem.section}</span></p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">Dispatch Date: <span className="font-medium ml-1">{today}</span></p>
          </div>
        </div>

        <div className="mb-10 text-sm font-serif">
          <h3 className="font-black text-center underline mb-8 uppercase text-base tracking-widest">JOINT MEETING NOTICE</h3>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <p className="font-bold min-w-[30px]">To,</p>
              <div className="leading-relaxed">
                <p className="font-black">The Managing Director / Manager,</p>
                <p className="font-black text-lg">{caseItem.managementName}</p>
                <p className="italic text-slate-700">{caseItem.managementAddress}</p>
                <p className="mt-2 font-bold text-slate-800">Contact: {caseItem.managementPerson} ({caseItem.managementPhones[0]})</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <p className="font-bold min-w-[30px]">Sub:</p>
              <div className="italic leading-relaxed font-bold border-l-2 border-slate-200 pl-4 text-slate-700">
                <p>Industrial Relations Dispute - Case filed by <span className="text-slate-900 underline uppercase">{caseItem.applicantName}</span> regarding <span className="text-slate-900">"{caseItem.subject}"</span> - Summons for Joint Meeting - Regarding.</p>
              </div>
            </div>

            <div className="leading-relaxed text-justify mt-8 space-y-4">
              <p className="indent-12">
                It is brought to your notice that a formal labor representation has been registered in this office under the relevant provisions of the Labor Laws. The applicant (Petitioner) has raised serious concerns regarding industrial peace and statutory compliance.
              </p>
              <div className="p-6 bg-slate-50 border-2 border-slate-900/5 rounded-lg text-center font-bold">
                <p className="text-slate-500 uppercase text-[10px] tracking-widest mb-2">Scheduled Event Instance</p>
                <p className="text-xl text-slate-900">
                  {selectedEvent ? (
                    <>
                      On <span className="underline decoration-indigo-500 decoration-2">{new Date(selectedEvent.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span> at 
                      <span className="underline decoration-indigo-500 decoration-2 ml-2">{new Date(selectedEvent.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </>
                  ) : (
                    <span className="text-red-500 animate-pulse">PENDING SCHEDULING</span>
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-2 italic">Venue: Chambers of the Asst. Commissioner of Labour, Rangareddy.</p>
              </div>
              <p className="indent-12">
                You are strictly directed to attend the aforementioned meeting in person or through an authorized representative well-versed with the facts of the case. Failure to attend without valid prior intimation will result in the matter being decided ex-parte based on the merits of the petitioner's claim.
              </p>
            </div>

            <div className="mt-20 flex flex-col items-end">
              <div className="text-center w-64 border-t border-slate-900 pt-2">
                <p className="font-black uppercase text-sm">Assistant Commissioner of Labour</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rangareddy District</p>
                <div className="h-12 w-full flex items-center justify-center">
                  <p className="text-[8px] italic text-slate-300 uppercase">Digitally Projected Document</p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-[10px] font-sans border-t border-slate-100 pt-6">
              <p className="font-black uppercase tracking-widest text-slate-400 mb-2">Copy To Transmitted Atoms:</p>
              <p className="ml-4 font-bold text-slate-600">1. Sri <span className="text-slate-900">{caseItem.applicantName}</span> - (Transmitted via Digital Record)</p>
              <p className="ml-4 font-bold text-slate-600">2. Official Case Repository - {caseItem.fileNumber}</p>
            </div>
          </div>
        </div>
      </div>
      
      {!selectedEvent && (
        <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-3 text-orange-800 no-print">
          <AlertCircle size={20} />
          <p className="text-sm font-bold uppercase tracking-tight">Warning: Notice is currently in a "Pending Event" state. Add a hearing in the Case Details view to populate meeting variables.</p>
        </div>
      )}
    </div>
  );
};

export default NoticePreview;