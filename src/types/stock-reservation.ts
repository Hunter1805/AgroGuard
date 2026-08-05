export type StockReservationStatus =
  | 'solicitada'
  | 'aprovada'
  | 'separada'
  | 'parcialmente_atendida'
  | 'atendida'
  | 'cancelada'
  | 'expirada';

export interface StockReservation {
  id: string;
  code: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  controlUnit: string;

  requestedQuantity: number;
  approvedQuantity: number;
  fulfilledQuantity: number;

  workOrderId?: string;
  workOrderCode?: string;
  maintenanceScheduleId?: string;
  equipmentId?: string;
  equipmentName?: string;

  requesterName: string;
  approverName?: string;

  expectedUseDate: string;
  expirationDate?: string;

  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  status: StockReservationStatus;

  justification?: string;
  cancelReason?: string;
  notes?: string;

  createdAt: string;
  updatedAt: string;
}

export interface StockReservationFilter {
  search?: string;
  status?: StockReservationStatus | 'todas';
  itemId?: string;
  workOrderId?: string;
  equipmentId?: string;
}
