const userFindUnique = jest.fn();
const userUpdate = jest.fn();
const passwordResetTokenFindFirst = jest.fn();
const passwordResetTokenDelete = jest.fn();
const transaction = jest.fn();

const transactionPasswordResetTokenCreate = jest.fn();
const transactionPasswordResetTokenUpdateMany = jest.fn();
const transactionUserUpdate = jest.fn();

jest.mock('@djob/database', () => ({
  prisma: {
    user: { findUnique: userFindUnique, update: userUpdate },
    passwordResetToken: {
      findFirst: passwordResetTokenFindFirst,
      delete: passwordResetTokenDelete,
    },
    $transaction: transaction,
  },
}));

const hash = jest.fn();
const verify = jest.fn();

jest.mock('argon2', () => ({
  hash,
  verify,
}));

import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PasswordResetMailService } from '../mail/password-reset-mail.service';
import { AuthService } from './auth.service';

const transactionClient = {
  passwordResetToken: {
    create: transactionPasswordResetTokenCreate,
    updateMany: transactionPasswordResetTokenUpdateMany,
  },
  user: {
    update: transactionUserUpdate,
  },
};

describe('AuthService password reset', () => {
  const jwtService = { sign: jest.fn() } as unknown as JwtService;
  const passwordResetMailService = {
    isConfigured: jest.fn(),
    sendPasswordReset: jest.fn(),
  } as unknown as PasswordResetMailService;
  const service = new AuthService(jwtService, passwordResetMailService);

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.APP_WEB_URL = 'https://app.djob.com.br';
    process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES = '60';

    transaction.mockImplementation(
      async (callback: (client: typeof transactionClient) => Promise<unknown>) =>
        callback(transactionClient),
    );
  });

  afterAll(() => {
    delete process.env.APP_WEB_URL;
    delete process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES;
  });

  it('não revela se o email não existe ao solicitar recuperação', async () => {
    (passwordResetMailService.isConfigured as jest.Mock).mockReturnValue(true);
    userFindUnique.mockResolvedValue(null);

    await expect(
      service.requestPasswordReset({ email: 'inexistente@empresa.com' }),
    ).resolves.toEqual({
      message:
        'Se houver uma conta ativa com estes dados, enviaremos as instruções de recuperação.',
    });

    expect(passwordResetMailService.sendPasswordReset).not.toHaveBeenCalled();
  });

  it('não cria token quando o envio de e-mail está indisponível', async () => {
    (passwordResetMailService.isConfigured as jest.Mock).mockReturnValue(false);

    await expect(
      service.requestPasswordReset({ email: 'usuario@empresa.com' }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);

    expect(userFindUnique).not.toHaveBeenCalled();
  });

  it('persiste somente o hash e envia o token opaco no link de recuperação', async () => {
    (passwordResetMailService.isConfigured as jest.Mock).mockReturnValue(true);
    userFindUnique.mockResolvedValue({
      id: 'user-1',
      name: 'Diogo',
      email: 'usuario@empresa.com',
      isActive: true,
      tenant: { id: 'tenant-1', isActive: true },
    });
    transactionPasswordResetTokenCreate.mockResolvedValue({ id: 'reset-1' });
    transactionPasswordResetTokenUpdateMany.mockResolvedValue({ count: 0 });
    (passwordResetMailService.sendPasswordReset as jest.Mock).mockResolvedValue(undefined);

    await service.requestPasswordReset({ email: 'usuario@empresa.com' });

    const createInput = transactionPasswordResetTokenCreate.mock.calls[0][0];
    const mailInput = (passwordResetMailService.sendPasswordReset as jest.Mock).mock.calls[0][0];
    const rawToken = new URL(mailInput.resetUrl).searchParams.get('token');

    expect(createInput.data.tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(rawToken).toMatch(/^[a-f0-9]{64}$/);
    expect(createInput.data.tokenHash).not.toBe(rawToken);
  });

  it('redefine a senha uma única vez e remove o bloqueio da conta', async () => {
    passwordResetTokenFindFirst.mockResolvedValue({ id: 'reset-1', userId: 'user-1' });
    transactionPasswordResetTokenUpdateMany
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 0 });
    hash.mockResolvedValue('novo-hash');

    await expect(
      service.confirmPasswordReset({
        token: 'a'.repeat(64),
        password: 'uma-nova-senha',
      }),
    ).resolves.toEqual({
      message: 'Senha redefinida com sucesso. Entre usando sua nova senha.',
    });

    expect(transactionUserUpdate).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: {
        passwordHash: 'novo-hash',
        failedAttempts: 0,
        lockedUntil: null,
      },
    });
  });

  it('rejeita token inexistente, expirado ou já utilizado', async () => {
    passwordResetTokenFindFirst.mockResolvedValue(null);

    await expect(
      service.confirmPasswordReset({
        token: 'a'.repeat(64),
        password: 'uma-nova-senha',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
