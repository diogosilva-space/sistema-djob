import { Target } from 'lucide-react';

import { PageActionHeader } from '@/components/dashboard/PageActionHeader';
import { PipelineBoard } from '@/features/crm/components/PipelineBoard';

export default function CrmPage() {
  return (
    <div className="space-y-6">
      <PageActionHeader
        icon={Target}
        title="Pipeline de Vendas"
        subtitle="Gerencie oportunidades e acompanhe o funil comercial"
      />
      <PipelineBoard />
    </div>
  );
}
