'use client';

import type { ReactNode } from 'react';

import { Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Alternar tema"
      className="text-white/70 hover:text-white hover:bg-white/10"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

function HeroBackgrounds() {
  return (
    <>
      <Image
        src="/images/login-hero-mobile-light.png"
        alt=""
        fill
        className="object-cover md:hidden dark:hidden"
        priority
        quality={85}
        role="presentation"
      />
      <Image
        src="/images/login-hero-mobile-dark.png"
        alt=""
        fill
        className="object-cover md:hidden hidden dark:block"
        priority
        quality={85}
        role="presentation"
      />
      <Image
        src="/images/login-hero-desktop-light.png"
        alt=""
        fill
        className="object-cover hidden md:block dark:md:hidden"
        priority
        quality={85}
        role="presentation"
      />
      <Image
        src="/images/login-hero-desktop-dark.png"
        alt=""
        fill
        className="object-cover hidden dark:md:block"
        priority
        quality={85}
        role="presentation"
      />
    </>
  );
}

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <HeroBackgrounds />

      <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />

      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/10 dark:from-primary/10 dark:to-secondary/5" />

      <div className="absolute top-5 left-5 z-20 flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
          <span className="text-base font-bold text-white">D</span>
        </div>
        <span className="text-lg font-extrabold tracking-tight text-white drop-shadow-sm">
          D<span className="text-secondary">.</span>job System
        </span>
      </div>

      <div className="absolute top-5 right-5 z-20">
        <div className="h-9 w-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
          <ThemeToggle />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[420px] mx-4">
        <div className="rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
          <div className="p-7 space-y-6">
            <div className="space-y-1.5 text-center">
              <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
              <p className="text-sm dark:text-white/60 text-white">{description}</p>
            </div>

            <div className="auth-glass-form space-y-6">{children}</div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs dark:text-white/60 text-white">
          &copy; {new Date().getFullYear()} D.job Sistemas — Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
