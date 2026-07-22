'use client';

import { CustomerForm } from '@/features/crm/components/CustomerForm';
import { useSearchParams } from 'next/navigation';
import { UserPlus, UserCheck } from 'lucide-react';
import { Suspense } from 'react';
import { PageActionHeader } from '@/components/dashboard/PageActionHeader';

function NewCustomerHeader() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get('id');

  return (
    <PageActionHeader
      icon={customerId ? UserCheck : UserPlus}
      backHref="/crm"
      title={customerId ? 'Editar Registro de Cliente' : 'Novo Cliente'}
      subtitle={
        customerId
          ? 'Atualize as informações cadastrais do cliente no CRM'
          : 'Cadastre um novo cliente ou fornecedor no sistema centralizado'
      }
    />
  );
}

export default function NewCustomerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-6">
      <Suspense fallback={<div className="text-center py-6">Carregando cabeçalho...</div>}>
        <NewCustomerHeader />
      </Suspense>

      <div className="rounded-xl glass-card p-8">
        <CustomerForm />
      </div>
    </div>
  );
}
