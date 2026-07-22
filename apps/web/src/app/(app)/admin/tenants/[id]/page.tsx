'use client';

import { Building2 } from 'lucide-react';
import { useParams } from 'next/navigation';

import { PageActionHeader } from '@/components/dashboard/PageActionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { TenantForm } from '@/features/admin/components/TenantForm';
import { useTenant } from '@/features/admin/hooks/useAdminQueries';

export default function TenantDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data: tenant, isLoading, error } = useTenant(params.id);

  if (isLoading) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Carregando empresa...</p>;
  }

  if (error || !tenant) {
    return (
      <p role="alert" className="py-12 text-center text-sm text-destructive">
        Empresa não encontrada.
      </p>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <PageActionHeader
        icon={Building2}
        title="Editar empresa"
        subtitle={tenant.name}
        backHref="/admin/tenants"
      />
      <Card>
        <CardContent className="p-6">
          <TenantForm tenant={tenant} />
        </CardContent>
      </Card>
    </div>
  );
}
