import { Controller, Get, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  DashboardSummaryQuery,
  dashboardSummaryQuerySchema,
} from '@djob/validators';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard, ROLES_KEY } from '../common/guards/roles.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER', 'OPERATOR', 'VIEWER'])
  @ApiQuery({
    name: 'from',
    required: false,
    description: 'Início do período dos KPIs em ISO 8601.',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    description: 'Fim do período dos KPIs em ISO 8601.',
  })
  getSummary(
    @CurrentUser() user: { tenantId: string },
    @Query(new ZodValidationPipe(dashboardSummaryQuerySchema))
    query: DashboardSummaryQuery,
  ) {
    return this.dashboardService.getSummary(user.tenantId, query);
  }
}
