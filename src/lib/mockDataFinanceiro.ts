import { Titulo } from '@/features/financeiro/types/Financeiro.types';

export type { Titulo };

const subDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
};

const addDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
};

export const titulosMock: Titulo[] = [
    // Contas a Receber
    {
        id: 'f-1',
        tipo: 'Receita',
        descricao: 'Venda Orçamento #452',
        clienteFornecedorNome: 'Restaurante Sabor & Arte',
        valorOriginal: 12500.00,
        valorAtual: 12500.00,
        dataEmissao: subDays(15),
        dataVencimento: addDays(5),
        status: 'Pendente',
        categoriaFinanceira: 'Vendas',
        contaBancaria: 'Banco do Brasil - Principal',
    },
    {
        id: 'f-2',
        tipo: 'Receita',
        descricao: 'Venda Orçamento #453',
        clienteFornecedorNome: 'Tech Solutions Ltda',
        valorOriginal: 4500.00,
        valorAtual: 4500.00,
        dataEmissao: subDays(10),
        dataVencimento: subDays(2),
        status: 'Atrasado',
        categoriaFinanceira: 'Vendas',
        contaBancaria: 'Itaú Empresas',
    },
    {
        id: 'f-3',
        tipo: 'Receita',
        descricao: 'Contrato Mensal - Uniformes',
        clienteFornecedorNome: 'Escola Aprender',
        valorOriginal: 8200.00,
        valorAtual: 8200.00,
        dataEmissao: subDays(20),
        dataVencimento: subDays(5),
        dataPagamento: subDays(5),
        formaPagamento: 'Pix',
        status: 'Pago',
        categoriaFinanceira: 'Vendas Recorrentes',
        contaBancaria: 'Banco do Brasil - Principal',
    },

    // Contas a Pagar
    {
        id: 'f-4',
        tipo: 'Despesa',
        descricao: 'Compra de Tecidos - NF 8842',
        clienteFornecedorNome: 'Têxtil Brasil S.A.',
        valorOriginal: 3500.00,
        valorAtual: 3500.00,
        dataEmissao: subDays(5),
        dataVencimento: addDays(10),
        status: 'Pendente',
        categoriaFinanceira: 'Matéria-Prima',
        contaBancaria: 'Banco do Brasil - Principal',
    },
    {
        id: 'f-5',
        tipo: 'Despesa',
        descricao: 'Aluguel Galpão',
        clienteFornecedorNome: 'Imobiliária Central',
        valorOriginal: 12000.00,
        valorAtual: 12000.00,
        dataEmissao: subDays(1),
        dataVencimento: addDays(4),
        status: 'Pendente',
        categoriaFinanceira: 'Custos Fixos',
        contaBancaria: 'Itaú Empresas',
    },
    {
        id: 'f-6',
        tipo: 'Despesa',
        descricao: 'Energia Elétrica - 01/2026',
        clienteFornecedorNome: 'Enel Distribuição',
        valorOriginal: 1850.40,
        valorAtual: 1850.40,
        dataEmissao: subDays(10),
        dataVencimento: subDays(1),
        status: 'Atrasado',
        categoriaFinanceira: 'Contas de Consumo',
        contaBancaria: 'Banco do Brasil - Principal',
    }
];
