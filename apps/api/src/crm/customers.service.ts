import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@djob/database';
import { CreateCustomerInput, UpdateCustomerInput } from '@djob/validators';

@Injectable()
export class CustomersService {
  async findAll() {
    return prisma.customer.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Cliente não encontrado');
    return customer;
  }

  async create(tenantId: string, data: CreateCustomerInput) {
    // A RLS vai proteger a inserção, mas o client Prisma tipado exige que o tenantId seja informado (já que a coluna é NOT NULL e não tem default dbgenerated).
    return prisma.customer.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async update(id: string, data: UpdateCustomerInput) {
    await this.findOne(id);
    return prisma.customer.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return prisma.customer.delete({ where: { id } });
  }
}
