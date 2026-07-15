const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';
const BASE_API_URL = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

function forceLogout() {
  localStorage.removeItem('djob_token');
  localStorage.removeItem('djob-auth-storage');
  document.cookie = 'djob_token=; Path=/; Max-Age=0; SameSite=Lax';
  window.location.href = '/auth/login';
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('djob_token') : null;

  if (!token && typeof window !== 'undefined') {
    forceLogout();
    throw new Error('Sessão expirada. Redirecionando para login...');
  }

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    forceLogout();
    throw new Error('Sessão expirada. Redirecionando para login...');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Ocorreu um erro na requisição');
  }

  return response.json();
}
