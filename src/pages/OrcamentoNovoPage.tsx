import React from 'react';

import { OrcamentoForm } from '@/features/vendas/components/OrcamentoForm';

export const OrcamentoNovoPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Novo Orçamento</h1>
        <p className="text-muted-foreground mt-1">Crie um novo orçamento para o cliente</p>
      </div>

      <OrcamentoForm mode="criar" />
    </div>
  );
};
