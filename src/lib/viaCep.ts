/**
 * Integração com a API ViaCEP para busca de endereços
 */

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string; // Cidade
  uf: string; // Estado
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

/**
 * Busca endereço pelo CEP
 * @param cep CEP no formato 00000-000 ou 00000000
 * @returns Dados do endereço
 */
export async function buscarCEP(cep: string): Promise<ViaCEPResponse | null> {
  // Remove caracteres não numéricos
  const cepLimpo = cep.replace(/\D/g, '');

  // Valida o formato do CEP
  if (cepLimpo.length !== 8) {
    throw new Error('CEP inválido. Deve conter 8 dígitos.');
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

    if (!response.ok) {
      throw new Error('Erro ao buscar CEP');
    }

    const data: ViaCEPResponse = await response.json();

    // Verifica se o CEP foi encontrado
    if (data.erro) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    throw error;
  }
}

/**
 * Formata CEP para o padrão 00000-000
 */
export function formatarCEP(cep: string): string {
  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

/**
 * Valida se o CEP está no formato correto
 */
export function validarCEP(cep: string): boolean {
  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.length === 8;
}
