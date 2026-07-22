'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { contactsApi } from '@/features/crm/api/contacts.api';

interface CreateOpportunityModalProps {
  onCancel: () => void;
  onCreate: (data: {
    name: string;
    contactId?: string;
    value: number;
    probability: number;
  }) => void;
  isPending?: boolean;
}

export function CreateOpportunityModal({
  onCancel,
  onCreate,
  isPending,
}: CreateOpportunityModalProps) {
  const [name, setName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [value, setValue] = useState('0');
  const [probability, setProbability] = useState('50');
  const { data: customers = [] } = useQuery({
    queryKey: ['contacts', 'clients'],
    queryFn: () => contactsApi.getAll({ role: 'CLIENT' }),
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCreate({
      name,
      contactId: customerId || undefined,
      value: Number(value),
      probability: Number(probability),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl glass-card-elevated p-6"
      >
        <h2 className="text-base font-semibold text-foreground">Nova oportunidade</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Registre a próxima negociação no pipeline.
        </p>
        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Nome da oportunidade
            <Input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Cliente
            <select
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
              className="flex h-8 w-full rounded-lg border glass-input px-3 text-sm text-foreground"
            >
              <option value="">Selecione depois</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Valor estimado
              <Input
                type="number"
                min="0"
                step="0.01"
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Probabilidade (%)
              <Input
                type="number"
                min="0"
                max="100"
                value={probability}
                onChange={(event) => setProbability(event.target.value)}
              />
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Criando...' : 'Criar oportunidade'}
          </Button>
        </div>
      </form>
    </div>
  );
}
