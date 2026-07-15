'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Users, User, Building, Mail, Phone, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'FISICA' | 'JURIDICA';
};

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'name',
    header: () => (
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Razão Social / Nome
      </span>
    ),
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      const type = row.getValue('type') as string;
      return (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-muted rounded-lg flex items-center justify-center border border-border">
            {type === 'JURIDICA' ? (
              <Building className="h-4.5 w-4.5 text-muted-foreground" />
            ) : (
              <User className="h-4.5 w-4.5 text-muted-foreground" />
            )}
          </div>
          <div>
            <span className="font-semibold text-foreground block">{name}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: () => (
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Tipo de Conta
      </span>
    ),
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            type === 'JURIDICA'
              ? 'bg-blue-50 text-blue-700 border border-blue-100'
              : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
          }`}
        >
          {type === 'JURIDICA' ? 'Pessoa Jurídica' : 'Pessoa Física'}
        </span>
      );
    },
  },
  {
    accessorKey: 'email',
    header: () => (
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        E-mail
      </span>
    ),
    cell: ({ row }) => {
      const email = row.getValue('email') as string;
      if (!email) return <span className="text-muted-foreground text-sm">—</span>;
      return (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-medium">{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'phone',
    header: () => (
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Contato
      </span>
    ),
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string;
      if (!phone) return <span className="text-muted-foreground text-sm">—</span>;
      return (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm tabular-nums font-medium">{phone}</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div className="flex justify-end gap-2">
          <Link href={`/crm/new?id=${customer.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-muted hover:text-foreground active:scale-[0.97] transition-all flex items-center gap-1"
            >
              <span>Gerenciar</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
