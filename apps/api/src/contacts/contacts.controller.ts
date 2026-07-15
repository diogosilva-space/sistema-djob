import { Body, Controller, Get, Param, Patch, Post, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ContactListQuery,
  CreateContactInput,
  UpdateContactInput,
  contactListQuerySchema,
  createContactSchema,
  updateContactSchema,
} from '@djob/validators';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ROLES_KEY, RolesGuard } from '../common/guards/roles.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

import { ContactsService } from './contacts.service';

@ApiTags('Contacts')
@ApiBearerAuth()
@Controller('contacts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER', 'OPERATOR', 'VIEWER'])
  findAll(
    @CurrentUser() user: { tenantId: string },
    @Query(new ZodValidationPipe(contactListQuerySchema)) query: ContactListQuery,
  ) {
    return this.contactsService.findAll(user.tenantId, query);
  }

  @Get(':id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER', 'OPERATOR', 'VIEWER'])
  findOne(@CurrentUser() user: { tenantId: string }, @Param('id') id: string) {
    return this.contactsService.findOne(user.tenantId, id);
  }

  @Post()
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER'])
  create(
    @CurrentUser() user: { tenantId: string },
    @Body(new ZodValidationPipe(createContactSchema)) data: CreateContactInput,
  ) {
    return this.contactsService.create(user.tenantId, data);
  }

  @Patch(':id')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER', 'SELLER'])
  update(
    @CurrentUser() user: { tenantId: string },
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateContactSchema)) data: UpdateContactInput,
  ) {
    return this.contactsService.update(user.tenantId, id, data);
  }

  @Patch(':id/toggle')
  @SetMetadata(ROLES_KEY, ['ADMIN', 'MANAGER'])
  toggleActive(@CurrentUser() user: { tenantId: string }, @Param('id') id: string) {
    return this.contactsService.toggleActive(user.tenantId, id);
  }
}
