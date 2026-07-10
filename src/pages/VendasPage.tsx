import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  FileText,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  MoreHorizontal,
  Download,
  Eye,
  Edit,
  Truck,
  DollarSign
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { vendasMock, StatusVenda } from '@/lib/mockDataVendas';
import { format } from 'date-fns';

export const VendasPage: React.FC = () => {
  const navigate = useNavigate();

  const getStatusColor = (status: StatusVenda) => {
    switch (status) {
      case 'Aprovado': return 'default';
      case 'Orçamento': return 'secondary';
      case 'Faturado': return 'default';
      case 'Entregue': return 'outline';
      case 'Em Produção': return 'secondary';
      case 'Cancelado': return 'destructive';
      default: return 'outline';
    }
  };

  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vendas & Orçamentos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão do ciclo comercial, desde o lead até o faturamento
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-9 gap-2">
            <Download size={16} />
            Exportar
          </Button>
          <Button onClick={() => navigate('/vendas/orcamentos/novo')} className="h-9 gap-2">
            <Plus size={16} />
            Novo Orçamento
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Orçamentos Pendentes
            </CardTitle>
            <Clock size={14} className="text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Aguardando aprovação do cliente
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Pedidos em Aberto
            </CardTitle>
            <Truck size={14} className="text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Em produção ou expedição
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Faturamento (Mês)
            </CardTitle>
            <DollarSign size={14} className="text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(45231)}</div>
            <div className="flex items-center gap-1 text-[11px] text-success font-medium mt-1">
              <ArrowUpRight size={12} />
              <span>+15.2% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Taxa de Conversão
            </CardTitle>
            <CheckCircle2 size={14} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32%</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Média de orçamentos fechados
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-muted/40">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-base">Histórico Comercial</CardTitle>
              <CardDescription className="text-xs">Visualize todos os orçamentos e pedidos de venda</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por número ou cliente..." className="h-9 pl-9 text-xs" />
              </div>
              <Button variant="outline" className="h-9 gap-2 text-xs">
                <Filter size={14} />
                Filtros
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-muted/60 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold">Número</TableHead>
                  <TableHead className="text-xs font-semibold">Cliente</TableHead>
                  <TableHead className="text-xs font-semibold">Data</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Valor Total</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Status</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendasMock.map((venda) => (
                  <TableRow key={venda.id} className="hover:bg-muted/20 transition-colors group">
                    <TableCell className="text-[13px] font-mono font-medium">{venda.numero}</TableCell>
                    <TableCell>
                      <span className="text-[13px] font-bold">{venda.clienteNome}</span>
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {format(venda.data, 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="text-right text-[13px] font-mono font-medium">
                      {formatCurrency(venda.valorTotal)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusColor(venda.status) as any} className="h-5 text-[10px] uppercase font-bold">
                        {venda.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                          <DropdownMenuItem className="cursor-pointer gap-2">
                            <Eye size={14} /> Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer gap-2">
                            <Edit size={14} /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer gap-2">
                            <FileText size={14} /> Gerar PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer gap-2">
                            <DollarSign size={14} /> Faturar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
