import { PrismaClient } from '@prisma/client';

export async function seedMasterData(prisma: PrismaClient) {
  const eqType = await prisma.equipmentType.upsert({
    where: { code: 'TRATOR' },
    update: {},
    create: {
      id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
      code: 'TRATOR',
      name: 'Trator de Pneus',
      status: 'ativo',
    },
  });

  const brand = await prisma.brand.upsert({
    where: { code: 'VALTRA' },
    update: {},
    create: {
      id: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
      code: 'VALTRA',
      name: 'Valtra',
      status: 'ativo',
    },
  });

  const model = await prisma.model.upsert({
    where: { id: 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a77' },
    update: {},
    create: {
      id: 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
      brandId: brand.id,
      code: 'A750',
      name: 'Valtra A750',
      powerHp: 75,
      status: 'ativo',
    },
  });

  const unitMeasure = await prisma.unitMeasure.upsert({
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

  console.log('✅ Seeds de Master Data criados/atualizados!');
  return { eqType, brand, model, unitMeasure };
}
