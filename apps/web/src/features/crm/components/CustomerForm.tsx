'use client';

import { useEffect, useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCustomerSchema, CreateCustomerInput } from '@djob/validators';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customersService } from '../api/customers.service';
import { useRouter, useSearchParams } from 'next/navigation';

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

function CustomerFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get('id');
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateCustomerInput>({
    resolver: zodResolver(createCustomerSchema) as any,
    defaultValues: {
      type: 'JURIDICA',
      name: '',
      email: '',
      phone: '',
      document: '',
      stateReg: '',
      zipCode: '',
      city: '',
      state: '',
      street: '',
      number: '',
    },
  });

  useEffect(() => {
    if (customerId) {
      const loadCustomer = async () => {
        try {
          setLoading(true);
          const customer = await customersService.getCustomerById(customerId);
          form.reset({
            type: customer.type || 'JURIDICA',
            name: customer.name || '',
            email: customer.email || '',
            phone: customer.phone || '',
            document: customer.document || '',
            stateReg: customer.stateReg || '',
            zipCode: customer.zipCode || '',
            city: customer.city || '',
            state: customer.state || '',
            street: customer.street || '',
            number: customer.number || '',
          });
        } catch (err) {
          console.error('Erro ao carregar cliente', err);
        } finally {
          setLoading(false);
        }
      };
      loadCustomer();
    }
  }, [customerId, form]);

  const mutation = useMutation({
    mutationFn: (data: CreateCustomerInput) => {
      if (customerId) {
        return customersService.updateCustomer(customerId, data);
      }
      return customersService.createCustomer(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      router.push('/crm');
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  function onSubmit(values: CreateCustomerInput) {
    mutation.mutate(values);
  }

  const handleZipCodeBlur = async () => {
    const zipVal = form.getValues('zipCode');
    if (!zipVal || zipVal.replace(/\D/g, '').length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${zipVal}/json/`);
      const data = await res.json();
      if (!data.erro) {
        form.setValue('street', data.logradouro || '');
        form.setValue('city', data.localidade || '');
        form.setValue('state', data.uf || '');
      }
    } catch (err) {
      console.error('Erro ao buscar CEP', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground font-medium">
        Carregando dados do cliente...
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-semibold text-sm">
                  Razão Social / Nome Completo
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-10 border-white/30 dark:border-white/[0.12] focus-visible:ring-ring"
                    placeholder="Ex: Confecções Estrela Ltda"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-semibold text-sm">
                  Regime Fiscal
                </FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-lg border glass-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    {...field}
                  >
                    <option value="JURIDICA">Pessoa Jurídica (CNPJ)</option>
                    <option value="FISICA">Pessoa Física (CPF)</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-semibold text-sm">CNPJ / CPF</FormLabel>
                <FormControl>
                  <Input
                    className="h-10 border-white/30 dark:border-white/[0.12] focus-visible:ring-ring"
                    placeholder="00.000.000/0000-00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stateReg"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-semibold text-sm">
                  Inscrição Estadual
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-10 border-white/30 dark:border-white/[0.12] focus-visible:ring-ring"
                    placeholder="Isento ou Nº"
                    {...field}
                  />
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
                <FormLabel className="text-foreground font-semibold text-sm">
                  E-mail Corporativo
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="h-10 border-white/30 dark:border-white/[0.12] focus-visible:ring-ring"
                    placeholder="financeiro@empresa.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-semibold text-sm">
                  Telefone / WhatsApp
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-10 border-white/30 dark:border-white/[0.12] focus-visible:ring-ring"
                    placeholder="(11) 99999-9999"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t border-white/20 dark:border-white/[0.08] pt-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Endereço e Expedição</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-semibold text-sm">
                    CEP (Auto-completar)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 border-white/30 dark:border-white/[0.12] focus-visible:ring-ring"
                      placeholder="00000-000"
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();
                        handleZipCodeBlur();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-semibold text-sm">Cidade</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 border-white/30 dark:border-white/[0.12] focus-visible:ring-ring"
                      placeholder="São Paulo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-semibold text-sm">
                    Estado (UF)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 border-white/30 dark:border-white/[0.12] focus-visible:ring-ring"
                      placeholder="SP"
                      maxLength={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold text-sm">
                      Logradouro / Avenida
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-10 border-white/30 dark:border-white/[0.12] focus-visible:ring-ring"
                        placeholder="Rua da Consolação"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-semibold text-sm">Número</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 border-white/30 dark:border-white/[0.12] focus-visible:ring-ring"
                      placeholder="123"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/20 dark:border-white/[0.08] pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={mutation.isPending}
            className="border-white/20 dark:border-white/[0.10] hover:bg-white/15 dark:hover:bg-white/[0.06] text-foreground"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold active:scale-[0.98] transition-transform"
          >
            {mutation.isPending
              ? 'Salvando...'
              : customerId
                ? 'Atualizar Cadastro'
                : 'Cadastrar Cliente'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function CustomerForm() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12 text-muted-foreground font-medium">
          Carregando formulário...
        </div>
      }
    >
      <CustomerFormContent />
    </Suspense>
  );
}
