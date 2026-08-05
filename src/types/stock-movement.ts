export type StockMovementType =
  | 'entrada'
  | 'saida'
  | 'consumo'
  | 'reserva'
  | 'liberacao_reserva'
  | 'devolucao'
  | 'transferencia'
  | 'ajuste_positivo'
  | 'ajuste_negativo'
  | 'perda'
  | 'descarte'
  | 'inventario';

export type StockMovementOrigin =
  | 'compra'
  | 'devolucao_sobra'
  | 'transferencia_recebida'
  | 'ajuste_fisico'
  | 'saldo_inicial'
  | 'retorno_manutencao'
  | 'bonificacao'
  | 'outro';

export type StockMovementDestination =
  | 'ordem_servico'
  | 'manutencao_preventiva'
  | 'equipamento'
  | 'setor'
  | 'usuario'
  | 'transferencia_enviada'
  | 'descarte'
  | 'outro';

export type StockItemReturnCondition =
  | 'lacrado'
  | 'aberto_utilizavel'
  | 'parcialmente_utilizado'
  | 'danificado'
  | 'contaminado'
  | 'vencido';

export interface StockMovement {
  id: string;
  code: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  itemType: string;
  controlUnit: string;

  type: StockMovementType;
  quantity: number;

  lotId?: string;
  lotCode?: string;
  expirationDate?: string;
  manufacturingDate?: string;

  date: string;
  origin?: StockMovementOrigin;
  destination?: StockMovementDestination;

  supplierName?: string;
  documentNumber?: string;
  invoiceNumber?: string;

  workOrderId?: string;
  workOrderCode?: string;
  maintenanceScheduleId?: string;
  equipmentId?: string;
  equipmentName?: string;

  originWarehouseId?: string;
  originWarehouseName?: string;
  destinationWarehouseId?: string;
  destinationWarehouseName?: string;

  unitCost: number;
  totalCost: number;
  previousAverageCost?: number;
  posteriorAverageCost?: number;

  responsibleName: string;
  deliveredByName?: string;
  receivedByName?: string;

  returnCondition?: StockItemReturnCondition;
  canReturnToStock?: boolean;

  lossReason?: string;
  notes?: string;
  createdAt: string;
}

export interface StockMovementFilter {
  search?: string;
  type?: StockMovementType | 'todos';
  itemId?: string;
  workOrderId?: string;
  equipmentId?: string;
  startDate?: string;
  endDate?: string;
}
