import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { prisma } from '@djob/database';
import {
  CreateSupplierInput,
  UpdateSupplierInput,
  createSupplierSchema,
  updateSupplierSchema,
} from '@djob/validators';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard, ROLES_KEY } from '../common/guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('CRM - Suppliers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('crm/suppliers')
export class SuppliersController {
  @Post()
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER'])
  @ApiOperation({ summary: 'Criar novo fornecedor' })
  create(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(createSupplierSchema)) data: CreateSupplierInput,
  ) {
    return prisma.supplier.create({
      data: {
        ...data,
        tenantId: user.tenantId,
      },
    });
  }

  @Get()
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER', 'OPERATOR', 'VIEWER'])
  @ApiOperation({ summary: 'Listar fornecedores do tenant atual' })
  findAll(@CurrentUser() user: any) {
    return prisma.supplier.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { name: 'asc' },
    });
  }

  @Get(':id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER', 'OPERATOR', 'VIEWER'])
  @ApiOperation({ summary: 'Buscar fornecedor por ID' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return prisma.supplier.findFirst({
      where: { id, tenantId: user.tenantId },
    });
  }

  @Patch(':id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER'])
  @ApiOperation({ summary: 'Atualizar fornecedor' })
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateSupplierSchema)) data: UpdateSupplierInput,
  ) {
    return prisma.supplier.update({
      where: { id },
      data,
    });
  }

  @Delete(':id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER'])
  @ApiOperation({ summary: 'Remover fornecedor' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return prisma.supplier.delete({
      where: { id },
    });
  }
}
