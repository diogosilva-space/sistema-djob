'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { passwordResetRequestSchema, type PasswordResetRequestInput } from '@djob/validators';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
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
import { PublicAuthApiError, requestPasswordReset } from '@/features/auth/api/auth.api';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { ClearInputButton } from '@/features/auth/components/InputActions';

export default function ForgotPasswordPage() {
  const form = useForm<PasswordResetRequestInput>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  });
  const mutation = useMutation({
    mutationFn: requestPasswordReset,
  });
  const isPending = mutation.isPending;

  function clearField(name: keyof PasswordResetRequestInput) {
    form.setValue(name, '', { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    requestAnimationFrame(() => form.setFocus(name));
  }

  function onSubmit(values: PasswordResetRequestInput) {
    mutation.mutate(values);
  }

  return (
    <AuthShell
      title="Recuperar acesso"
      description="Informe seu e-mail para receber as instruções de recuperação."
    >
      {mutation.isSuccess ? (
        <div className="space-y-6">
          <div className="rounded-lg border border-success/25 bg-success/10 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              <p className="text-sm leading-relaxed text-foreground">{mutation.data.message}</p>
            </div>
          </div>
          <Button asChild className="w-full">
            <Link href="/auth/login">Voltar para entrar</Link>
          </Button>
        </div>
      ) : (
        <>
          {mutation.isError && (
            <div
              role="alert"
              aria-live="assertive"
              className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
            >
              <p className="text-sm text-destructive">
                {mutation.error instanceof PublicAuthApiError
                  ? mutation.error.message
                  : 'Não foi possível solicitar a recuperação de senha.'}
              </p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">E-mail</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          autoComplete="email"
                          autoFocus
                          autoCapitalize="none"
                          inputMode="email"
                          spellCheck={false}
                          placeholder="seu@email.com"
                          disabled={isPending}
                          className="pr-9"
                        />
                      </FormControl>
                      {field.value && (
                        <div className="absolute inset-y-0 right-1 flex items-center">
                          <ClearInputButton
                            disabled={isPending}
                            onClear={() => clearField('email')}
                          />
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-2" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar instruções'
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar para entrar
            </Link>
          </div>
        </>
      )}
    </AuthShell>
  );
}
