import type { MasterDataBase } from './master-data';

export interface Company extends MasterDataBase {
  corporateName: string; // Razão Social
  tradeName: string; // Nome Fantasia
  cnpj?: string;
  stateRegistration?: string; // Inscrição Estadual
  municipalRegistration?: string;
  segment?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  responsibleName?: string;
  logoUrl?: string;
}

export type UnitType =
  | 'matriz'
  | 'filial'
  | 'fazenda'
  | 'oficina'
  | 'centro_distribuicao'
  | 'almoxarifado'
  | 'base_operacional'
  | 'outro';

export interface Unit extends MasterDataBase {
  companyId: string;
  companyName?: string;
  type: UnitType;
  address?: string;
  city?: string;
  state?: string;
  responsibleName?: string;
  phone?: string;
  email?: string;
  mainCostCenterId?: string;
}

export interface Farm extends MasterDataBase {
  companyId: string;
  unitId?: string;
  totalAreaHectares?: number;
  city?: string;
  state?: string;
  coordinates?: string;
  responsibleName?: string;
  phone?: string;
}

export interface Sector extends MasterDataBase {
  companyId: string;
  unitId?: string;
  farmId?: string;
  responsibleName?: string;
}

export type LocationType =
  | 'patio'
  | 'oficina'
  | 'galpao'
  | 'talhao'
  | 'almoxarifado'
  | 'armario'
  | 'linha_producao'
  | 'area_externa'
  | 'outro';

export interface LocationItem extends MasterDataBase {
  type: LocationType;
  companyId?: string;
  unitId?: string;
  farmId?: string;
  sectorId?: string;
  parentLocationId?: string; // Para hierarquia galpão -> armário
  parentLocationName?: string;
  addressOrReference?: string;
  responsibleName?: string;
}

export interface CostCenter extends MasterDataBase {
  companyId: string;
  unitId?: string;
  farmId?: string;
  managerName?: string;
  startDate?: string;
  endDate?: string;
  isClosed?: boolean;
}

export interface Workshop extends MasterDataBase {
  type: 'interna' | 'terceirizada' | 'movel';
  companyId?: string;
  unitId?: string;
  farmId?: string;
  supplierId?: string;
  responsibleName?: string;
  specialties?: string[];
  phone?: string;
  email?: string;
}

export interface Warehouse extends MasterDataBase {
  companyId?: string;
  unitId?: string;
  farmId?: string;
  locationId?: string;
  responsibleName?: string;
  allowsStock: boolean;
  allowsTools: boolean;
}

export interface Team extends MasterDataBase {
  type: 'manutencao' | 'operacao' | 'mecanica' | 'eletrica' | 'hidraulica' | 'pneus' | 'almoxarifado' | 'inspecao' | 'outro';
  supervisorName?: string;
  membersCount: number;
  companyId?: string;
  unitId?: string;
  shift?: 'diurno' | 'noturno' | 'rotativo';
}
