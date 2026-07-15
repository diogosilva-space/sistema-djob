import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductionStepsService } from './production-steps.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CreateProductionStepInput,
  UpdateProductionStepInput,
  CreateProductionLogInput,
} from '@djob/validators';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  createProductionStepSchema,
  updateProductionStepSchema,
  createProductionLogSchema,
} from '@djob/validators';
import { Request } from 'express';

@ApiTags('PCP - Etapas de Produção')
@Controller('pcp/production-steps')
@UseGuards(JwtAuthGuard)
export class ProductionStepsController {
  constructor(private readonly productionStepsService: ProductionStepsService) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(createProductionStepSchema))
    createDto: CreateProductionStepInput,
  ) {
    return this.productionStepsService.create(user.tenantId, createDto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProductionStepSchema))
    updateDto: UpdateProductionStepInput,
  ) {
    return this.productionStepsService.update(user.tenantId, id, updateDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.productionStepsService.remove(user.tenantId, id);
  }

  @Post('logs')
  createLog(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(createProductionLogSchema))
    createDto: CreateProductionLogInput,
  ) {
    const responsibleName = user?.name || 'Sistema';
    return this.productionStepsService.createLog(user.tenantId, createDto, responsibleName);
  }
}
