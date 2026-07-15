import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { TenantInterceptor } from './common/interceptors/tenant.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { CrmModule } from './crm/crm.module';
import { PcpModule } from './pcp/pcp.module';
import { VendasModule } from './vendas/vendas.module';
import { EstoqueModule } from './estoque/estoque.module';
import { ComprasModule } from './compras/compras.module';
import { ProductsModule } from './products/products.module';
import { RhModule } from './rh/rh.module';
import { LogisticaModule } from './logistica/logistica.module';
import { FinanceiroModule } from './financeiro/financeiro.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';
import { ActivitiesModule } from './activities/activities.module';
import { TasksModule } from './tasks/tasks.module';
import { ContactsModule } from './contacts/contacts.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    TenantModule,
    CrmModule,
    PcpModule,
    VendasModule,
    EstoqueModule,
    ComprasModule,
    ProductsModule,
    RhModule,
    LogisticaModule,
    FinanceiroModule,
    DashboardModule,
    OpportunitiesModule,
    ActivitiesModule,
    TasksModule,
    ContactsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
