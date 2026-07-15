import {
  Body,
  Controller,
  Delete,
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
  CreateTaskInput,
  TaskListQuery,
  UpdateTaskInput,
  createTaskSchema,
  taskListQuerySchema,
  updateTaskSchema,
} from '@djob/validators';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ROLES_KEY, RolesGuard } from '../common/guards/roles.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

import { TasksService } from './tasks.service';

@ApiTags('CRM - Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER'])
  findAll(
    @CurrentUser() user: { id: string; tenantId: string; role: string },
    @Query(new ZodValidationPipe(taskListQuerySchema)) query: TaskListQuery,
  ) {
    return this.tasksService.findAll(user, query);
  }

  @Post()
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER'])
  create(
    @CurrentUser() user: { id: string; tenantId: string; role: string },
    @Body(new ZodValidationPipe(createTaskSchema)) data: CreateTaskInput,
  ) {
    return this.tasksService.create(user, data);
  }

  @Patch(':id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER'])
  update(
    @CurrentUser() user: { id: string; tenantId: string; role: string },
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateTaskSchema)) data: UpdateTaskInput,
  ) {
    return this.tasksService.update(user, id, data);
  }

  @Patch(':id/complete')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER'])
  complete(
    @CurrentUser() user: { id: string; tenantId: string; role: string },
    @Param('id') id: string,
  ) {
    return this.tasksService.complete(user, id);
  }

  @Delete(':id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER'])
  remove(
    @CurrentUser() user: { id: string; tenantId: string; role: string },
    @Param('id') id: string,
  ) {
    return this.tasksService.remove(user, id);
  }
}
