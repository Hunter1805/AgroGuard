export type ToolStatus =
  | 'disponivel'
  | 'emprestada'
  | 'reservada'
  | 'em_uso'
  | 'em_manutencao'
  | 'aguardando_manutencao'
  | 'aguardando_calibracao'
  | 'danificada'
  | 'perdida'
  | 'baixada';

export type ToolCondition =
  | 'nova'
  | 'excelente'
  | 'boa'
  | 'regular'
  | 'ruim'
  | 'inutilizavel';

export type ToolControlType = 'individual' | 'quantidade';

export type ToolPriority = 'Alta' | 'Média' | 'Baixa';

export interface ToolLocation {
  company?: string;
  unit?: string;
  farm?: string;
  workshop?: string;
  warehouse?: string;
  cabinet?: string;
  drawer?: string;
  detailedLocation?: string;
}

export interface Tool {
  id: string; // ex: "TOOL-001"
  code: string; // ex: "FER-001"
  name: string;
  category: string; // ex: "Chaves Chaves", "Medição", "Elétrica", "Pneumática", "Segurança"
  subcategory?: string;
  description?: string;
  technicalSpec?: string;
  controlType: ToolControlType;
  brand?: string;
  model?: string;
  serialNumber?: string;
  patrimonyNumber?: string;
  barcodeOrQr?: string;
  photoUrl?: string;

  // Controle por quantidade ou unitário
  totalQuantity: number;
  availableQuantity: number;
  minimumQuantity?: number;
  unitOfMeasure?: string;

  // Localização
  location: ToolLocation;
  currentResponsibleName?: string;

  // Aquisição & Garantia
  acquisitionDate?: string;
  acquisitionValue?: number;
  supplierName?: string;
  invoiceNumber?: string;
  warrantyEndDate?: string;

  // Conservação & Status
  status: ToolStatus;
  condition: ToolCondition;
  lastInspectionDate?: string;
  notes?: string;
  unavailabilityReason?: string;

  // Calibração
  requiresCalibration?: boolean;
  calibrationType?: string;
  calibrationFrequencyValue?: number;
  calibrationFrequencyUnit?: 'dias' | 'meses' | 'anos';
  lastCalibrationDate?: string;
  nextCalibrationDate?: string;
  calibrationCompany?: string;

  // Manutenção Periódica
  requiresMaintenance?: boolean;
  maintenanceFrequencyDays?: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;

  // Campos legados mantidos para compatibilidade
  priority?: ToolPriority;
  brands?: string;
  quantity?: number;
}

export type ToolReservationStatus =
  | 'solicitada'
  | 'aprovada'
  | 'separada'
  | 'retirada'
  | 'cancelada'
  | 'expirada';

export interface ToolReservation {
  id: string;
  code: string;
  toolId: string;
  toolCode: string;
  toolName: string;
  quantity: number;
  requesterName: string;
  workOrderId?: string;
  workOrderCode?: string;
  equipmentId?: string;
  equipmentName?: string;
  expectedPickupDate: string; // ISO
  expectedReturnDate: string; // ISO
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  justification?: string;
  approverName?: string;
  status: ToolReservationStatus;
  notes?: string;
}

export interface ToolHistoryLog {
  id: string;
  toolId: string;
  toolCode: string;
  date: string; // ISO String
  event:
    | 'cadastro'
    | 'edicao'
    | 'emprestimo'
    | 'devolucao'
    | 'prorrogacao'
    | 'reserva'
    | 'cancelamento_reserva'
    | 'transferencia'
    | 'dano'
    | 'perda'
    | 'recuperacao'
    | 'inclusao_kit'
    | 'conferencia_kit'
    | 'calibracao'
    | 'manutencao'
    | 'baixa';
  responsibleName: string;
  originLocation?: string;
  destinationLocation?: string;
  workOrderId?: string;
  previousCondition?: string;
  newCondition?: string;
  cost?: number;
  notes?: string;
}

export interface ToolsDashboardStats {
  totalTools: number;
  availableTools: number;
  loanedTools: number;
  overdueLoans: number;
  reservedTools: number;
  inMaintenanceTools: number;
  damagedTools: number;
  lostTools: number;
  expiredCalibrations: number;
  upcomingCalibrations: number;
  incompleteKits: number;
  totalPatrimonyValue: number;
}

export interface ToolFilter {
  search?: string;
  category?: string;
  status?: ToolStatus | 'todos';
  condition?: ToolCondition | 'todas';
  location?: string;
  responsible?: string;
  controlType?: ToolControlType | 'todos';
  belowMinimumOnly?: boolean;
  calibrationOverdueOnly?: boolean;
  calibrationUpcomingOnly?: boolean;
}

// Interface legada para calibragem de pneus
export interface TirePressureEntry {
  id: number;
  vehicleType: string;
  tireMeasure: string;
  pressure: string;
}
