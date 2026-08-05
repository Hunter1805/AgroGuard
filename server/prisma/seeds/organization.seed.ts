import { PrismaClient } from '@prisma/client';

export async function seedOrganizations(prisma: PrismaClient) {
  const org = await prisma.organization.upsert({
    where: { code: 'ORG-AGRO' },
    update: {},
    create: {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      code: 'ORG-AGRO',
      name: 'AgroGuard Operações Agrícolas',
      status: 'ativo',
    },
  });

  const company = await prisma.company.upsert({
    where: { organizationId_code: { organizationId: org.id, code: 'EMP-001' } },
    update: {},
    create: {
      id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
      organizationId: org.id,
      code: 'EMP-001',
      name: 'AgroGuard Operações Agrícolas Ltda',
      tradeName: 'AgroGuard Agrícola',
      cnpj: '12.345.678/0001-90',
      status: 'ativo',
    },
  });

  const unit = await prisma.unit.upsert({
    where: { organizationId_code: { organizationId: org.id, code: 'UND-001' } },
    update: {},
    create: {
      id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
      organizationId: org.id,
      companyId: company.id,
      code: 'UND-001',
      name: 'Unidade Central Ribeirão',
      type: 'matriz',
      city: 'Ribeirão Preto',
      state: 'SP',
      status: 'ativo',
    },
  });

  const farm = await prisma.farm.upsert({
    where: { organizationId_code: { organizationId: org.id, code: 'FZM-001' } },
    update: {},
    create: {
      id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
      organizationId: org.id,
      companyId: company.id,
      unitId: unit.id,
      code: 'FZM-001',
      name: 'Fazenda Santa Maria',
      totalAreaHectares: 1250.0,
      status: 'ativo',
    },
  });

  console.log('✅ Seeds Organizacionais criados/atualizados com sucesso!');
  return { org, company, unit, farm };
}
