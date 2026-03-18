import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit3, Key, X, Save, Shield } from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-amber-100 text-amber-700',
  officer: 'bg-blue-100 text-blue-700',
  viewer: 'bg-slate-100 text-slate-500',
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create/Edit modal state
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState({ username: '', password: '', role: 'officer' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Password change modal
  const [showPwModal, setShowPwModal] = useState(false);
  const [pwUser, setPwUser] = useState<User | null>(null);
  const [pw, setPw] = useState({ newPassword: '', confirm: '' });
  const [pwError, setPwError] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      setUsers(await api.getUsers());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const openCreate = () => {
    setEditUser(null);
    setForm({ username: '', password: '', role: 'officer' });
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (u: User) => {
    setEditUser(u);
    setForm({ username: u.username, password: '', role: u.role });
    setFormError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.username.trim()) return setFormError('Username is required');
    if (!editUser && !form.password.trim()) return setFormError('Password is required');
    setSaving(true);
    try {
      if (editUser) {
        const updated = await api.updateUser(editUser.id, form.username, form.role);
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
      } else {
        const created = await api.createUser(form.username, form.password, form.role);
        setUsers((prev) => [...prev, { ...created, createdAt: new Date().toISOString() }]);
      }
      setShowModal(false);
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const handleChangePw = async () => {
    setPwError('');
    if (pw.newPassword.length < 8) return setPwError('Password must be at least 8 characters');
    if (pw.newPassword !== pw.confirm) return setPwError('Passwords do not match');
    try {
      await api.changePassword(pwUser!.id, '', pw.newPassword);
      setShowPwModal(false);
      setPw({ newPassword: '', confirm: '' });
    } catch (e: unknown) {
      setPwError(e instanceof Error ? e.message : 'Failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#0A1628] rounded-2xl flex items-center justify-center">
            <Users size={28} className="text-[#C9A84C]" />
          </div>
          <div>
            <h1 className="serif text-3xl font-black text-[#0A1628]">User Management</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{users.length} registered accounts</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-6 py-3 bg-[#0A1628] text-[#C9A84C] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#C9A84C] hover:text-[#0A1628] transition-all shadow-lg"
        >
          <Plus size={18} /> Add User
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 font-bold animate-pulse">Loading users…</div>
      ) : error ? (
        <div className="text-center py-16 text-red-500 font-bold">{error}</div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0A1628] text-[#C9A84C]">
                {['Username', 'Role', 'Created', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className={`border-b border-slate-50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-amber-50/30 transition-colors`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#0A1628]/10 rounded-xl flex items-center justify-center">
                        <Shield size={14} className="text-[#0A1628]" />
                      </div>
                      <span className="text-sm font-black text-[#0A1628]">{u.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ROLE_COLORS[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-bold">
                    {new Date(u.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(u)} className="p-2 text-slate-400 hover:text-[#0A1628] hover:bg-slate-100 rounded-lg transition-all" title="Edit">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => { setPwUser(u); setPw({ newPassword: '', confirm: '' }); setPwError(''); setShowPwModal(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Change Password">
                        <Key size={16} />
                      </button>
                      <button onClick={() => handleDelete(u.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="serif text-2xl font-black text-[#0A1628]">{editUser ? 'Edit User' : 'New User'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</label>
                <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#C9A84C]" />
              </div>
              {!editUser && (
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#C9A84C]" />
                </div>
              )}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#C9A84C]">
                  <option value="admin">Admin</option>
                  <option value="officer">Officer</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              {formError && <p className="text-red-500 text-xs font-bold">{formError}</p>}
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0A1628] text-[#C9A84C] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#C9A84C] hover:text-[#0A1628] transition-all disabled:opacity-50">
                <Save size={16} /> {saving ? 'Saving…' : 'Save'}
              </button>
              <button onClick={() => setShowModal(false)} className="px-6 py-3 bg-slate-100 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPwModal && pwUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="serif text-2xl font-black text-[#0A1628]">Change Password</h2>
              <button onClick={() => setShowPwModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
            </div>
            <p className="text-sm text-slate-500 font-bold">Changing password for: <span className="text-[#0A1628]">{pwUser.username}</span></p>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Password</label>
                <input type="password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#C9A84C]" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirm Password</label>
                <input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#C9A84C]" />
              </div>
              {pwError && <p className="text-red-500 text-xs font-bold">{pwError}</p>}
            </div>
            <div className="flex gap-3">
              <button onClick={handleChangePw} className="flex-1 py-3 bg-[#0A1628] text-[#C9A84C] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#C9A84C] hover:text-[#0A1628] transition-all">Update Password</button>
              <button onClick={() => setShowPwModal(false)} className="px-6 py-3 bg-slate-100 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
