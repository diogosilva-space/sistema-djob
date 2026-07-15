'use client';

import { useState, useEffect, useCallback } from 'react';
import { pcpService } from '@/features/pcp/api/pcp.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle, Play, Pause, AlertTriangle, Cpu, Tag, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { PageActionHeader } from '@/components/dashboard/PageActionHeader';
import { useParams } from 'next/navigation';

export default function PcpOrderDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      const data = await pcpService.getProductionOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error('Erro ao buscar OP', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) loadOrder();
  }, [id, loadOrder]);

  const handleAction = async (stepId: string, action: 'START' | 'FINISH' | 'PAUSE' | 'DEFECT') => {
    try {
      await pcpService.createProductionLog({
        stepId,
        type: action,
        notes: action === 'START' ? 'Início de etapa' : 'Conclusão de etapa',
      });
      loadOrder(); // Recarrega para ver novos status
    } catch (error) {
      console.error('Erro ao registrar apontamento', error);
    }
  };

  const getStepStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground border border-border">
            Aguardando
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            Executando
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
            Concluído
          </span>
        );
      case 'SKIPPED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground border border-border">
            Ignorado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground border border-border">
            {status}
          </span>
        );
    }
  };

  const getStepIndicatorStyle = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'border-border bg-card text-muted-foreground';
      case 'IN_PROGRESS':
        return 'border-blue-500 bg-blue-50 text-blue-600 ring-4 ring-blue-50';
      case 'COMPLETED':
        return 'border-emerald-500 bg-emerald-500 text-white';
      default:
        return 'border-border bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h3 className="text-xl font-bold text-foreground">Ordem de Produção não encontrada</h3>
        <Link href="/pcp">
          <Button variant="outline">Voltar ao PCP</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageActionHeader
        icon={Cpu}
        backHref="/pcp"
        title={order.code}
        subtitle="Fluxo operacional e apontamentos no chão de fábrica"
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Informações Gerais */}
        <Card className="bg-card rounded-lg border border-border shadow-sm md:col-span-1 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-foreground">Detalhes da OP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm border-t border-border pt-4">
            <div className="space-y-1">
              <span className="text-muted-foreground block font-semibold">Cliente</span>
              <span className="font-bold text-foreground text-base">{order.salesOrder?.customer?.name || 'Venda Avulsa'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block font-semibold">Pedido Relacionado</span>
              <span className="tabular-nums font-bold text-foreground">{order.salesOrder?.code || '—'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block font-semibold">Status de Produção</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {order.status}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block font-semibold">Prioridade da OP</span>
              <span className="font-bold text-foreground">Nível {order.priority}</span>
            </div>
          </CardContent>
        </Card>

        {/* Linha do tempo das Etapas */}
        <Card className="bg-card rounded-lg border border-border shadow-sm md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-foreground">Roteiro de Confecção</CardTitle>
            <CardDescription>Gerencie e registre o progresso em tempo real das etapas</CardDescription>
          </CardHeader>
          <CardContent className="border-t border-border pt-6">
            <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
              {order.steps?.map((step: any, index: number) => {
                const stepIndicatorClass = getStepIndicatorStyle(step.status);
                return (
                  <div key={step.id} className="relative space-y-3">
                    {/* Indicador de Timeline */}
                    <div
                      className={`absolute -left-[37px] top-0.5 h-6.5 w-6.5 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${stepIndicatorClass}`}
                    >
                      {step.status === 'COMPLETED' ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground text-base">{step.name}</span>
                      {getStepStatusBadge(step.status)}
                    </div>

                    <div className="flex gap-2">
                      {step.status === 'PENDING' && (
                        <Button
                          size="sm"
                          className="font-semibold flex items-center gap-1 active:scale-[0.98]"
                          onClick={() => handleAction(step.id, 'START')}
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Iniciar Etapa</span>
                        </Button>
                      )}
                      {step.status === 'IN_PROGRESS' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-border text-foreground hover:bg-muted flex items-center gap-1 active:scale-[0.97]"
                            onClick={() => handleAction(step.id, 'PAUSE')}
                          >
                            <Pause className="h-3.5 w-3.5" />
                            <span>Pausar</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-destructive/40 text-destructive hover:bg-destructive/10 flex items-center gap-1 active:scale-[0.97]"
                            onClick={() => handleAction(step.id, 'DEFECT')}
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>Reportar Perda</span>
                          </Button>
                          <Button
                            size="sm"
                            className="font-semibold flex items-center gap-1 active:scale-[0.98]"
                            onClick={() => handleAction(step.id, 'FINISH')}
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Concluir</span>
                          </Button>
                        </>
                      )}
                      {step.status === 'COMPLETED' && (
                        <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
                          <CheckCircle className="h-4 w-4" />
                          <span>Apontamento concluído e registrado no log.</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
