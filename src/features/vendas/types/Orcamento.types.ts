/**
 * Tipos e interfaces para o módulo de Vendas (Orçamentos)
 */

// Técnicas de Personalização conforme especificação
export type TecnicaPersonalizacao =
  | 'BOR'  // Bordado
  | 'ETQ'  // Etiquetas
  | 'IMP'  // Impressão Digital
  | 'SUB'  // Sublimação
  | 'LAS'  // Laser
  | 'LAS360'  // Laser Circular
  | 'HOT'  // Hot Stamping
  | 'SIL'  // Silk Screen
  | 'SIL360'  // Silk Screen Circular
  | 'SILTEX'  // Silk Screen Têxtil
  | 'TAM'  // Tampografia
  | 'TRA'  // Transfer
  | 'UVD'  // UV Digital
  | 'UV360';  // UV Circular (360)

export interface TecnicaPersonalizacaoInfo {
  codigo: TecnicaPersonalizacao;
  nome: string;
  custoBase: number;
  variavelCusto: string;
}

export const TECNICAS_PERSONALIZACAO: Record<TecnicaPersonalizacao, TecnicaPersonalizacaoInfo> = {
  BOR: { codigo: 'BOR', nome: 'Bordado', custoBase: 8.00, variavelCusto: 'Por 1000 pontos' },
  ETQ: { codigo: 'ETQ', nome: 'Etiquetas', custoBase: 0.50, variavelCusto: 'Por unidade' },
  IMP: { codigo: 'IMP', nome: 'Impressão Digital', custoBase: 2.00, variavelCusto: 'Por cm²' },
  SUB: { codigo: 'SUB', nome: 'Sublimação', custoBase: 5.00, variavelCusto: 'Por peça' },
  LAS: { codigo: 'LAS', nome: 'Laser', custoBase: 3.00, variavelCusto: 'Por cm²' },
  LAS360: { codigo: 'LAS360', nome: 'Laser Circular', custoBase: 5.00, variavelCusto: 'Por peça' },
  HOT: { codigo: 'HOT', nome: 'Hot Stamping', custoBase: 4.00, variavelCusto: 'Por aplicação' },
  SIL: { codigo: 'SIL', nome: 'Silk Screen', custoBase: 2.00, variavelCusto: 'Por cor' },
  SIL360: { codigo: 'SIL360', nome: 'Silk Screen Circular', custoBase: 3.00, variavelCusto: 'Por cor' },
  SILTEX: { codigo: 'SILTEX', nome: 'Silk Screen Têxtil', custoBase: 2.50, variavelCusto: 'Por cor' },
  TAM: { codigo: 'TAM', nome: 'Tampografia', custoBase: 1.50, variavelCusto: 'Por cor' },
  TRA: { codigo: 'TRA', nome: 'Transfer', custoBase: 3.00, variavelCusto: 'Por peça' },
  UVD: { codigo: 'UVD', nome: 'UV Digital', custoBase: 4.00, variavelCusto: 'Por cm²' },
  UV360: { codigo: 'UV360', nome: 'UV Circular (360)', custoBase: 6.00, variavelCusto: 'Por peça' },
};

export interface Personalizacao {
  id?: string;
  tecnica: TecnicaPersonalizacao;
  numeroCores?: number;
  posicaoArte: string;
  tamanhoArte: string;
  arquivos?: string[];
  observacoes?: string;
  custoCalculado: number;
}

export interface ItemOrcamento {
  id: string;
  produtoId: string;
  produtoNome: string;
  produtoDescricao?: string;
  quantidade: number;
  unidade: string;
  precoUnitario: number;
  desconto: number; // Porcentagem 0-100
  subtotal: number;
  personalizacao?: Personalizacao;
}

export interface Orcamento {
  id?: string;
  numero: string;
  clienteId: string;
  clienteNome: string;
  dataEmissao: Date;
  validade: string; // "15 dias", "30 dias", "60 dias"
  vendedorId: string;
  vendedorNome: string;
  oportunidadeId?: string;
  observacoesInternas?: string;
  itens: ItemOrcamento[];
  
  // Valores calculados
  subtotalProdutos: number;
  custoPersonalizacao: number;
  freteEstimado: number;
  descontoGlobalPorcentagem: number;
  descontoGlobalValor: number;
  total: number;
  
  // Controle
  status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado' | 'expirado' | 'convertido';
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CreateOrcamentoDTO {
  clienteId: string;
  validade: string;
  vendedorId: string;
  oportunidadeId?: string;
  observacoesInternas?: string;
  itens: Omit<ItemOrcamento, 'id' | 'subtotal'>[];
  freteEstimado?: number;
  descontoGlobalPorcentagem?: number;
}

export interface UpdateOrcamentoDTO extends CreateOrcamentoDTO {
  id: string;
  status?: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado' | 'expirado' | 'convertido';
}

// Produto simplificado para seleção no orçamento
export interface ProdutoSimples {
  id: string;
  sku: string;
  nome: string;
  descricao: string;
  precoVenda: number;
  unidade: string;
  estoque?: number;
}
