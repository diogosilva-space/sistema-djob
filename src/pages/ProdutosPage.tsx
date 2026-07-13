import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Package,
  Tag,
  Warehouse,
  AlertTriangle,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  FileText,
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
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { produtosMock } from '@/lib/mockDataProdutos';

export const ProdutosPage: React.FC = () => {
  const navigate = useNavigate();

  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const getCategoria = (sku: string) => {
    if (sku.startsWith('CAMISETA') || sku.startsWith('ECOBAG') || sku.startsWith('BONE')) {
      return 'Confecção';
    }
    return 'Brinde';
  };

  const getEstoqueStatus = (qtd: number) => {
    if (qtd <= 70) return 'destructive';
    if (qtd <= 100) return 'secondary';
    return 'default';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produtos & Catálogo</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão completa de brindes e itens de confecção própria
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-9 gap-2">
            <Tag size={16} />
            Categorias
          </Button>
          <Button onClick={() => navigate('/produtos/novo')} className="h-9 gap-2">
            <Plus size={16} />
            Novo Produto
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Total de Produtos
            </CardTitle>
            <Package size={14} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{produtosMock.length}</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Itens cadastrados no catálogo
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Valor em Estoque
            </CardTitle>
            <Warehouse size={14} className="text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(124350)}</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Avaliação a preço de custo
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Baixo Estoque
            </CardTitle>
            <AlertTriangle size={14} className="text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Itens abaixo do estoque mínimo
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Margem Média
            </CardTitle>
            <Tag size={14} className="text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42.5%</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              Performance de lucratividade
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-muted/40">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-base">Catálogo de Produtos</CardTitle>
              <CardDescription className="text-xs">
                Visualize e gerencie os detalhes técnicos e preços
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por nome ou SKU..." className="h-9 pl-9 text-xs" />
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
                  <TableHead className="text-xs font-semibold">Produto</TableHead>
                  <TableHead className="text-xs font-semibold">Categoria</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Preço Venda</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Estoque</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtosMock.map((prod) => (
                  <TableRow key={prod.id} className="hover:bg-muted/20 transition-colors group">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold leading-none mb-1">{prod.nome}</span>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {prod.sku}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="h-5 text-[10px] font-semibold uppercase">
                        {getCategoria(prod.sku)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-[13px] font-mono font-medium">
                      {formatCurrency(prod.precoVenda)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={getEstoqueStatus(prod.estoque || 0) as any}
                        className="h-5 text-[10px] uppercase font-bold"
                      >
                        {prod.estoque} {prod.unidade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100"
                          >
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
                            <FileText size={14} /> Ficha Técnica
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer gap-2 text-destructive">
                            <Trash2 size={14} /> Excluir
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
