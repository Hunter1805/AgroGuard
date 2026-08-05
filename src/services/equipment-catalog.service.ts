import type {
  EquipmentTypeMaster, EquipmentCategoryMaster, EquipmentSubcategoryMaster,
  BrandMaster, ModelMaster, FuelTypeMaster, OwnershipTypeMaster
} from '../types/equipment-master-data';

let mockTypes: EquipmentTypeMaster[] = [
  { id: 'te-01', code: 'TRATOR', name: 'Trator de Pneus', iconName: 'Tractor', usesHorimeter: true, usesOdometer: false, canHaveTires: true, canHaveImplement: true, status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'te-02', code: 'COLHEDORA', name: 'Colhedora de Grãos', iconName: 'Tractor', usesHorimeter: true, usesOdometer: false, canHaveTires: true, canHaveImplement: false, status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'te-03', code: 'CAMINHAO', name: 'Caminhão Pipoca / Basculante', iconName: 'Truck', usesHorimeter: true, usesOdometer: true, canHaveTires: true, canHaveImplement: true, status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

let mockCategories: EquipmentCategoryMaster[] = [
  { id: 'cat-01', code: 'TRATOR_MEDIO', name: 'Tratores Médios (75-120 CV)', equipmentTypeId: 'te-01', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

let mockSubcategories: EquipmentSubcategoryMaster[] = [
  { id: 'sub-01', code: 'TRATOR_4X4', name: 'Tratores 4x4 Cabinados', categoryId: 'cat-01', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

let mockBrands: BrandMaster[] = [
  { id: 'mar-01', code: 'VALTRA', name: 'Valtra', manufacturer: 'AGCO Corporation', country: 'Finlândia / Brasil', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'mar-02', code: 'MASSEY', name: 'Massey Ferguson', manufacturer: 'AGCO Corporation', country: 'Estados Unidos / Brasil', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'mar-03', code: 'JACTO', name: 'Jacto', manufacturer: 'Jacto Máquinas Agrícolas', country: 'Brasil', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

let mockModels: ModelMaster[] = [
  { id: 'mod-01', code: 'A750', name: 'Valtra A750 14', brandId: 'mar-01', brandName: 'Valtra', equipmentTypeId: 'te-01', defaultFuelType: 'Diesel S10', powerHp: 75, defaultMeterType: 'horimetro', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'mod-02', code: 'MF265', name: 'Massey Ferguson 265', brandId: 'mar-02', brandName: 'Massey Ferguson', equipmentTypeId: 'te-01', defaultFuelType: 'Diesel', powerHp: 65, defaultMeterType: 'horimetro', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

let mockFuelTypes: FuelTypeMaster[] = [
  { id: 'comb-01', code: 'DIESEL_S10', name: 'Diesel S10', consumptionUnit: 'L/h', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'comb-02', code: 'GASOLINA', name: 'Gasolina Comum', consumptionUnit: 'L/km', status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

let mockOwnershipTypes: OwnershipTypeMaster[] = [
  { id: 'prop-01', code: 'PROPRIO', name: 'Próprio', requiresSupplier: false, requiresContract: false, requiresEndDate: false, status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
  { id: 'prop-02', code: 'ALUGADO', name: 'Alugado / Arrendado', requiresSupplier: true, requiresContract: true, requiresEndDate: true, status: 'ativo', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z', createdBy: 'Sistema' },
];

export const equipmentCatalogService = {
  async getEquipmentTypes(): Promise<EquipmentTypeMaster[]> { return mockTypes; },
  async getCategories(): Promise<EquipmentCategoryMaster[]> { return mockCategories; },
  async getSubcategories(): Promise<EquipmentSubcategoryMaster[]> { return mockSubcategories; },
  async getBrands(): Promise<BrandMaster[]> { return mockBrands; },
  async getModels(): Promise<ModelMaster[]> { return mockModels; },
  async getFuelTypes(): Promise<FuelTypeMaster[]> { return mockFuelTypes; },
  async getOwnershipTypes(): Promise<OwnershipTypeMaster[]> { return mockOwnershipTypes; },
};
