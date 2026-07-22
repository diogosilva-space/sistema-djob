'use client';

import { UserPlus } from 'lucide-react';
import { useParams } from 'next/navigation';

import { PageActionHeader } from '@/components/dashboard/PageActionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { UserForm } from '@/features/admin/components/UserForm';

export default function NewTenantUserPage() {
  const params = useParams<{ id: string }>();

  return (
    <div className="space-y-6 mt-6">
      <PageActionHeader
        icon={UserPlus}
        title="Novo usuário"
        subtitle="Crie um acesso para esta empresa"
        backHref={`/admin/tenants/${params.id}/users`}
      />
      <Card>
        <CardContent className="p-6">
          <UserForm tenantId={params.id} />
        </CardContent>
      </Card>
    </div>
  );
}
