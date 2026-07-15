import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@djob/database';
import { ContactListQuery, CreateContactInput, UpdateContactInput } from '@djob/validators';

@Injectable()
export class ContactsService {
  async findAll(tenantId: string, query: ContactListQuery) {
    return prisma.contact.findMany({
      where: {
        tenantId,
        ...(query.role
          ? query.role === 'BOTH'
            ? { role: 'BOTH' }
            : { role: { in: [query.role, 'BOTH'] } }
          : {}),
        ...(query.isActive === undefined ? {} : { isActive: query.isActive }),
        ...(query.search
          ? {
              OR: [
                { name: { contains: query.search, mode: 'insensitive' } },
                { tradeName: { contains: query.search, mode: 'insensitive' } },
                { document: { contains: query.search } },
                { email: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const contact = await prisma.contact.findFirst({
      where: { id, tenantId },
      include: {
        opportunities: {
          include: { seller: { select: { id: true, name: true } } },
          orderBy: { updatedAt: 'desc' },
        },
        activities: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { occurredAt: 'desc' },
          take: 20,
        },
        tasks: {
          include: { assignedTo: { select: { id: true, name: true } } },
          orderBy: { dueDate: 'asc' },
        },
      },
    });
    if (!contact) throw new NotFoundException('Contato não encontrado.');
    return contact;
  }

  async create(tenantId: string, data: CreateContactInput) {
    return prisma.$transaction(async (tx) => {
      const contact = await tx.contact.create({ data: { ...data, tenantId } });
      const legacyData = {
        id: contact.id,
        tenantId,
        type: data.type,
        name: data.name,
        tradeName: data.tradeName,
        document: data.document,
        stateReg: data.stateReg,
        email: data.email,
        phone: data.phone,
        mobile: data.mobile,
        website: data.website,
        zipCode: data.zipCode,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        notes: data.notes,
      };

      if (data.role === 'CLIENT' || data.role === 'BOTH') {
        await tx.customer.create({ data: legacyData });
      }
      if (data.role === 'SUPPLIER' || data.role === 'BOTH') {
        await tx.supplier.create({ data: legacyData });
      }
      return contact;
    });
  }

  async update(tenantId: string, id: string, data: UpdateContactInput) {
    await this.findOne(tenantId, id);
    return prisma.contact.update({ where: { id }, data });
  }

  async toggleActive(tenantId: string, id: string) {
    const contact = await this.findOne(tenantId, id);
    return prisma.contact.update({
      where: { id },
      data: { isActive: !contact.isActive },
    });
  }
}
