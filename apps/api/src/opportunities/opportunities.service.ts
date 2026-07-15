import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@djob/database';
import {
  ChangeOpportunityStageInput,
  CreateOpportunityInput,
  OpportunityListQuery,
  OpportunityMetricsQuery,
  UpdateOpportunityInput,
} from '@djob/validators';
import { OpportunityStatus, Prisma } from '@prisma/client';

interface AuthUser {
  id: string;
  tenantId: string;
  role: string;
}

const CLOSED_STATUSES = [
  OpportunityStatus.FECHADO_GANHO,
  OpportunityStatus.FECHADO_PERDIDO,
] as const;

const OPEN_STATUSES = [
  OpportunityStatus.LEAD_QUALIFICADO,
  OpportunityStatus.CONTATO_INICIAL,
  OpportunityStatus.APRESENTACAO,
  OpportunityStatus.PROPOSTA_ENVIADA,
  OpportunityStatus.NEGOCIACAO,
] as const;

@Injectable()
export class OpportunitiesService {
  async findAll(user: AuthUser, query: OpportunityListQuery) {
    const where = this.buildWhere(user, query);

    return prisma.opportunity.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, mobile: true, phone: true, email: true } },
        contact: { select: { id: true, name: true, mobile: true, phone: true, email: true } },
        seller: { select: { id: true, name: true } },
        _count: { select: { activities: true, tasks: true } },
      },
      orderBy: [{ expectedCloseAt: 'asc' }, { updatedAt: 'desc' }],
    });
  }

  async findPipeline(user: AuthUser, query: OpportunityListQuery) {
    const opportunities = await this.findAll(user, query);

    return Object.values(OpportunityStatus).map((status) => {
      const items = opportunities.filter((opportunity) => opportunity.status === status);

      return {
        status,
        count: items.length,
        value: items.reduce((total, item) => total + Number(item.value), 0),
        opportunities: items.map((item) => ({
          ...item,
          value: Number(item.value),
        })),
      };
    });
  }

  async findOne(user: AuthUser, id: string) {
    const opportunity = await prisma.opportunity.findFirst({
      where: this.scope(user, { id }),
      include: {
        customer: true,
        contact: true,
        seller: { select: { id: true, name: true, email: true } },
        activities: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { occurredAt: 'desc' },
        },
        tasks: {
          include: { assignedTo: { select: { id: true, name: true } } },
          orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
        },
      },
    });

    if (!opportunity) throw new NotFoundException('Oportunidade não encontrada.');
    return opportunity;
  }

  async create(user: AuthUser, data: CreateOpportunityInput) {
    const sellerId = this.resolveSellerId(user, data.sellerId);

    if (data.customerId) {
      await this.assertCustomer(user.tenantId, data.customerId);
    }
    if (data.contactId) {
      await this.assertContact(user.tenantId, data.contactId);
    }

    return prisma.opportunity.create({
      data: {
        tenantId: user.tenantId,
        sellerId,
        customerId: data.customerId,
        contactId: data.contactId,
        name: data.name,
        value: new Prisma.Decimal(data.value),
        probability: data.probability,
        status: data.status,
        expectedCloseAt: data.expectedCloseAt ? new Date(data.expectedCloseAt) : undefined,
        notes: data.notes,
        tags: data.tags,
      },
      include: {
        customer: { select: { id: true, name: true } },
        contact: { select: { id: true, name: true } },
        seller: { select: { id: true, name: true } },
      },
    });
  }

  async update(user: AuthUser, id: string, data: UpdateOpportunityInput) {
    await this.findOne(user, id);

    if (data.customerId) {
      await this.assertCustomer(user.tenantId, data.customerId);
    }
    if (data.contactId) {
      await this.assertContact(user.tenantId, data.contactId);
    }

    return prisma.opportunity.update({
      where: { id },
      data: {
        ...data,
        value: data.value === undefined ? undefined : new Prisma.Decimal(data.value),
        contactId: data.contactId,
        expectedCloseAt:
          data.expectedCloseAt === undefined
            ? undefined
            : data.expectedCloseAt
              ? new Date(data.expectedCloseAt)
              : null,
      },
    });
  }

  async changeStage(user: AuthUser, id: string, data: ChangeOpportunityStageInput) {
    await this.findOne(user, id);
    const isClosed = CLOSED_STATUSES.includes(data.status as (typeof CLOSED_STATUSES)[number]);

    return prisma.opportunity.update({
      where: { id },
      data: {
        status: data.status,
        value: data.value === undefined ? undefined : new Prisma.Decimal(data.value),
        closedAt: isClosed ? new Date(data.closedAt ?? new Date().toISOString()) : null,
        lostReason: data.status === OpportunityStatus.FECHADO_PERDIDO ? data.lostReason : null,
      },
    });
  }

  async getMetrics(user: AuthUser, query: OpportunityMetricsQuery) {
    const now = new Date();
    const from = query.from ? new Date(query.from) : undefined;
    const to = query.to ? new Date(query.to) : undefined;
    const where = this.scope(user, {
      ...(query.sellerId && this.canViewTeam(user) ? { sellerId: query.sellerId } : {}),
      ...(from || to ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
    });
    const opportunities = await prisma.opportunity.findMany({
      where,
      select: {
        status: true,
        value: true,
        probability: true,
        createdAt: true,
        lastInteractionAt: true,
      },
    });
    const open = opportunities.filter((item) =>
      OPEN_STATUSES.includes(item.status as (typeof OPEN_STATUSES)[number]),
    );
    const closed = opportunities.filter((item) =>
      CLOSED_STATUSES.includes(item.status as (typeof CLOSED_STATUSES)[number]),
    );
    const rottingThreshold = new Date(now);
    rottingThreshold.setDate(rottingThreshold.getDate() - 7);

    const stageBreakdown = Object.values(OpportunityStatus).map((status) => {
      const items = opportunities.filter((item) => item.status === status);
      return {
        status,
        count: items.length,
        value: items.reduce((total, item) => total + Number(item.value), 0),
      };
    });

    return {
      totalPipelineValue: open.reduce((total, item) => total + Number(item.value), 0),
      weightedPipelineValue: open.reduce(
        (total, item) => total + Number(item.value) * (item.probability / 100),
        0,
      ),
      totalDeals: opportunities.length,
      rottingDeals: open.filter((item) => item.lastInteractionAt < rottingThreshold).length,
      winRate:
        closed.length === 0
          ? 0
          : closed.filter((item) => item.status === OpportunityStatus.FECHADO_GANHO).length /
            closed.length,
      stageBreakdown,
    };
  }

  private buildWhere(user: AuthUser, query: OpportunityListQuery) {
    const from = query.from ? new Date(query.from) : undefined;
    const to = query.to ? new Date(query.to) : undefined;

    return this.scope(user, {
      ...(query.status ? { status: query.status } : {}),
      ...(query.sellerId && this.canViewTeam(user) ? { sellerId: query.sellerId } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { customer: { is: { name: { contains: query.search, mode: 'insensitive' } } } },
              { contact: { is: { name: { contains: query.search, mode: 'insensitive' } } } },
            ],
          }
        : {}),
      ...(from || to
        ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } }
        : {}),
    });
  }

  private scope(user: AuthUser, where: Prisma.OpportunityWhereInput): Prisma.OpportunityWhereInput {
    return {
      ...where,
      tenantId: user.tenantId,
      ...(!this.canViewTeam(user) ? { sellerId: user.id } : {}),
    };
  }

  private resolveSellerId(user: AuthUser, requestedSellerId?: string) {
    if (!requestedSellerId || !this.canViewTeam(user)) return user.id;
    return requestedSellerId;
  }

  private canViewTeam(user: AuthUser) {
    return ['ADMIN', 'MANAGER'].includes(user.role);
  }

  private async assertCustomer(tenantId: string, customerId: string) {
    const customer = await prisma.customer.findFirst({ where: { id: customerId, tenantId } });
    if (!customer) throw new ForbiddenException('Cliente inválido para este tenant.');
  }

  private async assertContact(tenantId: string, contactId: string) {
    const contact = await prisma.contact.findFirst({ where: { id: contactId, tenantId } });
    if (!contact) throw new ForbiddenException('Contato inválido para este tenant.');
  }
}
