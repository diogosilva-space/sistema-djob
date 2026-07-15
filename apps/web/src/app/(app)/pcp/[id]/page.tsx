'use client';

import { useState, useEffect } from 'react';
import { pcpService } from '@/features/pcp/api/pcp.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowLeft, CheckCircle, Play, Pause, AlertTriangle, Cpu, Tag, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PcpOrderDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await pcpService.getProductionOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error('Erro ao buscar OP', error);
    } finally {
      setLoading(false);
    }
  };

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
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Aguardando
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 animate-pulse">
            Executando
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            Concluído
          </span>
        );
      case 'SKIPPED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Ignorado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const getStepIndicatorStyle = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'border-slate-300 bg-white text-slate-400';
      case 'IN_PROGRESS':
        return 'border-blue-500 bg-blue-50 text-blue-600 ring-4 ring-blue-50';
      case 'COMPLETED':
        return 'border-emerald-500 bg-emerald-500 text-white';
      default:
        return 'border-slate-350 bg-slate-100 text-slate-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold text-slate-900">Ordem de Produção não encontrada</h3>
        <Link href="/pcp">
          <Button variant="outline">Voltar ao PCP</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/pcp">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200 hover:bg-slate-150 text-slate-700 flex items-center gap-1.5 active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{order.code}</h1>
            <p className="text-sm text-slate-500">Fluxo operacional e apontamentos no chão de fábrica</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Informações Gerais */}
        <Card className="bg-white rounded-2xl border border-slate-200 shadow-sm md:col-span-1 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-slate-900">Detalhes da OP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm border-t border-slate-100 pt-4">
            <div className="space-y-1">
              <span className="text-slate-455 block font-semibold">Cliente</span>
              <span className="font-bold text-slate-900 text-base">{order.salesOrder?.customer?.name || 'Venda Avulsa'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-455 block font-semibold">Pedido Relacionado</span>
              <span className="font-mono font-bold text-slate-800">{order.salesOrder?.code || '—'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-455 block font-semibold">Status de Produção</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white">
                {order.status}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-455 block font-semibold">Prioridade da OP</span>
              <span className="font-bold text-slate-900">Nível {order.priority}</span>
            </div>
          </CardContent>
        </Card>

        {/* Linha do tempo das Etapas */}
        <Card className="bg-white rounded-2xl border border-slate-200 shadow-sm md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-slate-900">Roteiro de Confecção</CardTitle>
            <CardDescription>Gerencie e registre o progresso em tempo real das etapas</CardDescription>
          </CardHeader>
          <CardContent className="border-t border-slate-100 pt-6">
            <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
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
                      <span className="font-bold text-slate-900 text-base">{step.name}</span>
                      {getStepStatusBadge(step.status)}
                    </div>

                    <div className="flex gap-2">
                      {step.status === 'PENDING' && (
                        <Button
                          size="sm"
                          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1 active:scale-[0.98]"
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
                            className="border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1 active:scale-[0.97]"
                            onClick={() => handleAction(step.id, 'PAUSE')}
                          >
                            <Pause className="h-3.5 w-3.5" />
                            <span>Pausar</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-700 hover:bg-red-50/50 flex items-center gap-1 active:scale-[0.97]"
                            onClick={() => handleAction(step.id, 'DEFECT')}
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>Reportar Perda</span>
                          </Button>
                          <Button
                            size="sm"
                            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1 active:scale-[0.98]"
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
