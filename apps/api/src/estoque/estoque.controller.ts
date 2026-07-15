import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { EstoqueService } from './estoque.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard, ROLES_KEY } from '../common/guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { stockMovementSchema, StockMovementInput } from '@djob/validators';

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('estoque')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  @Get('items')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER', 'OPERATOR', 'VIEWER'])
  getStockItems(@CurrentUser() user: any) {
    return this.estoqueService.getStockItems(user.tenantId);
  }

  @Get('movements')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER', 'OPERATOR', 'VIEWER'])
  getMovements(@CurrentUser() user: any) {
    return this.estoqueService.getMovements(user.tenantId);
  }

  @Post('adjust')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER'])
  adjustStock(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(stockMovementSchema)) data: StockMovementInput,
  ) {
    return this.estoqueService.adjustStock(user.tenantId, data);
  }
}
