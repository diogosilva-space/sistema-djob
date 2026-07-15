import { Controller, Get, Post, Patch, Param, Delete, Body, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard, ROLES_KEY } from '../common/guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  createProductSchema,
  updateProductSchema,
  CreateProductInput,
  UpdateProductInput,
} from '@djob/validators';

@ApiTags('Produtos')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER'])
  create(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(createProductSchema)) data: CreateProductInput,
  ) {
    return this.productsService.create(user.tenantId, data);
  }

  @Get()
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER', 'OPERATOR', 'VIEWER'])
  findAll(@CurrentUser() user: any) {
    return this.productsService.findAll(user.tenantId);
  }

  @Get(':id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER', 'OPERATOR', 'VIEWER'])
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.productsService.findOne(user.tenantId, id);
  }

  @Patch(':id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER'])
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProductSchema)) data: UpdateProductInput,
  ) {
    return this.productsService.update(user.tenantId, id, data);
  }

  @Delete(':id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER'])
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.productsService.remove(user.tenantId, id);
  }
}
