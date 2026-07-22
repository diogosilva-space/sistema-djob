'use client';

import { useDroppable } from '@dnd-kit/core';

import { cn } from '@/lib/utils';

import type { PipelineColumn as PipelineColumnType } from '../types/Opportunity.types';

import { OpportunityCard } from './OpportunityCard';

interface PipelineColumnProps {
  column: PipelineColumnType;
  collapsed?: boolean;
}

const labels: Record<PipelineColumnType['status'], string> = {
  LEAD_QUALIFICADO: 'Lead qualificado',
  CONTATO_INICIAL: 'Contato inicial',
  APRESENTACAO: 'Apresentação',
  PROPOSTA_ENVIADA: 'Proposta enviada',
  NEGOCIACAO: 'Negociação',
  FECHADO_GANHO: 'Ganho',
  FECHADO_PERDIDO: 'Perdido',
};

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

export function PipelineColumn({ column, collapsed = false }: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.status });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        'flex min-h-[14rem] min-w-[16rem] flex-1 flex-col rounded-xl bg-white/30 dark:bg-white/[0.04] backdrop-blur-md border border-white/25 dark:border-white/[0.06] p-2',
        isOver && 'ring-2 ring-primary/30',
        collapsed && 'min-w-[9rem] flex-none',
      )}
    >
      <header className="flex items-start justify-between gap-2 px-1.5 py-1">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{labels[column.status]}</h2>
          {!collapsed && (
            <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
              {currency.format(column.value)}
            </p>
          )}
        </div>
        <span className="rounded-full bg-white/30 dark:bg-white/[0.08] px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
          {column.count}
        </span>
      </header>
      {!collapsed && (
        <div className="mt-2 space-y-2">
          {column.opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
          {column.opportunities.length === 0 && (
            <p className="px-2 py-6 text-center text-xs text-muted-foreground">
              Nenhuma oportunidade
            </p>
          )}
        </div>
      )}
    </section>
  );
}
