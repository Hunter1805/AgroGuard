import type { MasterDataBase } from './master-data';

export type SupplierClassification =
  | 'pecas'
  | 'insumos'
  | 'pneus'
  | 'ferramentas'
  | 'oficina'
  | 'servico_tecnico'
  | 'calibracao'
  | 'transporte'
  | 'locacao'
  | 'equipamentos'
  | 'outro';

export interface SupplierMaster extends MasterDataBase {
  personType: 'juridica' | 'fisica';
  corporateName: string;
  tradeName?: string;
  documentNumber: string; // CNPJ ou CPF único
  stateRegistration?: string;

  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  contactPersonName?: string;

  zipCode?: string;
  address?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;

  classifications: SupplierClassification[];
  averageDeliveryDays?: number;
  paymentTerms?: string;
  ratingStars?: number; // 1 a 5
  documentsCount?: number;
}

export interface PartCategoryMaster extends MasterDataBase {
  parentCategoryId?: string;
  parentCategoryName?: string;
}

export interface ToolCategoryMaster extends MasterDataBase {
  parentCategoryId?: string;
  parentCategoryName?: string;
}

export type UnitMeasureGroup =
  | 'quantidade'
  | 'volume'
  | 'massa'
  | 'comprimento'
  | 'area'
  | 'pressao'
  | 'temperatura'
  | 'tempo'
  | 'horimetro'
  | 'outro';

export interface UnitMeasureMaster extends MasterDataBase {
  symbol: string;
  group: UnitMeasureGroup;
  allowsDecimal: boolean;
  decimalPlaces: number;
}

export interface DocumentTypeMaster extends MasterDataBase {
  requiresExpirationDate: boolean;
  requiresDocumentNumber: boolean;
  requiresFile: boolean;
}

export interface ServiceTypeMaster extends MasterDataBase {}

export interface SpecialtyMaster extends MasterDataBase {}
