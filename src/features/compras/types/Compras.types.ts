/**
 * Tipos e interfaces para o módulo de Compras
 */

export type StatusPedidoCompra =
  | 'Rascunho'
  | 'Aguardando Aprovação'
  | 'Pedido Enviado'
  | 'Recebido Parcial'
  | 'Recebedio Total'
  | 'Cancelado';

export interface ItemPedidoCompra {
  id: string;
  materialId: string;
  materialNome: string;
  quantidadePedida: number;
  quantidadeRecebida: number;
  valorUnitarioPlan: number;
  valorUnitarioReal?: number;
  subtotal: number;
}

export interface PedidoCompra {
  id: string;
  numero: string;
  fornecedorId: string;
  fornecedorNome: string;
  dataEmissao: Date;
  dataPrevisaoEntrega: Date;
  status: StatusPedidoCompra;
  itens: ItemPedidoCompra[];
  valorTotal: number;
  condicaoPagamento: string;
  observacoes?: string;
  responsavelNome: string;
}

export interface CreatePedidoCompraDTO {
  fornecedorId: string;
  itens: Omit<ItemPedidoCompra, 'id' | 'quantidadeRecebida' | 'subtotal'>[];
  dataPrevisaoEntrega: Date;
  condicaoPagamento: string;
}
