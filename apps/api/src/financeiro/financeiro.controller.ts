import { Controller, Get, Post, Patch, Param, Delete, Body, UseGuards } from '@nestjs/common';
import { FinancialService } from './financeiro.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard, ROLES_KEY } from '../common/guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  createTransactionSchema,
  updateTransactionSchema,
  CreateTransactionInput,
  UpdateTransactionInput,
} from '@djob/validators';

@ApiTags('Financeiro')
@ApiBearerAuth()
@Controller('financeiro')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Get('transacoes')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER']) // Apenas ADMIN e MANAGER
  getTransactions(@CurrentUser() user: any) {
    return this.financialService.getTransactions(user.tenantId);
  }

  @Get('transacoes/:id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER'])
  getTransactionById(@CurrentUser() user: any, @Param('id') id: string) {
    return this.financialService.getTransactionById(user.tenantId, id);
  }

  @Post('transacoes')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER'])
  createTransaction(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(createTransactionSchema)) data: CreateTransactionInput,
  ) {
    return this.financialService.createTransaction(user.tenantId, user.id, data);
  }

  @Patch('transacoes/:id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER'])
  updateTransaction(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateTransactionSchema)) data: UpdateTransactionInput,
  ) {
    return this.financialService.updateTransaction(user.tenantId, id, user.id, data);
  }

  @Delete('transacoes/:id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER'])
  removeTransaction(@CurrentUser() user: any, @Param('id') id: string) {
    return this.financialService.removeTransaction(user.tenantId, id, user.id);
  }
}
