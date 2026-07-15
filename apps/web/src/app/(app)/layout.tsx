'use client';

import { useState, useCallback, useEffect } from 'react';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { cn } from '@/lib/utils';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => setCollapsed((v) => !v), []);
  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar — desktop: static */}
      <div className="hidden shrink-0 md:block">
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Mobile sidebar drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-200 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Sidebar collapsed={false} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header
          collapsed={collapsed}
          onToggleSidebar={toggleCollapsed}
          onMobileMenuToggle={toggleMobile}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
