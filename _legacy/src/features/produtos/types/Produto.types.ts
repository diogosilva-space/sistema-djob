/**
 * Tipos e interfaces para o módulo de Produtos
 */

export type TipoProduto = 'brinde' | 'confeccao';
export type StatusProduto = 'ativo' | 'inativo';
export type UnidadeMedida = 'Unidade' | 'Par' | 'Kit' | 'Metro' | 'Kg';

// Matéria-prima para BOM
export interface MateriaPrima {
  id: string;
  materialId: string;
  materialNome: string;
  quantidade: number;
  unidade: UnidadeMedida;
  custoUnitario: number;
  custoTotal: number;
}

// Produto completo
export interface Produto {
  id?: string;

  // Informações Gerais
  sku: string;
  nome: string;
  descricaoCurta: string;
  descricaoCompleta?: string;
  tipoProduto: TipoProduto;
  categoriaId?: string;
  categoriaNome?: string;
  subcategoriaId?: string;
  subcategoriaNome?: string;
  unidadeMedida: UnidadeMedida;
  status: StatusProduto;
  imagemPrincipal?: string;
  galeriaImagens?: string[];

  // Estoque (para Brindes)
  estoqueAtual?: number;
  estoqueMinimo?: number;
  estoqueMaximo?: number;
  localizacao?: string;
  fornecedorPrincipalId?: string;
  fornecedorPrincipalNome?: string;
  tempoReposicaoDias?: number;

  // Ficha Técnica / BOM (para Confecção)
  bom?: MateriaPrima[];
  tempoProducaoPadrao?: number; // em minutos
  tamanhosDisponiveis?: string[];
  coresDisponiveis?: string[];

  // Custos e Preços
  custoCompraUltima?: number;
  custoMedio?: number;
  custoProducao?: number;
  margemLucroPadrao: number; // porcentagem
  precoVendaSugerido?: number;
  precoVendaPraticado: number;

  // Controle
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CreateProdutoDTO {
  sku: string;
  nome: string;
  descricaoCurta: string;
  descricaoCompleta?: string;
  tipoProduto: TipoProduto;
  categoriaId?: string;
  subcategoriaId?: string;
  unidadeMedida: UnidadeMedida;
  status: StatusProduto;

  // Estoque (Brindes)
  estoqueMinimo?: number;
  estoqueMaximo?: number;
  localizacao?: string;
  fornecedorPrincipalId?: string;
  tempoReposicaoDias?: number;

  // Ficha Técnica (Confecção)
  bom?: Omit<MateriaPrima, 'id' | 'custoTotal'>[];
  tempoProducaoPadrao?: number;
  tamanhosDisponiveis?: string[];
  coresDisponiveis?: string[];

  // Custos
  custoCompraUltima?: number;
  margemLucroPadrao: number;
  precoVendaPraticado: number;
}

export interface UpdateProdutoDTO extends CreateProdutoDTO {
  id: string;
}

// Categoria de produtos
export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  subcategorias?: Subcategoria[];
}

export interface Subcategoria {
  id: string;
  categoriaId: string;
  nome: string;
  descricao?: string;
}

// Fornecedor simplificado
export interface FornecedorSimples {
  id: string;
  razaoSocial: string;
  cnpj: string;
}

// Material para BOM
export interface MaterialSimples {
  id: string;
  sku: string;
  nome: string;
  unidade: UnidadeMedida;
  custoUnitario: number;
}
