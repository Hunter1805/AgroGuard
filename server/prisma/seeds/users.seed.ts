import { PrismaClient } from '@prisma/client';

export async function seedUsers(prisma: PrismaClient) {
  const adminUser = await prisma.user.upsert({
    where: { email: 'carlos.eduardo@agroguard.com.br' },
    update: {},
    create: {
      id: 'e5eebc99-9c0b-4ef8-bb6d-6bb9bd380bb1',
      name: 'Carlos Eduardo',
      email: 'carlos.eduardo@agroguard.com.br',
      employeeCode: 'MAT-1001',
      type: 'interno',
      status: 'ativo',
    },
  });

  const mecanicoUser = await prisma.user.upsert({
    where: { email: 'lucas.pereira@agroguard.com.br' },
    update: {},
    create: {
      id: 'f6eebc99-9c0b-4ef8-bb6d-6bb9bd380bb2',
      name: 'Lucas Pereira',
      email: 'lucas.pereira@agroguard.com.br',
      employeeCode: 'MAT-1002',
      type: 'interno',
      status: 'ativo',
    },
  });

  console.log('✅ Seeds de Usuários criados/atualizados!');
  return { adminUser, mecanicoUser };
}
