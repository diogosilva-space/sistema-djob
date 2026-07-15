import React from 'react';

import { ProdutoForm } from '@/features/produtos/components/ProdutoForm';

export const ProdutoNovoPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Novo Produto</h1>
        <p className="text-muted-foreground mt-1">Cadastre um novo produto no catálogo</p>
      </div>

      <ProdutoForm mode="criar" />
    </div>
  );
};
