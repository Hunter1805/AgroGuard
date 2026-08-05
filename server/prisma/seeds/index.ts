import { PrismaClient } from '@prisma/client';
import { seedOrganizations } from './organization.seed';
import { seedMasterData } from './master-data.seed';
import { seedRoles } from './roles.seed';
import { seedUsers } from './users.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando carga de Seeds no PostgreSQL...');
  await seedOrganizations(prisma);
  await seedMasterData(prisma);
  await seedRoles(prisma);
  await seedUsers(prisma);
  console.log('🎉 Carga de seeds concluída com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a execução dos seeds:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
