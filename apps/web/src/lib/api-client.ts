const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';
const BASE_API_URL = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('djob_token') : null;

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Ocorreu um erro na requisição');
  }

  return response.json();
}
