import { LaborCase, User, Attachment, AuditEntry, ReportSummary } from '../types';

// In dev, Vite proxies /api → http://localhost:4000
// In production, the Express server serves both on the same origin
const API_BASE = '';

const getToken = (): string | null => localStorage.getItem('auth_token');

const authHeaders = (): Record<string, string> => {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
};

export const api = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  login: async (username: string, password: string): Promise<{ token: string; username: string; role: string }> => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await handleResponse(res);
    localStorage.setItem('auth_token', data.token);
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', headers: authHeaders() });
    } catch { /* ignore network errors on logout */ }
    localStorage.removeItem('auth_token');
  },

  isAuthenticated: (): boolean => !!getToken(),

  // ── Cases ─────────────────────────────────────────────────────────────────
  getCases: async (): Promise<LaborCase[]> => {
    const res = await fetch(`${API_BASE}/api/cases`, { headers: authHeaders() });
    return handleResponse(res);
  },

  createCase: async (c: LaborCase): Promise<LaborCase> => {
    const res = await fetch(`${API_BASE}/api/cases`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(c),
    });
    return handleResponse(res);
  },

  updateCase: async (c: LaborCase): Promise<LaborCase> => {
    const res = await fetch(`${API_BASE}/api/cases/${c.id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(c),
    });
    return handleResponse(res);
  },

  getPublicCase: async (fileNumber: string): Promise<Partial<LaborCase>> => {
    const res = await fetch(
      `${API_BASE}/api/cases/public/${encodeURIComponent(fileNumber)}`,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return handleResponse(res);
  },

  // ── Export ────────────────────────────────────────────────────────────────
  exportCases: (): void => {
    const token = getToken();
    const url = `${API_BASE}/api/cases/export`;
    const a = document.createElement('a');
    // Use fetch to carry the auth header then trigger download
    fetch(url, { headers: authHeaders() })
      .then((r) => r.blob())
      .then((blob) => {
        a.href = URL.createObjectURL(blob);
        a.download = 'cases_export.csv';
        a.click();
        URL.revokeObjectURL(a.href);
      });
  },

  // ── Users ─────────────────────────────────────────────────────────────────
  getUsers: async (): Promise<User[]> => {
    const res = await fetch(`${API_BASE}/api/users`, { headers: authHeaders() });
    return handleResponse(res);
  },

  createUser: async (username: string, password: string, role: string): Promise<User> => {
    const res = await fetch(`${API_BASE}/api/users`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ username, password, role }),
    });
    return handleResponse(res);
  },

  updateUser: async (id: number, username: string, role: string): Promise<User> => {
    const res = await fetch(`${API_BASE}/api/users/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ username, role }),
    });
    return handleResponse(res);
  },

  changePassword: async (id: number, currentPassword: string, newPassword: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/api/users/${id}/password`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse(res);
  },

  deleteUser: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/api/users/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  // ── Attachments ───────────────────────────────────────────────────────────
  getAttachments: async (caseId: string): Promise<Attachment[]> => {
    const res = await fetch(`${API_BASE}/api/attachments/${caseId}`, { headers: authHeaders() });
    return handleResponse(res);
  },

  uploadAttachment: async (caseId: string, file: File): Promise<Attachment> => {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/api/attachments/${caseId}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return handleResponse(res);
  },

  deleteAttachment: async (attachmentId: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/api/attachments/${attachmentId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  getAttachmentUrl: (attachmentId: string): string => `${API_BASE}/api/attachments/file/${attachmentId}`,

  // ── Reports ───────────────────────────────────────────────────────────────
  getReportSummary: async (): Promise<ReportSummary> => {
    const res = await fetch(`${API_BASE}/api/reports/summary`, { headers: authHeaders() });
    return handleResponse(res);
  },

  // ── Audit ─────────────────────────────────────────────────────────────────
  getCaseHistory: async (caseId: string): Promise<AuditEntry[]> => {
    const res = await fetch(`${API_BASE}/api/audit/cases/${caseId}`, { headers: authHeaders() });
    return handleResponse(res);
  },

  // ── Settings ──────────────────────────────────────────────────────────────
  getSettings: async (): Promise<Record<string, string>> => {
    const res = await fetch(`${API_BASE}/api/settings`, { headers: authHeaders() });
    return handleResponse(res);
  },

  updateSettings: async (settings: Record<string, string>): Promise<void> => {
    const res = await fetch(`${API_BASE}/api/settings`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(settings),
    });
    return handleResponse(res);
  },
};
