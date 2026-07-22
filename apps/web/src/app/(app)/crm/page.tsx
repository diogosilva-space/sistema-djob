import { Target } from 'lucide-react';

import { PageActionHeader } from '@/components/dashboard/PageActionHeader';
import { PipelineBoard } from '@/features/crm/components/PipelineBoard';

export default function CrmPage() {
  return (
    <div className="space-y-6 mt-6">
      <PageActionHeader
        icon={Target}
        title="Funil de Vendas"
        subtitle="Gerencie oportunidades e acompanhe as etapas comerciais"
      />
      <PipelineBoard />
    </div>
  );
}
