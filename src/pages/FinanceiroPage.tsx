import React from 'react';
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertCircle,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  CheckCircle2,
  Calendar,
  FileText
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

import { titulosMock, Titulo } from '@/lib/mockDataFinanceiro';
import { format } from 'date-fns';
import { PagamentoModal } from '@/features/financeiro/components/PagamentoModal';

export const FinanceiroPage: React.FC = () => {
  const [selectedTitulo, setSelectedTitulo] = React.useState<Titulo | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOpenPagamento = (titulo: Titulo) => {
    setSelectedTitulo(titulo);
    setIsModalOpen(true);
  };

  const handleSavePagamento = (data: any) => {
    console.log('Pagamento registrado:', data);
    alert(`Pagamento de ${formatCurrency(data.valorRecebido)} registrado com sucesso!`);
    setIsModalOpen(false);
  };
  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pago': return 'default';
      case 'Pendente': return 'secondary';
      case 'Atrasado': return 'destructive';
      default: return 'outline';
    }
  };

  const contasAReceber = titulosMock.filter(t => t.tipo === 'Receita');
  const contasAPagar = titulosMock.filter(t => t.tipo === 'Despesa');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão de fluxo de caixa, contas a pagar e receber
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-9 gap-2">
            <Download size={16} />
            DRE
          </Button>
          <Button className="h-9 gap-2">
            <Plus size={16} />
            Novo Lançamento
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Saldo em Contas
            </CardTitle>
            <Wallet size={14} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(84520.45)}</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Soma de todas as contas bancárias
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Total a Receber
            </CardTitle>
            <TrendingUp size={14} className="text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(132400)}</div>
            <div className="flex items-center gap-1 text-[11px] text-success font-medium mt-1">
              <ArrowUpRight size={12} />
              <span>R$ 15k vencendo hoje</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Total a Pagar
            </CardTitle>
            <TrendingDown size={14} className="text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(42150.80)}</div>
            <div className="flex items-center gap-1 text-[11px] text-destructive font-medium mt-1">
              <ArrowDownRight size={12} />
              <span>R$ 2k em atraso</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Previsão de Saldo (30d)
            </CardTitle>
            <Wallet size={14} className="text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(174769.65)}</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Projeção baseada em vencimentos
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="receber" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="receber" className="gap-2 text-xs py-1.5 px-4 h-8">
              A Receber <Badge variant="secondary" className="h-4 px-1 text-[10px]">{contasAReceber.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pagar" className="gap-2 text-xs py-1.5 px-4 h-8">
              A Pagar <Badge variant="secondary" className="h-4 px-1 text-[10px]">{contasAPagar.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="fluxo" className="gap-2 text-xs py-1.5 px-4 h-8">
              Fluxo de Caixa
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por descrição ou cliente..." className="h-9 pl-9 text-xs" />
            </div>
            <Button variant="outline" className="h-9 gap-2 text-xs">
              <Filter size={14} />
              Filtros
            </Button>
          </div>
        </div>

        <TabsContent value="receber">
          <Card className="shadow-sm border-muted/40">
            <CardContent className="pt-6">
              <div className="rounded-md border border-muted/60 overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs font-semibold">Descrição</TableHead>
                      <TableHead className="text-xs font-semibold">Cliente</TableHead>
                      <TableHead className="text-xs font-semibold text-center">Vencimento</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Valor</TableHead>
                      <TableHead className="text-xs font-semibold text-center">Status</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contasAReceber.map((titulo) => (
                      <TableRow key={titulo.id} className="hover:bg-muted/20 transition-colors group">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold leading-none mb-1">{titulo.descricao}</span>
                            <span className="text-[11px] text-muted-foreground uppercase tracking-tighter">{titulo.categoriaFinanceira}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-[13px] font-medium">{titulo.clienteFornecedorNome}</span>
                        </TableCell>
                        <TableCell className="text-center text-[13px] text-muted-foreground">
                          {format(titulo.dataVencimento, 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell className="text-right text-[13px] font-mono font-bold text-success">
                          {formatCurrency(titulo.valorAtual)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={getStatusColor(titulo.status) as any} className="h-5 text-[10px] uppercase font-bold">
                            {titulo.status}
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
                              <DropdownMenuItem
                                className="cursor-pointer gap-2"
                                onClick={() => handleOpenPagamento(titulo)}
                              >
                                <CheckCircle2 size={14} /> Baixar Título
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer gap-2">
                                <Calendar size={14} /> Prorrogar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer gap-2">
                                <FileText size={14} /> Segunda Via Boleto
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
        </TabsContent>

        <TabsContent value="pagar">
          <Card className="shadow-sm border-muted/40">
            <CardContent className="pt-6">
              <div className="rounded-md border border-muted/60 overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs font-semibold">Descrição</TableHead>
                      <TableHead className="text-xs font-semibold">Fornecedor</TableHead>
                      <TableHead className="text-xs font-semibold text-center">Vencimento</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Valor</TableHead>
                      <TableHead className="text-xs font-semibold text-center">Status</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contasAPagar.map((titulo) => (
                      <TableRow key={titulo.id} className="hover:bg-muted/20 transition-colors group">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold leading-none mb-1">{titulo.descricao}</span>
                            <span className="text-[11px] text-muted-foreground uppercase tracking-tighter">{titulo.categoriaFinanceira}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-[13px] font-medium">{titulo.clienteFornecedorNome}</span>
                        </TableCell>
                        <TableCell className="text-center text-[13px] text-muted-foreground">
                          {format(titulo.dataVencimento, 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell className="text-right text-[13px] font-mono font-bold text-destructive">
                          {formatCurrency(titulo.valorAtual)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={getStatusColor(titulo.status) as any} className="h-5 text-[10px] uppercase font-bold">
                            {titulo.status}
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
                              <DropdownMenuItem
                                className="cursor-pointer gap-2"
                                onClick={() => handleOpenPagamento(titulo)}
                              >
                                <CheckCircle2 size={14} /> Baixar Título
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer gap-2">
                                <Calendar size={14} /> Prorrogar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer gap-2 text-destructive">
                                <AlertCircle size={14} /> Estornar
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
        </TabsContent>

        <TabsContent value="fluxo">
          <Card className="shadow-sm border-muted/40">
            <CardContent className="h-[400px] flex items-center justify-center p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center gap-4">
                  <div className="h-40 w-12 bg-success/20 rounded-t-md relative flex items-end">
                    <div className="h-[80%] w-full bg-success rounded-t-md" />
                    <span className="absolute -top-6 left-0 right-0 text-[10px] font-bold">Jan</span>
                  </div>
                  <div className="h-40 w-12 bg-success/20 rounded-t-md relative flex items-end">
                    <div className="h-[65%] w-full bg-success rounded-t-md" />
                    <span className="absolute -top-6 left-0 right-0 text-[10px] font-bold">Fev</span>
                  </div>
                  <div className="h-40 w-12 bg-success/20 rounded-t-md relative flex items-end">
                    <div className="h-[95%] w-full bg-success rounded-t-md" />
                    <span className="absolute -top-6 left-0 right-0 text-[10px] font-bold">Mar</span>
                  </div>
                  <div className="h-40 w-12 bg-destructive/20 rounded-t-md relative flex items-end">
                    <div className="h-[40%] w-full bg-destructive rounded-t-md" />
                    <span className="absolute -top-6 left-0 right-0 text-[10px] font-bold">Abr</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground max-w-sm">Gráfico interativo de fluxo de caixa mensal (Receitas vs Despesas)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedTitulo && (
        <PagamentoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          titulo={selectedTitulo}
          onSave={handleSavePagamento}
        />
      )}
    </div>
  );
};
