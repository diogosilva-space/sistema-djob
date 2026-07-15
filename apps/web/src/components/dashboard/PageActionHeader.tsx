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
        'sticky top-0 z-20 -mx-6 -mt-6 mb-8 flex h-16 shrink-0 items-center px-6 md:-mx-8 md:-mt-8 md:px-8',
        className,
      )}
    >
      <div className="flex h-full w-full items-center justify-between gap-2 rounded-xl glass-card-elevated px-3 py-2 sm:gap-4 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          {backHref && (
            <Button asChild variant="ghost" size="icon" className="h-8 w-9 shrink-0 sm:w-10">
              <Link href={backHref} aria-label="Voltar">
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </Button>
          )}
          {Icon && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/80 backdrop-blur-sm text-primary-foreground">
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
