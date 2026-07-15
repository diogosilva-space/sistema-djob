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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Aberto
          </span>
        );
      case 'PAID':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-705 border border-emerald-250">
            Liquidado
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-750 border border-red-200">
            Atrasado
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-805 border border-slate-300">
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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Módulo Financeiro</h1>
            <p className="text-sm text-slate-500">
              Fluxo de caixa, controle de recebíveis de pedidos e liquidação de contas a pagar
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadTransactions}
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
            <span>Novo Lançamento</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Contas a Receber
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-extrabold text-emerald-700">
              R$ {totalReceivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Contas a Pagar
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-extrabold text-red-700">
              R$ {totalPayables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-none text-white rounded-2xl shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
              Saldo Projetado
            </CardTitle>
            <Wallet className="h-5 w-5 text-djob" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-mono font-extrabold ${netBalance >= 0 ? 'text-white' : 'text-red-400'}`}>
              R$ {netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-lg font-bold text-slate-900">Histórico de Lançamentos</CardTitle>
          <CardDescription>Auditoria permanente de receitas, despesas e baixas</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12 text-slate-500 font-medium">Carregando lançamentos...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-medium">
              Nenhum lançamento financeiro registrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70">
                  <TableHead className="pl-6 text-xs font-bold uppercase tracking-wider text-slate-500">Descrição</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Tipo</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Vencimento</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Valor</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                  <TableHead className="pr-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id} className="hover:bg-slate-50/50">
                    <TableCell className="pl-6 font-semibold text-slate-900">{t.description}</TableCell>
                    <TableCell>
                      {t.type === 'INCOME' ? (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-xs text-green-700 bg-green-50 border border-green-150 px-2 py-0.5 rounded-full">
                          <ArrowDownLeft className="h-3.5 w-3.5" />
                          <span>Receita</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-xs text-red-750 bg-red-50 border border-red-150 px-2 py-0.5 rounded-full">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                          <span>Despesa</span>
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-550 font-medium">
                      {new Date(t.dueDate).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-mono font-bold text-slate-900 text-right text-base">
                      R$ {Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{getStatusBadge(t.status)}</TableCell>
                    <TableCell className="pr-6 text-right">
                      {t.status === 'PENDING' && (
                        <Button
                          size="sm"
                          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold active:scale-[0.97] transition-all ml-auto"
                          onClick={() => handleMarkAsPaid(t.id)}
                        >
                          Quitar título
                        </Button>
                      )}
                      {t.status === 'PAID' && (
                        <span className="text-slate-400 font-semibold text-xs block text-right">
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
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <CardHeader className="pb-4 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold text-slate-900">Novo Lançamento Financeiro</CardTitle>
                <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <form onSubmit={handleCreateTransaction}>
              <CardContent className="space-y-5 p-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Descrição / Título</label>
                  <Input
                    type="text"
                    className="h-10 border-slate-200 focus-visible:ring-djob"
                    placeholder="Ex: Compra de linha de costura"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Fluxo da Operação</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-djob"
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                  >
                    <option value="INCOME">Receita / Entrada (+)</option>
                    <option value="EXPENSE">Despesa / Saída (-)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Valor Lançado (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      className="h-10 border-slate-200 focus-visible:ring-djob"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      min="0.01"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Data de Vencimento</label>
                    <Input
                      type="date"
                      className="h-10 border-slate-200 focus-visible:ring-djob"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Notas / Informações Extras</label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-djob"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Nº da fatura, boleto ou referências..."
                  />
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
