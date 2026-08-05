export type ReportQuickPeriod =
  | 'hoje'
  | 'ontem'
  | '7d'
  | '30d'
  | '90d'
  | 'mes_atual'
  | 'mes_anterior'
  | 'ano_atual'
  | 'ano_anterior'
  | 'personalizado';

export interface ReportFilter {
  period?: ReportQuickPeriod;
  startDate?: string;
  endDate?: string;

  companyId?: string;
  unitId?: string;
  farmId?: string;
  sectorId?: string;
  locationId?: string;
  costCenterId?: string;

  equipmentId?: string;
  equipmentTypeId?: string;
  brandId?: string;
  modelId?: string;

  responsibleName?: string;
  teamName?: string;
  status?: string;

  groupBy?: 'equipamento' | 'tipo' | 'unidade' | 'mes' | 'status' | 'nenhum';
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  search?: string;
}
