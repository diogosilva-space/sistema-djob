import { Module } from '@nestjs/common';
import { FinancialController } from './financeiro.controller';
import { FinancialService } from './financeiro.service';

@Module({
  controllers: [FinancialController],
  providers: [FinancialService],
})
export class FinanceiroModule {}
