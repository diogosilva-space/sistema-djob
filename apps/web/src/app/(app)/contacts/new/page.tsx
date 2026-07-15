'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';

import { PageActionHeader } from '@/components/dashboard/PageActionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { contactsApi } from '@/features/crm/api/contacts.api';

export default function NewContactPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    role: 'CLIENT',
    type: 'JURIDICA',
    email: '',
    mobile: '',
    document: '',
  });
  const create = useMutation({
    mutationFn: contactsApi.create,
    onSuccess: (contact) => router.push(`/contacts/${contact.id}`),
  });
  const change =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((current) => ({ ...current, [field]: event.target.value }));

  return (
    <div className="space-y-6">
      <PageActionHeader
        icon={UserPlus}
        title="Novo contato"
        subtitle="Cadastre um cliente, fornecedor ou ambos"
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          create.mutate(form);
        }}
        className="rounded-lg border border-border bg-card p-5 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Nome / razão social
            <Input value={form.name} onChange={change('name')} required />
          </label>
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Papel
            <select
              value={form.role}
              onChange={change('role')}
              className="h-8 rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="CLIENT">Cliente</option>
              <option value="SUPPLIER">Fornecedor</option>
              <option value="BOTH">Cliente e fornecedor</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Tipo
            <select
              value={form.type}
              onChange={change('type')}
              className="h-8 rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="JURIDICA">Pessoa jurídica</option>
              <option value="FISICA">Pessoa física</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-foreground">
            CPF / CNPJ
            <Input value={form.document} onChange={change('document')} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-foreground">
            E-mail
            <Input type="email" value={form.email} onChange={change('email')} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Celular / WhatsApp
            <Input value={form.mobile} onChange={change('mobile')} />
          </label>
        </div>
        {create.isError && (
          <p className="mt-4 text-sm text-destructive">Não foi possível criar o contato.</p>
        )}
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? 'Salvando...' : 'Salvar contato'}
          </Button>
        </div>
      </form>
    </div>
  );
}
