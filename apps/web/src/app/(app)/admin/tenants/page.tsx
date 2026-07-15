'use client';

import { Building2, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { PageActionHeader } from '@/components/dashboard/PageActionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TenantTable } from '@/features/admin/components/TenantTable';
import type { Tenant } from '@/features/admin/api/admin.api';
import { useTenants, useToggleTenant } from '@/features/admin/hooks/useAdminQueries';

export default function TenantsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useTenants({ search, limit: 50 });
  const toggleTenant = useToggleTenant();

  function handleToggle(tenant: Tenant) {
    const action = tenant.isActive ? 'desativar' : 'ativar';
    if (!window.confirm(`Deseja ${action} a empresa ${tenant.name}?`)) return;
    toggleTenant.mutate(tenant.id);
  }

  return (
    <div className="space-y-6">
      <PageActionHeader
        icon={Building2}
        title="Empresas"
        subtitle="Gerencie os ambientes e administradores da plataforma"
      >
        <Button asChild>
          <Link href="/admin/tenants/new">
            <Plus className="h-4 w-4" />
            Nova empresa
          </Link>
        </Button>
      </PageActionHeader>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar empresa, CNPJ ou e-mail"
              className="pl-8"
            />
          </div>
        </CardContent>
        <CardContent className="border-t p-0">
          {isLoading && (
            <p className="p-8 text-center text-sm text-muted-foreground">Carregando empresas...</p>
          )}
          {error && (
            <p role="alert" className="p-8 text-center text-sm text-destructive">
              {error.message}
            </p>
          )}
          {data && (
            <TenantTable
              tenants={data.items}
              isToggling={toggleTenant.isPending}
              onToggle={handleToggle}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
