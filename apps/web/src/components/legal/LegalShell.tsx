'use client';

import type { ReactNode } from 'react';

import { ArrowLeft, ChevronDown, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  title: string;
}

interface LegalShellProps {
  title: string;
  lastUpdated: string;
  sections: Section[];
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
      className="text-muted-foreground hover:text-foreground"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

function TableOfContents({ sections, className }: { sections: Section[]; className?: string }) {
  return (
    <nav aria-label="Índice" className={className}>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Índice
      </h2>
      <ul className="space-y-1.5">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors block py-0.5"
            >
              {index + 1}. {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function MobileTableOfContents({ sections }: { sections: Section[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden mb-8 rounded-lg border bg-card">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-sm font-medium text-foreground"
        aria-expanded={isOpen}
      >
        Índice
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      {isOpen && (
        <div className="border-t px-4 pb-4 pt-2">
          <ul className="space-y-1.5">
            {sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block py-0.5"
                >
                  {index + 1}. {section.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function LegalShell({ title, lastUpdated, sections, children }: LegalShellProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">D</span>
            </div>
            <span className="text-base font-extrabold tracking-tight text-primary">
              D<span className="text-secondary">.</span>job System
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-muted-foreground hover:text-foreground gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Última atualização: {lastUpdated}</p>
        </div>

        <MobileTableOfContents sections={sections} />

        <div className="flex gap-12">
          <TableOfContents
            sections={sections}
            className="hidden lg:block w-48 shrink-0 sticky top-24 self-start"
          />

          <article className="min-w-0 flex-1 max-w-3xl prose-container">{children}</article>
        </div>
      </div>

      <footer className="border-t py-6">
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} D.job Sistemas — Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
