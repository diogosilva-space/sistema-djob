import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ClienteForm } from '@/features/crm/components/ClienteForm';
import { useCliente } from '@/features/crm/hooks/useClientes';

export const ClienteEditarPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: cliente, isLoading } = useCliente(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-lg font-medium">Carregando cliente...</div>
          <div className="text-sm text-muted-foreground mt-2">
            Aguarde enquanto buscamos os dados
          </div>
        </div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-lg font-medium">Cliente não encontrado</div>
          <div className="text-sm text-muted-foreground mt-2">
            O cliente solicitado não existe ou foi removido
          </div>
          <Button onClick={() => navigate('/crm')} className="mt-4">
            Voltar para CRM
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/crm/clientes/${id}`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Editar Cliente</h1>
          <p className="text-muted-foreground mt-1">
            {cliente.razaoSocial}
          </p>
        </div>
      </div>

      {/* Formulário */}
      <ClienteForm mode="editar" initialData={cliente} />
    </div>
  );
};
