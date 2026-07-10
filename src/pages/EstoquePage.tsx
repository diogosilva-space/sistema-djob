import React from 'react';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  Package,
  History,
  Download,
  Box,
  MoreHorizontal
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

import { itensEstoqueMock } from '@/lib/mockDataEstoque';
import { CategoriaItem } from '@/features/estoque/types/Estoque.types';
import { MovimentacaoModal } from '@/features/estoque/components/MovimentacaoModal';

export const EstoquePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSaveMovimentacao = (data: any) => {
    console.log('Movimentação salva:', data);
    alert('Movimentação registrada com sucesso!');
  };
  const getCategoriaColor = (categoria: CategoriaItem) => {
    switch (categoria) {
      case 'Matéria-Prima': return 'bg-category-2/10 text-category-2 border-category-2/20';
      case 'Produto Acabado': return 'bg-category-5/10 text-category-5 border-category-5/20';
      case 'Brinde': return 'bg-category-1/10 text-category-1 border-category-1/20';
      default: return 'bg-muted/50 text-muted-foreground border-muted';
    }
  };

  const getEstoqueStatus = (atual: number, minimo: number) => {
    if (atual <= 0) return { label: 'Zerado', color: 'destructive' };
    if (atual <= minimo) return { label: 'Baixo', color: 'destructive' };
    return { label: 'Ok', color: 'default' };
  };

  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Estoque</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão física e financeira de insumos e produtos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-9 gap-2">
            <History size={16} />
            Histórico
          </Button>
          <Button className="h-9 gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            Nova Movimentação
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Valor Total
            </CardTitle>
            <Box size={14} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(156840)}</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Baseado no custo médio atual
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Itens Totais
            </CardTitle>
            <Package size={14} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.245</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Unidades físicas em depósito
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Abaixo do Mínimo
            </CardTitle>
            <AlertTriangle size={14} className="text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">8</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Necessita reposição urgente
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Giro de Estoque
            </CardTitle>
            <ArrowUpDown size={14} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2x</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Trimestre atual
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-muted/40">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-base">Inventário Atual</CardTitle>
              <CardDescription className="text-xs">Consulte saldos e localize itens no armazém</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por SKU ou nome..." className="h-9 pl-9 text-xs" />
              </div>
              <Button variant="outline" className="h-9 gap-2 text-xs">
                <Filter size={14} />
                Filtros
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Download size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-muted/60 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold">Item</TableHead>
                  <TableHead className="text-xs font-semibold">Categoria</TableHead>
                  <TableHead className="text-xs font-semibold">Localização</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Mínimo</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Reservado</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Saldo Atual</TableHead>
                  <TableHead className="w-[100px] text-xs font-semibold text-center">Status</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itensEstoqueMock.map((item) => {
                  const status = getEstoqueStatus(item.quantidadeAtual, item.quantidadeMinima);
                  return (
                    <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold leading-none mb-1">{item.itemNome}</span>
                          <span className="text-[11px] font-mono text-muted-foreground">{item.itemSku}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded-full border inline-block ${getCategoriaColor(item.categoria)}`}>
                          {item.categoria}
                        </div>
                      </TableCell>
                      <TableCell className="text-[13px] text-muted-foreground">
                        {item.localizacao || '--'}
                      </TableCell>
                      <TableCell className="text-right text-[13px] font-medium text-muted-foreground">
                        {item.quantidadeMinima} {item.unidadeMedida}
                      </TableCell>
                      <TableCell className="text-right text-[13px] font-medium text-info">
                        {item.quantidadeReservada > 0 ? `${item.quantidadeReservada} ${item.unidadeMedida}` : '--'}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`text-[13px] font-bold ${status.color === 'destructive' ? 'text-destructive' : 'text-foreground'}`}>
                          {item.quantidadeAtual} <span className="text-[11px] font-medium text-muted-foreground">{item.unidadeMedida}</span>
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={status.color as any} className="h-5 text-[10px] uppercase font-bold">
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal size={14} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuItem className="cursor-pointer">Ver Histórico</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Ajustar Saldo</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Transferir Local</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="text-[11px] text-muted-foreground mt-4 flex items-center justify-between">
            <span>Mostrando {itensEstoqueMock.length} itens no total</span>
            <div className="flex gap-1">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded border bg-muted/20">
                <div className="h-2 w-2 rounded-full bg-destructive" /> Zerado/Baixo
              </span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded border bg-muted/20">
                <div className="h-2 w-2 rounded-full bg-primary" /> Disponível
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <MovimentacaoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMovimentacao}
      />
    </div>
  );
};
