import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-confeccao' },
    update: {},
    create: {
      name: 'Demo Confecção',
      slug: 'demo-confeccao',
      document: '12345678000199',
    },
  });

  // Create admin user
  const admin = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'admin@demo.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Admin User',
      email: 'admin@demo.com',
      passwordHash: 'dummy_hash', // To be replaced with real hash in auth module
      role: 'ADMIN',
    },
  });

  console.log(`Created tenant: ${tenant.name}`);
  console.log(`Created user: ${admin.email}`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
