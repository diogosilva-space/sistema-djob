import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    User,
    ChevronRight,
    Play,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    Printer,
    History,
    Info
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ApontamentoModal } from '@/features/producao/components/ApontamentoModal';

import { ordensProducaoMock } from '@/lib/mockDataProducao';
import { StatusOP, PrioridadeOP } from '@/features/producao/types/Producao.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const OrdemProducaoDetalhesPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const op = ordensProducaoMock.find((o) => o.id === id);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEtapa, setSelectedEtapa] = useState<any>(null);

    const handleOpenApontamento = (etapa: any) => {
        setSelectedEtapa(etapa);
        setIsModalOpen(true);
    };

    const handleSaveApontamento = (data: any) => {
        console.log('Apontamento salvo:', data, 'para etapa:', selectedEtapa?.nome);
        // Aqui viria a lógica de atualização do estado/API
        alert(`Apontamento registrado: ${data.tipo} de ${selectedEtapa?.nome}`);
        setIsModalOpen(false); // Close modal after saving
    };

    if (!op) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <AlertCircle size={48} className="text-muted-foreground" />
                <h2 className="text-xl font-semibold">Ordem de Produção não encontrada</h2>
                <Button onClick={() => navigate('/producao')}>Voltar para Produção</Button>
            </div>
        );
    }

    const getStatusColor = (status: StatusOP) => {
        switch (status) {
            case 'Aguardando Material': return 'destructive';
            case 'Em Produção': return 'secondary';
            case 'Finalizada': return 'default';
            case 'Cancelada': return 'destructive';
            default: return 'outline';
        }
    };

    const getPrioridadeColor = (prioridade: PrioridadeOP) => {
        switch (prioridade) {
            case 'Alta': return 'bg-destructive/10 text-destructive border-destructive/20';
            case 'Normal': return 'bg-info/10 text-info border-info/20';
            case 'Baixa': return 'bg-muted/50 text-muted-foreground border-muted';
            default: return '';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate('/producao')}>
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">{op.numero}</h1>
                            <Badge variant={getStatusColor(op.status)} className="h-5 text-[10px] uppercase font-bold">
                                {op.status}
                            </Badge>
                            <div className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded-full border ${getPrioridadeColor(op.prioridade)}`}>
                                {op.prioridade}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span>{op.clienteNome}</span>
                            <ChevronRight size={14} />
                            <span className="font-medium text-foreground">{op.produtoNome}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9 gap-2">
                        <Printer size={16} />
                        <span>Imprimir</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                        <MoreVertical size={16} />
                    </Button>
                    <Button className="h-9 gap-2">
                        <Play size={16} />
                        <span>Iniciar Próxima Etapa</span>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card className="shadow-sm border-muted/40">
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-base flex items-center gap-2">
                                <History size={18} className="text-primary" />
                                Fluxo de Produção
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Acompanhamento real das etapas na fábrica
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-[1.25rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-muted before:via-muted before:to-transparent">
                                {op.etapas.map((etapa, idx) => (
                                    <div key={etapa.id} className="relative flex items-start gap-6 group">
                                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shadow-sm transition-all z-10
                      ${etapa.status === 'Concluído' ? 'bg-primary text-primary-foreground' :
                                                etapa.status === 'Em Andamento' ? 'bg-secondary text-secondary-foreground animate-pulse' :
                                                    'bg-muted text-muted-foreground'}`}
                                        >
                                            {etapa.status === 'Concluído' ? <CheckCircle2 size={18} /> : <span>{etapa.ordem}</span>}
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className={`text-sm font-bold ${etapa.status === 'Pendente' ? 'text-muted-foreground' : 'text-foreground'}`}>
                                                    {etapa.nome}
                                                </h3>
                                                <Badge variant={
                                                    etapa.status === 'Concluído' ? 'default' :
                                                        etapa.status === 'Em Andamento' ? 'secondary' :
                                                            'outline'
                                                } className="h-5 text-[10px]">
                                                    {etapa.status}
                                                </Badge>
                                            </div>

                                            {(etapa.dataInicio || etapa.responsavelNome) && (
                                                <div className="grid grid-cols-2 gap-4 mt-3 bg-muted/30 p-3 rounded-lg border border-muted/50">
                                                    {etapa.dataInicio && (
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Início</p>
                                                            <div className="flex items-center gap-1.5 text-xs">
                                                                <Calendar size={12} className="text-muted-foreground" />
                                                                <span>{format(etapa.dataInicio, "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {etapa.dataFim && (
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Fim</p>
                                                            <div className="flex items-center gap-1.5 text-xs">
                                                                <CheckCircle2 size={12} className="text-muted-foreground" />
                                                                <span>{format(etapa.dataFim, "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {etapa.responsavelNome && (
                                                        <div className="space-y-1 col-span-2">
                                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Responsável</p>
                                                            <div className="flex items-center gap-1.5 text-xs font-medium">
                                                                <User size={12} className="text-muted-foreground" />
                                                                <span>{etapa.responsavelNome}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {etapa.status === 'Em Andamento' && (
                                                <div className="mt-4">
                                                    <Button
                                                        size="sm"
                                                        className="h-8 text-xs gap-2"
                                                        onClick={() => handleOpenApontamento(etapa)}
                                                    >
                                                        <CheckCircle2 size={14} />
                                                        Finalizar {etapa.nome}
                                                    </Button>
                                                </div>
                                            )}

                                            {etapa.status === 'Pendente' && idx > 0 && op.etapas[idx - 1].status === 'Concluído' && (
                                                <div className="mt-4">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 text-xs gap-2"
                                                        onClick={() => handleOpenApontamento(etapa)}
                                                    >
                                                        <Play size={14} />
                                                        Iniciar {etapa.nome}
                                                    </Button>
                                                </div>
                                            )}

                                            {etapa.status === 'Pendente' && idx === 0 && (
                                                <div className="mt-4">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 text-xs gap-2"
                                                        onClick={() => handleOpenApontamento(etapa)}
                                                    >
                                                        <Play size={14} />
                                                        Iniciar {etapa.nome}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="shadow-sm border-muted/40 overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Resumo da Ordem</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground mb-1">Produto</span>
                                <span className="text-[13px] font-bold">{op.produtoNome}</span>
                                <span className="text-[11px] font-mono text-muted-foreground">{op.produtoSku}</span>
                            </div>

                            <Separator className="opacity-50" />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground mb-1">Quantidade</span>
                                    <span className="text-[13px] font-bold">{op.quantidade} un.</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground mb-1">Emissão</span>
                                    <span className="text-[13px] font-medium">{format(op.dataEmissao, 'dd/MM/yyyy')}</span>
                                </div>
                            </div>

                            <Separator className="opacity-50" />

                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground mb-1 font-bold flex items-center gap-1.5 text-primary">
                                    <Calendar size={14} />
                                    Entrega Prometida
                                </span>
                                <span className="text-[15px] font-bold">{format(op.dataEntregaPrometida, "dd 'de' MMMM", { locale: ptBR })}</span>
                                <span className="text-[11px] text-muted-foreground mt-0.5">Ano: {format(op.dataEntregaPrometida, 'yyyy')}</span>
                            </div>

                            <Separator className="opacity-50" />

                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground mb-1">PCP Responsável</span>
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-[10px] font-bold">
                                        {op.responsavelPCP.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span className="text-[13px]">{op.responsavelPCP}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-muted/40">
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Info size={16} className="text-muted-foreground" />
                                Notas e Observações
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {op.observacoes || "Nenhuma observação interna registrada para esta ordem de produção."}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {selectedEtapa && (
                <ApontamentoModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    etapa={selectedEtapa}
                    onSave={handleSaveApontamento}
                />
            )}
        </div>
    );
};
