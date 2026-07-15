import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard, ROLES_KEY } from '../common/guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  createPurchaseOrderSchema,
  updatePurchaseOrderSchema,
  CreatePurchaseOrderInput,
  UpdatePurchaseOrderInput,
} from '@djob/validators';

@ApiTags('Compras')
@ApiBearerAuth()
@Controller('compras')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER'])
  create(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(createPurchaseOrderSchema)) data: CreatePurchaseOrderInput,
  ) {
    return this.comprasService.create(user.tenantId, data);
  }

  @Get()
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER', 'OPERATOR', 'VIEWER'])
  findAll(@CurrentUser() user: any) {
    return this.comprasService.findAll(user.tenantId);
  }

  @Get(':id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER', 'OPERATOR', 'VIEWER'])
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.comprasService.findOne(user.tenantId, id);
  }

  @Patch(':id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER'])
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePurchaseOrderSchema)) data: UpdatePurchaseOrderInput,
  ) {
    return this.comprasService.update(user.tenantId, id, data);
  }
}
