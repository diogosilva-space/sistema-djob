'use client';

import { CustomerForm } from '@/features/crm/components/CustomerForm';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, UserPlus, UserCheck } from 'lucide-react';
import { Suspense } from 'react';

function NewCustomerHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get('id');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
          {customerId ? <UserCheck className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {customerId ? 'Editar Registro de Cliente' : 'Novo Cliente'}
          </h1>
          <p className="text-sm text-slate-500">
            {customerId
              ? 'Atualize as informações cadastrais do cliente no CRM'
              : 'Cadastre um novo cliente ou fornecedor no sistema centralizado'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function NewCustomerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Suspense fallback={<div className="text-center py-6">Carregando cabeçalho...</div>}>
        <NewCustomerHeader />
      </Suspense>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <CustomerForm />
      </div>
    </div>
  );
}
