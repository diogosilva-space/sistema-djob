import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | D.job System',
    default: 'Legal | D.job System',
  },
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
