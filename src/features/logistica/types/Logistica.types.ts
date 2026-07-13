/**
 * Tipos e interfaces para o módulo de Logística
 */

export type StatusProtocoloEntrega = 'Aguardando Entrega' | 'Entregue' | 'Recusado' | 'Em Trânsito';

export interface ItemProtocolo {
  id: string;
  produtoNome: string;
  quantidade: number;
  unidade: string;
}

export interface ProtocoloEntrega {
  id: string;
  numero: string;
  pedidoVendaId: string;
  clienteNome: string;
  enderecoSaida: string;
  enderecoDestino: string;
  dataSaida: Date;
  dataEntrega?: Date;
  entreguePor: string;
  recebidoPor?: string;
  documentoRecebedor?: string;
  status: StatusProtocoloEntrega;
  itens: ItemProtocolo[];
}

export interface CreateProtocoloDTO {
  pedidoVendaId: string;
  dataSaida: Date;
  entreguePor: string;
}
