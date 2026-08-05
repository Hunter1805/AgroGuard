import type {
  AssetType,
  EquipmentStatus,
  MeterType,
  MeterConfig,
  EquipmentDocument,
  EquipmentImage,
} from './equipment';

export interface EquipmentFormData {
  id?: string;
  // Etapa 1: Identificação e Dados Básicos
  assetType: AssetType;
  name: string;
  brand: string;
  model: string;
  year?: string;
  plateOrCode: string;
  patrimony?: string;
  serialNumber?: string;

  // Etapa 2: Localização e Alocação
  farm: string;
  sector: string;
  location: string;
  operatorName?: string;

  // Etapa 3: Situação Operacional e Medidores
  status: EquipmentStatus;
  fuelLevel: number;
  meterType: MeterType;
  currentHours: number; // Mantido para compatibilidade rápida
  meters: MeterConfig[]; // Coleção flexível de medidores (horímetro, odômetro, etc.)

  // Etapa 4: Informações Técnicas
  fuelType?: string;
  enginePower?: string;
  transmissionType?: string;
  tankCapacity?: string;
  operatingWeight?: string;
  notes?: string;

  // Etapa 5: Pneus e Manutenção Preventiva
  tireConfig?: string;
  maintenancePlanId?: string;
  maintenancePlanName?: string;
  maintenanceInterval?: number; // em horas ou km
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;

  // Etapa 6: Documentos, Imagens e Revisão Final
  documents: EquipmentDocument[];
  images: EquipmentImage[];
  isDraft?: boolean;
}

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface StepConfig {
  number: FormStep;
  title: string;
  subtitle: string;
}

export const FORM_STEPS: StepConfig[] = [
  { number: 1, title: 'Identificação', subtitle: 'Nome, tipo, marca, modelo e registros' },
  { number: 2, title: 'Localização', subtitle: 'Fazenda, setor e operador responsável' },
  { number: 3, title: 'Operacional & Medidores', subtitle: 'Status, combustível e coleção de medidores' },
  { number: 4, title: 'Ficha Técnica', subtitle: 'Motor, transmissão, potência e especificações' },
  { number: 5, title: 'Pneus & Manutenção', subtitle: 'Rodados, esteiras e planos preventivos' },
  { number: 6, title: 'Documentos & Revisão', subtitle: 'Anexos, imagens e conferência final' },
];
