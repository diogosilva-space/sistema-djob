'use client';

import { useState, useEffect } from 'react';
import { vendasService } from '@/features/vendas/api/vendas.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Loader2,
  ArrowRight,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Truck,
} from 'lucide-react';
import { PageActionHeader } from '@/components/dashboard/PageActionHeader';

export default function SalesOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await vendasService.getSalesOrders();
      setOrders(data);
    } catch (error) {
      console.error('Erro ao buscar pedidos', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3" />
            <span>Pendente</span>
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle className="h-3 w-3" />
            <span>Confirmado</span>
          </span>
        );
      case 'IN_PRODUCTION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
            <Clock className="h-3 w-3" />
            <span>Em Produção</span>
          </span>
        );
      case 'READY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Package className="h-3 w-3" />
            <span>Pronto p/ Envio</span>
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-200">
            <Truck className="h-3 w-3" />
            <span>Enviado</span>
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="h-3 w-3" />
            <span>Entregue</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
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
        icon={Package}
        title="Pedidos de Venda"
        subtitle="Fluxo e expedição de pedidos convertidos e aprovados"
      />

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center rounded-xl glass-card">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 dark:bg-white/[0.06]">
            <Package className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-muted-foreground">Nenhum pedido de venda encontrado.</p>
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
                    <div className="text-lg tabular-nums font-bold text-foreground mt-1">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(order.totalAmount || 0)}
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-sm space-y-2 border-t border-white/20 dark:border-white/[0.08] pt-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cliente:</span>
                    <span className="font-semibold text-foreground truncate max-w-[170px]">
                      {order.customer?.name || 'Não informado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data de Criação:</span>
                    <span className="font-medium text-foreground">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-foreground hover:text-foreground font-semibold active:scale-[0.97] transition-all flex items-center gap-1"
                    >
                      <span>Gerenciar</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
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
