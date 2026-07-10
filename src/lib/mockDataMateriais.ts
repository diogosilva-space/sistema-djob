/**
 * Dados Mock para Materiais (Matérias-primas para BOM)
 */

import { MaterialSimples } from '@/features/produtos/types/Produto.types';

export const materiaisMock: MaterialSimples[] = [
  {
    id: '1',
    sku: 'MAT-MALHA-BR',
    nome: 'Malha 100% Algodão Branca',
    unidade: 'Metro',
    custoUnitario: 12.50,
  },
  {
    id: '2',
    sku: 'MAT-MALHA-PT',
    nome: 'Malha 100% Algodão Preta',
    unidade: 'Metro',
    custoUnitario: 13.00,
  },
  {
    id: '3',
    sku: 'MAT-LINHA-BR',
    nome: 'Linha de Costura Branca',
    unidade: 'Unidade',
    custoUnitario: 2.50,
  },
  {
    id: '4',
    sku: 'MAT-LINHA-PT',
    nome: 'Linha de Costura Preta',
    unidade: 'Unidade',
    custoUnitario: 2.50,
  },
  {
    id: '5',
    sku: 'MAT-ETIQUETA',
    nome: 'Etiqueta de Composição',
    unidade: 'Unidade',
    custoUnitario: 0.15,
  },
  {
    id: '6',
    sku: 'MAT-PLASTICO',
    nome: 'Embalagem Plástica',
    unidade: 'Unidade',
    custoUnitario: 0.25,
  },
  {
    id: '7',
    sku: 'MAT-BOTAO',
    nome: 'Botão Padrão',
    unidade: 'Unidade',
    custoUnitario: 0.10,
  },
  {
    id: '8',
    sku: 'MAT-ZIPER',
    nome: 'Zíper 20cm',
    unidade: 'Unidade',
    custoUnitario: 1.50,
  },
];

export const USE_MOCK_MATERIAIS = true;
