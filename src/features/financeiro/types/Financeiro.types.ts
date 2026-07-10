/**
 * Tipos e interfaces para o módulo Financeiro
 */

export type StatusFinanceiro = 'Pendente' | 'Pago' | 'Atrasado' | 'Parcial' | 'Cancelado';
export type TipoMovimentacao = 'Receita' | 'Despesa';
export type FormaPagamento = 'Boleto' | 'Cartão' | 'Pix' | 'Transferência' | 'Dinheiro';

export interface Titulo {
    id: string;
    tipo: TipoMovimentacao;
    descricao: string;
    clienteFornecedorId?: string;
    clienteFornecedorNome: string;
    valorOriginal: number;
    valorAtual: number; // com juros/descontos
    dataEmissao: Date;
    dataVencimento: Date;
    dataPagamento?: Date;
    formaPagamento?: FormaPagamento;
    status: StatusFinanceiro;
    categoriaFinanceira: string; // Ex: Vendas, Aluguel, Salários
    contaBancaria: string;
    observacoes?: string;
    documentoAnexo?: string;
}

export interface ResumoFinanceiro {
    totalAReceberMes: number;
    totalAPagarMes: number;
    saldoAtual: number;
    atrasadosAReceber: number;
    atrasadosAPagar: number;
}

export interface LancamentoRapidoDTO {
    tipo: TipoMovimentacao;
    descricao: string;
    valor: number;
    dataVencimento: Date;
    clienteFornecedorNome: string;
    categoriaFinanceira: string;
}
