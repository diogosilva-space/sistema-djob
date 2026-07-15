'use client';

import { AlertTriangle, CalendarDays, GripVertical } from 'lucide-react';
import Link from 'next/link';
import { useDraggable } from '@dnd-kit/core';

import { cn } from '@/lib/utils';

import type { Opportunity } from '../types/Opportunity.types';

interface OpportunityCardProps {
  opportunity: Opportunity;
  draggable?: boolean;
}

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

function isRotting(lastInteractionAt: string) {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - 7);
  return new Date(lastInteractionAt) < threshold;
}

export function OpportunityCard({ opportunity, draggable = true }: OpportunityCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: opportunity.id,
    data: { status: opportunity.status },
    disabled: !draggable,
  });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  const rotting = isRotting(opportunity.lastInteractionAt);

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md',
        isDragging && 'z-20 opacity-60',
      )}
    >
      <div className="flex gap-2">
        {draggable && (
          <button
            type="button"
            aria-label={`Mover ${opportunity.name}`}
            className="mt-0.5 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
            {...listeners}
            {...attributes}
          >
            <GripVertical className="h-4 w-4" strokeWidth={1.5} />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <Link
            href={`/crm/opportunities/${opportunity.id}`}
            className="line-clamp-2 text-sm font-semibold text-foreground hover:text-primary"
          >
            {opportunity.name}
          </Link>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {opportunity.contact?.name ?? opportunity.customer?.name ?? 'Contato não informado'}
          </p>
        </div>
        {rotting && (
          <AlertTriangle className="h-4 w-4 shrink-0 text-warning" aria-label="Sem interação há mais de 7 dias" />
        )}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold tabular-nums text-foreground">
          {currency.format(Number(opportunity.value))}
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
          {opportunity.probability}%
        </span>
      </div>
      {opportunity.expectedCloseAt && (
        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />
          {new Intl.DateTimeFormat('pt-BR').format(new Date(opportunity.expectedCloseAt))}
        </p>
      )}
    </article>
  );
}
