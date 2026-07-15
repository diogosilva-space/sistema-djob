import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@djob/database';
import { CreateProductInput, UpdateProductInput } from '@djob/validators';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  async create(tenantId: string, data: CreateProductInput) {
    const bomTemplateJson = data.bomTemplate
      ? typeof data.bomTemplate === 'string'
        ? JSON.parse(data.bomTemplate)
        : data.bomTemplate
      : null;

    return prisma.product.create({
      data: {
        tenantId,
        sku: data.sku,
        name: data.name,
        description: data.description,
        type: data.type as any,
        unit: data.unit,
        costPrice: new Prisma.Decimal(data.costPrice),
        salePrice: new Prisma.Decimal(data.salePrice),
        minStock: new Prisma.Decimal(data.minStock),
        maxStock: data.maxStock ? new Prisma.Decimal(data.maxStock) : null,
        weight: data.weight ? new Prisma.Decimal(data.weight) : null,
        isConfigurable: data.isConfigurable,
        bomTemplate: bomTemplateJson || undefined,
      },
    });
  }

  async findAll(tenantId: string) {
    return prisma.product.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const product = await prisma.product.findFirst({
      where: { id, tenantId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async update(tenantId: string, id: string, data: UpdateProductInput) {
    await this.findOne(tenantId, id);

    const bomTemplateJson = data.bomTemplate
      ? typeof data.bomTemplate === 'string'
        ? JSON.parse(data.bomTemplate)
        : data.bomTemplate
      : undefined;

    return prisma.product.update({
      where: { id },
      data: {
        sku: data.sku,
        name: data.name,
        description: data.description,
        type: data.type as any,
        unit: data.unit,
        costPrice: data.costPrice !== undefined ? new Prisma.Decimal(data.costPrice) : undefined,
        salePrice: data.salePrice !== undefined ? new Prisma.Decimal(data.salePrice) : undefined,
        minStock: data.minStock !== undefined ? new Prisma.Decimal(data.minStock) : undefined,
        maxStock:
          data.maxStock !== undefined
            ? data.maxStock
              ? new Prisma.Decimal(data.maxStock)
              : null
            : undefined,
        weight:
          data.weight !== undefined
            ? data.weight
              ? new Prisma.Decimal(data.weight)
              : null
            : undefined,
        isConfigurable: data.isConfigurable,
        bomTemplate: bomTemplateJson !== undefined ? bomTemplateJson : undefined,
      },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return prisma.product.delete({
      where: { id },
    });
  }
}
