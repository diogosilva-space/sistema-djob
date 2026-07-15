import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import {
  CreateTenantInput,
  UpdateTenantInput,
  createTenantSchema,
  updateTenantSchema,
} from '@djob/validators';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard, ROLES_KEY } from '../common/guards/roles.guard';
import { SetMetadata } from '@nestjs/common';

@ApiTags('Tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
// Restringe CRUD de Tenants para System Admins apenas (implementação futura)
@SetMetadata(ROLES_KEY, ['ADMIN'])
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo tenant' })
  create(@Body(new ZodValidationPipe(createTenantSchema)) createTenantDto: CreateTenantInput) {
    return this.tenantService.create(createTenantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os tenants' })
  findAll() {
    return this.tenantService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tenant por ID' })
  findOne(@Param('id') id: string) {
    return this.tenantService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar tenant' })
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateTenantSchema)) updateTenantDto: UpdateTenantInput,
  ) {
    return this.tenantService.update(id, updateTenantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover tenant' })
  remove(@Param('id') id: string) {
    return this.tenantService.remove(id);
  }
}
