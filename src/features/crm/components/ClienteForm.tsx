import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Cliente } from '../types/Cliente.types';
import { useCreateCliente, useUpdateCliente } from '../hooks/useClientes';

import { InformacoesGeraisTab } from './InformacoesGeraisTab';
import { ContatosTab } from './ContatosTab';
import { EnderecosTab } from './EnderecosTab';
import { ComercialTab } from './ComercialTab';

// Definição de Tipos (Props)
interface ClienteFormProps {
  initialData?: Cliente;
  mode?: 'criar' | 'editar';
}

// Componente Funcional
export const ClienteForm: React.FC<ClienteFormProps> = ({
  initialData,
  mode = 'criar'
}) => {
  const navigate = useNavigate();
  const createMutation = useCreateCliente();
  const updateMutation = useUpdateCliente();

  // Estado do formulário
  const [formData, setFormData] = useState<Partial<Cliente>>(
    initialData || {
      tipoPessoa: 'juridica',
      dataCadastro: new Date(),
      enderecos: [],
      ativo: true,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    }
  );

  // Funções de Manipulação de Eventos
  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === 'criar') {
        await createMutation.mutateAsync(formData as any);
        navigate('/crm');
      } else {
        await updateMutation.mutateAsync({ id: initialData?.id!, ...formData } as any);
        navigate(`/crm/clientes/${initialData?.id}`);
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const handleCancel = () => {
    navigate('/crm');
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Retorno JSX
  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>
            {mode === 'criar' ? 'Novo Cliente' : 'Editar Cliente'}
          </CardTitle>
          <CardDescription>
            Preencha os dados do cliente. Campos com * são obrigatórios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="geral" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="geral">Informações Gerais</TabsTrigger>
              <TabsTrigger value="contatos">Contatos</TabsTrigger>
              <TabsTrigger value="enderecos">Endereços</TabsTrigger>
              <TabsTrigger value="comercial">Comercial</TabsTrigger>
            </TabsList>

            <TabsContent value="geral" className="space-y-4 mt-4">
              <InformacoesGeraisTab
                formData={formData}
                onChange={handleFieldChange}
              />
            </TabsContent>

            <TabsContent value="contatos" className="space-y-4 mt-4">
              <ContatosTab
                formData={formData}
                onChange={handleFieldChange}
              />
            </TabsContent>

            <TabsContent value="enderecos" className="space-y-4 mt-4">
              <EnderecosTab
                formData={formData}
                onChange={handleFieldChange}
              />
            </TabsContent>

            <TabsContent value="comercial" className="space-y-4 mt-4">
              <ComercialTab
                formData={formData}
                onChange={handleFieldChange}
              />
            </TabsContent>
          </Tabs>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Cliente'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
