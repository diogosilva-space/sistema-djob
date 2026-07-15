import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SalesOrdersService } from './sales-orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { updateSalesOrderSchema, UpdateSalesOrderInput } from '@djob/validators';

@ApiTags('Vendas - Pedidos')
@Controller('vendas/sales-orders')
@UseGuards(JwtAuthGuard)
export class SalesOrdersController {
  constructor(private readonly salesOrdersService: SalesOrdersService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.salesOrdersService.findAll(user.tenantId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.salesOrdersService.findOne(user.tenantId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateSalesOrderSchema))
    updateDto: UpdateSalesOrderInput,
  ) {
    return this.salesOrdersService.update(user.tenantId, id, updateDto);
  }
}
