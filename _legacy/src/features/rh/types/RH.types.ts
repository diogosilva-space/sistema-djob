/**
 * Tipos e interfaces para o módulo de RH
 */

export type EstadoCivil =
  'Solteiro(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viúvo(a)' | 'União Estável';
export type CategoriaCNH = 'A' | 'B' | 'C' | 'D' | 'E' | 'AB' | 'AC' | 'AD' | 'AE';

export interface Dependente {
  id: string;
  nome: string;
  dataNascimento: Date;
  grauParentesco: string;
  cpf: string;
}

export interface Funcionario {
  id: string;
  fotoUrl?: string;
  nomeCompleto: string;
  dataNascimento: Date;
  naturalidade: string;
  ufNaturalidade: string;
  estadoCivil: EstadoCivil;
  nomeConjuge?: string;
  nomePai?: string;
  nomeMae: string;

  // Contato e Endereço
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  telefoneFixo?: string;
  celular: string;
  telefoneRecado?: string;

  // Documentação
  rg: string;
  orgaoExpedidor: string;
  ufExpedicaoRG: string;
  dataExpedicaoRG: Date;
  cpf: string;
  pisPasep: string;
  dataCadastroPIS?: Date;
  ctps: string;
  serieCTPS: string;
  dataExpedicaoCTPS: Date;
  tituloEleitor?: string;
  zonaEleitoral?: string;
  secaoEleitoral?: string;
  carteiraReservista?: string;
  serieReservista?: string;
  categoriaReservista?: string;
  cnh?: string;
  categoriaCNH?: CategoriaCNH;
  validadeCNH?: Date;

  // Dados Contratuais
  dataAdmissao: Date;
  funcaoCargo: string;
  contratoExperienciaDias: number;
  salarioBase: number;
  horarioTrabalhoManha: string;
  horarioTrabalhoTarde: string;
  intervaloAlmoco: string;
  descansoSemanal: string;
  descontoVT: boolean;
  recebeSeguroDesemprego: boolean;
  dataRequerimentoSeguro?: Date;

  // Dados Bancários
  banco: string;
  agencia: string;
  conta: string;

  // Dependentes
  dependentes: Dependente[];

  status: 'Ativo' | 'Afastado' | 'Desligado';
}

export type CreateFuncionarioDTO = Omit<Funcionario, 'id' | 'status'>;
