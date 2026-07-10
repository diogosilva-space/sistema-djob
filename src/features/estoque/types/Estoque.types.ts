/**
 * Tipos e interfaces para o módulo de Estoque
 */

export type TipoMovimentacaoEstoque = 'Entrada' | 'Saída' | 'Ajuste' | 'Reserva';
export type CategoriaItem = 'Produto Acabado' | 'Matéria-Prima' | 'Brinde' | 'Insumo';

export interface ItemEstoque {
    id: string;
    itemId: string; // ID do Produto ou Material
    itemNome: string;
    itemSku: string;
    categoria: CategoriaItem;
    quantidadeAtual: number;
    quantidadeMinima: number;
    quantidadeReservada: number;
    unidadeMedida: string;
    localizacao?: string;
    custoMedio: number;
    valorTotal: number;
    ultimaMovimentacao: Date;
}

export interface MovimentacaoEstoque {
    id: string;
    itemEstoqueId: string;
    tipo: TipoMovimentacaoEstoque;
    quantidade: number;
    data: Date;
    usuarioNome: string;
    motivo: string;
    documentoReferencia?: string; // Ex: Nº OP, Nº Pedido Compra
}

export interface HistoricoMovimentacaoDTO {
    itemEstoqueId: string;
    periodo?: {
        inicio: Date;
        fim: Date;
    };
}
