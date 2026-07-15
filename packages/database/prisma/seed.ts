import * as argon2 from 'argon2';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

const platformTenant = {
  name: 'D.job Platform',
  slug: 'platform',
};

const superAdmin = {
  name: 'Administrador da Plataforma',
  email: 'admin@djob.com.br',
  password: 'Admin@2026!',
};

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: platformTenant.slug },
    update: { name: platformTenant.name, isActive: true },
    create: {
      ...platformTenant,
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: superAdmin.email },
    update: {
      name: superAdmin.name,
      role: UserRole.SUPER_ADMIN,
      tenantId: tenant.id,
      isActive: true,
    },
    create: {
      name: superAdmin.name,
      email: superAdmin.email,
      passwordHash: await argon2.hash(superAdmin.password),
      tenantId: tenant.id,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  const demoTenant = await prisma.tenant.upsert({
    where: { slug: 'demo-confeccao' },
    update: {},
    create: {
      name: 'Demo Confecção',
      slug: 'demo-confeccao',
      document: '12345678000199',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {
      tenantId: demoTenant.id,
      name: 'Admin User',
      role: UserRole.ADMIN,
      isActive: true,
    },
    create: {
      tenantId: demoTenant.id,
      name: 'Admin User',
      email: 'admin@demo.com',
      passwordHash: await argon2.hash('Admin@2026!'),
      role: UserRole.ADMIN,
    },
  });
}

main()
  .then(() => {
    console.info(`Super Admin disponível em ${superAdmin.email}.`);
  })
  .catch((error: unknown) => {
    console.error('Falha ao criar o Super Admin inicial.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
