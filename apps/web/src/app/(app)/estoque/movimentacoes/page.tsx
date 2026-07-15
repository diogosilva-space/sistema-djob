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
import { PageActionHeader } from '@/components/dashboard/PageActionHeader';
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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <ArrowDownLeft className="h-3 w-3" />
            <span>Entrada / Retorno</span>
          </span>
        );
      case 'EXIT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <ArrowUpRight className="h-3 w-3" />
            <span>Saída / Baixa</span>
          </span>
        );
      case 'ADJUST':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Scale className="h-3 w-3" />
            <span>Ajuste Manual</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground border border-border">
            <SlidersHorizontal className="h-3 w-3" />
            <span>Outro</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <PageActionHeader
        icon={History}
        title="Movimentações de Estoque"
        subtitle="Histórico operacional completo de entradas, saídas e deduções automáticas"
      >
        <Button variant="outline" onClick={loadMovements} className="gap-1.5">
          <RefreshCw className="h-4 w-4" />
          Atualizar Logs
        </Button>
      </PageActionHeader>

      <Card className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base font-semibold text-foreground">Histórico de Transações</CardTitle>
          <CardDescription>Auditoria permanente de toda movimentação física de insumos</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12 text-sm text-muted-foreground">Carregando movimentações...</div>
          ) : movements.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              Nenhuma movimentação registrada no histórico.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/70">
                  <TableHead className="pl-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">Data / Hora</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Insumo</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Operação</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground text-right">Quantidade</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Referência</TableHead>
                  <TableHead className="pr-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">Motivo / Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((mov) => (
                  <TableRow key={mov.id} className="hover:bg-muted/50">
                    <TableCell className="pl-6 text-muted-foreground font-medium text-xs">
                      {new Date(mov.createdAt).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-bold text-foreground">{mov.productName}</TableCell>
                    <TableCell>{getTypeBadge(mov.type)}</TableCell>
                    <TableCell className="tabular-nums font-bold text-foreground text-right text-base">
                      {Number(mov.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 3 })}
                    </TableCell>
                    <TableCell className="tabular-nums text-xs text-muted-foreground">{mov.reference || '—'}</TableCell>
                    <TableCell className="pr-6 text-foreground text-sm">{mov.notes || '—'}</TableCell>
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
