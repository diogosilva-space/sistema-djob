import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { prisma } from '@djob/database';
import { CreateTenantInput, UpdateTenantInput } from '@djob/validators';

@Injectable()
export class TenantService {
  async findAll() {
    return prisma.tenant.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw new NotFoundException('Tenant não encontrado');
    return tenant;
  }

  async create(data: CreateTenantInput) {
    const exists = await prisma.tenant.findUnique({ where: { slug: data.slug } });
    if (exists) throw new ConflictException('Já existe um tenant com este slug');

    return prisma.tenant.create({ data });
  }

  async update(id: string, data: UpdateTenantInput) {
    await this.findOne(id);

    if (data.slug) {
      const exists = await prisma.tenant.findUnique({ where: { slug: data.slug } });
      if (exists && exists.id !== id) {
        throw new ConflictException('Já existe outro tenant com este slug');
      }
    }

    return prisma.tenant.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    // Hard delete for now, in a real scenario we might prefer soft delete (isActive: false)
    return prisma.tenant.delete({ where: { id } });
  }
}
