import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@djob/database';
import { CreateQuoteInput, UpdateQuoteInput } from '@djob/validators';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuotesService {
  async create(tenantId: string, data: CreateQuoteInput) {
    // Calcula totais
    let subtotal = 0;
    const itemsData = data.items.map((item) => {
      const totalPrice = item.quantity * item.unitPrice - item.discount;
      subtotal += totalPrice;

      return {
        productId: item.productId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        totalPrice,
        configuration: item.configuration ? (item.configuration as any) : Prisma.JsonNull,
      };
    });

    const totalAmount = subtotal - data.discount + data.shippingCost;

    // Gera código (ex: ORC-2026-0001) - Simples randomico para dev
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `ORC-${new Date().getFullYear()}-${randomNum}`;

    return prisma.quote.create({
      data: {
        tenantId,
        customerId: data.customerId,
        code,
        status: 'DRAFT',
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        subtotal,
        discount: data.discount,
        shippingCost: data.shippingCost,
        totalAmount,
        notes: data.notes,
        conditions: data.conditions,
        items: {
          create: itemsData,
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });
  }

  async findAll(tenantId: string) {
    return prisma.quote.findMany({
      where: { tenantId },
      include: {
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const quote = await prisma.quote.findFirst({
      where: { id, tenantId },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
        salesOrder: true,
      },
    });

    if (!quote) throw new NotFoundException('Orçamento não encontrado');
    return quote;
  }

  async update(tenantId: string, id: string, data: UpdateQuoteInput) {
    // Para simplificar: Não vamos permitir update de items neste MVP.
    // Apenas status e totais básicos
    return prisma.quote.updateMany({
      where: { id, tenantId },
      data: {
        status: data.status as any,
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
        notes: data.notes,
        conditions: data.conditions,
      },
    });
  }

  async convertToOrder(tenantId: string, id: string) {
    const quote = await this.findOne(tenantId, id);

    if (quote.status === 'CONVERTED' || quote.salesOrder) {
      throw new Error('Este orçamento já foi convertido.');
    }

    // 1. Marcar orçamento como convertido
    await prisma.quote.update({
      where: { id },
      data: { status: 'CONVERTED' },
    });

    // 2. Criar Pedido de Venda
    const code = `PED-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const salesOrder = await prisma.salesOrder.create({
      data: {
        tenantId,
        customerId: quote.customerId,
        quoteId: quote.id,
        code,
        status: 'PENDING',
        totalAmount: quote.totalAmount,
        items: {
          create: quote.items.map((item: any) => ({
            productId: item.productId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            configuration: item.configuration ? (item.configuration as any) : Prisma.JsonNull,
          })),
        },
      },
    });

    return salesOrder;
  }
}
