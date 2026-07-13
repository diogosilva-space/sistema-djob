import React from 'react';

import {
  DollarSign,
  Users,
  Package,
  Factory,
  Phone,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardCharts } from '@/components/DashboardCharts';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Page Header ── */}
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-xs text-muted-foreground">
          Visão geral dos principais indicadores do negócio
        </p>
      </header>

      {/* ── KPIs — Hierarquia: 2 principais + 2 secundários ── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI Principal 1 — Faturamento */}
        <Card className="sm:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Faturamento do Mês
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
              <DollarSign className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">R$ 45.231,89</div>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-success">
              <ArrowUpRight className="h-3 w-3" />
              <span>+20.1% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI Principal 2 — Novos Clientes */}
        <Card className="sm:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Novos Clientes
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">+23</div>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-success">
              <ArrowUpRight className="h-3 w-3" />
              <span>+15% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI Secundário 3 — Pedidos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Pedidos em Aberto
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
              <Package className="h-4 w-4 text-warning-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">12</div>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-destructive">
              <ArrowDownRight className="h-3 w-3" />
              <span>3 pedidos atrasados</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI Secundário 4 — Produção */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Ordens de Produção
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10">
              <Factory className="h-4 w-4 text-info" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">8</div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              5 em produção, 3 aguardando material
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── Gráficos ── */}
      <DashboardCharts />

      {/* ── Tarefas do Dia ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Minhas Tarefas Hoje</CardTitle>
          <CardDescription>Você tem 3 tarefas pendentes</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/30">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Phone className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-[13px] font-medium">Ligar para Cliente ABC</p>
                <p className="text-[11px] text-muted-foreground">CRM — Follow-up</p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/30">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-info/10">
                <FileText className="h-3.5 w-3.5 text-info" />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-[13px] font-medium">Enviar orçamento #1234</p>
                <p className="text-[11px] text-muted-foreground">Vendas</p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/30">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-warning/10">
                <AlertTriangle className="h-3.5 w-3.5 text-warning-foreground" />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-[13px] font-medium">Estoque baixo: Caneca Branca</p>
                <p className="text-[11px] text-muted-foreground">Estoque</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
