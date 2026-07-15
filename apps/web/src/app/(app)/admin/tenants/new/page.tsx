import { Building2 } from 'lucide-react';

import { PageActionHeader } from '@/components/dashboard/PageActionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { TenantForm } from '@/features/admin/components/TenantForm';

export default function NewTenantPage() {
  return (
    <div className="space-y-6">
      <PageActionHeader
        icon={Building2}
        title="Nova empresa"
        subtitle="Crie o ambiente e o primeiro administrador"
        backHref="/admin/tenants"
      />
      <Card>
        <CardContent className="p-6">
          <TenantForm />
        </CardContent>
      </Card>
    </div>
  );
}
