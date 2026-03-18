import { LaborCase } from '../types';

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

  logout: (): void => {
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
