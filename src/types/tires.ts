export type TireStatus =
  | 'disponivel'
  | 'instalado'
  | 'reservado'
  | 'em_reparo'
  | 'em_recapagem'
  | 'recapado'
  | 'condenado'
  | 'descartado'
  | 'perdido';

export type TireCondition =
  | 'novo'
  | 'bom'
  | 'atencao'
  | 'critico'
  | 'inutilizavel';

export interface Tire {
  id: string;
  internalCode: string;

  brand?: string;
  model?: string;
  size: string;
  constructionType?: 'radial' | 'diagonal';
  application?: string;

  serialNumber?: string;
  dotCode?: string;
  manufacturingDate?: string;

  acquisitionDate?: string;
  acquisitionValue?: number;
  supplierId?: string;
  warrantyEndDate?: string;

  initialTreadDepth?: number;
  currentTreadDepth?: number;
  minimumTreadDepth?: number;

  recommendedMinimumPressure?: number;
  recommendedMaximumPressure?: number;
  pressureUnit: 'psi' | 'bar' | 'kpa';

  hasTube: boolean;
  usesWaterBallast: boolean;

  status: TireStatus;
  condition: TireCondition;

  currentEquipmentId?: string;
  currentPositionId?: string;

  installationDate?: string;
  installationReading?: number;
  installationReadingUnit?: 'h' | 'km';

  accumulatedHours?: number;
  accumulatedKilometers?: number;

  retreadCount: number;
  maximumRetreads?: number;

  notes?: string;
  mainPhotoUrl?: string;

  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface EquipmentTireConfiguration {
  id: string;
  equipmentId: string;

  axleCount: number;
  spareTireCount: number;

  axles: EquipmentAxle[];

  pressureUnit: 'psi' | 'bar' | 'kpa';
  active: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface EquipmentAxle {
  id: string;
  order: number;
  name: string;

  type:
    | 'direcional'
    | 'tracao'
    | 'livre'
    | 'implemento'
    | 'motriz'
    | 'outro';

  sideConfiguration:
    | 'simples'
    | 'duplo'
    | 'triplo';

  positions: TirePosition[];
}

export interface TirePosition {
  id: string;
  code: string;
  name: string;

  axleId: string;
  axleOrder: number;

  side: 'esquerdo' | 'direito' | 'central' | 'estepe';
  innerOrOuter?: 'interno' | 'externo';

  installedTireId?: string;

  recommendedSize?: string;
  recommendedMinimumPressure?: number;
  recommendedMaximumPressure?: number;
}
