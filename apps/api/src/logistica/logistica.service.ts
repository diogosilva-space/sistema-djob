import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@djob/database';
import { CreateShipmentInput, UpdateShipmentInput } from '@djob/validators';

@Injectable()
export class LogisticaService {
  async getShipments(tenantId: string) {
    return prisma.shipmentOrder.findMany({
      where: { tenantId },
      include: {
        salesOrder: {
          select: {
            code: true,
            customer: { select: { name: true } },
            items: {
              select: {
                id: true,
                description: true,
                quantity: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getShipmentById(tenantId: string, id: string) {
    const shipment = await prisma.shipmentOrder.findFirst({
      where: { id, tenantId },
      include: {
        salesOrder: {
          select: {
            code: true,
            customer: { select: { name: true } },
            items: {
              select: {
                id: true,
                description: true,
                quantity: true,
              },
            },
          },
        },
      },
    });

    if (!shipment) {
      throw new NotFoundException('Protocolo de entrega não encontrado');
    }
    return shipment;
  }

  async createShipment(tenantId: string, data: CreateShipmentInput) {
    const salesOrder = await prisma.salesOrder.findFirst({
      where: { id: data.salesOrderId, tenantId },
    });

    if (!salesOrder) {
      throw new NotFoundException('Pedido de Venda não encontrado');
    }

    const code = `EXP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return prisma.shipmentOrder.create({
      data: {
        tenantId,
        salesOrderId: data.salesOrderId,
        code,
        status: 'PENDING',
        carrier: data.carrier,
        trackingCode: data.trackingCode,
        recipientName: data.recipientName,
        zipCode: data.zipCode,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        notes: data.notes,
      },
    });
  }

  async updateShipment(tenantId: string, id: string, data: UpdateShipmentInput) {
    const shipment = await this.getShipmentById(tenantId, id);

    const updateData: any = {
      carrier: data.carrier,
      trackingCode: data.trackingCode,
      recipientName: data.recipientName,
      zipCode: data.zipCode,
      street: data.street,
      number: data.number,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      notes: data.notes,
      status: data.status as any,
    };

    if (data.status === 'SHIPPED' && shipment.status !== 'SHIPPED') {
      updateData.shippedAt = new Date();
    }
    if (data.status === 'DELIVERED' && shipment.status !== 'DELIVERED') {
      updateData.deliveredAt = new Date();
    }

    return prisma.shipmentOrder.update({
      where: { id },
      data: updateData,
    });
  }
}
