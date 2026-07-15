import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductionOrdersService } from './production-orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateProductionOrderInput, UpdateProductionOrderInput } from '@djob/validators';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createProductionOrderSchema, updateProductionOrderSchema } from '@djob/validators';

@ApiTags('PCP - Ordens de Produção')
@Controller('pcp/production-orders')
@UseGuards(JwtAuthGuard)
export class ProductionOrdersController {
  constructor(private readonly productionOrdersService: ProductionOrdersService) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(createProductionOrderSchema))
    createDto: CreateProductionOrderInput,
  ) {
    return this.productionOrdersService.create(user.tenantId, createDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.productionOrdersService.findAll(user.tenantId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.productionOrdersService.findOne(user.tenantId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProductionOrderSchema))
    updateDto: UpdateProductionOrderInput,
  ) {
    return this.productionOrdersService.update(user.tenantId, id, updateDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.productionOrdersService.remove(user.tenantId, id);
  }
}
