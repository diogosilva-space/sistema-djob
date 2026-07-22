'use client';

import { useState, useEffect } from 'react';
import { pcpService } from '@/features/pcp/api/pcp.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Loader2,
  Plus,
  ArrowRight,
  Cpu,
  Play,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { PageActionHeader } from '@/components/dashboard/PageActionHeader';

export default function PcpPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await pcpService.getProductionOrders();
      setOrders(data);
    } catch (error) {
      console.error('Erro ao buscar ordens de produção', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/15 dark:bg-white/[0.06] text-foreground border border-white/20 dark:border-white/[0.08]">
            <Clock className="h-3 w-3" />
            <span>Planejado</span>
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            <Play className="h-3 w-3 text-blue-600" />
            <span>Em Produção</span>
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="h-3 w-3" />
            <span>Pausado</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="h-3 w-3" />
            <span>Concluído</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
            <AlertTriangle className="h-3 w-3" />
            <span>Cancelado</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/15 dark:bg-white/[0.06] text-foreground border border-white/20 dark:border-white/[0.08]">
            <span>{status}</span>
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <PageActionHeader
        icon={Cpu}
        title="Produção (PCP)"
        subtitle="Gestão e apontamento do chão de fábrica da confecção"
      >
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          Nova Ordem
        </Button>
      </PageActionHeader>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center rounded-xl glass-card">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 dark:bg-white/[0.06]">
            <Cpu className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-muted-foreground">Nenhuma ordem de produção em andamento.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="rounded-xl glass-card hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-semibold text-foreground">
                      {order.code}
                    </CardTitle>
                    <CardDescription className="font-semibold text-muted-foreground mt-1">
                      {order.salesOrder ? `Pedido: ${order.salesOrder.code}` : 'OP Avulsa'}
                    </CardDescription>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-sm space-y-2 border-t border-white/20 dark:border-white/[0.08] pt-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cliente:</span>
                    <span className="font-semibold text-foreground truncate max-w-[170px]">
                      {order.salesOrder?.customer?.name || 'Não informado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Etapas Cadastradas:</span>
                    <span className="tabular-nums font-bold text-foreground">
                      {order.steps?.length || 0}
                    </span>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Link href={`/pcp/${order.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-foreground hover:text-foreground hover:bg-white/15 dark:hover:bg-white/[0.06] font-semibold active:scale-[0.97] transition-all flex items-center gap-1"
                      >
                        <span>Gerenciar OP</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
