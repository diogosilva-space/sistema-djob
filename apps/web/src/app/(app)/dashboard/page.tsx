'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Users,
  Package,
  Cpu,
  ArrowUpRight,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  History,
} from 'lucide-react';
import Link from 'next/link';
import { vendasService } from '@/features/vendas/api/vendas.service';
import { pcpService } from '@/features/pcp/api/pcp.service';
import { estoqueService } from '@/features/estoque/api/estoque.service';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    salesTotal: 0,
    salesCount: 0,
    opsActive: 0,
    criticalStock: 0,
    recentSales: [] as any[],
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      
      let sales: any[] = [];
      try {
        sales = await vendasService.getSalesOrders();
      } catch (err) {
        console.error('Erro ao carregar vendas no dashboard:', err);
      }

      let ops: any[] = [];
      try {
        ops = await pcpService.getProductionOrders();
      } catch (err) {
        console.error('Erro ao carregar ordens de produção no dashboard:', err);
      }

      let stock: any[] = [];
      try {
        stock = await estoqueService.getStockItems();
      } catch (err) {
        console.error('Erro ao carregar itens de estoque no dashboard:', err);
      }

      const salesTotal = sales ? sales.reduce((acc, s) => acc + Number(s.totalAmount || 0), 0) : 0;
      const activeOps = ops ? ops.filter(o => o.status !== 'COMPLETED').length : 0;
      const critStock = stock ? stock.filter(item => Number(item.quantity || 0) <= Number(item.product?.minStock || 0)).length : 0;

      setMetrics({
        salesTotal,
        salesCount: sales ? sales.length : 0,
        opsActive: activeOps,
        criticalStock: critStock,
        recentSales: sales ? sales.slice(0, 5) : [],
      });
      setLoading(false);
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Carregando painel analítico...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Painel Geral</h1>
          <p className="text-sm text-slate-500">
            Métricas operacionais de vendas, estoque e produção em tempo real
          </p>
        </div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Card 1: Faturamento */}
        <Card className="md:col-span-2 bg-slate-900 text-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold tracking-wide text-slate-400 uppercase">
              Faturamento Total
            </CardTitle>
            <DollarSign className="h-5 w-5 text-djob" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-4xl font-mono font-extrabold">
              R$ {metrics.salesTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-400">
              <TrendingUp className="h-4 w-4 text-djob" />
              <span>Baseado em {metrics.salesCount} pedidos convertidos</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: PCP Ativo */}
        <Card className="bg-white border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              OPs em Andamento
            </CardTitle>
            <Cpu className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-4xl font-mono font-extrabold text-slate-900">
              {metrics.opsActive}
            </div>
            <p className="text-xs text-slate-400 mt-2">Ordens ativas no chão de fábrica</p>
          </CardContent>
        </Card>

        {/* Card 3: Estoque Crítico */}
        <Card className="bg-white border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Estoque Crítico
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-4xl font-mono font-extrabold text-red-600">
              {metrics.criticalStock}
            </div>
            <p className="text-xs text-slate-400 mt-2">Matérias-primas abaixo do mínimo</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Pedidos Recentes */}
        <Card className="md:col-span-2 bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Últimos Pedidos</CardTitle>
            <CardDescription>Fluxo de vendas integrado em tempo real</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.recentSales.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">Nenhum pedido de venda registrado.</p>
            ) : (
              <div className="space-y-4">
                {metrics.recentSales.map((sale) => (
                  <div key={sale.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-slate-900">{sale.code}</p>
                      <p className="text-xs text-slate-400">{sale.customer.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-slate-900">
                        R$ {Number(sale.totalAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {sale.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Atalhos Operacionais */}
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Ações Rápidas</CardTitle>
            <CardDescription>Principais painéis de controle do ERP</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/vendas/orcamentos" className="block">
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white flex justify-between px-4 py-2 h-10">
                <span>Criar Orçamento</span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pcp" className="block">
              <Button variant="outline" className="w-full border-slate-200 text-slate-800 flex justify-between px-4 py-2 h-10">
                <span>Monitorar Produção</span>
                <Cpu className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/estoque" className="block">
              <Button variant="outline" className="w-full border-slate-200 text-slate-800 flex justify-between px-4 py-2 h-10">
                <span>Ajustar Estoque</span>
                <Package className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
