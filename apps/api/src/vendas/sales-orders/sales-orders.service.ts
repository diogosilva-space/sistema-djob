import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@djob/database';
import { CreateSalesOrderInput, UpdateSalesOrderInput } from '@djob/validators';
import { Prisma } from '@prisma/client';

@Injectable()
export class SalesOrdersService {
  async findAll(tenantId: string) {
    return prisma.salesOrder.findMany({
      where: { tenantId },
      include: {
        customer: true,
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const order = await prisma.salesOrder.findFirst({
      where: { id, tenantId },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
        productionOrders: true,
      },
    });

    if (!order) throw new NotFoundException('Pedido não encontrado');
    return order;
  }

  async update(tenantId: string, id: string, data: UpdateSalesOrderInput) {
    const order = await this.findOne(tenantId, id);

    // Se o status mudar para IN_PRODUCTION, cria a Ordem de Produção (PCP)
    if (data.status === 'IN_PRODUCTION' && order.status !== 'IN_PRODUCTION') {
      await prisma.$transaction(async (tx: any) => {
        // Atualiza status do pedido
        await tx.salesOrder.update({
          where: { id },
          data: { status: 'IN_PRODUCTION' },
        });

        // Verifica se já existe OP
        const existingOP = await tx.productionOrder.findFirst({
          where: { salesOrderId: id },
        });

        if (!existingOP) {
          const code = `OP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
          await tx.productionOrder.create({
            data: {
              tenantId,
              salesOrderId: id,
              code,
              status: 'PLANNED',
              priority: 3,
            },
          });
        }
      });
      return this.findOne(tenantId, id);
    }

    return prisma.salesOrder.update({
      where: { id },
      data: {
        status: data.status as any,
        paymentMethod: data.paymentMethod,
        paymentTerms: data.paymentTerms,
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined,
        notes: data.notes,
      },
    });
  }
}
