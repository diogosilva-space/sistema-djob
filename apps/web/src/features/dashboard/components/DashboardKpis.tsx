import type { DashboardSummary } from '@djob/validators';
import { AlertTriangle, ClipboardList, Cpu, DollarSign } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardKpisProps {
  kpis: DashboardSummary['kpis'];
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function DashboardKpis({ kpis }: DashboardKpisProps) {
  const items = [
    {
      title: 'Faturamento do mês',
      value: currencyFormatter.format(kpis.revenue),
      description: 'Pedidos não cancelados no período',
      icon: DollarSign,
      valueClassName: 'text-foreground',
      iconClassName: 'text-primary',
    },
    {
      title: 'Pedidos em aberto',
      value: String(kpis.openOrders),
      description: 'Pedidos em fluxo operacional',
      icon: ClipboardList,
      valueClassName: 'text-foreground',
      iconClassName: 'text-info',
    },
    {
      title: 'OPs em andamento',
      value: String(kpis.activeProductionOrders),
      description: 'Ordens ativas no chão de fábrica',
      icon: Cpu,
      valueClassName: 'text-foreground',
      iconClassName: 'text-primary',
    },
    {
      title: 'Estoque crítico',
      value: String(kpis.criticalStock),
      description: 'Itens abaixo do estoque mínimo',
      icon: AlertTriangle,
      valueClassName: 'text-destructive',
      iconClassName: 'text-destructive',
    },
  ];

  return (
    <section
      aria-label="Indicadores principais"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {items.map(({ title, value, description, icon: Icon, valueClassName, iconClassName }) => (
        <Card key={title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {title}
            </CardTitle>
            <Icon className={`h-4 w-4 ${iconClassName}`} strokeWidth={1.5} />
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className={`text-2xl font-bold tabular-nums ${valueClassName}`}>{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
