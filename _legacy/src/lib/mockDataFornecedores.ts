/**
 * Dados Mock para Fornecedores
 */

import { FornecedorSimples } from '@/features/produtos/types/Produto.types';

export const fornecedoresMock: FornecedorSimples[] = [
  {
    id: '1',
    razaoSocial: 'Brindes Brasil Ltda',
    cnpj: '12.345.678/0001-90',
  },
  {
    id: '2',
    razaoSocial: 'Confecções Master',
    cnpj: '23.456.789/0001-91',
  },
  {
    id: '3',
    razaoSocial: 'Importadora Global',
    cnpj: '34.567.890/0001-92',
  },
  {
    id: '4',
    razaoSocial: 'Têxtil Premium',
    cnpj: '45.678.901/0001-93',
  },
];

export const USE_MOCK_FORNECEDORES = true;
