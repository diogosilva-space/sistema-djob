const tenantCreate = jest.fn();
const userCreate = jest.fn();
const tenantFindUnique = jest.fn();
const userFindUnique = jest.fn();
const userUpdate = jest.fn();
const transaction = jest.fn();

jest.mock('@djob/database', () => ({
  Prisma: {
    PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
      code = 'P2002';
    },
  },
  prisma: {
    tenant: { create: tenantCreate, findUnique: tenantFindUnique },
    user: { create: userCreate, findUnique: userFindUnique, update: userUpdate },
    $transaction: transaction,
  },
}));

const hash = jest.fn();

jest.mock('argon2', () => ({ hash }));

import { UnprocessableEntityException } from '@nestjs/common';

import { AdminService } from './admin.service';

describe('AdminService', () => {
  const service = new AdminService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('cria tenant e seu administrador inicial na mesma transação', async () => {
    hash.mockResolvedValue('password-hash');
    tenantCreate.mockResolvedValue({ id: 'tenant-1', name: 'Empresa Teste' });
    userCreate.mockResolvedValue({ id: 'user-1', role: 'ADMIN' });
    transaction.mockImplementation(
      async (
        callback: (client: {
          tenant: { create: typeof tenantCreate };
          user: { create: typeof userCreate };
        }) => unknown,
      ) =>
        callback({
          tenant: { create: tenantCreate },
          user: { create: userCreate },
        }),
    );

    await expect(
      service.createTenant({
        name: 'Empresa Teste',
        slug: 'empresa-teste',
        adminUser: {
          name: 'Ana Admin',
          email: 'ana@empresa.com',
          password: 'SenhaSegura1',
        },
      }),
    ).resolves.toEqual({
      tenant: { id: 'tenant-1', name: 'Empresa Teste' },
      adminUser: { id: 'user-1', role: 'ADMIN' },
    });

    expect(userCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: 'tenant-1',
          email: 'ana@empresa.com',
          passwordHash: 'password-hash',
          role: 'ADMIN',
        }),
      }),
    );
  });

  it('não permite desativar a empresa da plataforma', async () => {
    tenantFindUnique.mockResolvedValue({
      id: 'platform-tenant',
      slug: 'platform',
      isActive: true,
      _count: { users: 1 },
    });

    await expect(service.toggleTenant('platform-tenant')).rejects.toBeInstanceOf(
      UnprocessableEntityException,
    );
  });

  it('não permite alterar um Super Admin', async () => {
    userFindUnique.mockResolvedValue({
      id: 'super-admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    });

    await expect(service.toggleUser('super-admin')).rejects.toBeInstanceOf(
      UnprocessableEntityException,
    );
    expect(userUpdate).not.toHaveBeenCalled();
  });
});
