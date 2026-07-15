'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RefreshCw, ArrowUpRight, ArrowDownLeft, SlidersHorizontal, Scale, History } from 'lucide-react';
import { estoqueService } from '@/features/estoque/api/estoque.service';

export default function MovimentacoesPage() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMovements = async () => {
    try {
      setLoading(true);
      const data = await estoqueService.getMovements();
      setMovements(data);
    } catch (err) {
      console.error('Erro ao carregar movimentações', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovements();
  }, []);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'ENTRY':
      case 'RETURN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-750 border border-green-150">
            <ArrowDownLeft className="h-3 w-3" />
            <span>Entrada / Retorno</span>
          </span>
        );
      case 'EXIT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-750 border border-red-150">
            <ArrowUpRight className="h-3 w-3" />
            <span>Saída / Baixa</span>
          </span>
        );
      case 'ADJUST':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-750 border border-blue-150">
            <Scale className="h-3 w-3" />
            <span>Ajuste Manual</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200">
            <SlidersHorizontal className="h-3 w-3" />
            <span>Outro</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Movimentações de Estoque</h1>
            <p className="text-sm text-slate-500">
              Histórico operacional completo de entradas, saídas e deduções automáticas
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={loadMovements}
          className="border-slate-200 hover:bg-slate-100 text-slate-700 active:scale-[0.98] transition-transform"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          <span>Atualizar Logs</span>
        </Button>
      </div>

      <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-lg font-bold text-slate-900">Histórico de Transações</CardTitle>
          <CardDescription>Auditoria permanente de toda movimentação física de insumos</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12 text-slate-500 font-medium">Carregando movimentações...</div>
          ) : movements.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-medium">
              Nenhuma movimentação registrada no histórico.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70">
                  <TableHead className="pl-6 text-xs font-bold uppercase tracking-wider text-slate-500">Data / Hora</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Insumo</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Operação</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Quantidade</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Referência</TableHead>
                  <TableHead className="pr-6 text-xs font-bold uppercase tracking-wider text-slate-500">Motivo / Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((mov) => (
                  <TableRow key={mov.id} className="hover:bg-slate-50/50">
                    <TableCell className="pl-6 text-slate-500 font-medium text-xs">
                      {new Date(mov.createdAt).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">{mov.productName}</TableCell>
                    <TableCell>{getTypeBadge(mov.type)}</TableCell>
                    <TableCell className="font-mono font-bold text-slate-900 text-right text-base">
                      {Number(mov.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 3 })}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-650">{mov.reference || '—'}</TableCell>
                    <TableCell className="pr-6 text-slate-700 text-sm">{mov.notes || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
