'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { passwordResetFormSchema, type PasswordResetFormInput } from '@djob/validators';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
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
import { confirmPasswordReset, PublicAuthApiError } from '@/features/auth/api/auth.api';
import { ClearInputButton, PasswordVisibilityButton } from './InputActions';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const form = useForm<PasswordResetFormInput>({
    resolver: zodResolver(passwordResetFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });
  const mutation = useMutation({
    mutationFn: confirmPasswordReset,
  });
  const isPending = mutation.isPending;

  function clearField(name: keyof PasswordResetFormInput) {
    form.setValue(name, '', { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    requestAnimationFrame(() => form.setFocus(name));
  }

  function onSubmit(values: PasswordResetFormInput) {
    if (!token) {
      return;
    }

    mutation.mutate({ token, password: values.password });
  }

  if (!token) {
    return (
      <div className="space-y-5">
        <div
          role="alert"
          className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive"
        >
          O link de recuperação está incompleto ou é inválido.
        </div>
        <Button asChild className="w-full">
          <Link href="/auth/forgot-password">Solicitar um novo link</Link>
        </Button>
      </div>
    );
  }

  if (mutation.isSuccess) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-success/25 bg-success/10 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            <p className="text-sm leading-relaxed text-foreground">{mutation.data.message}</p>
          </div>
        </div>
        <Button asChild className="w-full">
          <Link href="/auth/login">Entrar com a nova senha</Link>
        </Button>
      </div>
    );
  }

  return (
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
              : 'Não foi possível redefinir sua senha.'}
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">Nova senha</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type={isPasswordVisible ? 'text' : 'password'}
                      autoComplete="new-password"
                      autoFocus
                      placeholder="Mínimo de 8 caracteres"
                      disabled={isPending}
                      className="pr-16"
                    />
                  </FormControl>
                  <div className="absolute inset-y-0 right-1 flex items-center">
                    {field.value && (
                      <ClearInputButton
                        disabled={isPending}
                        onClear={() => clearField('password')}
                      />
                    )}
                    <PasswordVisibilityButton
                      disabled={isPending}
                      isVisible={isPasswordVisible}
                      onToggle={() => setIsPasswordVisible((visible) => !visible)}
                    />
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">
                  Confirmar nova senha
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type={isConfirmationVisible ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Repita a nova senha"
                      disabled={isPending}
                      className="pr-16"
                    />
                  </FormControl>
                  <div className="absolute inset-y-0 right-1 flex items-center">
                    {field.value && (
                      <ClearInputButton
                        disabled={isPending}
                        onClear={() => clearField('confirmPassword')}
                      />
                    )}
                    <PasswordVisibilityButton
                      disabled={isPending}
                      isVisible={isConfirmationVisible}
                      onToggle={() => setIsConfirmationVisible((visible) => !visible)}
                    />
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-2" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redefinindo...
              </>
            ) : (
              'Redefinir senha'
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-xs text-muted-foreground">
        Sua nova senha deve ter pelo menos 8 caracteres.
      </p>
    </>
  );
}
