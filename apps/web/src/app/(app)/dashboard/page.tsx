'use client';

import { useQuery } from '@tanstack/react-query';
import type { DashboardSummary } from '@djob/validators';
import { ArrowUpRight, Cpu, LayoutDashboard, Package } from 'lucide-react';
import Link from 'next/link';

import { PageActionHeader } from '@/components/dashboard/PageActionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { dashboardApi } from '@/features/dashboard/api/dashboard.api';
import { DashboardAlerts } from '@/features/dashboard/components/DashboardAlerts';
import {
  DashboardRevenueChart,
  DashboardSalesByTypeChart,
} from '@/features/dashboard/components/DashboardCharts';
import { DashboardKpis } from '@/features/dashboard/components/DashboardKpis';

const statusLabels: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  IN_PRODUCTION: 'Em produção',
  READY: 'Pronto',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const dateFormatter = new Intl.DateTimeFormat('pt-BR');

export default function DashboardPage() {
  const {
    data: summary,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardApi.getSummary(),
  });

  return (
    <div className="space-y-6 mt-6">
      <PageActionHeader
        className="static"
        icon={LayoutDashboard}
        title="Painel Geral"
        subtitle="Métricas operacionais de vendas, estoque e produção em tempo real"
      />

      {isPending && <DashboardLoading />}

      {isError && (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-foreground">
              Não foi possível carregar o painel analítico.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'Tente novamente em instantes.'}
            </p>
          </CardContent>
        </Card>
      )}

      {summary && (
        <>
          <DashboardKpis kpis={summary.kpis} />

          <section className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-semibold">Ações rápidas</CardTitle>
                <CardDescription>Principais controles do ERP</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 p-4 pt-2">
                <Link href="/vendas/orcamentos" className="block">
                  <Button className="flex h-8 w-full justify-between">
                    Criar orçamento
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                  </Button>
                </Link>
                <Link href="/pcp" className="block">
                  <Button variant="outline" className="flex h-8 w-full justify-between">
                    Monitorar produção
                    <Cpu className="h-4 w-4" strokeWidth={1.5} />
                  </Button>
                </Link>
                <Link href="/estoque" className="block">
                  <Button variant="outline" className="flex h-8 w-full justify-between">
                    Ajustar estoque
                    <Package className="h-4 w-4" strokeWidth={1.5} />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <DashboardAlerts alerts={summary.alerts} />
            <DashboardSalesByTypeChart salesByProductType={summary.salesByProductType} />
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-semibold">Últimos pedidos</CardTitle>
                <CardDescription>Fluxo de vendas mais recente</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                {summary.recentOrders.length === 0 ? (
                  <p className="py-6 text-sm text-muted-foreground">
                    Nenhum pedido de venda registrado.
                  </p>
                ) : (
                  <div className="divide-y divide-white/15 dark:divide-white/[0.06]">
                    {summary.recentOrders.map((order: DashboardSummary['recentOrders'][number]) => (
                      <Link
                        key={order.id}
                        href="/vendas/pedidos"
                        className="flex items-center justify-between gap-4 py-3 first:pt-1 last:pb-1"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{order.code}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {order.customerName} · {dateFormatter.format(new Date(order.createdAt))}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold tabular-nums text-foreground">
                            {currencyFormatter.format(order.totalAmount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {statusLabels[order.status] ?? order.status}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <DashboardRevenueChart
              className="lg:col-span-2"
              revenueSeries={summary.revenueSeries}
            />
          </section>
        </>
      )}
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="space-y-6 mt-6" aria-label="Carregando painel analítico">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index}>
            <CardContent className="space-y-3 p-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <Skeleton className="h-72 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-72 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
