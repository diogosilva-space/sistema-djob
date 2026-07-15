import { Body, Controller, Delete, Get, Param, Post, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ActivityListQuery,
  CreateActivityInput,
  activityListQuerySchema,
  createActivitySchema,
} from '@djob/validators';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ROLES_KEY, RolesGuard } from '../common/guards/roles.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

import { ActivitiesService } from './activities.service';

@ApiTags('CRM - Activities')
@ApiBearerAuth()
@Controller('activities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER'])
  findAll(
    @CurrentUser() user: { id: string; tenantId: string; role: string },
    @Query(new ZodValidationPipe(activityListQuerySchema)) query: ActivityListQuery,
  ) {
    return this.activitiesService.findAll(user, query);
  }

  @Post()
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER'])
  create(
    @CurrentUser() user: { id: string; tenantId: string; role: string },
    @Body(new ZodValidationPipe(createActivitySchema)) data: CreateActivityInput,
  ) {
    return this.activitiesService.create(user, data);
  }

  @Delete(':id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER'])
  remove(@CurrentUser() user: { id: string; tenantId: string; role: string }, @Param('id') id: string) {
    return this.activitiesService.remove(user, id);
  }
}
