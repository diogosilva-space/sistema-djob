'use client';

import { useState, useEffect } from 'react';
import { vendasService } from '@/features/vendas/api/vendas.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowRight, Package, Clock, CheckCircle, AlertTriangle, Truck } from 'lucide-react';

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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-750 border border-amber-200">
            <Clock className="h-3 w-3" />
            <span>Pendente</span>
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-750 border border-blue-200">
            <CheckCircle className="h-3 w-3" />
            <span>Confirmado</span>
          </span>
        );
      case 'IN_PRODUCTION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-750 border border-purple-200">
            <Clock className="h-3 w-3" />
            <span>Em Produção</span>
          </span>
        );
      case 'READY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-750 border border-indigo-200">
            <Package className="h-3 w-3" />
            <span>Pronto p/ Envio</span>
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-cyan-750 border border-cyan-200">
            <Truck className="h-3 w-3" />
            <span>Enviado</span>
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-755 border border-emerald-200">
            <CheckCircle className="h-3 w-3" />
            <span>Entregue</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-750 border border-red-200">
            <AlertTriangle className="h-3 w-3" />
            <span>Cancelado</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-750 border border-slate-200">
            <span>{status}</span>
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Pedidos de Venda</h1>
            <p className="text-sm text-slate-500">Fluxo e expedição de pedidos convertidos e aprovados</p>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <Package className="h-12 w-12 text-slate-350 mb-4" />
          <p className="text-slate-500 font-medium mb-4">Nenhum pedido de venda encontrado.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-extrabold text-slate-900">{order.code}</CardTitle>
                    <div className="text-lg font-mono font-bold text-slate-950 mt-1">
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
                <div className="text-sm space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-455">Cliente:</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[170px]">
                      {order.customer?.name || 'Não informado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-455">Data de Criação:</span>
                    <span className="font-medium text-slate-800">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-semibold active:scale-[0.97] transition-all flex items-center gap-1"
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
