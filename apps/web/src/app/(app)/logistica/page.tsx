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
import { RefreshCw, Plus, Eye, Printer, Truck, CheckSquare, Package, X, Calendar, User, Navigation } from 'lucide-react';
import { logisticaService } from '@/features/logistica/api/logistica.service';
import { vendasService } from '@/features/vendas/api/vendas.service';

export default function LogisticaPage() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);

  // Form State
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [carrier, setCarrier] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [notes, setNotes] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [shipmentsData, ordersData] = await Promise.all([
        logisticaService.getShipments(),
        vendasService.getSalesOrders(),
      ]);
      setShipments(shipmentsData);
      setOrders(ordersData.filter((o) => o.status === 'READY' || o.status === 'IN_PRODUCTION'));
    } catch (err) {
      console.error('Erro ao carregar logística', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOrderChange = (orderId: string) => {
    setSelectedOrderId(orderId);
    const order = orders.find((o) => o.id === orderId);
    if (order && order.customer) {
      setRecipientName(order.customer.name || '');
      setZipCode(order.customer.zipCode || '');
      setStreet(order.customer.street || '');
      setNumber(order.customer.number || '');
      setComplement(order.customer.complement || '');
      setNeighborhood(order.customer.neighborhood || '');
      setCity(order.customer.city || '');
      setState(order.customer.state || '');
    }
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;

    try {
      await logisticaService.createShipment({
        salesOrderId: selectedOrderId,
        carrier: carrier || null,
        trackingCode: trackingCode || null,
        recipientName: recipientName || null,
        zipCode: zipCode || null,
        street: street || null,
        number: number || null,
        complement: complement || null,
        neighborhood: neighborhood || null,
        city: city || null,
        state: state || null,
        notes: notes || null,
      });

      setShowCreateModal(false);
      setSelectedOrderId('');
      setCarrier('');
      setTrackingCode('');
      setRecipientName('');
      setZipCode('');
      setStreet('');
      setNumber('');
      setComplement('');
      setNeighborhood('');
      setCity('');
      setState('');
      setNotes('');
      loadData();
    } catch (err) {
      console.error('Erro ao criar remessa', err);
    }
  };

  const handleUpdateStatus = async (shipmentId: string, status: string) => {
    try {
      await logisticaService.updateShipment(shipmentId, { status: status as any });
      if (selectedShipment && selectedShipment.id === shipmentId) {
        const updated = await logisticaService.getShipmentById(shipmentId);
        setSelectedShipment(updated);
      }
      loadData();
    } catch (err) {
      console.error('Erro ao atualizar status', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Pendente
          </span>
        );
      case 'PICKED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
            Separado
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
            Despachado
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-705 border border-amber-200 animate-pulse">
            Em Trânsito
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-705 border border-emerald-200">
            Entregue
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Ocultar cabeçalho na impressão */}
      <div className="flex justify-between items-center print:hidden">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Logística & Entregas</h1>
            <p className="text-sm text-slate-500">
              Controle de expedição de mercadorias, protocolos físicos de entrega e rastreamento
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
            <span>Emitir Protocolo</span>
          </Button>
        </div>
      </div>

      <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden print:hidden">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-lg font-bold text-slate-900">Remessas & Expedição</CardTitle>
          <CardDescription>Acompanhe o status e a entrega dos pedidos finalizados</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12 text-slate-500 font-medium">Carregando expedição...</div>
          ) : shipments.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-medium">
              Nenhuma remessa em andamento no momento.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70">
                  <TableHead className="pl-6 text-xs font-bold uppercase tracking-wider text-slate-500">Código</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Pedido</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Destinatário</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Cidade / UF</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Transportadora</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                  <TableHead className="pr-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((ship) => (
                  <TableRow key={ship.id} className="hover:bg-slate-50/50">
                    <TableCell className="pl-6 font-bold text-slate-900">{ship.code}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">{ship.salesOrder.code}</TableCell>
                    <TableCell className="font-semibold text-slate-800">{ship.recipientName}</TableCell>
                    <TableCell className="text-slate-650">
                      {ship.city} / {ship.state}
                    </TableCell>
                    <TableCell className="font-medium text-slate-600">{ship.carrier || '—'}</TableCell>
                    <TableCell>{getStatusBadge(ship.status)}</TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          const detailed = await logisticaService.getShipmentById(ship.id);
                          setSelectedShipment(detailed);
                          setShowDetailModal(true);
                        }}
                        className="border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-[0.97] flex items-center gap-1 ml-auto"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Ver Protocolo</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de Criação de Remessa */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 print:hidden">
          <Card className="w-full max-w-2xl bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <CardHeader className="pb-4 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold text-slate-900">Novo Protocolo de Expedição</CardTitle>
                <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <form onSubmit={handleCreateShipment}>
              <CardContent className="space-y-5 p-6 max-h-[60vh] overflow-y-auto">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Selecione o Pedido de Venda Pronto</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-djob"
                    value={selectedOrderId}
                    onChange={(e) => handleOrderChange(e.target.value)}
                    required
                  >
                    <option value="">Selecione um Pedido...</option>
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.code} — {o.customer.name} (R$ {Number(o.totalAmount).toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Nome da Transportadora</label>
                    <Input
                      type="text"
                      className="h-10 border-slate-200 focus-visible:ring-djob"
                      placeholder="Ex: Correios, DHL"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Código de Rastreamento</label>
                    <Input
                      type="text"
                      className="h-10 border-slate-200 focus-visible:ring-djob"
                      placeholder="Ex: BR123456789XX"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Destinatário & Endereço de Entrega</h4>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Nome do Recebedor</label>
                    <Input
                      type="text"
                      className="h-10 border-slate-200 focus-visible:ring-djob"
                      placeholder="Ex: Almoxarifado central"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700">CEP</label>
                      <Input
                        type="text"
                        className="h-10 border-slate-200 focus-visible:ring-djob"
                        placeholder="00000-000"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700">Cidade</label>
                      <Input
                        type="text"
                        className="h-10 border-slate-200 focus-visible:ring-djob"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700">Estado (UF)</label>
                      <Input
                        type="text"
                        className="h-10 border-slate-200 focus-visible:ring-djob"
                        maxLength={2}
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700">Rua / Avenida</label>
                      <Input
                        type="text"
                        className="h-10 border-slate-200 focus-visible:ring-djob"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700">Número</label>
                      <Input
                        type="text"
                        className="h-10 border-slate-200 focus-visible:ring-djob"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                      />
                    </div>
                  </div>
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
                  Confirmar Expedição
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Modal de Protocolo Físico (Otimizado para Impressão) */}
      {showDetailModal && selectedShipment && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 print:p-0 print:bg-white print:static print:h-full print:w-full">
          <Card className="w-full max-w-2xl bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden print:border-none print:shadow-none print:rounded-none">
            {/* Ocultar no print */}
            <CardHeader className="pb-4 border-b border-slate-100 print:hidden flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Protocolo Físico de Entrega</CardTitle>
                <CardDescription>Visualize ou imprima o recibo para entrega presencial</CardDescription>
              </div>
              <button type="button" onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* Cabeçalho do Protocolo Físico */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                <div>
                  <h3 className="text-xl font-black tracking-tight text-slate-950 uppercase">D.job Brindes & Confecção</h3>
                  <p className="text-xs text-slate-500 mt-1">CNPJ: 00.000.000/0001-00 | Tel: (11) 99999-9999</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold block text-slate-500 uppercase tracking-widest">Protocolo</span>
                  <span className="text-lg font-black text-slate-950 font-mono">{selectedShipment.code}</span>
                </div>
              </div>

              {/* Informações da Entrega */}
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="space-y-1">
                  <span className="text-slate-500 font-bold block uppercase text-xs">Destinatário</span>
                  <span className="font-extrabold text-slate-950 text-base">{selectedShipment.recipientName}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 font-bold block uppercase text-xs">Pedido de Venda</span>
                  <span className="font-mono font-extrabold text-slate-950 text-base">{selectedShipment.salesOrder?.code}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 font-bold block uppercase text-xs">Transportadora</span>
                  <span className="font-semibold text-slate-800">{selectedShipment.carrier || 'Entrega Direta / Própria'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 font-bold block uppercase text-xs">Rastreamento</span>
                  <span className="font-mono text-slate-850 font-semibold">{selectedShipment.trackingCode || '—'}</span>
                </div>
              </div>

              <div className="space-y-1 border-t border-slate-100 pt-4">
                <span className="text-slate-500 font-bold block uppercase text-xs">Endereço de Entrega</span>
                <span className="font-semibold text-slate-900 block text-sm">
                  {selectedShipment.street}, {selectedShipment.number} {selectedShipment.complement && `(${selectedShipment.complement})`}
                </span>
                <span className="text-slate-500 text-xs font-semibold">
                  {selectedShipment.neighborhood} — {selectedShipment.city} / {selectedShipment.state} | CEP: {selectedShipment.zipCode}
                </span>
              </div>

              {/* Campos de Assinatura */}
              <div className="grid grid-cols-2 gap-8 pt-12 border-t-2 border-dashed border-slate-200">
                <div className="text-center pt-8 border-t border-slate-400">
                  <span className="text-xs text-slate-500 block uppercase font-bold">Assinatura do Entregador</span>
                  <span className="text-xs text-slate-400 block mt-1">Data: ___/___/______</span>
                </div>
                <div className="text-center pt-8 border-t border-slate-400">
                  <span className="text-xs text-slate-500 block uppercase font-bold">Assinatura do Recebedor (Cliente)</span>
                  <span className="text-xs text-slate-400 block mt-1">Documento / RG: __________________</span>
                </div>
              </div>
            </CardContent>
            {/* Ocultar no print */}
            <div className="flex justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50/50 print:hidden">
              <Button
                onClick={handlePrint}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold active:scale-[0.97] flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                <span>Imprimir Protocolo</span>
              </Button>
              {selectedShipment.status !== 'DELIVERED' && (
                <Button
                  className="bg-emerald-600 hover:bg-emerald-705 text-white font-semibold active:scale-[0.97] flex items-center gap-1.5"
                  onClick={() => handleUpdateStatus(selectedShipment.id, 'DELIVERED')}
                >
                  <CheckSquare className="h-4 w-4" />
                  <span>Marcar Entregue</span>
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
