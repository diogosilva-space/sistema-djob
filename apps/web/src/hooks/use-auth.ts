import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('djob_token', token);
        document.cookie = `djob_token=${encodeURIComponent(token)}; Path=/; Max-Age=604800; SameSite=Lax${
          window.location.protocol === 'https:' ? '; Secure' : ''
        }`;
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem('djob_token');
        document.cookie = 'djob_token=; Path=/; Max-Age=0; SameSite=Lax';
        set({ user: null, token: null });
      },
    }),
    {
      name: 'djob-auth-storage',
    },
  ),
);
