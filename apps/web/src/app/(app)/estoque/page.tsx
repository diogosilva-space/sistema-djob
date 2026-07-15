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
import { AlertCircle, Plus, RefreshCw, Database, AlertTriangle, CheckCircle, Tag } from 'lucide-react';
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
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-750 border border-red-100">
          <AlertTriangle className="h-3 w-3" />
          <span>Crítico (≤ {min})</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-705 border border-emerald-100">
        <CheckCircle className="h-3 w-3" />
        <span>Estável</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Estoque & Almoxarifado</h1>
            <p className="text-sm text-slate-500">
              Acompanhamento de saldo e controle de insumos industriais
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadStock}
            className="border-slate-200 hover:bg-slate-100 text-slate-700 active:scale-[0.98] transition-transform"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Atualizar</span>
          </Button>
          <Button
            onClick={() => setShowAdjustModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold active:scale-[0.98] transition-transform"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Ajustar Saldo</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Total de Itens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-extrabold text-slate-900">{items.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Itens em Alerta Crítico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-extrabold text-red-650">
              {items.filter((item) => Number(item.quantity) <= Number(item.product.minStock || 0)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-lg font-bold text-slate-900">Saldo de Insumos</CardTitle>
          <CardDescription>Visualização completa dos estoques por matéria-prima</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12 text-slate-500 font-medium">Carregando saldo de insumos...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-medium">
              Nenhum saldo registrado no momento.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70">
                  <TableHead className="pl-6 text-xs font-bold uppercase tracking-wider text-slate-500">Insumo / Matéria Prima</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">SKU</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Localização</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Quantidade</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Unidade</TableHead>
                  <TableHead className="pr-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50">
                    <TableCell className="pl-6 font-semibold text-slate-900">{item.product.name}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">{item.product.sku}</TableCell>
                    <TableCell className="text-slate-650">{item.location}</TableCell>
                    <TableCell className="font-mono font-bold text-slate-900 text-right text-base">
                      {Number(item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 3 })}
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm font-semibold">{item.product.unit}</TableCell>
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
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 backdrop-none">
          <Card className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-xl font-bold text-slate-900">Ajustar Saldo de Estoque</CardTitle>
              <CardDescription>Adicione ou retire saldo manualmente das localizações</CardDescription>
            </CardHeader>
            <form onSubmit={handleAdjust}>
              <CardContent className="space-y-5 p-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Produto / Insumo</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-djob"
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
                  <label className="text-sm font-semibold text-slate-700">Tipo de Ajuste</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-djob"
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value as any)}
                  >
                    <option value="ENTRY">Entrada (+)</option>
                    <option value="EXIT">Saída (-)</option>
                    <option value="ADJUST">Inventário (Substituir Valor Absoluto)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Quantidade</label>
                  <Input
                    type="number"
                    step="0.001"
                    className="h-10 border-slate-200 focus-visible:ring-djob"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="0.001"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Documento de Referência</label>
                  <Input
                    type="text"
                    className="h-10 border-slate-200 focus-visible:ring-djob"
                    value={reference}
                    placeholder="Ex: AJUSTE-2026, NF-123"
                    onChange={(e) => setReference(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Observações / Motivo</label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-djob"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Descreva o motivo do ajuste..."
                  />
                </div>
              </CardContent>
              <div className="flex justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdjustModal(false)}
                  className="border-slate-200 hover:bg-slate-100 text-slate-700"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold active:scale-[0.98] transition-transform"
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
