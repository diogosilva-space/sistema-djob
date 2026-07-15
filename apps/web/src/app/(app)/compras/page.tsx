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
import { Plus, RefreshCw, Eye, CheckCircle2, ChevronRight, XCircle, ShoppingBag, Truck, Calendar, Tag, Trash2, X } from 'lucide-react';
import { comprasService } from '@/features/compras/api/compras.service';
import { suppliersService } from '@/features/crm/api/suppliers.service';

export default function ComprasPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Form State
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<any[]>([{ productName: '', quantity: 1, unitPrice: 0 }]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, suppliersData] = await Promise.all([
        comprasService.getPurchaseOrders(),
        suppliersService.getSuppliers(),
      ]);
      setOrders(ordersData);
      setSuppliers(suppliersData);
    } catch (err) {
      console.error('Erro ao carregar dados de compras', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId || items.length === 0) return;

    try {
      await comprasService.createPurchaseOrder({
        supplierId: selectedSupplierId,
        expectedDate: expectedDate ? new Date(expectedDate).toISOString() : undefined,
        notes,
        items: items.map(item => ({
          productName: item.productName,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
      });
      setShowCreateModal(false);
      setSelectedSupplierId('');
      setExpectedDate('');
      setNotes('');
      setItems([{ productName: '', quantity: 1, unitPrice: 0 }]);
      loadData();
    } catch (err) {
      console.error('Erro ao criar pedido de compra', err);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'SENT' | 'CONFIRMED' | 'RECEIVED' | 'CANCELLED') => {
    try {
      await comprasService.updatePurchaseOrder(id, { status });
      loadData();
      if (showDetailModal && selectedOrder?.id === id) {
        const detailed = await comprasService.getPurchaseOrderById(id);
        setSelectedOrder(detailed);
      }
    } catch (err) {
      console.error('Erro ao atualizar status', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Rascunho
          </span>
        );
      case 'SENT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
            Enviado
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-705 border border-amber-200">
            Confirmado
          </span>
        );
      case 'RECEIVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-705 border border-emerald-200">
            Recebido
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
            Cancelado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const addItemRow = () => {
    setItems([...items, { productName: '', quantity: 1, unitPrice: 0 }]);
  };

  const updateItemRow = (index: number, key: string, value: any) => {
    const updated = [...items];
    updated[index][key] = value;
    setItems(updated);
  };

  const removeItemRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Gestão de Compras</h1>
            <p className="text-sm text-slate-500">
              Crie e gerencie os pedidos de compra de insumos industriais
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadData}
            className="border-slate-200 hover:bg-slate-100 text-slate-700 active:scale-[0.98] transition-transform"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Atualizar</span>
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold active:scale-[0.98] transition-transform"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Novo Pedido</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Total de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-extrabold text-slate-900">{orders.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Pedidos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-extrabold text-amber-600">
              {orders.filter((o) => o.status !== 'RECEIVED' && o.status !== 'CANCELLED').length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Total Comprado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-extrabold text-slate-950">
              R${' '}
              {orders
                .reduce((acc, o) => acc + Number(o.totalAmount), 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-lg font-bold text-slate-900">Histórico de Compras</CardTitle>
          <CardDescription>Acompanhe o pipeline de insumos solicitados e recebidos</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12 text-slate-500 font-medium">Carregando pedidos de compra...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-medium">
              Nenhum pedido de compra registrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70">
                  <TableHead className="pl-6 text-xs font-bold uppercase tracking-wider text-slate-500">Código</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Fornecedor</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Previsão de Entrega</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Valor Total</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                  <TableHead className="pr-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-slate-50/50">
                    <TableCell className="pl-6 font-bold text-slate-900">{order.code}</TableCell>
                    <TableCell className="font-semibold text-slate-800">{order.supplier.name}</TableCell>
                    <TableCell className="text-slate-550 font-medium">
                      {order.expectedDate
                        ? new Date(order.expectedDate).toLocaleDateString('pt-BR')
                        : '—'}
                    </TableCell>
                    <TableCell className="font-mono font-bold text-slate-900 text-right text-base">
                      R$ {Number(order.totalAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="pr-6 text-right flex justify-end gap-1.5 items-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          const detailed = await comprasService.getPurchaseOrderById(order.id);
                          setSelectedOrder(detailed);
                          setShowDetailModal(true);
                        }}
                        className="border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-[0.97]"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {order.status === 'DRAFT' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(order.id, 'SENT')}
                          title="Enviar pedido"
                          className="border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-[0.97]"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                      {order.status === 'SENT' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                          title="Confirmar recebimento do fornecedor"
                          className="border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-[0.97]"
                        >
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        </Button>
                      )}
                      {order.status === 'CONFIRMED' && (
                        <Button
                          size="sm"
                          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold active:scale-[0.97]"
                          onClick={() => handleUpdateStatus(order.id, 'RECEIVED')}
                          title="Receber insumos no estoque"
                        >
                          Receber
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de Criação de Pedido */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 overflow-y-auto p-4">
          <Card className="w-full max-w-2xl bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <CardHeader className="pb-4 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold text-slate-900">Novo Pedido de Compra</CardTitle>
                <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <form onSubmit={handleCreateOrder}>
              <CardContent className="space-y-5 p-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Fornecedor</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-djob"
                      value={selectedSupplierId}
                      onChange={(e) => setSelectedSupplierId(e.target.value)}
                      required
                    >
                      <option value="">Selecione o Fornecedor...</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Data de Entrega Estimada</label>
                    <Input
                      type="date"
                      className="h-10 border-slate-200 focus-visible:ring-djob"
                      value={expectedDate}
                      onChange={(e) => setExpectedDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Observações gerais</label>
                  <textarea
                    className="flex min-h-[60px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-djob"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Termos de pagamento, frete, etc..."
                  />
                </div>

                {/* Itens do Pedido */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-900">Itens e Matérias-Primas</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addItemRow}
                      className="border-slate-200 hover:bg-slate-50 text-slate-700"
                    >
                      + Insumo
                    </Button>
                  </div>

                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end border-b pb-4 last:border-0 last:pb-0">
                      <div className="md:col-span-2 flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-500">Nome do Insumo</label>
                        <Input
                          type="text"
                          className="h-9 border-slate-200 focus-visible:ring-djob"
                          placeholder="Ex: Tecido Algodão Premium"
                          value={item.productName}
                          onChange={(e) => updateItemRow(index, 'productName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-500">Qtd</label>
                        <Input
                          type="number"
                          step="0.01"
                          className="h-9 border-slate-200 focus-visible:ring-djob"
                          value={item.quantity}
                          onChange={(e) => updateItemRow(index, 'quantity', Number(e.target.value))}
                          min="0.01"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 relative">
                        <label className="text-xs font-semibold text-slate-500">Preço Unitário (R$)</label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            className="h-9 border-slate-200 focus-visible:ring-djob"
                            value={item.unitPrice}
                            onChange={(e) => updateItemRow(index, 'unitPrice', Number(e.target.value))}
                            min="0"
                            required
                          />
                          {items.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItemRow(index)}
                              className="text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="flex justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="border-slate-200 hover:bg-slate-100 text-slate-700"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold active:scale-[0.98] transition-transform"
                >
                  Gerar Pedido de Compra
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Modal de Detalhes */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-xl bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <CardHeader className="pb-4 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">Detalhes do Pedido {selectedOrder.code}</CardTitle>
                  <CardDescription>Acompanhamento de entregas e insumos inclusos</CardDescription>
                </div>
                <button type="button" onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500 block font-semibold">Fornecedor</span>
                  <span className="font-bold text-slate-950">{selectedOrder.supplier?.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Data Esperada</span>
                  <span className="font-medium text-slate-800">
                    {selectedOrder.expectedDate
                      ? new Date(selectedOrder.expectedDate).toLocaleDateString('pt-BR')
                      : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Status do Pedido</span>
                  <span>{getStatusBadge(selectedOrder.status)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Valor Total</span>
                  <span className="font-mono font-bold text-slate-950 text-base">
                    R$ {Number(selectedOrder.totalAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="bg-slate-50 border p-3 rounded-lg text-sm text-slate-650">
                  <span className="font-bold text-slate-800 block mb-1">Notas Operacionais</span>
                  {selectedOrder.notes}
                </div>
              )}

              {/* Itens do Pedido */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Itens e Matérias-Primas Inclusos</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="pl-4 text-xs font-semibold text-slate-500">Item / Insumo</TableHead>
                        <TableHead className="text-xs font-semibold text-slate-500 text-right">Qtd</TableHead>
                        <TableHead className="text-xs font-semibold text-slate-500 text-right">Preço Unit.</TableHead>
                        <TableHead className="pr-4 text-xs font-semibold text-slate-500 text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="pl-4 font-semibold text-slate-900">{item.productName}</TableCell>
                          <TableCell className="font-mono text-right">{Number(item.quantity)}</TableCell>
                          <TableCell className="font-mono text-right">R$ {Number(item.unitPrice).toFixed(2)}</TableCell>
                          <TableCell className="pr-4 font-mono font-bold text-slate-950 text-right">
                            R$ {Number(item.totalPrice).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <div className="flex justify-end gap-2 p-6 border-t border-slate-100 bg-slate-50/50">
              {selectedOrder.status === 'SENT' && (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold active:scale-[0.97]"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'CONFIRMED')}
                >
                  Confirmar Envio
                </Button>
              )}
              {selectedOrder.status === 'CONFIRMED' && (
                <Button
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold active:scale-[0.97]"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'RECEIVED')}
                >
                  Receber no Estoque
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDetailModal(false)}
                className="border-slate-200 hover:bg-slate-100 text-slate-700"
              >
                Fechar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
