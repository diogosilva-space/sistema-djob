import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  TrendingUp,
  History,
  FileText,
  Boxes,
  Layers,
  BarChart3,
  Image as ImageIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { produtosMock } from '@/lib/mockDataProdutos';

export const ProdutoDetalhesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const produto = produtosMock.find((p) => p.id === id);

  if (!produto) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-bold">Produto não encontrado</h2>
        <Button onClick={() => navigate('/produtos')} className="mt-4">
          Voltar para Catálogo
        </Button>
      </div>
    );
  }

  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/produtos')}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{produto.nome}</h1>
              <Badge variant="outline" className="font-mono text-[10px] uppercase">
                SKU: {produto.sku}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{produto.descricao}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-9 gap-2">
            <History size={16} />
            Histórico
          </Button>
          <Button onClick={() => navigate(`/produtos/editar/${id}`)} className="h-9 gap-2">
            <Edit size={16} />
            Editar Produto
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Preço de Venda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(produto.precoVenda)}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Margem Bruta Est.: 45%</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Estoque Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {produto.estoque} {produto.unidade}
            </div>
            <p className="text-[11px] text-green-500 font-medium mt-1">Suficiente para 24 dias</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Valor em Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency((produto.estoque || 0) * (produto.precoVenda * 0.6))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Baseado no custo médio</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/40 font-inter">
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Vendas (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <div className="flex items-center gap-1 text-[11px] text-green-500 font-medium mt-1">
              <TrendingUp size={12} />
              <span>+12% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="geral" className="gap-2 text-xs h-8">
            <FileText size={14} /> Ficha Técnica
          </TabsTrigger>
          <TabsTrigger value="producao" className="gap-2 text-xs h-8">
            <Layers size={14} /> Processos de Produção
          </TabsTrigger>
          <TabsTrigger value="estoque" className="gap-2 text-xs h-8">
            <Boxes size={14} /> Movimentação
          </TabsTrigger>
          <TabsTrigger value="vendas" className="gap-2 text-xs h-8">
            <BarChart3 size={14} /> Vendas e Leads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-sm border-muted/40">
              <CardHeader>
                <CardTitle className="text-base">Imagens do Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed">
                    <ImageIcon size={32} className="text-muted-foreground opacity-20" />
                  </div>
                  <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed">
                    <ImageIcon size={32} className="text-muted-foreground opacity-20" />
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 h-9 text-xs">
                  Adicionar Imagem
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-muted/40">
              <CardHeader>
                <CardTitle className="text-base">Componentes / Insumos (BOM)</CardTitle>
                <CardDescription className="text-xs">
                  Itens necessários para fabricação ou personalização
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b">
                      <TableHead className="text-[11px] uppercase font-bold text-muted-foreground h-10">
                        Insumo
                      </TableHead>
                      <TableHead className="text-[11px] uppercase font-bold text-muted-foreground h-10 text-center">
                        Qtd
                      </TableHead>
                      <TableHead className="text-[11px] uppercase font-bold text-muted-foreground h-10 text-right">
                        Custo
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3].map((i) => (
                      <TableRow key={i} className="hover:bg-muted/10">
                        <TableCell className="text-[13px] font-medium py-2.5">
                          Insumo Exemplo {i}
                        </TableCell>
                        <TableCell className="text-[13px] text-center py-2.5">1.0 UN</TableCell>
                        <TableCell className="text-[13px] text-right font-mono py-2.5">
                          {formatCurrency(2.5)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-between mt-4 pt-4 border-t px-2 font-bold bg-muted/20 p-2 rounded">
                  <span className="text-xs uppercase text-muted-foreground">
                    Custo Total Insumos
                  </span>
                  <span className="text-sm font-mono text-primary">{formatCurrency(7.5)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="producao">
          <Card className="shadow-sm border-muted/40">
            <CardHeader>
              <CardTitle className="text-base">Etapas do Workflow de Produção</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { step: 'Corte', time: '10 min', resp: 'Equipe Têxtil' },
                  { step: 'Costura', time: '25 min', resp: 'Equipe Têxtil' },
                  { step: 'Personalização Sublimática', time: '15 min', resp: 'Produção Brindes' },
                  { step: 'Revisão e Dobra', time: '5 min', resp: 'Qualidade' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/5 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[13px] font-bold">{item.step}</h4>
                      <p className="text-[11px] text-muted-foreground">Responsável: {item.resp}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="h-5 text-[10px] uppercase">
                        {item.time}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
