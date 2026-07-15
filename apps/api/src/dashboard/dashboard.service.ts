import { BadRequestException, Injectable } from '@nestjs/common';
import { prisma } from '@djob/database';
import {
  DashboardSummary,
  DashboardSummaryQuery,
} from '@djob/validators';
import {
  ProductType,
  ProductionOrderStatus,
  SalesOrderStatus,
} from '@prisma/client';

const OPEN_ORDER_STATUSES = [
  SalesOrderStatus.PENDING,
  SalesOrderStatus.CONFIRMED,
  SalesOrderStatus.IN_PRODUCTION,
  SalesOrderStatus.READY,
  SalesOrderStatus.SHIPPED,
] as const;

const ACTIVE_PRODUCTION_STATUSES = [
  ProductionOrderStatus.PLANNED,
  ProductionOrderStatus.IN_PROGRESS,
  ProductionOrderStatus.PAUSED,
] as const;

@Injectable()
export class DashboardService {
  async getSummary(
    tenantId: string,
    query: DashboardSummaryQuery,
  ): Promise<DashboardSummary> {
    const now = new Date();
    const to = query.to ? new Date(query.to) : now;
    const from = query.from
      ? new Date(query.from)
      : new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), 1));

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) {
      throw new BadRequestException('O período informado é inválido.');
    }

    const seriesStart = new Date(
      Date.UTC(to.getUTCFullYear(), to.getUTCMonth() - 5, 1),
    );

    const [
      revenueAggregate,
      openOrders,
      activeProductionOrders,
      stockItems,
      seriesOrders,
      productSales,
      recentOrders,
      overdueOrders,
      overdueProductionOrders,
    ] = await Promise.all([
      prisma.salesOrder.aggregate({
        where: {
          tenantId,
          status: { not: SalesOrderStatus.CANCELLED },
          createdAt: { gte: from, lte: to },
        },
        _sum: { totalAmount: true },
      }),
      prisma.salesOrder.count({
        where: {
          tenantId,
          status: { in: [...OPEN_ORDER_STATUSES] },
        },
      }),
      prisma.productionOrder.count({
        where: {
          tenantId,
          status: { in: [...ACTIVE_PRODUCTION_STATUSES] },
        },
      }),
      prisma.stockItem.findMany({
        where: { tenantId },
        select: {
          id: true,
          quantity: true,
          product: {
            select: {
              name: true,
              minStock: true,
            },
          },
        },
        orderBy: { quantity: 'asc' },
      }),
      prisma.salesOrder.findMany({
        where: {
          tenantId,
          status: { not: SalesOrderStatus.CANCELLED },
          createdAt: { gte: seriesStart, lte: to },
        },
        select: {
          totalAmount: true,
          createdAt: true,
        },
      }),
      prisma.salesOrderItem.findMany({
        where: {
          order: {
            is: {
              tenantId,
              status: { not: SalesOrderStatus.CANCELLED },
              createdAt: { gte: from, lte: to },
            },
          },
        },
        select: {
          totalPrice: true,
          product: {
            select: { type: true },
          },
        },
      }),
      prisma.salesOrder.findMany({
        where: {
          tenantId,
          status: { not: SalesOrderStatus.CANCELLED },
        },
        select: {
          id: true,
          code: true,
          status: true,
          totalAmount: true,
          createdAt: true,
          deliveryDate: true,
          customer: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.salesOrder.findMany({
        where: {
          tenantId,
          deliveryDate: { not: null, lt: now },
          status: {
            notIn: [SalesOrderStatus.DELIVERED, SalesOrderStatus.CANCELLED],
          },
        },
        select: {
          id: true,
          code: true,
          deliveryDate: true,
        },
        orderBy: { deliveryDate: 'asc' },
        take: 2,
      }),
      prisma.productionOrder.findMany({
        where: {
          tenantId,
          dueDate: { not: null, lt: now },
          status: {
            notIn: [
              ProductionOrderStatus.COMPLETED,
              ProductionOrderStatus.CANCELLED,
            ],
          },
        },
        select: {
          id: true,
          code: true,
          dueDate: true,
        },
        orderBy: { dueDate: 'asc' },
        take: 2,
      }),
    ]);

    const criticalStockItems = stockItems.filter(
      (item) => Number(item.quantity) <= Number(item.product.minStock),
    );

    const revenueByMonth = new Map<string, number>();
    const revenueSeries = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        Date.UTC(to.getUTCFullYear(), to.getUTCMonth() - 5 + index, 1),
      );
      const key = this.getMonthKey(date);
      revenueByMonth.set(key, 0);

      return {
        month: new Intl.DateTimeFormat('pt-BR', { month: 'short' })
          .format(date)
          .replace('.', ''),
        amount: 0,
      };
    });

    for (const order of seriesOrders) {
      const key = this.getMonthKey(order.createdAt);
      revenueByMonth.set(
        key,
        (revenueByMonth.get(key) ?? 0) + Number(order.totalAmount),
      );
    }

    revenueSeries.forEach((item, index) => {
      const date = new Date(
        Date.UTC(to.getUTCFullYear(), to.getUTCMonth() - 5 + index, 1),
      );
      item.amount = revenueByMonth.get(this.getMonthKey(date)) ?? 0;
    });

    const salesByProductType = new Map<
      'Brindes' | 'Confecção' | 'Outros',
      number
    >([
      ['Brindes', 0],
      ['Confecção', 0],
      ['Outros', 0],
    ]);

    for (const item of productSales) {
      const type =
        item.product.type === ProductType.SIMPLE
          ? 'Brindes'
          : item.product.type === ProductType.CONFIGURABLE
            ? 'Confecção'
            : 'Outros';

      salesByProductType.set(
        type,
        (salesByProductType.get(type) ?? 0) + Number(item.totalPrice),
      );
    }

    const alerts: DashboardSummary['alerts'] = [
      ...criticalStockItems.slice(0, 2).map((item) => ({
        id: `stock-${item.id}`,
        severity: 'critical' as const,
        title: `${item.product.name} abaixo do mínimo`,
        description: `${Number(item.quantity)} em estoque para mínimo de ${Number(item.product.minStock)}.`,
        href: '/estoque',
      })),
      ...overdueOrders.map((order) => ({
        id: `order-${order.id}`,
        severity: 'warning' as const,
        title: `Pedido ${order.code} está atrasado`,
        description: `Entrega prevista para ${this.formatDate(order.deliveryDate)}.`,
        href: '/vendas/pedidos',
      })),
      ...overdueProductionOrders.map((order) => ({
        id: `production-${order.id}`,
        severity: 'warning' as const,
        title: `OP ${order.code} está com prazo vencido`,
        description: `Conclusão prevista para ${this.formatDate(order.dueDate)}.`,
        href: '/pcp',
      })),
    ].slice(0, 5);

    return {
      period: {
        from: from.toISOString(),
        to: to.toISOString(),
      },
      kpis: {
        revenue: Number(revenueAggregate._sum.totalAmount ?? 0),
        openOrders,
        activeProductionOrders,
        criticalStock: criticalStockItems.length,
      },
      revenueSeries,
      salesByProductType: Array.from(salesByProductType, ([name, amount]) => ({
        name,
        amount,
      })).filter((item) => item.amount > 0),
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        code: order.code,
        customerName: order.customer.name,
        status: order.status,
        totalAmount: Number(order.totalAmount),
        createdAt: order.createdAt.toISOString(),
        deliveryDate: order.deliveryDate?.toISOString() ?? null,
      })),
      alerts,
    };
  }

  private getMonthKey(date: Date) {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
  }

  private formatDate(date: Date | null) {
    if (!date) return 'data não informada';

    return new Intl.DateTimeFormat('pt-BR').format(date);
  }
}
