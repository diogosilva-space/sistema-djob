/**
 * Exports do módulo CRM
 */

// Componentes
export { ClienteForm } from './components/ClienteForm';
export { InformacoesGeraisTab } from './components/InformacoesGeraisTab';
export { ContatosTab } from './components/ContatosTab';
export { EnderecosTab } from './components/EnderecosTab';
export { ComercialTab } from './components/ComercialTab';

// Tipos
export type {
  Cliente,
  CreateClienteDTO,
  UpdateClienteDTO,
  TipoPessoa,
  Segmento,
  OrigemCliente,
  TipoEndereco,
  CondicaoPagamento,
  Endereco,
} from './types/Cliente.types';

// API
export { clientesApi } from './api/clientes.api';

// Hooks
export {
  useClientes,
  useCliente,
  useCreateCliente,
  useUpdateCliente,
  useDeleteCliente,
  clientesKeys,
} from './hooks/useClientes';
