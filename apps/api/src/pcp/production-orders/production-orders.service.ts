import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@djob/database';
import { CreateProductionOrderInput, UpdateProductionOrderInput } from '@djob/validators';
import { EstoqueService } from '../../estoque/estoque.service';

@Injectable()
export class ProductionOrdersService {
  constructor(private readonly estoqueService: EstoqueService) {}

  async create(tenantId: string, data: CreateProductionOrderInput) {
    return prisma.productionOrder.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async findAll(tenantId: string) {
    return prisma.productionOrder.findMany({
      where: { tenantId },
      include: {
        salesOrder: {
          select: { code: true, customer: { select: { name: true } } },
        },
        steps: {
          select: {
            id: true,
            name: true,
            status: true,
            sequence: true,
          },
          orderBy: { sequence: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const order = await prisma.productionOrder.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        salesOrder: {
          select: { code: true, customer: { select: { name: true } } },
        },
        steps: {
          include: {
            logs: {
              orderBy: { loggedAt: 'desc' },
            },
          },
          orderBy: { sequence: 'asc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Ordem de produção não encontrada.');
    }

    return order;
  }

  async update(tenantId: string, id: string, data: UpdateProductionOrderInput) {
    const order = await this.findOne(tenantId, id); // Verifica existência e tenant

    // Automatic stock deduction trigger
    if (data.status === 'COMPLETED' && order.status !== 'COMPLETED') {
      await this.estoqueService.deductStockForProduction(tenantId, id);
    }

    return prisma.productionOrder.update({
      where: { id },
      data,
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return prisma.productionOrder.delete({
      where: { id },
    });
  }
}
