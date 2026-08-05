import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedProduction() {
  console.log('🏭 Executando Seed Estrutural de Produção (AgroGuard v1.0.0)...');

  // 1. Perfis Oficiais
  const adminRole = await prisma.role.upsert({
    where: { code: 'ADMIN' },
    update: {},
    create: {
      id: 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
      code: 'ADMIN',
      name: 'Administrador do Sistema',
      description: 'Acesso irrestrito e controle completo da organização.',
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
      description: 'Execução e apontamento técnico em Ordens de Serviço.',
      systemRole: false,
      active: true,
    },
  });

  // 2. Unidades de Medida Básicas
  const unitMeasureUN = await prisma.unitMeasure.upsert({
    where: { code: 'UN' },
    update: {},
    create: {
      id: 'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a88',
      code: 'UN',
      name: 'Unidade',
      symbol: 'UN',
      status: 'ativo',
    },
  });

  // 3. Numeração Sequencial Inicial para Ordens de Serviço
  const woSequence = await prisma.numberSequence.upsert({
    where: { entityType: 'work_order' },
    update: {},
    create: {
      entityType: 'work_order',
      prefix: 'OS',
      nextValue: 10001,
      digitsCount: 5,
    },
  });

  console.log('✅ Seed Estrutural de Produção concluído sem dados de teste!');
  return { adminRole, mecanicoRole, unitMeasureUN, woSequence };
}

if (require.main === module) {
  seedProduction()
    .catch((e) => {
      console.error('❌ Erro no seed de produção:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
