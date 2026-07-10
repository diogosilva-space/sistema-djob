/**
 * Tipos e interfaces para o módulo de Oportunidades (Pipeline de Vendas)
 */

export type StatusOportunidade =
  | 'lead_qualificado'
  | 'contato_inicial'
  | 'apresentacao'
  | 'proposta_enviada'
  | 'negociacao'
  | 'fechado_ganho'
  | 'fechado_perdido';

export interface Oportunidade {
  id: string;
  nomeCliente: string;
  clienteId?: string;
  valor: number;
  probabilidade: number; // 0-100
  status: StatusOportunidade;
  vendedor: string;
  vendedorId?: string;
  dataUltimaInteracao: Date;
  dataCriacao: Date;
  dataFechamento?: Date;
  observacoes?: string;
  tags?: string[];
}

export interface KanbanColuna {
  id: StatusOportunidade;
  titulo: string;
  cor: string;
  oportunidades: Oportunidade[];
}

export interface CreateOportunidadeDTO {
  nomeCliente: string;
  clienteId?: string;
  valor: number;
  probabilidade: number;
  vendedor: string;
  vendedorId?: string;
  observacoes?: string;
  tags?: string[];
}

export interface UpdateOportunidadeDTO extends CreateOportunidadeDTO {
  id: string;
  status: StatusOportunidade;
}
