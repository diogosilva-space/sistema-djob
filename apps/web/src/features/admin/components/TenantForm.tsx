'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  createPlatformTenantSchema,
  type CreatePlatformTenantInput,
  type UpdatePlatformTenantInput,
  updatePlatformTenantSchema,
} from '@djob/validators';
import type { Resolver } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

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

import type { Tenant } from '../api/admin.api';
import { useCreateTenant, useUpdateTenant } from '../hooks/useAdminQueries';

interface TenantFormProps {
  tenant?: Tenant;
}

const defaultAdmin = { name: '', email: '', password: '' };

function tenantValues(tenant?: Tenant): CreatePlatformTenantInput {
  return {
    name: tenant?.name ?? '',
    slug: tenant?.slug ?? '',
    document: tenant?.document ?? '',
    tradeName: tenant?.tradeName ?? '',
    stateReg: tenant?.stateReg ?? '',
    phone: tenant?.phone ?? '',
    email: tenant?.email ?? '',
    website: tenant?.website ?? '',
    logo: tenant?.logo ?? '',
    zipCode: tenant?.zipCode ?? '',
    street: tenant?.street ?? '',
    number: tenant?.number ?? '',
    complement: tenant?.complement ?? '',
    neighborhood: tenant?.neighborhood ?? '',
    city: tenant?.city ?? '',
    state: tenant?.state ?? '',
    adminUser: defaultAdmin,
  };
}

export function TenantForm({ tenant }: TenantFormProps) {
  const router = useRouter();
  const createTenant = useCreateTenant();
  const updateTenant = useUpdateTenant();
  const isEditing = Boolean(tenant);
  const mutationPending = createTenant.isPending || updateTenant.isPending;

  const form = useForm<CreatePlatformTenantInput>({
    resolver: (isEditing
      ? zodResolver(updatePlatformTenantSchema)
      : zodResolver(createPlatformTenantSchema)) as Resolver<CreatePlatformTenantInput>,
    defaultValues: tenantValues(tenant),
    mode: 'onSubmit',
  });

  async function completeAddress() {
    const zipCode = form.getValues('zipCode')?.replace(/\D/g, '');
    if (!zipCode || zipCode.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
      const address = (await response.json()) as {
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      };
      if (!address.erro) {
        form.setValue('street', address.logradouro ?? '');
        form.setValue('neighborhood', address.bairro ?? '');
        form.setValue('city', address.localidade ?? '');
        form.setValue('state', address.uf ?? '');
      }
    } catch {
      form.setError('zipCode', { message: 'Não foi possível consultar o CEP.' });
    }
  }

  function onSubmit(values: CreatePlatformTenantInput) {
    if (tenant) {
      const { adminUser: _adminUser, ...updateValues } = values;
      updateTenant.mutate(
        { id: tenant.id, values: updateValues as UpdatePlatformTenantInput },
        {
          onSuccess: () => router.push('/admin/tenants'),
          onError: (error: Error) => form.setError('root', { message: error.message }),
        },
      );
      return;
    }

    createTenant.mutate(values, {
      onSuccess: () => router.push('/admin/tenants'),
      onError: (error: Error) => form.setError('root', { message: error.message }),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7" noValidate>
        {form.formState.errors.root && (
          <p role="alert" className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}

        <section className="space-y-4">
          <div>
            <h2 className="font-semibold">Dados da empresa</h2>
            <p className="text-sm text-muted-foreground">
              Informações de identificação e contato comercial.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field control={form.control} name="name" label="Razão social" autoFocus />
            <Field control={form.control} name="tradeName" label="Nome fantasia" />
            <Field
              control={form.control}
              name="slug"
              label="Identificador da empresa"
              placeholder="minha-empresa"
            />
            <Field
              control={form.control}
              name="document"
              label="CNPJ"
              placeholder="00.000.000/0000-00"
            />
            <Field control={form.control} name="stateReg" label="Inscrição estadual" />
            <Field control={form.control} name="phone" label="Telefone" />
            <Field control={form.control} name="email" label="E-mail comercial" type="email" />
            <Field control={form.control} name="website" label="Website" type="url" />
            <Field
              control={form.control}
              name="logo"
              label="URL do logo"
              className="md:col-span-2"
            />
          </div>
        </section>

        <section className="space-y-4 border-t pt-6">
          <div>
            <h2 className="font-semibold">Endereço</h2>
            <p className="text-sm text-muted-foreground">
              O CEP preenche automaticamente os dados disponíveis.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="00000-000"
                      onBlur={(event) => {
                        field.onBlur();
                        void completeAddress();
                        event.currentTarget.value = event.currentTarget.value;
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Field control={form.control} name="city" label="Cidade" />
            <Field control={form.control} name="state" label="UF" maxLength={2} />
            <Field
              control={form.control}
              name="street"
              label="Logradouro"
              className="md:col-span-2"
            />
            <Field control={form.control} name="number" label="Número" />
            <Field control={form.control} name="complement" label="Complemento" />
            <Field control={form.control} name="neighborhood" label="Bairro" />
          </div>
        </section>

        {!isEditing && (
          <section className="space-y-4 border-t pt-6">
            <div>
              <h2 className="font-semibold">Primeiro administrador</h2>
              <p className="text-sm text-muted-foreground">
                Essa pessoa terá acesso administrativo à empresa.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field control={form.control} name="adminUser.name" label="Nome completo" />
              <Field
                control={form.control}
                name="adminUser.email"
                label="E-mail de acesso"
                type="email"
              />
              <Field
                control={form.control}
                name="adminUser.password"
                label="Senha inicial"
                type="password"
              />
            </div>
          </section>
        )}

        <div className="flex justify-end gap-3 border-t pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={mutationPending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={mutationPending}>
            {mutationPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditing ? 'Salvar alterações' : 'Criar empresa'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface FieldProps {
  control: ReturnType<typeof useForm<CreatePlatformTenantInput>>['control'];
  name:
    | 'name'
    | 'tradeName'
    | 'slug'
    | 'document'
    | 'stateReg'
    | 'phone'
    | 'email'
    | 'website'
    | 'logo'
    | 'city'
    | 'state'
    | 'street'
    | 'number'
    | 'complement'
    | 'neighborhood'
    | 'adminUser.name'
    | 'adminUser.email'
    | 'adminUser.password';
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  maxLength?: number;
}

function Field({ control, name, label, className, ...inputProps }: FieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} {...inputProps} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
