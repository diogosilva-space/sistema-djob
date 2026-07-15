import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ChangeOpportunityStageInput,
  CreateOpportunityInput,
  OpportunityListQuery,
  OpportunityMetricsQuery,
  UpdateOpportunityInput,
  changeOpportunityStageSchema,
  createOpportunitySchema,
  opportunityListQuerySchema,
  opportunityMetricsQuerySchema,
  updateOpportunitySchema,
} from '@djob/validators';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ROLES_KEY, RolesGuard } from '../common/guards/roles.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

import { OpportunitiesService } from './opportunities.service';

@ApiTags('CRM - Opportunities')
@ApiBearerAuth()
@Controller('opportunities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Get('pipeline')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER'])
  findPipeline(
    @CurrentUser() user: { id: string; tenantId: string; role: string },
    @Query(new ZodValidationPipe(opportunityListQuerySchema)) query: OpportunityListQuery,
  ) {
    return this.opportunitiesService.findPipeline(user, query);
  }

  @Get('metrics')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER'])
  getMetrics(
    @CurrentUser() user: { id: string; tenantId: string; role: string },
    @Query(new ZodValidationPipe(opportunityMetricsQuerySchema))
    query: OpportunityMetricsQuery,
  ) {
    return this.opportunitiesService.getMetrics(user, query);
  }

  @Get()
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER'])
  findAll(
    @CurrentUser() user: { id: string; tenantId: string; role: string },
    @Query(new ZodValidationPipe(opportunityListQuerySchema)) query: OpportunityListQuery,
  ) {
    return this.opportunitiesService.findAll(user, query);
  }

  @Get(':id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER'])
  findOne(
    @CurrentUser() user: { id: string; tenantId: string; role: string },
    @Param('id') id: string,
  ) {
    return this.opportunitiesService.findOne(user, id);
  }

  @Post()
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER'])
  create(
    @CurrentUser() user: { id: string; tenantId: string; role: string },
    @Body(new ZodValidationPipe(createOpportunitySchema)) data: CreateOpportunityInput,
  ) {
    return this.opportunitiesService.create(user, data);
  }

  @Patch(':id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER'])
  update(
    @CurrentUser() user: { id: string; tenantId: string; role: string },
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateOpportunitySchema)) data: UpdateOpportunityInput,
  ) {
    return this.opportunitiesService.update(user, id, data);
  }

  @Patch(':id/stage')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER'])
  changeStage(
    @CurrentUser() user: { id: string; tenantId: string; role: string },
    @Param('id') id: string,
    @Body(new ZodValidationPipe(changeOpportunityStageSchema)) data: ChangeOpportunityStageInput,
  ) {
    return this.opportunitiesService.changeStage(user, id, data);
  }
}
