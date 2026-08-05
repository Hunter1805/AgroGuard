export type EquipmentStatus =
  | 'operante'
  | 'em_operacao'
  | 'manutencao'
  | 'parado'
  | 'bloqueado'
  | 'inoperante';

export type AssetType =
  | 'Trator'
  | 'Colhedora'
  | 'Implemento'
  | 'Veículo'
  | 'Moto'
  | 'Caminhão';

export type MeterType = 'horimetro' | 'odometro' | 'nenhum' | 'ambos';

export interface MeterConfig {
  id: string;
  type: 'horimetro' | 'odometro' | 'outros';
  label: string;
  currentValue: number;
  unit: string;
  lastReadingDate?: string;
  requirePhoto?: boolean;
}

export type MaintenanceSituation = 'todas' | 'vencida' | 'proxima' | 'em_dia';

export interface EquipmentDocument {
  id: string;
  name: string;
  url: string;
  type?: string;
  size?: string;
  uploadedAt?: string;
}

export interface EquipmentImage {
  id: string;
  name: string;
  url: string;
}

export interface Equipment {
  id: string;
  assetId?: string; // ID do ativo conforme planilha (ex: "1", "22", "19-20-21")
  assetType: AssetType;
  name: string; // Nome descritivo (ex: TRATOR MASSEY 265 01 4x2)
  brand: string; // Marca (ex: Massey Ferguson)
  model: string; // Modelo (ex: 265)
  year?: string; // Ano de fabricação
  plateOrCode: string; // Placa ou código interno
  status: EquipmentStatus;
  location: string;
  farm?: string; // Fazenda/Unidade
  sector?: string; // Setor/Área
  currentHours: number; // Horímetro ou odômetro principal
  meterType?: MeterType; // Tipo principal de medidor
  meters?: MeterConfig[]; // Coleção flexível de medidores
  fuelLevel: number;
  lastReadingDate?: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  maintenanceStatus?: 'vencida' | 'proxima' | 'em_dia';
  patrimony?: string; // Número de patrimônio
  serialNumber?: string; // Número de série / Chassi
  operatorName?: string; // Operador atual responsável
  hasPendingAlert?: boolean; // Se possui alerta pendente
  isReadingOverdue?: boolean; // Se a leitura está atrasada (> 3 dias)
  isArchived?: boolean;
  archiveReason?: string;
  archivedAt?: string;
  
  // Informações Técnicas & Pneus
  fuelType?: string;
  enginePower?: string;
  transmissionType?: string;
  tankCapacity?: string;
  operatingWeight?: string;
  tireConfig?: string;
  maintenancePlanId?: string;
  maintenancePlanName?: string;
  maintenanceInterval?: number;
  notes?: string;

  // Anexos
  documents?: EquipmentDocument[];
  images?: EquipmentImage[];
}

export interface EquipmentStats {
  total: number;
  operantes: number;
  emOperacao: number;
  emManutencao: number;
  parados: number;
  bloqueados: number;
  alertasPendentes: number;
  manutencoesVencidas: number;
  leiturasAtrasadas: number;
}
