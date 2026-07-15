import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { prisma } from '@djob/database';
import { CreatePurchaseOrderInput, UpdatePurchaseOrderInput } from '@djob/validators';
import { EstoqueService } from '../estoque/estoque.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ComprasService {
  constructor(private readonly estoqueService: EstoqueService) {}

  async create(tenantId: string, data: CreatePurchaseOrderInput) {
    const code = `COM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const itemsData = data.items.map((item) => {
      const totalPrice = item.quantity * item.unitPrice;
      return {
        productName: item.productName,
        quantity: new Prisma.Decimal(item.quantity),
        unitPrice: new Prisma.Decimal(item.unitPrice),
        totalPrice: new Prisma.Decimal(totalPrice),
      };
    });

    const totalAmount = itemsData.reduce((acc, item) => acc + Number(item.totalPrice), 0);

    return prisma.purchaseOrder.create({
      data: {
        tenantId,
        supplierId: data.supplierId,
        code,
        status: 'DRAFT',
        totalAmount: new Prisma.Decimal(totalAmount),
        expectedDate: data.expectedDate ? new Date(data.expectedDate) : null,
        notes: data.notes,
        items: {
          create: itemsData,
        },
      },
      include: {
        supplier: true,
        items: true,
      },
    });
  }

  async findAll(tenantId: string) {
    return prisma.purchaseOrder.findMany({
      where: { tenantId },
      include: {
        supplier: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const order = await prisma.purchaseOrder.findFirst({
      where: { id, tenantId },
      include: {
        supplier: true,
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido de compra não encontrado');
    }
    return order;
  }

  async update(tenantId: string, id: string, data: UpdatePurchaseOrderInput) {
    const order = await this.findOne(tenantId, id);

    if (data.status === 'RECEIVED' && order.status !== 'RECEIVED') {
      // Trigger stock increase for all items matching database products
      await prisma.$transaction(async (tx) => {
        await tx.purchaseOrder.update({
          where: { id },
          data: { status: 'RECEIVED' },
        });

        for (const item of order.items) {
          const product = await tx.product.findFirst({
            where: {
              tenantId,
              name: item.productName,
            },
          });

          if (product) {
            // Find or create StockItem and adjust
            let stockItem = await tx.stockItem.findUnique({
              where: {
                tenantId_productId_location: {
                  tenantId,
                  productId: product.id,
                  location: 'PRINCIPAL',
                },
              },
            });

            if (!stockItem) {
              stockItem = await tx.stockItem.create({
                data: {
                  tenantId,
                  productId: product.id,
                  location: 'PRINCIPAL',
                  quantity: 0,
                },
              });
            }

            const newQuantity = Number(stockItem.quantity) + Number(item.quantity);

            await tx.stockItem.update({
              where: { id: stockItem.id },
              data: { quantity: newQuantity },
            });

            await tx.stockMovement.create({
              data: {
                tenantId,
                productName: product.name,
                type: 'ENTRY',
                quantity: item.quantity,
                reference: order.code,
                notes: `Entrada automática via recebimento de Pedido de Compra ${order.code}`,
              },
            });
          }
        }
      });
      return this.findOne(tenantId, id);
    }

    return prisma.purchaseOrder.update({
      where: { id },
      data: {
        status: data.status as any,
        expectedDate: data.expectedDate ? new Date(data.expectedDate) : undefined,
        notes: data.notes,
      },
    });
  }
}
