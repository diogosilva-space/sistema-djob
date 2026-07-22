'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

function AppBackgrounds() {
  return (
    <div className="absolute inset-0 blur-[20px] dark:blur-[5px] scale-100 saturate-[0] brightness-[1] dark:brightness-[0.3]">
      <Image
        src="/images/login-hero-mobile-light.png"
        alt=""
        fill
        className="object-cover md:hidden dark:hidden"
        priority
        quality={60}
        role="presentation"
      />
      <Image
        src="/images/login-hero-mobile-dark.png"
        alt=""
        fill
        className="object-cover md:hidden hidden dark:block"
        priority
        quality={60}
        role="presentation"
      />
      <Image
        src="/images/login-hero-desktop-light.png"
        alt=""
        fill
        className="object-cover hidden md:block dark:md:hidden"
        priority
        quality={60}
        role="presentation"
      />
      <Image
        src="/images/login-hero-desktop-dark.png"
        alt=""
        fill
        className="object-cover hidden dark:md:block"
        priority
        quality={60}
        role="presentation"
      />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuth((s) => s.token);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => setCollapsed((v) => !v), []);
  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);

  useEffect(() => {
    if (!token) {
      router.replace('/auth/login');
    }
  }, [token, router]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!token) return null;

  return (
    <div className="relative flex h-screen overflow-hidden">
      <AppBackgrounds />

      <div className="absolute inset-0 glass-overlay-light dark:glass-overlay-dark" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 dark:from-primary/[0.07] dark:to-secondary/[0.04]" />

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <div className="relative z-10 hidden shrink-0 md:block">
        <Sidebar collapsed={collapsed} />
      </div>

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-200 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Sidebar collapsed={false} />
      </div>

      <div className="relative z-10 flex flex-1 flex-col min-w-0">
        <Header
          collapsed={collapsed}
          onToggleSidebar={toggleCollapsed}
          onMobileMenuToggle={toggleMobile}
        />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
