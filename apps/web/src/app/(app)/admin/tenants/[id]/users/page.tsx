'use client';

import { Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { PageActionHeader } from '@/components/dashboard/PageActionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserTable } from '@/features/admin/components/UserTable';
import type { AdminUser } from '@/features/admin/api/admin.api';
import { useTenant, useTenantUsers, useToggleUser } from '@/features/admin/hooks/useAdminQueries';

export default function TenantUsersPage() {
  const params = useParams<{ id: string }>();
  const { data: tenant } = useTenant(params.id);
  const { data, isLoading, error } = useTenantUsers(params.id, { limit: 50 });
  const toggleUser = useToggleUser();

  function handleToggle(user: AdminUser) {
    const action = user.isActive ? 'desativar' : 'ativar';
    if (!window.confirm(`Deseja ${action} o usuário ${user.name}?`)) return;
    toggleUser.mutate(user.id);
  }

  return (
    <div className="space-y-6">
      <PageActionHeader
        icon={Users}
        title="Usuários"
        subtitle={tenant ? `Acessos de ${tenant.name}` : 'Gerencie os acessos da empresa'}
        backHref="/admin/tenants"
      >
        <Button asChild>
          <Link href={`/admin/tenants/${params.id}/users/new`}>
            <Plus className="h-4 w-4" />
            Novo usuário
          </Link>
        </Button>
      </PageActionHeader>
      <Card>
        <CardContent className="p-0">
          {isLoading && (
            <p className="p-8 text-center text-sm text-muted-foreground">Carregando usuários...</p>
          )}
          {error && (
            <p role="alert" className="p-8 text-center text-sm text-destructive">
              {error.message}
            </p>
          )}
          {data && (
            <UserTable
              users={data.items}
              isToggling={toggleUser.isPending}
              onToggle={handleToggle}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
