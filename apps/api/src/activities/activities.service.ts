import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@djob/database';
import { ActivityListQuery, CreateActivityInput } from '@djob/validators';
import { ActivityType, Prisma } from '@prisma/client';

interface AuthUser {
  id: string;
  tenantId: string;
  role: string;
}

const CONTACT_ACTIVITY_TYPES = new Set<ActivityType>([
  ActivityType.CALL,
  ActivityType.EMAIL,
  ActivityType.MEETING,
  ActivityType.WHATSAPP,
]);

@Injectable()
export class ActivitiesService {
  async findAll(user: AuthUser, query: ActivityListQuery) {
    return prisma.activity.findMany({
      where: this.scope(user, {
        ...(query.opportunityId ? { opportunityId: query.opportunityId } : {}),
        ...(query.customerId ? { customerId: query.customerId } : {}),
        ...(query.contactId ? { contactId: query.contactId } : {}),
      }),
      include: { user: { select: { id: true, name: true } } },
      orderBy: { occurredAt: 'desc' },
    });
  }

  async create(user: AuthUser, data: CreateActivityInput) {
    if (data.opportunityId) {
      await this.assertOpportunity(user, data.opportunityId);
    }
    if (data.customerId) {
      await this.assertCustomer(user.tenantId, data.customerId);
    }
    if (data.contactId) {
      await this.assertContact(user.tenantId, data.contactId);
    }

    const occurredAt = data.occurredAt ? new Date(data.occurredAt) : new Date();
    const activity = await prisma.activity.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        opportunityId: data.opportunityId,
        customerId: data.customerId,
        contactId: data.contactId,
        type: data.type,
        subject: data.subject,
        description: data.description,
        occurredAt,
      },
      include: { user: { select: { id: true, name: true } } },
    });

    if (data.opportunityId && CONTACT_ACTIVITY_TYPES.has(data.type)) {
      await prisma.opportunity.updateMany({
        where: { id: data.opportunityId, tenantId: user.tenantId },
        data: { lastInteractionAt: occurredAt },
      });
    }

    return activity;
  }

  async remove(user: AuthUser, id: string) {
    const activity = await prisma.activity.findFirst({ where: this.scope(user, { id }) });
    if (!activity) throw new NotFoundException('Atividade não encontrada.');
    await prisma.activity.delete({ where: { id } });
  }

  private scope(user: AuthUser, where: Prisma.ActivityWhereInput): Prisma.ActivityWhereInput {
    if (this.canViewTeam(user)) return { ...where, tenantId: user.tenantId };

    return {
      ...where,
      tenantId: user.tenantId,
      OR: [{ userId: user.id }, { opportunity: { is: { sellerId: user.id } } }],
    };
  }

  private async assertOpportunity(user: AuthUser, opportunityId: string) {
    const opportunity = await prisma.opportunity.findFirst({
      where: {
        id: opportunityId,
        tenantId: user.tenantId,
        ...(!this.canViewTeam(user) ? { sellerId: user.id } : {}),
      },
    });
    if (!opportunity) throw new ForbiddenException('Oportunidade inválida para este usuário.');
  }

  private async assertCustomer(tenantId: string, customerId: string) {
    const customer = await prisma.customer.findFirst({ where: { id: customerId, tenantId } });
    if (!customer) throw new ForbiddenException('Cliente inválido para este tenant.');
  }

  private async assertContact(tenantId: string, contactId: string) {
    const contact = await prisma.contact.findFirst({ where: { id: contactId, tenantId } });
    if (!contact) throw new ForbiddenException('Contato inválido para este tenant.');
  }

  private canViewTeam(user: AuthUser) {
    return ['ADMIN', 'MANAGER'].includes(user.role);
  }
}
