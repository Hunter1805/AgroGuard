export type ToolCalibrationResult =
  | 'aprovada'
  | 'aprovada_com_restricao'
  | 'reprovada'
  | 'aguardando_resultado';

export interface ToolCalibration {
  id: string;
  toolId: string;
  toolCode: string;
  toolName: string;
  calibrationType: string;
  sentDate: string; // ISO String
  calibrationDate?: string; // ISO String
  nextCalibrationDate?: string; // ISO String
  responsibleCompany: string;
  certificateNumber?: string;
  result: ToolCalibrationResult;
  deviationFound?: string;
  adjustmentMade?: string;
  cost?: number;
  warrantyUntil?: string;
  responsibleName: string;
  notes?: string;
}
