'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { createAdminUserSchema, type CreateAdminUserInput } from '@djob/validators';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type Resolver, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useCreateUser } from '../hooks/useAdminQueries';

interface UserFormProps {
  tenantId: string;
}

export function UserForm({ tenantId }: UserFormProps) {
  const router = useRouter();
  const createUser = useCreateUser();
  const form = useForm<CreateAdminUserInput>({
    resolver: zodResolver(createAdminUserSchema) as Resolver<CreateAdminUserInput>,
    defaultValues: { name: '', email: '', password: '', role: 'OPERATOR' },
    mode: 'onSubmit',
  });

  function onSubmit(values: CreateAdminUserInput) {
    createUser.mutate(
      { tenantId, values },
      {
        onSuccess: () => router.push(`/admin/tenants/${tenantId}/users`),
        onError: (error: Error) => form.setError('root', { message: error.message }),
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {form.formState.errors.root && (
          <p role="alert" className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input {...field} autoFocus />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input {...field} type="email" autoComplete="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha inicial</FormLabel>
                <FormControl>
                  <Input {...field} type="password" autoComplete="new-password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perfil de acesso</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="flex h-8 w-full rounded-lg border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="ADMIN">Administrador</option>
                    <option value="MANAGER">Gerente</option>
                    <option value="SELLER">Vendedor</option>
                    <option value="OPERATOR">Operador</option>
                    <option value="VIEWER">Visualizador</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-3 border-t pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={createUser.isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={createUser.isPending}>
            {createUser.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Criar usuário
          </Button>
        </div>
      </form>
    </Form>
  );
}
