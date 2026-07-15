'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Plus, Search, Users } from 'lucide-react';

import { PageActionHeader } from '@/components/dashboard/PageActionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { contactsApi } from '@/features/crm/api/contacts.api';

export default function ContactsPage() {
  const [search, setSearch] = useState('');
  const contacts = useQuery({
    queryKey: ['contacts', search],
    queryFn: () => contactsApi.getAll(search.trim() ? { search: search.trim() } : {}),
  });

  return (
    <div className="space-y-6">
      <PageActionHeader icon={Users} title="Contatos" subtitle="Base de clientes e fornecedores do ERP">
        <Link href="/contacts/new">
          <Button><Plus className="h-4 w-4" />Novo contato</Button>
        </Link>
      </PageActionHeader>
      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="border-b border-border p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome, documento ou e-mail" />
          </div>
        </div>
        {contacts.isLoading ? <p className="p-8 text-center text-sm text-muted-foreground">Carregando contatos...</p> : null}
        {contacts.isError ? <p className="p-8 text-center text-sm text-destructive">Não foi possível carregar os contatos.</p> : null}
        {contacts.data && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-4 py-3">Contato</th><th className="px-4 py-3">Papel</th><th className="px-4 py-3">Documento</th><th className="px-4 py-3">Localidade</th><th className="px-4 py-3" /></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contacts.data.map((contact) => (
                  <tr key={contact.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3"><Link href={`/contacts/${contact.id}`} className="flex items-center gap-3 font-medium text-foreground hover:text-primary"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">{contact.type === 'JURIDICA' ? <Building2 className="h-4 w-4" /> : <Users className="h-4 w-4" />}</span>{contact.name}</Link></td>
                    <td className="px-4 py-3"><span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{contact.role === 'CLIENT' ? 'Cliente' : contact.role === 'SUPPLIER' ? 'Fornecedor' : 'Ambos'}</span></td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{contact.document ?? '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{[contact.city, contact.state].filter(Boolean).join('/') || '—'}</td>
                    <td className="px-4 py-3 text-right"><Link href={`/contacts/${contact.id}`} className="text-xs font-medium text-primary hover:underline">Ver 360°</Link></td>
                  </tr>
                ))}
                {contacts.data.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-sm text-muted-foreground">Nenhum contato cadastrado.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
