import { PedidoCompra } from '@/features/compras/types/Compras.types';

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

export const pedidosCompraMock: PedidoCompra[] = [
  {
    id: 'pc-1',
    numero: 'COMP-2026-0042',
    fornecedorId: 'forn-1',
    fornecedorNome: 'Têxtil Brasil S.A.',
    dataEmissao: subDays(5),
    dataPrevisaoEntrega: addDays(2),
    status: 'Pedido Enviado',
    valorTotal: 12500.0,
    condicaoPagamento: '30/60 dias',
    responsavelNome: 'Carlos Oliveira',
    itens: [
      {
        id: 'item-1',
        materialId: 'm-1',
        materialNome: 'Tecido Algodão Premium',
        quantidadePedida: 500,
        quantidadeRecebida: 0,
        valorUnitarioPlan: 25.0,
        subtotal: 12500.0,
      },
    ],
  },
  {
    id: 'pc-2',
    numero: 'COMP-2026-0043',
    fornecedorId: 'forn-2',
    fornecedorNome: 'Aviamentos Express',
    dataEmissao: subDays(1),
    dataPrevisaoEntrega: addDays(5),
    status: 'Rascunho',
    valorTotal: 840.5,
    condicaoPagamento: 'Boleto 15 dias',
    responsavelNome: 'Carlos Oliveira',
    itens: [
      {
        id: 'item-2',
        materialId: 'm-2',
        materialNome: 'Linha Costura Reforçada',
        quantidadePedida: 200,
        quantidadeRecebida: 0,
        valorUnitarioPlan: 4.2,
        subtotal: 840.0,
      },
    ],
  },
  {
    id: 'pc-3',
    numero: 'COMP-2026-0040',
    fornecedorId: 'forn-3',
    fornecedorNome: 'Química Color Ltda',
    dataEmissao: subDays(15),
    dataPrevisaoEntrega: subDays(1),
    status: 'Recebedio Total',
    valorTotal: 3200.0,
    condicaoPagamento: 'Pix',
    responsavelNome: 'Ana Souza',
    itens: [
      {
        id: 'item-3',
        materialId: 'm-3',
        materialNome: 'Tinta Serigrafia Preta 1kg',
        quantidadePedida: 50,
        quantidadeRecebida: 50,
        valorUnitarioPlan: 64.0,
        subtotal: 3200.0,
      },
    ],
  },
];
