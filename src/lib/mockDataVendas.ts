export type StatusVenda = 'Rascunho' | 'Orçamento' | 'Aprovado' | 'Em Produção' | 'Faturado' | 'Entregue' | 'Cancelado';

export interface Venda {
    id: string;
    numero: string;
    clienteNome: string;
    data: Date;
    valorTotal: number;
    status: StatusVenda;
}

export const vendasMock: Venda[] = [
    {
        id: 'v-1',
        numero: 'ORC-2026-0001',
        clienteNome: 'Tech Solutions Ltda',
        data: new Date(2026, 0, 10),
        valorTotal: 5400.00,
        status: 'Faturado'
    },
    {
        id: 'v-2',
        numero: 'ORC-2026-0002',
        clienteNome: 'Escola Internacional Maple',
        data: new Date(2026, 0, 15),
        valorTotal: 3200.50,
        status: 'Aprovado'
    },
    {
        id: 'v-3',
        numero: 'ORC-2026-0003',
        clienteNome: 'Restaurante Sabor & Arte',
        data: new Date(2026, 0, 20),
        valorTotal: 1250.00,
        status: 'Em Produção'
    },
    {
        id: 'v-4',
        numero: 'ORC-2026-0004',
        clienteNome: 'Academia Corpo & Mente',
        data: new Date(2026, 0, 25),
        valorTotal: 890.00,
        status: 'Orçamento'
    },
    {
        id: 'v-5',
        numero: 'ORC-2026-0005',
        clienteNome: 'Prefeitura Municipal',
        data: new Date(2026, 0, 27),
        valorTotal: 15700.00,
        status: 'Entregue'
    }
];
