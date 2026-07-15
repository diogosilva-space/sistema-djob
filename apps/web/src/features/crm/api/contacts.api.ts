import { apiFetch } from '@/lib/api-client';

export type Contact = {
  id: string;
  role: 'CLIENT' | 'SUPPLIER' | 'BOTH';
  type: 'FISICA' | 'JURIDICA';
  name: string;
  tradeName: string | null;
  document: string | null;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  city: string | null;
  state: string | null;
  isActive: boolean;
};

export const contactsApi = {
  getAll: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params);
    return apiFetch<Contact[]>(`/contacts${query.size ? `?${query.toString()}` : ''}`);
  },
  getOne: (id: string) => apiFetch<Contact & Record<string, unknown>>(`/contacts/${id}`),
  create: (data: Record<string, unknown>) =>
    apiFetch<Contact>('/contacts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, unknown>) =>
    apiFetch<Contact>(`/contacts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  toggle: (id: string) => apiFetch<Contact>(`/contacts/${id}/toggle`, { method: 'PATCH' }),
};
