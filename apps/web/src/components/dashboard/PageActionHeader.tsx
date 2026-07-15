import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PageActionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  backHref?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageActionHeader({
  title,
  subtitle,
  icon: Icon,
  backHref,
  children,
  className,
}: PageActionHeaderProps) {
  return (
    <div
      className={cn(
        'sticky top-0 z-20 -mx-4 -mt-4 mb-8 flex h-16 shrink-0 items-center bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:-mx-6 md:-mt-6 md:px-6',
        className,
      )}
    >
      <div className="flex h-full w-full items-center justify-between gap-2 rounded-xl border border-border bg-card/50 px-2 py-2 sm:gap-4 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          {backHref && (
            <Button asChild variant="ghost" size="icon" className="h-8 w-9 shrink-0 sm:w-10">
              <Link href={backHref} aria-label="Voltar">
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </Button>
          )}
          {Icon && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-foreground">{title}</p>
            {subtitle && (
              <p className="line-clamp-2 text-xs text-muted-foreground md:line-clamp-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}
