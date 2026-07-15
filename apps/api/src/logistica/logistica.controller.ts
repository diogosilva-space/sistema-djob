import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { LogisticaService } from './logistica.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard, ROLES_KEY } from '../common/guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  createShipmentSchema,
  updateShipmentSchema,
  CreateShipmentInput,
  UpdateShipmentInput,
} from '@djob/validators';

@ApiTags('Logística')
@ApiBearerAuth()
@Controller('logistica')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LogisticaController {
  constructor(private readonly logisticaService: LogisticaService) {}

  @Get('remessas')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER', 'OPERATOR', 'VIEWER'])
  getShipments(@CurrentUser() user: any) {
    return this.logisticaService.getShipments(user.tenantId);
  }

  @Get('remessas/:id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER', 'OPERATOR', 'VIEWER'])
  getShipmentById(@CurrentUser() user: any, @Param('id') id: string) {
    return this.logisticaService.getShipmentById(user.tenantId, id);
  }

  @Post('remessas')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER', 'OPERATOR'])
  createShipment(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(createShipmentSchema)) data: CreateShipmentInput,
  ) {
    return this.logisticaService.createShipment(user.tenantId, data);
  }

  @Patch('remessas/:id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER', 'OPERATOR'])
  updateShipment(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateShipmentSchema)) data: UpdateShipmentInput,
  ) {
    return this.logisticaService.updateShipment(user.tenantId, id, data);
  }
}
