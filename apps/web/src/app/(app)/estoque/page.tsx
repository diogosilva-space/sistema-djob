'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertCircle,
  Plus,
  RefreshCw,
  Database,
  AlertTriangle,
  CheckCircle,
  Tag,
} from 'lucide-react';
import { PageActionHeader } from '@/components/dashboard/PageActionHeader';
import { estoqueService } from '@/features/estoque/api/estoque.service';
import { productsService } from '@/features/products/api/products.service';

export default function EstoquePage() {
  const [items, setItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [adjustType, setAdjustType] = useState<'ENTRY' | 'EXIT' | 'ADJUST'>('ENTRY');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [reference, setReference] = useState('');

  const loadStock = async () => {
    try {
      setLoading(true);
      const [stockData, productsData] = await Promise.all([
        estoqueService.getStockItems(),
        productsService.getProducts(),
      ]);
      setItems(stockData);
      setProducts(productsData);
    } catch (err) {
      console.error('Erro ao carregar dados do estoque', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStock();
  }, []);

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || quantity <= 0) return;

    try {
      await estoqueService.adjustStock({
        productId: selectedProductId,
        type: adjustType,
        quantity,
        notes,
        reference,
        location: 'PRINCIPAL',
      });
      setShowAdjustModal(false);
      setSelectedProductId('');
      setAdjustType('ENTRY');
      setQuantity(1);
      setNotes('');
      setReference('');
      loadStock();
    } catch (err) {
      console.error('Erro ao ajustar estoque', err);
    }
  };

  const getStockStatus = (item: any) => {
    const qty = Number(item.quantity);
    const min = Number(item.product.minStock || 0);
    if (qty <= min) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
          <AlertTriangle className="h-3 w-3" />
          <span>Crítico (≤ {min})</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
        <CheckCircle className="h-3 w-3" />
        <span>Estável</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 mt-6">
      <PageActionHeader
        icon={Database}
        title="Estoque & Almoxarifado"
        subtitle="Acompanhamento de saldo e controle de insumos industriais"
      >
        <Button variant="outline" onClick={loadStock} className="gap-1.5">
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
        <Button onClick={() => setShowAdjustModal(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Ajustar Saldo
        </Button>
      </PageActionHeader>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-xl glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Total de Itens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl tabular-nums font-bold text-foreground">{items.length}</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Itens em Alerta Crítico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl tabular-nums font-bold text-destructive">
              {
                items.filter((item) => Number(item.quantity) <= Number(item.product.minStock || 0))
                  .length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl glass-card overflow-hidden">
        <CardHeader className="pb-3 border-b border-white/20 dark:border-white/[0.08]">
          <CardTitle className="text-base font-semibold text-foreground">
            Saldo de Insumos
          </CardTitle>
          <CardDescription>Visualização completa dos estoques por matéria-prima</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              Carregando saldo de insumos...
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              Nenhum saldo registrado no momento.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-white/15 dark:bg-white/[0.06]">
                  <TableHead className="pl-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Insumo / Matéria Prima
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    SKU
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Localização
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground text-right">
                    Quantidade
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Unidade
                  </TableHead>
                  <TableHead className="pr-6 text-xs font-medium uppercase tracking-wide text-muted-foreground text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-white/20 dark:hover:bg-white/[0.04]">
                    <TableCell className="pl-6 font-semibold text-foreground">
                      {item.product.name}
                    </TableCell>
                    <TableCell className="tabular-nums text-xs text-muted-foreground">
                      {item.product.sku}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.location}</TableCell>
                    <TableCell className="tabular-nums font-bold text-foreground text-right text-base">
                      {Number(item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 3 })}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm font-semibold">
                      {item.product.unit}
                    </TableCell>
                    <TableCell className="pr-6 text-right">{getStockStatus(item)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de Ajuste manual */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <Card className="w-full max-w-md rounded-xl glass-card-elevated shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <CardHeader className="pb-4 border-b border-white/20 dark:border-white/[0.08]">
              <CardTitle className="text-base font-semibold text-foreground">
                Ajustar Saldo de Estoque
              </CardTitle>
              <CardDescription>
                Adicione ou retire saldo manualmente das localizações
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleAdjust}>
              <CardContent className="space-y-5 p-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Produto / Insumo</label>
                  <select
                    className="flex h-8 w-full rounded-lg border border-input px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring glass-input"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    required
                  >
                    <option value="">Selecione o Insumo...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Tipo de Ajuste</label>
                  <select
                    className="flex h-8 w-full rounded-lg border border-input px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring glass-input"
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value as any)}
                  >
                    <option value="ENTRY">Entrada (+)</option>
                    <option value="EXIT">Saída (-)</option>
                    <option value="ADJUST">Inventário (Substituir Valor Absoluto)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Quantidade</label>
                  <Input
                    type="number"
                    step="0.001"
                    className="h-10 border-white/20 dark:border-white/[0.08] focus-visible:ring-djob"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="0.001"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Documento de Referência
                  </label>
                  <Input
                    type="text"
                    className="h-10 border-white/20 dark:border-white/[0.08] focus-visible:ring-djob"
                    value={reference}
                    placeholder="Ex: AJUSTE-2026, NF-123"
                    onChange={(e) => setReference(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Observações / Motivo
                  </label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-lg border border-white/20 dark:border-white/[0.08] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-djob"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Descreva o motivo do ajuste..."
                  />
                </div>
              </CardContent>
              <div className="flex justify-end gap-3 p-6 border-t border-white/20 dark:border-white/[0.08] bg-white/20 dark:bg-white/[0.04]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdjustModal(false)}
                  className="border-white/20 dark:border-white/[0.08] hover:bg-white/15 dark:hover:bg-white/[0.06] text-foreground"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="font-semibold active:scale-[0.98] transition-transform"
                >
                  Confirmar Ajuste
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
