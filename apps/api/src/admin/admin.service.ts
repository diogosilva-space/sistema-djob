import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma, prisma } from '@djob/database';
import * as argon2 from 'argon2';

import {
  CreateAdminUserInput,
  CreatePlatformTenantInput,
  UpdateAdminUserInput,
  UpdatePlatformTenantInput,
} from '@djob/validators';

const userSelect = {
  id: true,
  tenantId: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class AdminService {
  async listTenants(search: string | undefined, page: number, limit: number) {
    const where: Prisma.TenantWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { tradeName: { contains: search, mode: 'insensitive' } },
            { document: { contains: search } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [items, total] = await prisma.$transaction([
      prisma.tenant.findMany({
        where,
        include: { _count: { select: { users: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.tenant.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async createTenant(data: CreatePlatformTenantInput) {
    try {
      const passwordHash = await argon2.hash(data.adminUser.password);

      return await prisma.$transaction(async (transaction) => {
        const tenant = await transaction.tenant.create({
          data: {
            name: data.name,
            slug: data.slug,
            document: data.document,
            tradeName: data.tradeName,
            stateReg: data.stateReg,
            phone: data.phone,
            email: data.email,
            website: data.website,
            logo: data.logo,
            zipCode: data.zipCode,
            street: data.street,
            number: data.number,
            complement: data.complement,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
          },
        });

        const adminUser = await transaction.user.create({
          data: {
            tenantId: tenant.id,
            name: data.adminUser.name,
            email: data.adminUser.email,
            passwordHash,
            role: 'ADMIN',
          },
          select: userSelect,
        });

        return { tenant, adminUser };
      });
    } catch (error: unknown) {
      this.rethrowUniqueConstraint(error);
    }
  }

  async getTenant(id: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    });

    if (!tenant) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    return tenant;
  }

  async updateTenant(id: string, data: UpdatePlatformTenantInput) {
    await this.getTenant(id);

    try {
      return await prisma.tenant.update({ where: { id }, data });
    } catch (error: unknown) {
      this.rethrowUniqueConstraint(error);
    }
  }

  async toggleTenant(id: string) {
    const tenant = await this.getTenant(id);

    if (tenant.slug === 'platform') {
      throw new UnprocessableEntityException('A empresa da plataforma não pode ser desativada.');
    }

    return prisma.tenant.update({
      where: { id },
      data: { isActive: !tenant.isActive },
    });
  }

  async listUsers(tenantId: string, search: string | undefined, page: number, limit: number) {
    await this.getTenant(tenantId);

    const where: Prisma.UserWhereInput = {
      tenantId,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: userSelect,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async createUser(tenantId: string, data: CreateAdminUserInput) {
    await this.getTenant(tenantId);

    try {
      return await prisma.user.create({
        data: {
          tenantId,
          name: data.name,
          email: data.email,
          passwordHash: await argon2.hash(data.password),
          role: data.role,
        },
        select: userSelect,
      });
    } catch (error: unknown) {
      this.rethrowUniqueConstraint(error);
    }
  }

  async updateUser(id: string, data: UpdateAdminUserInput) {
    const user = await this.getNonPlatformUser(id);
    return prisma.user.update({
      where: { id: user.id },
      data,
      select: userSelect,
    });
  }

  async toggleUser(id: string) {
    const user = await this.getNonPlatformUser(id);
    return prisma.user.update({
      where: { id: user.id },
      data: { isActive: !user.isActive },
      select: userSelect,
    });
  }

  private async getNonPlatformUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id }, select: userSelect });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (user.role === 'SUPER_ADMIN') {
      throw new UnprocessableEntityException(
        'O Super Admin deve ser administrado pela infraestrutura.',
      );
    }

    return user;
  }

  private rethrowUniqueConstraint(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictException('Já existe um registro com estes dados.');
    }

    throw error;
  }
}
