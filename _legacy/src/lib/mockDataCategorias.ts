/**
 * Dados Mock para Categorias e Subcategorias
 */

import { Categoria } from '@/features/produtos/types/Produto.types';

export const categoriasMock: Categoria[] = [
  {
    id: '1',
    nome: 'Brindes Personalizados',
    descricao: 'Produtos promocionais e corporativos',
    subcategorias: [
      { id: '1-1', categoriaId: '1', nome: 'Canecas e Copos' },
      { id: '1-2', categoriaId: '1', nome: 'Chaveiros' },
      { id: '1-3', categoriaId: '1', nome: 'Cadernos e Blocos' },
      { id: '1-4', categoriaId: '1', nome: 'Utensílios' },
    ],
  },
  {
    id: '2',
    nome: 'Confecção Têxtil',
    descricao: 'Vestuário e produtos têxteis',
    subcategorias: [
      { id: '2-1', categoriaId: '2', nome: 'Camisetas' },
      { id: '2-2', categoriaId: '2', nome: 'Bonés e Chapéus' },
      { id: '2-3', categoriaId: '2', nome: 'Ecobags' },
      { id: '2-4', categoriaId: '2', nome: 'Uniformes' },
    ],
  },
  {
    id: '3',
    nome: 'Acessórios',
    descricao: 'Acessórios diversos',
    subcategorias: [
      { id: '3-1', categoriaId: '3', nome: 'Mochilas e Bolsas' },
      { id: '3-2', categoriaId: '3', nome: 'Garrafas e Squeezes' },
    ],
  },
];

export const USE_MOCK_CATEGORIAS = true;
