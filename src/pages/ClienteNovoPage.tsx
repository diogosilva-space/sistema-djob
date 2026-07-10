import React from 'react';

import { ClienteForm } from '@/features/crm/components/ClienteForm';

export const ClienteNovoPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Novo Cliente</h1>
        <p className="text-muted-foreground mt-1">
          Cadastre um novo cliente no sistema
        </p>
      </div>

      <ClienteForm mode="criar" />
    </div>
  );
};
