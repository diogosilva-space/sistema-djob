import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import {
  CreateCustomerInput,
  UpdateCustomerInput,
  createCustomerSchema,
  updateCustomerSchema,
} from '@djob/validators';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard, ROLES_KEY } from '../common/guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
import { Request } from 'express';

@ApiTags('CRM - Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('crm/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER'])
  @ApiOperation({ summary: 'Criar novo cliente' })
  create(
    @Req() req: Request & { user: any },
    @Body(new ZodValidationPipe(createCustomerSchema)) createCustomerDto: CreateCustomerInput,
  ) {
    return this.customersService.create(req.user.tenantId, createCustomerDto);
  }

  @Get()
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER', 'OPERATOR', 'VIEWER'])
  @ApiOperation({ summary: 'Listar clientes do tenant atual' })
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER', 'OPERATOR', 'VIEWER'])
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER'])
  @ApiOperation({ summary: 'Atualizar cliente' })
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateCustomerSchema)) updateCustomerDto: UpdateCustomerInput,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER'])
  @ApiOperation({ summary: 'Remover cliente' })
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
