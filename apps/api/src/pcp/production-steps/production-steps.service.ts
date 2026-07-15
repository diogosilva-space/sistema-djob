import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { prisma } from '@djob/database';
import {
  CreateProductionStepInput,
  UpdateProductionStepInput,
  CreateProductionLogInput,
} from '@djob/validators';

@Injectable()
export class ProductionStepsService {
  async create(tenantId: string, data: CreateProductionStepInput) {
    // Verify if production order exists for this tenant
    const order = await prisma.productionOrder.findFirst({
      where: { id: data.productionOrderId, tenantId },
    });

    if (!order) {
      throw new NotFoundException('Ordem de produção não encontrada.');
    }

    return prisma.productionStep.create({
      data,
    });
  }

  async update(tenantId: string, id: string, data: UpdateProductionStepInput) {
    const step = await prisma.productionStep.findFirst({
      where: {
        id,
        productionOrder: { tenantId },
      },
    });

    if (!step) {
      throw new NotFoundException('Etapa não encontrada.');
    }

    return prisma.productionStep.update({
      where: { id },
      data,
    });
  }

  async remove(tenantId: string, id: string) {
    const step = await prisma.productionStep.findFirst({
      where: {
        id,
        productionOrder: { tenantId },
      },
    });

    if (!step) {
      throw new NotFoundException('Etapa não encontrada.');
    }

    return prisma.productionStep.delete({
      where: { id },
    });
  }

  // --- Apontamentos (Logs) ---
  async createLog(tenantId: string, data: CreateProductionLogInput, responsibleName: string) {
    const step = await prisma.productionStep.findFirst({
      where: {
        id: data.stepId,
        productionOrder: { tenantId },
      },
    });

    if (!step) {
      throw new NotFoundException('Etapa não encontrada.');
    }

    // Registra o apontamento
    const log = await prisma.productionLog.create({
      data: {
        ...data,
        responsibleName,
      },
    });

    // Se o tipo for START, atualiza o status da etapa para IN_PROGRESS
    if (data.type === 'START' && step.status === 'PENDING') {
      await prisma.productionStep.update({
        where: { id: step.id },
        data: { status: 'IN_PROGRESS', startedAt: new Date() },
      });
      // Atualiza também a Ordem de Produção
      await prisma.productionOrder.update({
        where: { id: step.productionOrderId },
        data: { status: 'IN_PROGRESS' },
      });
    }

    // Se o tipo for FINISH, atualiza o status para COMPLETED
    if (data.type === 'FINISH' && step.status === 'IN_PROGRESS') {
      await prisma.productionStep.update({
        where: { id: step.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });
    }

    return log;
  }
}
