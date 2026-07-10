import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { ordensProducaoMock } from '@/lib/mockDataProducao';
import { StatusOP, PrioridadeOP } from '@/features/producao/types/Producao.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ProducaoPage: React.FC = () => {
  const navigate = useNavigate();

  const getStatusColor = (status: StatusOP) => {
    switch (status) {
      case 'Aguardando Material': return 'destructive';
      case 'Em Produção': return 'secondary';
      case 'Finalizada': return 'default';
      case 'Cancelada': return 'destructive';
      default: return 'outline';
    }
  };

  const getPrioridadeColor = (prioridade: PrioridadeOP) => {
    switch (prioridade) {
      case 'Alta': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Normal': return 'bg-info/10 text-info border-info/20';
      case 'Baixa': return 'bg-muted/50 text-muted-foreground border-muted';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produção</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Planejamento e controle de produção (PCP)
          </p>
        </div>
        <Button className="h-9 gap-2">
          <Plus size={16} />
          Nova Ordem de Produção
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-muted/40">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
              OPs Ativas
            </CardTitle>
            <Clock size={14} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">
              5 sendo processadas agora
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
              Material Pendente
            </CardTitle>
            <AlertCircle size={14} className="text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ordens bloqueadas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
              Finalizadas/Mês
            </CardTitle>
            <CheckCircle2 size={14} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
              Eficiência
            </CardTitle>
            <CheckCircle2 size={14} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Meta atingida
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-muted/40">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-base">Ordens de Produção</CardTitle>
              <CardDescription className="text-xs">
                Gerencie o fluxo de trabalho da fábrica
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por OP, cliente ou produto..."
                  className="h-9 pl-9 text-xs"
                />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Filter size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-muted/60 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[100px] text-xs font-semibold">Nº OP</TableHead>
                  <TableHead className="text-xs font-semibold">Produto</TableHead>
                  <TableHead className="text-xs font-semibold">Cliente</TableHead>
                  <TableHead className="w-[80px] text-xs font-semibold text-center">Qtd</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Entrega</TableHead>
                  <TableHead className="w-[100px] text-xs font-semibold text-center">Prioridade</TableHead>
                  <TableHead className="w-[140px] text-xs font-semibold">Status</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordensProducaoMock.map((op) => (
                  <TableRow key={op.id} className="cursor-pointer hover:bg-muted/20" onClick={() => navigate(`/producao/ordem/${op.id}`)}>
                    <TableCell className="font-mono text-xs font-medium">{op.numero}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium">{op.produtoNome}</span>
                        <span className="text-[11px] text-muted-foreground">{op.produtoSku}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[13px]">{op.clienteNome}</TableCell>
                    <TableCell className="text-center font-medium text-[13px]">{op.quantidade}</TableCell>
                    <TableCell className="text-center text-[13px]">
                      {format(op.dataEntregaPrometida, 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded-full border inline-block ${getPrioridadeColor(op.prioridade)}`}>
                        {op.prioridade}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(op.status)} className="h-5 text-[10px] font-semibold uppercase">
                        {op.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Eye size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-[11px] text-muted-foreground">
              Mostrando {ordensProducaoMock.length} de 45 ordens de produção
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs" disabled>Anterior</Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">Próxima</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
