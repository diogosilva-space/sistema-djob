import type { PasswordResetConfirmInput, PasswordResetRequestInput } from '@djob/validators';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const AUTH_API_URL = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

interface AuthMessageResponse {
  message: string;
}

export class PublicAuthApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function publicAuthRequest<TResponse>(path: string, body: unknown): Promise<TResponse> {
  let response: Response;

  try {
    response = await fetch(`${AUTH_API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new PublicAuthApiError(
      'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
      0,
    );
  }

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new PublicAuthApiError(
      data?.message ?? 'Não foi possível concluir sua solicitação.',
      response.status,
    );
  }

  return response.json() as Promise<TResponse>;
}

export function requestPasswordReset(values: PasswordResetRequestInput) {
  return publicAuthRequest<AuthMessageResponse>('/auth/password-reset/request', values);
}

export function confirmPasswordReset(values: PasswordResetConfirmInput) {
  return publicAuthRequest<AuthMessageResponse>('/auth/password-reset/confirm', values);
}
