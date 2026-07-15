'use client';

import { Target } from 'lucide-react';
import { useParams } from 'next/navigation';

import { PageActionHeader } from '@/components/dashboard/PageActionHeader';
import { OpportunityDetail } from '@/features/crm/components/OpportunityDetail';

export default function OpportunityPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="space-y-6">
      <PageActionHeader
        icon={Target}
        title="Detalhe da oportunidade"
        subtitle="Atividades, contato e próximos follow-ups"
      />
      <OpportunityDetail id={id} />
    </div>
  );
}
