import { PrismaClient } from '@prisma/client';

export async function seedRoles(prisma: PrismaClient) {
  const adminRole = await prisma.role.upsert({
    where: { code: 'ADMIN' },
    update: {},
    create: {
      id: 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
      code: 'ADMIN',
      name: 'Administrador do Sistema',
      description: 'Acesso irrestrito a todos os recursos.',
      systemRole: true,
      active: true,
    },
  });

  const mecanicoRole = await prisma.role.upsert({
    where: { code: 'MECANICO' },
    update: {},
    create: {
      id: 'd4eebc99-9c0b-4ef8-bb6d-6bb9bd380aa0',
      code: 'MECANICO',
      name: 'Mecânico Diesel',
      description: 'Execução e apontamentos em Ordens de Serviço.',
      systemRole: false,
      active: true,
    },
  });

  console.log('✅ Seeds de Perfis criados/atualizados!');
  return { adminRole, mecanicoRole };
}
