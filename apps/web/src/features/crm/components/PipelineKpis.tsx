'use client';

import { Activity, CircleDollarSign, Target, TrendingUp } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

import type { PipelineMetrics } from '../types/Opportunity.types';

interface PipelineKpisProps {
  metrics: PipelineMetrics;
}

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

export function PipelineKpis({ metrics }: PipelineKpisProps) {
  const items = [
    {
      label: 'Pipeline total',
      value: currency.format(metrics.totalPipelineValue),
      icon: CircleDollarSign,
    },
    {
      label: 'Pipeline ponderado',
      value: currency.format(metrics.weightedPipelineValue),
      icon: TrendingUp,
    },
    { label: 'Negociações paradas', value: String(metrics.rottingDeals), icon: Activity },
    { label: 'Taxa de ganho', value: `${Math.round(metrics.winRate * 100)}%`, icon: Target },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, value, icon: Icon }) => (
        <Card key={label}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums text-foreground">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
