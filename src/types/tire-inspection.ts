export type TireInspectionType =
  | 'rotina'
  | 'pre_operacao'
  | 'semanal'
  | 'manutencao'
  | 'emergencial'
  | 'personalizada';

export type TireInspectionResult =
  | 'conforme'
  | 'atencao'
  | 'nao_conforme'
  | 'critico';

export type TireInspectionRecommendedAction =
  | 'nenhuma'
  | 'calibrar'
  | 'reparar'
  | 'rodiziar'
  | 'recapar'
  | 'substituir'
  | 'bloquear_equipamento'
  | 'criar_os';

export interface TireInspectionHeader {
  id: string;
  equipmentId: string;
  inspectionType: TireInspectionType;
  date: string; // ISO
  responsibleId: string;
  responsibleName: string;
  horimeterReading?: number;
  odometerReading?: number;
  location?: string;
  notes?: string;
  items: TireInspectionItem[];
  overallResult: TireInspectionResult;
  createdAt: string;
}

export interface TireInspectionItem {
  id: string;
  positionId: string;
  positionName: string;
  tireId: string;
  tireCode: string;

  measuredPressure?: number;
  recommendedPressure?: number;
  pressureDifference?: number;
  pressureUnit: 'psi' | 'bar' | 'kpa';

  measuredTreadDepth?: number;

  anomalies: TireAnomaly[];

  photoUrl?: string;
  notes?: string;

  result: TireInspectionResult;
  recommendedAction: TireInspectionRecommendedAction;
}

export type TireAnomaly =
  | 'desgaste_irregular'
  | 'desgaste_interno'
  | 'desgaste_externo'
  | 'corte'
  | 'bolha'
  | 'rachadura'
  | 'objeto_perfurante'
  | 'vazamento'
  | 'aquecimento_anormal'
  | 'porca_frouxa'
  | 'aro_danificado'
  | 'camara_danificada';

export interface TireCalibrationLog {
  id: string;
  equipmentId: string;
  tireId: string;
  positionId: string;
  
  previousPressure?: number;
  adjustedPressure: number;
  recommendedPressure?: number;
  unit: 'psi' | 'bar' | 'kpa';
  
  date: string;
  responsibleId: string;
  responsibleName: string;
  equipmentUsed?: string;
  notes?: string;
}
