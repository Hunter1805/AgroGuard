import type { MasterDataBase } from './master-data';

export interface EquipmentTypeMaster extends MasterDataBase {
  iconName?: string;
  usesHorimeter: boolean;
  usesOdometer: boolean;
  canHaveTires: boolean;
  canHaveImplement: boolean;
}

export interface EquipmentCategoryMaster extends MasterDataBase {
  equipmentTypeId?: string;
  equipmentTypeName?: string;
}

export interface EquipmentSubcategoryMaster extends MasterDataBase {
  categoryId: string;
  categoryName?: string;
}

export interface BrandMaster extends MasterDataBase {
  manufacturer?: string;
  country?: string;
  website?: string;
  contactInfo?: string;
}

export interface ModelMaster extends MasterDataBase {
  brandId: string;
  brandName?: string;
  equipmentTypeId?: string;
  categoryId?: string;
  subcategoryId?: string;
  startYear?: number;
  endYear?: number;
  defaultFuelType?: string;
  powerHp?: number;
  defaultMeterType?: 'horimetro' | 'odometro' | 'ambos';
  defaultTireConfig?: string;
  suggestedPreventivePlanId?: string;
}

export interface FuelTypeMaster extends MasterDataBase {
  consumptionUnit: 'L/h' | 'L/km' | 'kWh' | 'kg/h';
}

export interface OwnershipTypeMaster extends MasterDataBase {
  requiresSupplier: boolean;
  requiresContract: boolean;
  requiresEndDate: boolean;
}
