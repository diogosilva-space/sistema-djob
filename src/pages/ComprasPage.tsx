import React from 'react';
import {
  Plus,
  Search,
  Filter,
  ShoppingCart,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  FileText,
  Truck
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

import { pedidosCompraMock } from '@/lib/mockDataCompras';
import { StatusPedidoCompra } from '@/features/compras/types/Compras.types';
import { format } from 'date-fns';
import { PedidoCompraModal } from '@/features/compras/components/PedidoCompraModal';

export const ComprasPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSavePedido = (data: any) => {
    console.log('Pedido de compra salvo:', data);
    alert('Pedido de compra gerado com sucesso!');
  };
  const getStatusColor = (status: StatusPedidoCompra) => {
    switch (status) {
      case 'Rascunho': return 'outline';
      case 'Aguardando Aprovação': return 'secondary';
      case 'Pedido Enviado': return 'secondary';
      case 'Recebido Parcial': return 'default';
      case 'Recebedio Total': return 'default';
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
          <h1 className="text-2xl font-bold tracking-tight">Compras</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão de fornecedores e suprimentos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-9 gap-2 font-medium">
            <FileText size={16} />
            Cotações
          </Button>
          <Button className="h-9 gap-2 font-medium" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            Novo Pedido de Compra
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Pedidos Pendentes
            </CardTitle>
            <Clock size={14} className="text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Aguardando recebimento
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Fornecedores Ativos
            </CardTitle>
            <Truck size={14} className="text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Parceiros homologados
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Compras (Mês)
            </CardTitle>
            <ShoppingCart size={14} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(28450)}</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Investimento em insumos
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Atrasos de Entrega
            </CardTitle>
            <AlertCircle size={14} className="text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">2</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Impacto na produção
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-muted/40">
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                Histórico de Pedidos
              </CardTitle>
              <CardDescription className="text-xs">Acompanhe o status e prazos dos pedidos de compra</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por número ou fornecedor..." className="h-9 pl-9 text-xs" />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter size={14} className="mr-2" />
                Filtrar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="text-xs font-semibold h-11">Número</TableHead>
                <TableHead className="text-xs font-semibold h-11">Fornecedor</TableHead>
                <TableHead className="text-xs font-semibold h-11">Data Emissão</TableHead>
                <TableHead className="text-xs font-semibold h-11">Previsão</TableHead>
                <TableHead className="text-xs font-semibold h-11 text-right">Total</TableHead>
                <TableHead className="text-xs font-semibold h-11 text-center">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidosCompraMock.map((pedido) => (
                <TableRow key={pedido.id} className="hover:bg-muted/20 transition-colors cursor-pointer group">
                  <TableCell className="text-[13px] font-mono font-medium py-3">{pedido.numero}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold">{pedido.fornecedorNome}</span>
                      <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-tighter">Homologado</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground py-3">
                    {format(pedido.dataEmissao, 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5 text-[13px] font-medium">
                      <Clock size={12} className="text-muted-foreground" />
                      {format(pedido.dataPrevisaoEntrega, 'dd/MM/yyyy')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-[13px] py-3">
                    {formatCurrency(pedido.valorTotal)}
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <Badge variant={getStatusColor(pedido.status)} className="h-5 text-[10px] uppercase font-bold">
                      {pedido.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-xs">
                        <DropdownMenuItem className="cursor-pointer gap-2">
                          <FileText size={14} /> Visualizar PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2">
                          <CheckCircle2 size={14} /> Confirmar Recebimento
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2 text-destructive">
                          <AlertCircle size={14} /> Cancelar Pedido
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 px-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-warning" /> Aguardando Material
          </span>
          <span className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-success" /> Recebido Total
          </span>
        </div>
        <Button variant="link" className="text-xs p-0 h-auto">Ver fornecedores sem pedidos há mais de 30 dias</Button>
      </div>

      <PedidoCompraModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePedido}
      />
    </div>
  );
};
