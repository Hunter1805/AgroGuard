export type MeterReadingSource =
  | 'manual'
  | 'checklist'
  | 'ordem_servico'
  | 'manutencao'
  | 'importacao'
  | 'integracao';

export type MeterReadingStatus =
  | 'valida'
  | 'suspeita'
  | 'pendente_aprovacao'
  | 'corrigida'
  | 'rejeitada'
  | 'cancelada';

export type ReadingValidationType =
  | 'normal'
  | 'regressiva'
  | 'duplicada'
  | 'muito_alta'
  | 'retroativa';

export interface MeterReading {
  id: string;
  equipmentId: string;
  equipmentName?: string;
  equipmentCode?: string;
  meterId: string;
  meterName?: string;
  meterType: 'horimetro' | 'odometro';
  unit: 'h' | 'km';

  previousValue: number;
  value: number;
  difference: number;
  readingAt: string; // YYYY-MM-DD HH:mm

  source: MeterReadingSource;
  status: MeterReadingStatus;
  validationType: ReadingValidationType;

  photoUrl?: string;
  notes?: string;
  justification?: string;

  createdBy: string;
  createdAt: string;

  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;

  correctedFromReadingId?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export interface MeterReplacement {
  id: string;
  equipmentId: string;
  previousMeterId: string;
  newMeterId: string;
  replacementAt: string;
  reason: string;
  previousFinalReading: number;
  newInitialReading: number;
  newSerialNumber?: string;
  photoUrl?: string;
  documentUrl?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface ReadingValidationResult {
  type: ReadingValidationType;
  requiresJustification: boolean;
  requiresApproval: boolean;
  blocksMeterUpdate: boolean;
  message?: string;
}

export interface ReadingStats {
  readingsToday: number;
  equipmentsOverdue: number;
  suspiciousReadings: number;
  pendingApproval: number;
  activeMeters: number;
  equipmentsWithoutMeter: number;
}

export interface ReadingsFilterState {
  search: string;
  meterType: 'todos' | 'horimetro' | 'odometro';
  status: 'todos' | MeterReadingStatus;
  source: 'todos' | MeterReadingSource;
  responsible: string;
  period: 'todos' | 'hoje' | '30' | '90';
  equipmentId: string;
  onlySuspicious: boolean;
  onlyRegressive: boolean;
  onlyCorrected: boolean;
}

export interface CreateReadingInput {
  equipmentId: string;
  meterId: string;
  meterType: 'horimetro' | 'odometro';
  unit: 'h' | 'km';
  previousValue: number;
  value: number;
  readingAt: string;
  source: MeterReadingSource;
  photoUrl?: string;
  notes?: string;
  justification?: string;
  createdBy: string;
}
