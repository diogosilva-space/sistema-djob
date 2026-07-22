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
  Plus,
  RefreshCw,
  Eye,
  CheckCircle2,
  ChevronRight,
  XCircle,
  ShoppingBag,
  Truck,
  Calendar,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { PageActionHeader } from '@/components/dashboard/PageActionHeader';
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
        items: items.map((item) => ({
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

  const handleUpdateStatus = async (
    id: string,
    status: 'SENT' | 'CONFIRMED' | 'RECEIVED' | 'CANCELLED',
  ) => {
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/15 dark:bg-white/[0.06] text-foreground border border-white/20 dark:border-white/[0.08]">
            Rascunho
          </span>
        );
      case 'SENT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            Enviado
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            Confirmado
          </span>
        );
      case 'RECEIVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            Recebido
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
            Cancelado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/15 dark:bg-white/[0.06] text-foreground border border-white/20 dark:border-white/[0.08]">
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
    <div className="space-y-6 mt-6">
      <PageActionHeader
        icon={ShoppingBag}
        title="Gestão de Compras"
        subtitle="Crie e gerencie os pedidos de compra de insumos industriais"
      >
        <Button variant="outline" onClick={loadData} className="gap-1.5">
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
        <Button onClick={() => setShowCreateModal(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Novo Pedido
        </Button>
      </PageActionHeader>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-xl glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Total de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl tabular-nums font-bold text-foreground">{orders.length}</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Pedidos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl tabular-nums font-bold text-warning">
              {orders.filter((o) => o.status !== 'RECEIVED' && o.status !== 'CANCELLED').length}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Total Comprado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl tabular-nums font-bold text-foreground">
              R${' '}
              {orders
                .reduce((acc, o) => acc + Number(o.totalAmount), 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl glass-card overflow-hidden">
        <CardHeader className="pb-3 border-b border-white/20 dark:border-white/[0.08]">
          <CardTitle className="text-base font-semibold text-foreground">
            Histórico de Compras
          </CardTitle>
          <CardDescription>Acompanhe o pipeline de insumos solicitados e recebidos</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              Carregando pedidos de compra...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              Nenhum pedido de compra registrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-white/15 dark:bg-white/[0.06]">
                  <TableHead className="pl-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Código
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Fornecedor
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Previsão de Entrega
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground text-right">
                    Valor Total
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="pr-6 text-xs font-medium uppercase tracking-wide text-muted-foreground text-right">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-white/20 dark:hover:bg-white/[0.04]">
                    <TableCell className="pl-6 font-bold text-foreground">{order.code}</TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {order.supplier.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">
                      {order.expectedDate
                        ? new Date(order.expectedDate).toLocaleDateString('pt-BR')
                        : '—'}
                    </TableCell>
                    <TableCell className="tabular-nums font-bold text-foreground text-right text-base">
                      R${' '}
                      {Number(order.totalAmount).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
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
                        className="border-white/20 dark:border-white/[0.08] text-foreground hover:bg-white/15 dark:hover:bg-white/[0.06] active:scale-[0.97]"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {order.status === 'DRAFT' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(order.id, 'SENT')}
                          title="Enviar pedido"
                          className="border-white/20 dark:border-white/[0.08] text-foreground hover:bg-white/15 dark:hover:bg-white/[0.06] active:scale-[0.97]"
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
                          className="border-white/20 dark:border-white/[0.08] text-foreground hover:bg-white/15 dark:hover:bg-white/[0.06] active:scale-[0.97]"
                        >
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        </Button>
                      )}
                      {order.status === 'CONFIRMED' && (
                        <Button
                          size="sm"
                          className="font-semibold active:scale-[0.97]"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <Card className="w-full max-w-2xl rounded-xl glass-card-elevated shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <CardHeader className="pb-4 border-b border-white/20 dark:border-white/[0.08]">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-semibold text-foreground">
                  Novo Pedido de Compra
                </CardTitle>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-muted-foreground hover:text-muted-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <form onSubmit={handleCreateOrder}>
              <CardContent className="space-y-5 p-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Fornecedor</label>
                    <select
                      className="flex h-8 w-full rounded-lg border border-input px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring glass-input"
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
                    <label className="text-sm font-semibold text-foreground">
                      Data de Entrega Estimada
                    </label>
                    <Input
                      type="date"
                      className="h-10 border-white/20 dark:border-white/[0.08] focus-visible:ring-djob"
                      value={expectedDate}
                      onChange={(e) => setExpectedDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Observações gerais
                  </label>
                  <textarea
                    className="flex min-h-[60px] w-full rounded-lg border border-white/20 dark:border-white/[0.08] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-djob"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Termos de pagamento, frete, etc..."
                  />
                </div>

                {/* Itens do Pedido */}
                <div className="space-y-4 pt-4 border-t border-white/20 dark:border-white/[0.08]">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-foreground">Itens e Matérias-Primas</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addItemRow}
                      className="border-white/20 dark:border-white/[0.08] hover:bg-white/15 dark:hover:bg-white/[0.06] text-foreground"
                    >
                      + Insumo
                    </Button>
                  </div>

                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="md:col-span-2 flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">
                          Nome do Insumo
                        </label>
                        <Input
                          type="text"
                          className="h-9 border-white/20 dark:border-white/[0.08] focus-visible:ring-djob"
                          placeholder="Ex: Tecido Algodão Premium"
                          value={item.productName}
                          onChange={(e) => updateItemRow(index, 'productName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Qtd</label>
                        <Input
                          type="number"
                          step="0.01"
                          className="h-9 border-white/20 dark:border-white/[0.08] focus-visible:ring-djob"
                          value={item.quantity}
                          onChange={(e) => updateItemRow(index, 'quantity', Number(e.target.value))}
                          min="0.01"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 relative">
                        <label className="text-xs font-semibold text-muted-foreground">
                          Preço Unitário (R$)
                        </label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            className="h-9 border-white/20 dark:border-white/[0.08] focus-visible:ring-djob"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItemRow(index, 'unitPrice', Number(e.target.value))
                            }
                            min="0"
                            required
                          />
                          {items.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItemRow(index)}
                              className="text-destructive hover:bg-destructive/10"
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
              <div className="flex justify-end gap-3 p-6 border-t border-white/20 dark:border-white/[0.08] bg-white/20 dark:bg-white/[0.04]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="border-white/20 dark:border-white/[0.08] hover:bg-white/15 dark:hover:bg-white/[0.06] text-foreground"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="font-semibold active:scale-[0.98] transition-transform"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-xl rounded-xl glass-card-elevated shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <CardHeader className="pb-4 border-b border-white/20 dark:border-white/[0.08]">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base font-semibold text-foreground">
                    Detalhes do Pedido {selectedOrder.code}
                  </CardTitle>
                  <CardDescription>Acompanhamento de entregas e insumos inclusos</CardDescription>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDetailModal(false)}
                  className="text-muted-foreground hover:text-muted-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block font-semibold">Fornecedor</span>
                  <span className="font-bold text-foreground">{selectedOrder.supplier?.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-semibold">Data Esperada</span>
                  <span className="font-medium text-foreground">
                    {selectedOrder.expectedDate
                      ? new Date(selectedOrder.expectedDate).toLocaleDateString('pt-BR')
                      : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-semibold">
                    Status do Pedido
                  </span>
                  <span>{getStatusBadge(selectedOrder.status)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-semibold">Valor Total</span>
                  <span className="tabular-nums font-bold text-foreground text-base">
                    R${' '}
                    {Number(selectedOrder.totalAmount).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="bg-white/15 dark:bg-white/[0.06] border border-white/20 dark:border-white/[0.08] p-3 rounded-lg text-sm text-muted-foreground">
                  <span className="font-bold text-foreground block mb-1">Notas Operacionais</span>
                  {selectedOrder.notes}
                </div>
              )}

              {/* Itens do Pedido */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Itens e Matérias-Primas Inclusos
                </h4>
                <div className="border border-white/20 dark:border-white/[0.08] rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/15 dark:bg-white/[0.06]">
                      <TableRow>
                        <TableHead className="pl-4 text-xs font-semibold text-muted-foreground">
                          Item / Insumo
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground text-right">
                          Qtd
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground text-right">
                          Preço Unit.
                        </TableHead>
                        <TableHead className="pr-4 text-xs font-semibold text-muted-foreground text-right">
                          Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="pl-4 font-semibold text-foreground">
                            {item.productName}
                          </TableCell>
                          <TableCell className="tabular-nums text-right">
                            {Number(item.quantity)}
                          </TableCell>
                          <TableCell className="tabular-nums text-right">
                            R$ {Number(item.unitPrice).toFixed(2)}
                          </TableCell>
                          <TableCell className="pr-4 tabular-nums font-bold text-foreground text-right">
                            R$ {Number(item.totalPrice).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <div className="flex justify-end gap-2 p-6 border-t border-white/20 dark:border-white/[0.08] bg-white/20 dark:bg-white/[0.04]">
              {selectedOrder.status === 'SENT' && (
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold active:scale-[0.97]"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'CONFIRMED')}
                >
                  Confirmar Envio
                </Button>
              )}
              {selectedOrder.status === 'CONFIRMED' && (
                <Button
                  className="font-semibold active:scale-[0.97]"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'RECEIVED')}
                >
                  Receber no Estoque
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDetailModal(false)}
                className="border-white/20 dark:border-white/[0.08] hover:bg-white/15 dark:hover:bg-white/[0.06] text-foreground"
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
