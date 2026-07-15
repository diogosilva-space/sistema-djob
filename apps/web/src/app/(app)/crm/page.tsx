'use client';

import { useQuery } from '@tanstack/react-query';
import { customersService } from '@/features/crm/api/customers.service';
import { columns, Customer } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, UserPlus } from 'lucide-react';

export default function CrmPage() {
  const {
    data: customers,
    isLoading,
    isError,
  } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: () => customersService.getCustomers(),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Clientes & Contatos</h1>
            <p className="text-sm text-slate-500">
              Pipeline de CRM, controle de contas de clientes e fornecedores cadastrados
            </p>
          </div>
        </div>
        <Link href="/crm/new">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 active:scale-[0.98] transition-transform">
            <UserPlus className="h-4 w-4" />
            <span>Novo Cliente</span>
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            Carregando cadastro de clientes...
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-red-500 font-medium border-red-100 bg-red-50/50">
            Não foi possível carregar os clientes. Verifique a conexão com o servidor.
          </div>
        ) : (
          <DataTable columns={columns} data={customers || []} />
        )}
      </div>
    </div>
  );
}
