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
import { PageActionHeader } from '@/components/dashboard/PageActionHeader';
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground border border-border">
            Pendente
          </span>
        );
      case 'PICKED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            Separado
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
            Despachado
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            Em Trânsito
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            Entregue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground border border-border">
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
      <PageActionHeader
        icon={Truck}
        title="Logística & Entregas"
        subtitle="Controle de expedição de mercadorias, protocolos físicos de entrega e rastreamento"
        className="print:hidden"
      >
        <Button variant="outline" onClick={loadData} className="gap-1.5">
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
        <Button onClick={() => setShowCreateModal(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Emitir Protocolo
        </Button>
      </PageActionHeader>

      <Card className="bg-card border border-border rounded-lg shadow-sm overflow-hidden print:hidden">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base font-semibold text-foreground">Remessas & Expedição</CardTitle>
          <CardDescription>Acompanhe o status e a entrega dos pedidos finalizados</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12 text-sm text-muted-foreground">Carregando expedição...</div>
          ) : shipments.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              Nenhuma remessa em andamento no momento.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/70">
                  <TableHead className="pl-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">Código</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pedido</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Destinatário</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Cidade / UF</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Transportadora</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</TableHead>
                  <TableHead className="pr-6 text-xs font-medium uppercase tracking-wide text-muted-foreground text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((ship) => (
                  <TableRow key={ship.id} className="hover:bg-muted/50">
                    <TableCell className="pl-6 font-bold text-foreground">{ship.code}</TableCell>
                    <TableCell className="tabular-nums text-xs text-muted-foreground">{ship.salesOrder.code}</TableCell>
                    <TableCell className="font-semibold text-foreground">{ship.recipientName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {ship.city} / {ship.state}
                    </TableCell>
                    <TableCell className="font-medium text-muted-foreground">{ship.carrier || '—'}</TableCell>
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
                        className="border-border text-foreground hover:bg-muted active:scale-[0.97] flex items-center gap-1 ml-auto"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:hidden">
          <Card className="w-full max-w-2xl bg-card border border-border shadow-lg rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <CardHeader className="pb-4 border-b border-border">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-semibold text-foreground">Novo Protocolo de Expedição</CardTitle>
                <button type="button" onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-muted-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <form onSubmit={handleCreateShipment}>
              <CardContent className="space-y-5 p-6 max-h-[60vh] overflow-y-auto">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Selecione o Pedido de Venda Pronto</label>
                  <select
                    className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
                    <label className="text-sm font-semibold text-foreground">Nome da Transportadora</label>
                    <Input
                      type="text"
                      className="h-10 border-border focus-visible:ring-djob"
                      placeholder="Ex: Correios, DHL"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Código de Rastreamento</label>
                    <Input
                      type="text"
                      className="h-10 border-border focus-visible:ring-djob"
                      placeholder="Ex: BR123456789XX"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-foreground">Destinatário & Endereço de Entrega</h4>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Nome do Recebedor</label>
                    <Input
                      type="text"
                      className="h-10 border-border focus-visible:ring-djob"
                      placeholder="Ex: Almoxarifado central"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-foreground">CEP</label>
                      <Input
                        type="text"
                        className="h-10 border-border focus-visible:ring-djob"
                        placeholder="00000-000"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-foreground">Cidade</label>
                      <Input
                        type="text"
                        className="h-10 border-border focus-visible:ring-djob"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-foreground">Estado (UF)</label>
                      <Input
                        type="text"
                        className="h-10 border-border focus-visible:ring-djob"
                        maxLength={2}
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-foreground">Rua / Avenida</label>
                      <Input
                        type="text"
                        className="h-10 border-border focus-visible:ring-djob"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-foreground">Número</label>
                      <Input
                        type="text"
                        className="h-10 border-border focus-visible:ring-djob"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="flex justify-end gap-3 p-6 border-t border-border bg-muted/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="border-border hover:bg-muted text-foreground"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="font-semibold active:scale-[0.98] transition-transform"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:p-0 print:bg-card print:static print:h-full print:w-full">
          <Card className="w-full max-w-2xl bg-card border border-border shadow-lg rounded-lg overflow-hidden print:border-none print:shadow-none print:rounded-none">
            {/* Ocultar no print */}
            <CardHeader className="pb-4 border-b border-border print:hidden flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-foreground">Protocolo Físico de Entrega</CardTitle>
                <CardDescription>Visualize ou imprima o recibo para entrega presencial</CardDescription>
              </div>
              <button type="button" onClick={() => setShowDetailModal(false)} className="text-muted-foreground hover:text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* Cabeçalho do Protocolo Físico */}
              <div className="flex justify-between items-start border-b-2 border-foreground pb-4">
                <div>
                  <h3 className="text-xl font-black tracking-tight text-foreground uppercase">D.job Brindes & Confecção</h3>
                  <p className="text-xs text-muted-foreground mt-1">CNPJ: 00.000.000/0001-00 | Tel: (11) 99999-9999</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold block text-muted-foreground uppercase tracking-widest">Protocolo</span>
                  <span className="text-lg font-black text-foreground tabular-nums">{selectedShipment.code}</span>
                </div>
              </div>

              {/* Informações da Entrega */}
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground font-bold block uppercase text-xs">Destinatário</span>
                  <span className="font-semibold text-foreground text-base">{selectedShipment.recipientName}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-bold block uppercase text-xs">Pedido de Venda</span>
                  <span className="tabular-nums font-semibold text-foreground text-base">{selectedShipment.salesOrder?.code}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-bold block uppercase text-xs">Transportadora</span>
                  <span className="font-semibold text-foreground">{selectedShipment.carrier || 'Entrega Direta / Própria'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-bold block uppercase text-xs">Rastreamento</span>
                  <span className="tabular-nums text-foreground font-semibold">{selectedShipment.trackingCode || '—'}</span>
                </div>
              </div>

              <div className="space-y-1 border-t border-border pt-4">
                <span className="text-muted-foreground font-bold block uppercase text-xs">Endereço de Entrega</span>
                <span className="font-semibold text-foreground block text-sm">
                  {selectedShipment.street}, {selectedShipment.number} {selectedShipment.complement && `(${selectedShipment.complement})`}
                </span>
                <span className="text-muted-foreground text-xs font-semibold">
                  {selectedShipment.neighborhood} — {selectedShipment.city} / {selectedShipment.state} | CEP: {selectedShipment.zipCode}
                </span>
              </div>

              {/* Campos de Assinatura */}
              <div className="grid grid-cols-2 gap-8 pt-12 border-t border-border">
                <div className="text-center pt-8 border-t border-border">
                  <span className="text-xs text-muted-foreground block uppercase font-bold">Assinatura do Entregador</span>
                  <span className="text-xs text-muted-foreground block mt-1">Data: ___/___/______</span>
                </div>
                <div className="text-center pt-8 border-t border-border">
                  <span className="text-xs text-muted-foreground block uppercase font-bold">Assinatura do Recebedor (Cliente)</span>
                  <span className="text-xs text-muted-foreground block mt-1">Documento / RG: __________________</span>
                </div>
              </div>
            </CardContent>
            {/* Ocultar no print */}
            <div className="flex justify-end gap-3 p-6 border-t border-border bg-muted/50 print:hidden">
              <Button
                onClick={handlePrint}
                className="font-semibold active:scale-[0.97] flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                <span>Imprimir Protocolo</span>
              </Button>
              {selectedShipment.status !== 'DELIVERED' && (
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold active:scale-[0.97] flex items-center gap-1.5"
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
                className="border-border hover:bg-muted text-foreground"
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
