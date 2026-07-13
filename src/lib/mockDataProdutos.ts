/**
 * Dados Mock para Produtos (usado em Orçamentos)
 */

import { ProdutoSimples } from '@/features/vendas/types/Orcamento.types';

export const produtosMock: ProdutoSimples[] = [
  {
    id: '1',
    sku: 'CANECA-BR-300ML',
    nome: 'Caneca Branca 300ml',
    descricao: 'Caneca cerâmica branca 300ml para sublimação',
    precoVenda: 8.5,
    unidade: 'Unidade',
    estoque: 250,
  },
  {
    id: '2',
    sku: 'CANECA-MAGICA',
    nome: 'Caneca Mágica',
    descricao: 'Caneca que muda de cor com líquido quente',
    precoVenda: 15.0,
    unidade: 'Unidade',
    estoque: 100,
  },
  {
    id: '3',
    sku: 'CAMISETA-ALGODAO-P',
    nome: 'Camiseta Algodão Branca P',
    descricao: 'Camiseta 100% algodão malha fria tamanho P',
    precoVenda: 18.9,
    unidade: 'Unidade',
    estoque: 80,
  },
  {
    id: '4',
    sku: 'CAMISETA-ALGODAO-M',
    nome: 'Camiseta Algodão Branca M',
    descricao: 'Camiseta 100% algodão malha fria tamanho M',
    precoVenda: 18.9,
    unidade: 'Unidade',
    estoque: 120,
  },
  {
    id: '5',
    sku: 'CAMISETA-ALGODAO-G',
    nome: 'Camiseta Algodão Branca G',
    descricao: 'Camiseta 100% algodão malha fria tamanho G',
    precoVenda: 18.9,
    unidade: 'Unidade',
    estoque: 150,
  },
  {
    id: '6',
    sku: 'ECOBAG-ALGODAO',
    nome: 'Ecobag Algodão Cru',
    descricao: 'Sacola ecológica 100% algodão cru 35x40cm',
    precoVenda: 12.0,
    unidade: 'Unidade',
    estoque: 200,
  },
  {
    id: '7',
    sku: 'CADERNO-A5',
    nome: 'Caderno Brochura A5',
    descricao: 'Caderno capa dura A5 96 folhas personalizável',
    precoVenda: 22.5,
    unidade: 'Unidade',
    estoque: 60,
  },
  {
    id: '8',
    sku: 'CHAVEIRO-ACRILICO',
    nome: 'Chaveiro Acrílico Retangular',
    descricao: 'Chaveiro acrílico transparente 4x6cm',
    precoVenda: 3.5,
    unidade: 'Unidade',
    estoque: 500,
  },
  {
    id: '9',
    sku: 'SQUEEZE-500ML',
    nome: 'Squeeze Plástico 500ml',
    descricao: 'Squeeze plástico branco 500ml com tampa rosqueável',
    precoVenda: 9.9,
    unidade: 'Unidade',
    estoque: 180,
  },
  {
    id: '10',
    sku: 'BONE-5GOMOS',
    nome: 'Boné 5 Gomos',
    descricao: 'Boné americano 5 gomos 100% algodão',
    precoVenda: 25.0,
    unidade: 'Unidade',
    estoque: 75,
  },
];

export const USE_MOCK_PRODUTOS = true;
