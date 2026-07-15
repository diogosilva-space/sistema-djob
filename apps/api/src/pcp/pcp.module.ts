import { Module } from '@nestjs/common';
import { ProductionOrdersService } from './production-orders/production-orders.service';
import { ProductionOrdersController } from './production-orders/production-orders.controller';
import { ProductionStepsService } from './production-steps/production-steps.service';
import { ProductionStepsController } from './production-steps/production-steps.controller';
import { EstoqueModule } from '../estoque/estoque.module';

@Module({
  imports: [EstoqueModule],
  providers: [ProductionOrdersService, ProductionStepsService],
  controllers: [ProductionOrdersController, ProductionStepsController],
})
export class PcpModule {}
