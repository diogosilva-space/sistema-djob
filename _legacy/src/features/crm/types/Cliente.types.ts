/**
 * Tipos e Interfaces para o módulo CRM
 */

export type TipoPessoa = 'fisica' | 'juridica';

export type Segmento = 'Corporativo' | 'Escolas' | 'Eventos' | 'Varejo' | 'Governo';

export type OrigemCliente =
  'Indicação' | 'Site' | 'Redes Sociais' | 'Feira/Evento' | 'Prospecção Ativa';

export type TipoEndereco = 'Faturamento' | 'Entrega' | 'Ambos';

export type CondicaoPagamento =
  'À Vista' | '7 dias' | '14 dias' | '21 dias' | '28 dias' | '30/60/90';

export interface Endereco {
  id?: string;
  tipo: TipoEndereco;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface Cliente {
  id?: string;

  // Informações Gerais
  tipoPessoa: TipoPessoa;
  razaoSocial: string;
  nomeFantasia?: string;
  cpfCnpj: string;
  inscricaoEstadual?: string;
  dataCadastro: Date;
  segmento: Segmento;
  origem?: OrigemCliente;
  vendedorResponsavel: string;
  tags?: string[];
  observacoes?: string;

  // Contatos
  telefonePrincipal: string;
  whatsapp?: string;
  email: string;
  site?: string;
  contatoPrincipal?: string;
  cargoContato?: string;

  // Endereços
  enderecos: Endereco[];

  // Comercial
  limiteCredito?: number;
  condicaoPagamentoPadrao?: CondicaoPagamento;
  tabelaPreco?: string;

  // Metadados
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

export type CreateClienteDTO = Omit<Cliente, 'id' | 'criadoEm' | 'atualizadoEm'>;

export interface UpdateClienteDTO extends Partial<CreateClienteDTO> {
  id: string;
}
