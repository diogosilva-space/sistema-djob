export * from './common';
export * from './auth';
export {
  createTenantSchema as createPlatformTenantSchema,
  updateTenantSchema as updatePlatformTenantSchema,
  createAdminUserSchema,
  updateAdminUserSchema,
  userRoleSchema,
  type CreateTenantInput as CreatePlatformTenantInput,
  type UpdateTenantInput as UpdatePlatformTenantInput,
  type CreateAdminUserInput,
  type UpdateAdminUserInput,
} from './admin';
export * from './crm';
export * from './pcp';
export * from './vendas';
export * from './estoque';
export * from './products';
export * from './rh';
export * from './logistica';
export * from './financeiro';
export * from './tenant';
export * from './dashboard';
