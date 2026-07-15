import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@djob/database';
import { StockMovementInput } from '@djob/validators';
import { Prisma } from '@prisma/client';

@Injectable()
export class EstoqueService {
  async getStockItems(tenantId: string) {
    return prisma.stockItem.findMany({
      where: { tenantId },
      include: {
        product: true,
      },
      orderBy: { quantity: 'asc' },
    });
  }

  async getMovements(tenantId: string) {
    return prisma.stockMovement.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async adjustStock(tenantId: string, data: StockMovementInput) {
    const { productId, quantity, type, notes, reference, location } = data;

    const product = await prisma.product.findFirst({
      where: { id: productId, tenantId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return prisma.$transaction(async (tx) => {
      // Find or create StockItem
      let stockItem = await tx.stockItem.findUnique({
        where: {
          tenantId_productId_location: {
            tenantId,
            productId,
            location,
          },
        },
      });

      if (!stockItem) {
        stockItem = await tx.stockItem.create({
          data: {
            tenantId,
            productId,
            location,
            quantity: 0,
          },
        });
      }

      let newQuantity = Number(stockItem.quantity);
      if (type === 'ENTRY' || type === 'RETURN') {
        newQuantity += quantity;
      } else if (type === 'EXIT') {
        newQuantity -= quantity;
      } else if (type === 'ADJUST') {
        newQuantity = quantity; // For direct adjustment, set absolute quantity
      }

      // Update StockItem
      await tx.stockItem.update({
        where: { id: stockItem.id },
        data: { quantity: newQuantity },
      });

      // Log StockMovement
      return tx.stockMovement.create({
        data: {
          tenantId,
          productName: product.name,
          type: type as any,
          quantity: new Prisma.Decimal(quantity),
          reference,
          notes,
        },
      });
    });
  }

  // Deduct materials automatically when an OP is completed
  async deductStockForProduction(tenantId: string, productionOrderId: string) {
    const op = await prisma.productionOrder.findFirst({
      where: { id: productionOrderId, tenantId },
      include: {
        salesOrder: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!op || !op.salesOrder) {
      return; // No sales order, nothing to deduct
    }

    for (const item of op.salesOrder.items) {
      const product = item.product;
      if (!product.bomTemplate) continue;

      try {
        const bom =
          typeof product.bomTemplate === 'string'
            ? JSON.parse(product.bomTemplate)
            : (product.bomTemplate as any);

        if (!Array.isArray(bom)) continue;

        for (const bomItem of bom) {
          const rawMaterialId = bomItem.rawMaterialProductId;
          const reqQty = Number(bomItem.quantityRequired);

          if (!rawMaterialId || isNaN(reqQty)) continue;

          // Multiply BOM quantity by the total sales order item quantity
          const totalDeduction = reqQty * Number(item.quantity);

          await this.adjustStock(tenantId, {
            productId: rawMaterialId,
            type: 'EXIT',
            quantity: totalDeduction,
            location: 'PRINCIPAL',
            reference: op.code,
            notes: `Baixa automática da OP ${op.code} (Produto: ${product.name})`,
          });
        }
      } catch (err) {
        console.error(`Erro ao processar Ficha Técnica para o produto ${product.name}:`, err);
      }
    }
  }
}
