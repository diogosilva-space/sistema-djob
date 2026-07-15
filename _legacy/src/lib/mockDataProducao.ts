import { OrdemProducao } from '@/features/producao/types/Producao.types';

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

const etapasPadrao = (): any[] => [
  { id: '1', nome: 'Corte', ordem: 1, status: 'Pendente', apontamentos: [] },
  { id: '2', nome: 'Costura', ordem: 2, status: 'Pendente', apontamentos: [] },
  { id: '3', nome: 'Estamparia', ordem: 3, status: 'Pendente', apontamentos: [] },
  { id: '4', nome: 'Acabamento', ordem: 4, status: 'Pendente', apontamentos: [] },
  { id: '5', nome: 'Qualidade', ordem: 5, status: 'Pendente', apontamentos: [] },
];

export const ordensProducaoMock: OrdemProducao[] = [
  {
    id: 'op-1',
    numero: 'OP-2026-00123',
    clienteId: '1',
    clienteNome: 'Restaurante Sabor & Arte',
    produtoId: '3',
    produtoNome: 'Camiseta Algodão P/M/G',
    produtoSku: 'PROD-CAM-001',
    quantidade: 100,
    dataEmissao: subDays(5),
    dataEntregaPrometida: addDays(10),
    prioridade: 'Alta',
    status: 'Em Produção',
    responsavelPCP: 'Carlos Oliveira',
    etapas: [
      {
        id: '1',
        nome: 'Corte',
        ordem: 1,
        status: 'Concluído',
        dataInicio: subDays(4),
        dataFim: subDays(3),
        responsavelNome: 'Ana Silva',
        apontamentos: [],
      },
      {
        id: '2',
        nome: 'Costura',
        ordem: 2,
        status: 'Em Andamento',
        dataInicio: subDays(2),
        responsavelNome: 'Marcos Santos',
        apontamentos: [],
      },
      { id: '3', nome: 'Estamparia', ordem: 3, status: 'Pendente', apontamentos: [] },
      { id: '4', nome: 'Acabamento', ordem: 4, status: 'Pendente', apontamentos: [] },
      { id: '5', nome: 'Qualidade', ordem: 5, status: 'Pendente', apontamentos: [] },
    ],
  },
  {
    id: 'op-2',
    numero: 'OP-2026-00124',
    clienteId: '2',
    clienteNome: 'Tech Solutions Ltda',
    produtoId: '8',
    produtoNome: 'Boné 5 Gomos',
    produtoSku: 'PROD-BON-001',
    quantidade: 50,
    dataEmissao: subDays(2),
    dataEntregaPrometida: addDays(5),
    prioridade: 'Normal',
    status: 'Aguardando Material',
    responsavelPCP: 'Carlos Oliveira',
    etapas: etapasPadrao(),
  },
  {
    id: 'op-3',
    numero: 'OP-2026-00125',
    clienteId: '3',
    clienteNome: 'Escola Aprender',
    produtoId: '4',
    produtoNome: 'Ecobag Algodão',
    produtoSku: 'PROD-ECO-001',
    quantidade: 200,
    dataEmissao: subDays(1),
    dataEntregaPrometida: addDays(15),
    prioridade: 'Baixa',
    status: 'Em Produção',
    responsavelPCP: 'João Silva',
    etapas: [
      {
        id: '1',
        nome: 'Corte',
        ordem: 1,
        status: 'Em Andamento',
        dataInicio: subDays(0),
        responsavelNome: 'Ana Silva',
        apontamentos: [],
      },
      { id: '2', nome: 'Costura', ordem: 2, status: 'Pendente', apontamentos: [] },
      { id: '3', nome: 'Estamparia', ordem: 3, status: 'Pendente', apontamentos: [] },
      { id: '4', nome: 'Acabamento', ordem: 4, status: 'Pendente', apontamentos: [] },
      { id: '5', nome: 'Qualidade', ordem: 5, status: 'Pendente', apontamentos: [] },
    ],
  },
];
