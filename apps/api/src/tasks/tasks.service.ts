import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@djob/database';
import {
  CreateTaskInput,
  TaskListQuery,
  UpdateTaskInput,
} from '@djob/validators';
import { Prisma, TaskStatus } from '@prisma/client';

interface AuthUser {
  id: string;
  tenantId: string;
  role: string;
}

@Injectable()
export class TasksService {
  async findAll(user: AuthUser, query: TaskListQuery) {
    return prisma.task.findMany({
      where: this.scope(user, {
        ...(query.opportunityId ? { opportunityId: query.opportunityId } : {}),
        ...(query.customerId ? { customerId: query.customerId } : {}),
        ...(query.contactId ? { contactId: query.contactId } : {}),
        ...(query.status ? { status: query.status } : {}),
        ...(query.dueDate ? { dueDate: { lte: new Date(query.dueDate) } } : {}),
      }),
      include: {
        assignedTo: { select: { id: true, name: true } },
        opportunity: { select: { id: true, name: true, status: true } },
        customer: { select: { id: true, name: true } },
      },
      orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
    });
  }

  async create(user: AuthUser, data: CreateTaskInput) {
    const assignedToId = this.resolveAssignee(user, data.assignedToId);
    if (data.opportunityId) await this.assertOpportunity(user, data.opportunityId);
    if (data.customerId) await this.assertCustomer(user.tenantId, data.customerId);
    if (data.contactId) await this.assertContact(user.tenantId, data.contactId);

    return prisma.task.create({
      data: {
        tenantId: user.tenantId,
        assignedToId,
        opportunityId: data.opportunityId,
        customerId: data.customerId,
        contactId: data.contactId,
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        priority: data.priority,
      },
      include: { assignedTo: { select: { id: true, name: true } } },
    });
  }

  async update(user: AuthUser, id: string, data: UpdateTaskInput) {
    await this.findOne(user, id);
    if (data.opportunityId) await this.assertOpportunity(user, data.opportunityId);
    if (data.customerId) await this.assertCustomer(user.tenantId, data.customerId);
    if (data.contactId) await this.assertContact(user.tenantId, data.contactId);

    return prisma.task.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });
  }

  async complete(user: AuthUser, id: string) {
    await this.findOne(user, id);
    return prisma.task.update({
      where: { id },
      data: { status: TaskStatus.COMPLETED, completedAt: new Date() },
    });
  }

  async remove(user: AuthUser, id: string) {
    await this.findOne(user, id);
    return prisma.task.update({
      where: { id },
      data: { status: TaskStatus.CANCELLED },
    });
  }

  private async findOne(user: AuthUser, id: string) {
    const task = await prisma.task.findFirst({ where: this.scope(user, { id }) });
    if (!task) throw new NotFoundException('Tarefa não encontrada.');
    return task;
  }

  private scope(user: AuthUser, where: Prisma.TaskWhereInput): Prisma.TaskWhereInput {
    return {
      ...where,
      tenantId: user.tenantId,
      ...(!this.canManageTeam(user) ? { assignedToId: user.id } : {}),
    };
  }

  private resolveAssignee(user: AuthUser, assignedToId?: string) {
    if (!assignedToId || !this.canManageTeam(user)) return user.id;
    return assignedToId;
  }

  private async assertOpportunity(user: AuthUser, opportunityId: string) {
    const opportunity = await prisma.opportunity.findFirst({
      where: {
        id: opportunityId,
        tenantId: user.tenantId,
        ...(!this.canManageTeam(user) ? { sellerId: user.id } : {}),
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

  private canManageTeam(user: AuthUser) {
    return ['ADMIN', 'MANAGER'].includes(user.role);
  }
}
