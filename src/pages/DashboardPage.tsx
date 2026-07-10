import React from 'react';

import {
  DollarSign,
  Users,
  Package,
  Settings,
  Phone,
  FileText,
  AlertTriangle,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardCharts } from '@/components/DashboardCharts';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="space-y-0.5">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-xs text-muted-foreground">
          Visão geral dos principais indicadores do negócio
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">
              Faturamento do Mês
            </CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">R$ 45.231,89</div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              +20.1% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Novos Clientes</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">+23</div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              +15% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">
              Pedidos em Aberto
            </CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">12</div>
            <p className="mt-1 text-[11px] text-muted-foreground">3 pedidos atrasados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">
              Ordens de Produção
            </CardTitle>
            <Settings className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">8</div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              5 em produção, 3 aguardando material
            </p>
          </CardContent>
        </Card>
      </section>

      <DashboardCharts />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Minhas Tarefas Hoje</CardTitle>
          <CardDescription className="text-xs">Você tem 3 tarefas pendentes</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5">
              <Phone className="size-4 shrink-0 text-muted-foreground mt-0.5" />
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-xs font-medium">Ligar para Cliente ABC</p>
                <p className="text-[11px] text-muted-foreground">CRM — Follow-up</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <FileText className="size-4 shrink-0 text-muted-foreground mt-0.5" />
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-xs font-medium">Enviar orçamento #1234</p>
                <p className="text-[11px] text-muted-foreground">Vendas</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <AlertTriangle className="size-4 shrink-0 text-amber-500 mt-0.5" />
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-xs font-medium">Estoque baixo: Caneca Branca</p>
                <p className="text-[11px] text-muted-foreground">Estoque</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
