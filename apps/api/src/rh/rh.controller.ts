import { Controller, Get, Post, Patch, Param, Delete, Body, UseGuards } from '@nestjs/common';
import { RhService } from './rh.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard, ROLES_KEY } from '../common/guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from '@djob/validators';

@ApiTags('Recursos Humanos (RH)')
@ApiBearerAuth()
@Controller('rh')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RhController {
  constructor(private readonly rhService: RhService) {}

  @Get('funcionarios')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER']) // Apenas ADMIN e MANAGER podem ver dados de RH
  getEmployees(@CurrentUser() user: any) {
    return this.rhService.getEmployees(user.tenantId);
  }

  @Get('funcionarios/:id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER'])
  getEmployeeById(@CurrentUser() user: any, @Param('id') id: string) {
    return this.rhService.getEmployeeById(user.tenantId, id);
  }

  @Post('funcionarios')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER'])
  createEmployee(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(createEmployeeSchema)) data: CreateEmployeeInput,
  ) {
    return this.rhService.createEmployee(user.tenantId, user.id, data);
  }

  @Patch('funcionarios/:id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER'])
  updateEmployee(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateEmployeeSchema)) data: UpdateEmployeeInput,
  ) {
    return this.rhService.updateEmployee(user.tenantId, id, user.id, data);
  }

  @Delete('funcionarios/:id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER'])
  removeEmployee(@CurrentUser() user: any, @Param('id') id: string) {
    return this.rhService.removeEmployee(user.tenantId, id, user.id);
  }
}
