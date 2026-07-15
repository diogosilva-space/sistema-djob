import { Module } from '@nestjs/common';
import { QuotesController } from './quotes/quotes.controller';
import { QuotesService } from './quotes/quotes.service';
import { SalesOrdersController } from './sales-orders/sales-orders.controller';
import { SalesOrdersService } from './sales-orders/sales-orders.service';

@Module({
  controllers: [QuotesController, SalesOrdersController],
  providers: [QuotesService, SalesOrdersService],
})
export class VendasModule {}
