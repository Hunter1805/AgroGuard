import { PrismaClient } from '@prisma/client';

export class MasterDataRepository {
  constructor(private prisma: PrismaClient) {}

  async getEquipmentTypes() { return this.prisma.equipmentType.findMany({ where: { status: 'ativo' } }); }
  async getBrands() { return this.prisma.brand.findMany({ where: { status: 'ativo' }, include: { models: true } }); }
  async getModels() { return this.prisma.model.findMany({ where: { status: 'ativo' }, include: { brand: true } }); }
  async getTechnicalSystems() { return this.prisma.technicalSystem.findMany({ where: { status: 'ativo' }, include: { subsystems: { include: { components: true } } } }); }
  async getSuppliers() { return this.prisma.supplier.findMany({ where: { status: 'ativo' } }); }
  async getUnitMeasures() { return this.prisma.unitMeasure.findMany({ where: { status: 'ativo' } }); }
}
