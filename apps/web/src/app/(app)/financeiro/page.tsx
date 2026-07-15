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
import { RefreshCw, Plus, TrendingUp, TrendingDown, Wallet, DollarSign, CheckCircle2, XCircle, ArrowUpRight, ArrowDownLeft, X, Calendar } from 'lucide-react';
import { PageActionHeader } from '@/components/dashboard/PageActionHeader';
import { financeiroService } from '@/features/financeiro/api/financeiro.service';

export default function FinanceiroPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [amount, setAmount] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await financeiroService.getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Erro ao carregar transações financeiras', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0 || !dueDate) return;

    try {
      await financeiroService.createTransaction({
        description,
        type,
        amount,
        dueDate: new Date(dueDate).toISOString(),
        status: 'PENDING',
        notes: notes || null,
      });

      setShowCreateModal(false);
      setDescription('');
      setType('INCOME');
      setAmount(0);
      setDueDate('');
      setNotes('');
      loadTransactions();
    } catch (err) {
      console.error('Erro ao criar transação', err);
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      await financeiroService.updateTransaction(id, {
        status: 'PAID',
        paidDate: new Date().toISOString(),
      });
      loadTransactions();
    } catch (err) {
      console.error('Erro ao baixar título', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground border border-border">
            Aberto
          </span>
        );
      case 'PAID':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            Liquidado
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            Atrasado
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground border border-border">
            Cancelado
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

  // Metricas
  const totalReceivables = transactions
    .filter((t) => t.type === 'INCOME' && t.status !== 'CANCELLED')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalPayables = transactions
    .filter((t) => t.type === 'EXPENSE' && t.status !== 'CANCELLED')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const netBalance = totalReceivables - totalPayables;

  return (
    <div className="space-y-6">
      <PageActionHeader
        icon={DollarSign}
        title="Módulo Financeiro"
        subtitle="Fluxo de caixa, controle de recebíveis de pedidos e liquidação de contas a pagar"
      >
        <Button variant="outline" onClick={loadTransactions} className="gap-1.5">
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
        <Button onClick={() => setShowCreateModal(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Novo Lançamento
        </Button>
      </PageActionHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Contas a Receber
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl tabular-nums font-bold text-success">
              R$ {totalReceivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Contas a Pagar
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl tabular-nums font-bold text-destructive">
              R$ {totalPayables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Saldo Projetado
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl tabular-nums font-bold ${netBalance >= 0 ? 'text-foreground' : 'text-destructive'}`}>
              R$ {netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base font-semibold text-foreground">Histórico de Lançamentos</CardTitle>
          <CardDescription>Auditoria permanente de receitas, despesas e baixas</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12 text-sm text-muted-foreground">Carregando lançamentos...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              Nenhum lançamento financeiro registrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/70">
                  <TableHead className="pl-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">Descrição</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tipo</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Vencimento</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground text-right">Valor</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</TableHead>
                  <TableHead className="pr-6 text-xs font-medium uppercase tracking-wide text-muted-foreground text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id} className="hover:bg-muted/50">
                    <TableCell className="pl-6 font-semibold text-foreground">{t.description}</TableCell>
                    <TableCell>
                      {t.type === 'INCOME' ? (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                          <ArrowDownLeft className="h-3.5 w-3.5" />
                          <span>Receita</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-xs text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                          <span>Despesa</span>
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">
                      {new Date(t.dueDate).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="tabular-nums font-bold text-foreground text-right text-base">
                      R$ {Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{getStatusBadge(t.status)}</TableCell>
                    <TableCell className="pr-6 text-right">
                      {t.status === 'PENDING' && (
                        <Button
                          size="sm"
                          className="font-semibold ml-auto"
                          onClick={() => handleMarkAsPaid(t.id)}
                        >
                          Quitar título
                        </Button>
                      )}
                      {t.status === 'PAID' && (
                        <span className="text-muted-foreground font-semibold text-xs block text-right">
                          Pago em {new Date(t.paidDate).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de Criação de Transação */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-card border border-border shadow-lg rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <CardHeader className="pb-4 border-b border-border">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-semibold text-foreground">Novo Lançamento Financeiro</CardTitle>
                <button type="button" onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-muted-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <form onSubmit={handleCreateTransaction}>
              <CardContent className="space-y-5 p-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Descrição / Título</label>
                  <Input
                    type="text"
                    className="h-10 border-border focus-visible:ring-djob"
                    placeholder="Ex: Compra de linha de costura"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Fluxo da Operação</label>
                  <select
                    className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                  >
                    <option value="INCOME">Receita / Entrada (+)</option>
                    <option value="EXPENSE">Despesa / Saída (-)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Valor Lançado (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      className="h-10 border-border focus-visible:ring-djob"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      min="0.01"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Data de Vencimento</label>
                    <Input
                      type="date"
                      className="h-10 border-border focus-visible:ring-djob"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Notas / Informações Extras</label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-djob"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Nº da fatura, boleto ou referências..."
                  />
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
                  className="font-semibold"
                >
                  Efetivar Lançamento
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
