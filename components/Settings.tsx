
import React, { useState, useEffect } from 'react';
import { Save, Link, Bell, Shield, Database } from 'lucide-react';

const Settings: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedUrl = localStorage.getItem('make_webhook_url');
    if (savedUrl) setWebhookUrl(savedUrl);
  }, []);

  const handleSave = () => {
    localStorage.setItem('make_webhook_url', webhookUrl);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-500">Configure integrations and application behavior.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Automation Integration */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-slate-50">
            <Link className="text-blue-600" size={24} />
            <div>
              <h2 className="font-bold text-gray-800">Make.com Integration</h2>
              <p className="text-xs text-gray-500">Trigger WhatsApp and Email notifications automatically.</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Notice Webhook URL</label>
              <input 
                type="text"
                placeholder="https://hook.us1.make.com/your-unique-id"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <p className="mt-2 text-xs text-gray-500">
                Data sent to this URL includes: File Number, Applicant Details, Management Details, and Notice Content.
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                onClick={handleSave}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                  isSaved ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Save size={18} />
                {isSaved ? 'Settings Saved' : 'Save Configuration'}
              </button>
            </div>
          </div>
        </div>

        {/* Placeholder cards for other settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Notifications</h3>
              <p className="text-xs text-gray-500">Manage internal staff alerts</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <Database size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Backup & Restore</h3>
              <p className="text-xs text-gray-500">Export local storage data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
