import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, TrendingUp, Target, Search, Filter, LayoutGrid, List } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

import { ClientesTable } from '@/features/crm/components/ClientesTable';
import { PipelineKanban } from '@/features/crm/components/PipelineKanban';
import { useClientes } from '@/features/crm/hooks/useClientes';
import { oportunidadesMock } from '@/lib/mockDataOportunidades';
import { StatusOportunidade, Oportunidade } from '@/features/crm/types/Oportunidade.types';

export const CRMPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: clientes } = useClientes();
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>(oportunidadesMock);

  const clientesAtivos = clientes?.filter((c) => c.ativo) || [];
  const novosMes =
    clientes?.filter((c) => {
      const umMesAtras = new Date();
      umMesAtras.setMonth(umMesAtras.getMonth() - 1);
      return new Date(c.criadoEm) > umMesAtras;
    }).length || 0;

  // Calcular KPIs do Pipeline
  const oportunidadesAtivas = oportunidades.filter((o) => !o.status.includes('fechado'));
  const valorPotencial = oportunidadesAtivas.reduce((acc, o) => acc + o.valor, 0);
  const taxaConversao = Math.round(
    (oportunidades.filter((o) => o.status === 'fechado_ganho').length / oportunidades.length) * 100,
  );

  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  // Handlers
  const handleMoveOportunidade = (id: string, novoStatus: StatusOportunidade) => {
    setOportunidades((prev) => prev.map((o) => (o.id === id ? { ...o, status: novoStatus } : o)));
  };

  const handleClickOportunidade = (oportunidade: Oportunidade) => {
    console.log('Oportunidade clicada:', oportunidade);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRM & Relacionamento</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão de clientes, histórico de interações e pipeline comercial
          </p>
        </div>
        <Button onClick={() => navigate('/crm/clientes/novo')} className="h-9 gap-2">
          <Plus size={16} />
          Novo Cliente
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Total de Clientes
            </CardTitle>
            <Users size={14} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesAtivos.length}</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              +{novosMes} novos nas últimas 4 semanas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Pipeline Ativo
            </CardTitle>
            <Target size={14} className="text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(valorPotencial)}</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Valor total em {oportunidadesAtivas.length} oportunidades
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Taxa de Conversão
            </CardTitle>
            <TrendingUp size={14} className="text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taxaConversao}%</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Performance do funil de vendas
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clientes" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted/50 p-1 h-9">
            <TabsTrigger value="clientes" className="gap-2 text-xs h-7">
              <List size={14} /> Clientes
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="gap-2 text-xs h-7">
              <LayoutGrid size={14} /> Funil de Vendas
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome, CPF/CNPJ..." className="h-9 pl-9 text-xs" />
            </div>
            <Button variant="outline" className="h-9 gap-2 text-xs font-medium">
              <Filter size={14} /> Filtros
            </Button>
          </div>
        </div>

        <TabsContent value="clientes" className="space-y-4">
          <Card className="shadow-sm border-muted/40">
            <CardContent className="pt-6">
              <ClientesTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="bg-muted/10 rounded-lg p-1">
            <PipelineKanban
              oportunidades={oportunidades}
              onMoveOportunidade={handleMoveOportunidade}
              onClickOportunidade={handleClickOportunidade}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
