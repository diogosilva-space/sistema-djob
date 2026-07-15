import { ProtocoloEntrega } from '@/features/logistica/types/Logistica.types';

export const protocolosMock: ProtocoloEntrega[] = [
  {
    id: 'pe-1',
    numero: 'PE-2026-0001',
    pedidoVendaId: 'pv-452',
    clienteNome: 'Restaurante Sabor & Arte',
    enderecoSaida: 'Rua da DJOB, 123 - São Paulo/SP',
    enderecoDestino: 'Av. Paulista, 1000 - São Paulo/SP',
    dataSaida: new Date(2026, 0, 25, 9, 30),
    dataEntrega: new Date(2026, 0, 25, 14, 15),
    entreguePor: 'Marcio Motoboy',
    recebidoPor: 'João Silva',
    status: 'Entregue',
    itens: [
      { id: 'i-1', produtoNome: 'Camiseta Algodão Branca', quantidade: 50, unidade: 'Un' },
      { id: 'i-2', produtoNome: 'Boné 5 Gomos Preto', quantidade: 20, unidade: 'Un' },
    ],
  },
  {
    id: 'pe-2',
    numero: 'PE-2026-0002',
    pedidoVendaId: 'pv-453',
    clienteNome: 'Academia Corpo & Mente',
    enderecoSaida: 'Rua da DJOB, 123 - São Paulo/SP',
    enderecoDestino: 'Rua Augusta, 500 - São Paulo/SP',
    dataSaida: new Date(2026, 0, 27, 10, 0),
    entreguePor: 'Carlos Express',
    status: 'Em Trânsito',
    itens: [{ id: 'i-3', produtoNome: 'Squeeze Personalizada', quantidade: 100, unidade: 'Un' }],
  },
];
