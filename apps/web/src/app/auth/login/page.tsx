'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@djob/validators';
import { AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
import { AuthShell } from '@/features/auth/components/AuthShell';
import {
  ClearInputButton,
  PasswordVisibilityButton,
} from '@/features/auth/components/InputActions';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuth((state) => state.setAuth);
  const token = useAuth((state) => state.token);
  const user = useAuth((state) => state.user);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (token) {
      router.replace(user?.role === 'SUPER_ADMIN' ? '/admin/tenants' : '/dashboard');
    }
  }, [router, token, user?.role]);

  useEffect(() => {
    if (error) {
      errorRef.current?.focus();
    }
  }, [error]);

  function clearField(name: keyof LoginInput) {
    form.setValue(name, '', { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    requestAnimationFrame(() => form.setFocus(name));
  }

  async function onSubmit(values: LoginInput) {
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        },
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Muitas tentativas. Aguarde um instante antes de tentar novamente.');
        }
        throw new Error('Não foi possível entrar. Confira seus dados e tente novamente.');
      }

      const data = await response.json();
      setAuth(data.user, data.access_token);
      router.push(data.user.role === 'SUPER_ADMIN' ? '/admin/tenants' : '/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell
      title="Bem-vindo de volta"
      description="Informe suas credenciais para acessar o sistema"
    >
      {error && (
        <div
          ref={errorRef}
          role="alert"
          aria-live="assertive"
          tabIndex={-1}
          className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 outline-none"
        >
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
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
                      autoComplete="username"
                      autoFocus
                      autoCapitalize="none"
                      inputMode="email"
                      spellCheck={false}
                      placeholder="seu@email.com"
                      disabled={isLoading}
                      className="pr-9"
                    />
                  </FormControl>
                  {field.value && (
                    <div className="absolute inset-y-0 right-1 flex items-center">
                      <ClearInputButton disabled={isLoading} onClear={() => clearField('email')} />
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs text-muted-foreground">Senha</FormLabel>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type={isPasswordVisible ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="pr-16"
                      onKeyDown={(event) => setIsCapsLockOn(event.getModifierState('CapsLock'))}
                      onKeyUp={(event) => setIsCapsLockOn(event.getModifierState('CapsLock'))}
                      onBlur={() => {
                        field.onBlur();
                        setIsCapsLockOn(false);
                      }}
                    />
                  </FormControl>
                  <div className="absolute inset-y-0 right-1 flex items-center">
                    {field.value && (
                      <ClearInputButton
                        disabled={isLoading}
                        onClear={() => clearField('password')}
                      />
                    )}
                    <PasswordVisibilityButton
                      disabled={isLoading}
                      isVisible={isPasswordVisible}
                      onToggle={() => setIsPasswordVisible((visible) => !visible)}
                    />
                  </div>
                </div>
                {isCapsLockOn && (
                  <p className="text-xs text-warning" role="status">
                    Caps Lock está ativado.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Autenticando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-xs text-muted-foreground">
        Ao entrar, você concorda com os{' '}
        <Link href="/termos-de-uso" target="_blank" className="text-primary hover:underline">
          Termos de Uso
        </Link>{' '}
        e{' '}
        <Link
          href="/politica-de-privacidade"
          target="_blank"
          className="text-primary hover:underline"
        >
          Política de Privacidade
        </Link>
      </p>
    </AuthShell>
  );
}
