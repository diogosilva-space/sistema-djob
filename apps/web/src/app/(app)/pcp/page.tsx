'use client';

import { useState, useEffect } from 'react';
import { pcpService } from '@/features/pcp/api/pcp.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, ArrowRight, Cpu, Play, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="h-3 w-3" />
            <span>Planejado</span>
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
            <Play className="h-3 w-3 animate-pulse text-blue-600" />
            <span>Em Produção</span>
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-705 border border-amber-200">
            <AlertTriangle className="h-3 w-3" />
            <span>Pausado</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-705 border border-emerald-200">
            <CheckCircle className="h-3 w-3" />
            <span>Concluído</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
            <AlertTriangle className="h-3 w-3" />
            <span>Cancelado</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
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
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Planejamento e Controle de Produção (PCP)</h1>
            <p className="text-sm text-slate-500">Gestão e apontamento do chão de fábrica da confecção</p>
          </div>
        </div>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 active:scale-[0.98] transition-transform">
          <Plus className="h-4 w-4" />
          <span>Nova Ordem de Produção</span>
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <Cpu className="h-12 w-12 text-slate-350 mb-4" />
          <p className="text-slate-500 font-medium mb-4">Nenhuma ordem de produção em andamento.</p>
          <Button variant="outline" className="border-slate-200 hover:bg-slate-100">
            Criar Primeira OP
          </Button>
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
                    <CardDescription className="font-semibold text-slate-500 mt-1">
                      {order.salesOrder ? `Pedido: ${order.salesOrder.code}` : 'OP Avulsa'}
                    </CardDescription>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-sm space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-455">Cliente:</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[170px]">
                      {order.salesOrder?.customer?.name || 'Não informado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-455">Etapas Cadastradas:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {order.steps?.length || 0}
                    </span>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Link href={`/pcp/${order.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-semibold active:scale-[0.97] transition-all flex items-center gap-1"
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
