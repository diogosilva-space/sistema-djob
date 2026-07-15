import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  CreateAdminUserInput,
  createAdminUserSchema,
  createPlatformTenantSchema,
  CreatePlatformTenantInput,
  paginationSchema,
  UpdateAdminUserInput,
  updateAdminUserSchema,
  updatePlatformTenantSchema,
  UpdatePlatformTenantInput,
} from '@djob/validators';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ROLES_KEY, RolesGuard } from '../common/guards/roles.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

import { AdminService } from './admin.service';

@ApiTags('Administração da Plataforma')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@SetMetadata(ROLES_KEY, ['SUPER_ADMIN'])
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('tenants')
  @ApiOperation({ summary: 'Lista empresas da plataforma' })
  listTenants(
    @Query(new ZodValidationPipe(paginationSchema))
    query: {
      search?: string;
      page: number;
      limit: number;
    },
  ) {
    return this.adminService.listTenants(query.search, query.page, query.limit);
  }

  @Post('tenants')
  @ApiOperation({ summary: 'Cria empresa e seu primeiro administrador' })
  createTenant(
    @Body(new ZodValidationPipe(createPlatformTenantSchema)) body: CreatePlatformTenantInput,
  ) {
    return this.adminService.createTenant(body);
  }

  @Get('tenants/:id')
  @ApiOperation({ summary: 'Detalha uma empresa' })
  getTenant(@Param('id') id: string) {
    return this.adminService.getTenant(id);
  }

  @Patch('tenants/:id')
  @ApiOperation({ summary: 'Atualiza dados de uma empresa' })
  updateTenant(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePlatformTenantSchema)) body: UpdatePlatformTenantInput,
  ) {
    return this.adminService.updateTenant(id, body);
  }

  @Patch('tenants/:id/toggle')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ativa ou desativa uma empresa' })
  toggleTenant(@Param('id') id: string) {
    return this.adminService.toggleTenant(id);
  }

  @Get('tenants/:tenantId/users')
  @ApiOperation({ summary: 'Lista usuários de uma empresa' })
  listUsers(
    @Param('tenantId') tenantId: string,
    @Query(new ZodValidationPipe(paginationSchema))
    query: { search?: string; page: number; limit: number },
  ) {
    return this.adminService.listUsers(tenantId, query.search, query.page, query.limit);
  }

  @Post('tenants/:tenantId/users')
  @ApiOperation({ summary: 'Cria usuário em uma empresa' })
  createUser(
    @Param('tenantId') tenantId: string,
    @Body(new ZodValidationPipe(createAdminUserSchema)) body: CreateAdminUserInput,
  ) {
    return this.adminService.createUser(tenantId, body);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Atualiza usuário de uma empresa' })
  updateUser(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateAdminUserSchema)) body: UpdateAdminUserInput,
  ) {
    return this.adminService.updateUser(id, body);
  }

  @Patch('users/:id/toggle')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ativa ou desativa usuário de uma empresa' })
  toggleUser(@Param('id') id: string) {
    return this.adminService.toggleUser(id);
  }
}
