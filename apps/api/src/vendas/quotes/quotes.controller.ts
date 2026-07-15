import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QuotesService } from './quotes.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  createQuoteSchema,
  updateQuoteSchema,
  CreateQuoteInput,
  UpdateQuoteInput,
} from '@djob/validators';

@ApiTags('Vendas - Orçamentos')
@Controller('vendas/quotes')
@UseGuards(JwtAuthGuard)
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(createQuoteSchema))
    createDto: CreateQuoteInput,
  ) {
    return this.quotesService.create(user.tenantId, createDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.quotesService.findAll(user.tenantId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.quotesService.findOne(user.tenantId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateQuoteSchema))
    updateDto: UpdateQuoteInput,
  ) {
    return this.quotesService.update(user.tenantId, id, updateDto);
  }

  @Post(':id/convert')
  convertToOrder(@CurrentUser() user: any, @Param('id') id: string) {
    return this.quotesService.convertToOrder(user.tenantId, id);
  }
}
