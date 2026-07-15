import { Suspense } from 'react';

import { AuthShell } from '@/features/auth/components/AuthShell';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Definir nova senha"
      description="Crie uma senha nova para voltar a acessar o seu ambiente."
    >
      <Suspense
        fallback={
          <div
            className="h-40 animate-pulse rounded-lg bg-muted"
            aria-label="Carregando formulário"
          />
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
