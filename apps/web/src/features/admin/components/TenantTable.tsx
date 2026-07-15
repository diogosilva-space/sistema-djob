'use client';

import Link from 'next/link';
import { Building2, Loader2, Pencil, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { Tenant } from '../api/admin.api';

interface TenantTableProps {
  tenants: Tenant[];
  isToggling: boolean;
  onToggle: (tenant: Tenant) => void;
}

export function TenantTable({ tenants, isToggling, onToggle }: TenantTableProps) {
  if (!tenants.length) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Nenhuma empresa encontrada.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Empresa</TableHead>
          <TableHead className="hidden md:table-cell">CNPJ</TableHead>
          <TableHead className="hidden lg:table-cell">Cidade</TableHead>
          <TableHead>Usuários</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenants.map((tenant) => (
          <TableRow key={tenant.id}>
            <TableCell>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{tenant.tradeName || tenant.name}</p>
                  <p className="text-xs text-muted-foreground">{tenant.name}</p>
                </div>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground">
              {tenant.document || '—'}
            </TableCell>
            <TableCell className="hidden lg:table-cell text-muted-foreground">
              {[tenant.city, tenant.state].filter(Boolean).join(' / ') || '—'}
            </TableCell>
            <TableCell>{tenant._count?.users ?? 0}</TableCell>
            <TableCell>
              <StatusBadge status={tenant.isActive ? 'success' : 'neutral'}>
                {tenant.isActive ? 'Ativa' : 'Inativa'}
              </StatusBadge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  aria-label={`Ver usuários de ${tenant.name}`}
                >
                  <Link href={`/admin/tenants/${tenant.id}/users`}>
                    <Users className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon" aria-label={`Editar ${tenant.name}`}>
                  <Link href={`/admin/tenants/${tenant.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isToggling || tenant.slug === 'platform'}
                  onClick={() => onToggle(tenant)}
                >
                  {isToggling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : tenant.isActive ? (
                    'Desativar'
                  ) : (
                    'Ativar'
                  )}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
