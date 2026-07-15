import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Acessar | D.job System',
    template: '%s | D.job System',
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
