
import React, { useState, useEffect } from 'react';
import { Save, Link, Bell, Shield, Database } from 'lucide-react';

const Settings: React.FC = () => {
  const [makeUrl, setMakeUrl] = useState('');
  const [n8nUrl, setN8nUrl] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedMakeUrl = localStorage.getItem('make_webhook_url');
    const savedN8nUrl = localStorage.getItem('n8n_webhook_url');
    if (savedMakeUrl) setMakeUrl(savedMakeUrl);
    if (savedN8nUrl) setN8nUrl(savedN8nUrl);
  }, []);

  const handleSave = () => {
    localStorage.setItem('make_webhook_url', makeUrl);
    localStorage.setItem('n8n_webhook_url', n8nUrl);
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
              <h2 className="font-bold text-gray-800">Automation Integrations</h2>
              <p className="text-xs text-gray-500">Trigger external workflows automatically via Webhooks.</p>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">n8n Webhook URL</label>
                <input 
                  type="text"
                  placeholder="https://your-n8n.instance/webhook/..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  value={n8nUrl}
                  onChange={(e) => setN8nUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Make.com Webhook URL</label>
                <input 
                  type="text"
                  placeholder="https://hook.us1.make.com/..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  value={makeUrl}
                  onChange={(e) => setMakeUrl(e.target.value)}
                />
              </div>
            </div>
            
            <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <strong>Data Payload:</strong> When triggered, the system sends a JSON object containing the <code>event</code> type, <code>timestamp</code>, and the full <code>case</code> data.
            </p>

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
