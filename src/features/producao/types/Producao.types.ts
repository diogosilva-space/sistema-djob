export type StatusOP = 'Aguardando Material' | 'Em Produção' | 'Finalizada' | 'Cancelada';
export type StatusEtapa = 'Pendente' | 'Em Andamento' | 'Concluído' | 'Reprovado';
export type PrioridadeOP = 'Baixa' | 'Normal' | 'Alta';

export interface Apontamento {
    id: string;
    etapaId: string;
    tipo: 'Início' | 'Fim';
    dataHora: Date;
    responsavelNome: string;
    quantidadeProcessada?: number;
    quantidadeDefeito?: number;
    tipoDefeito?: string;
    observacoes?: string;
}

export interface EtapaProducao {
    id: string;
    nome: string;
    ordem: number;
    status: StatusEtapa;
    dataInicio?: Date;
    dataFim?: Date;
    responsavelNome?: string;
    apontamentos: Apontamento[];
    observacoes?: string;
}

export interface OrdemProducao {
    id: string;
    numero: string; // Ex: OP-2026-00123
    pedidoVendaId?: string;
    clienteId: string;
    clienteNome: string;
    produtoId: string;
    produtoNome: string;
    produtoSku: string;
    quantidade: number;
    dataEmissao: Date;
    dataEntregaPrometida: Date;
    prioridade: PrioridadeOP;
    status: StatusOP;
    etapas: EtapaProducao[];
    responsavelPCP: string;
    observacoes?: string;
}

export interface CreateOrdemProducaoDTO {
    pedidoVendaId?: string;
    clienteId: string;
    produtoId: string;
    quantidade: number;
    dataEntregaPrometida: Date;
    prioridade: PrioridadeOP;
    observacoes?: string;
}
