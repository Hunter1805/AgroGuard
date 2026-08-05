export type StockItemType =
  | 'peca'
  | 'filtro'
  | 'oleo'
  | 'graxa'
  | 'fluido'
  | 'combustivel_auxiliar'
  | 'material_consumo'
  | 'componente_eletrico'
  | 'componente_hidraulico'
  | 'item_seguranca'
  | 'outro';

export type StockItemStatus =
  | 'ativo'
  | 'inativo'
  | 'sem_estoque'
  | 'estoque_baixo'
  | 'bloqueado'
  | 'descontinuado'
  | 'arquivado';

export interface StockItemLocation {
  warehouseId?: string;
  warehouseName?: string;
  shelf?: string;
  bin?: string;
  position?: string;
  detailedLocation?: string;
}

export interface StockItemSupplierInfo {
  supplierId: string;
  supplierName: string;
  supplierItemCode?: string;
  leadTimeDays?: number;
  lastPurchasePrice?: number;
  isPreferred?: boolean;
}

export interface StockItem {
  id: string;
  internalCode: string;
  barcode?: string;

  name: string;
  description?: string;

  type: StockItemType;
  categoryId?: string;
  categoryName?: string;
  subcategoryId?: string;
  subcategoryName?: string;

  brand?: string;
  manufacturerCode?: string;
  supplierReference?: string;

  controlUnit: string;
  allowsFractionalQuantity: boolean;

  currentQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;

  minimumQuantity: number;
  maximumQuantity?: number;
  reorderPoint?: number;

  averageCost: number;
  lastPurchaseCost?: number;
  totalStockValue: number;

  locationId?: string;
  location?: StockItemLocation;

  controlsLot: boolean;
  controlsExpiration: boolean;
  requiresSerialNumber?: boolean;
  requiresOutputApproval?: boolean;
  requiresWorkOrderLink?: boolean;

  compatibleEquipmentTypeIds?: string[];
  compatibleBrandIds?: string[];
  compatibleModelIds?: string[];
  specificEquipmentIds?: string[];
  compatibleEquipmentNames?: string[];

  preferredSupplierIds?: string[];
  suppliersInfo?: StockItemSupplierInfo[];

  status: StockItemStatus;
  mainPhotoUrl?: string;
  notes?: string;

  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface StockDashboardStats {
  totalItems: number;
  totalStockValue: number;
  itemsBelowMinimum: number;
  itemsOutOfStock: number;
  reservedItems: number;
  pendingReservations: number;
  lotsExpiringSoon: number;
  expiredLots: number;
  movementsCountPeriod: number;
  monthlyConsumptionCost: number;
  periodLossCost: number;
  inventoryDivergencesCount: number;
}

export interface StockItemFilter {
  search?: string;
  type?: StockItemType | 'todos';
  status?: StockItemStatus | 'todos';
  category?: string;
  brand?: string;
  warehouseId?: string;
  belowMinimumOnly?: boolean;
  outOfStockOnly?: boolean;
  hasReservationsOnly?: boolean;
  expiringLotsOnly?: boolean;
  expiredLotsOnly?: boolean;
  equipmentId?: string;
}

export interface StockHistoryLog {
  id: string;
  itemId: string;
  itemCode: string;
  date: string;
  event:
    | 'cadastro'
    | 'edicao'
    | 'entrada'
    | 'saida'
    | 'consumo'
    | 'reserva'
    | 'liberacao_reserva'
    | 'devolucao'
    | 'transferencia'
    | 'ajuste'
    | 'inventario'
    | 'perda'
    | 'descarte'
    | 'bloqueio'
    | 'arquivamento'
    | 'alteracao_custo';
  responsibleName: string;
  notes?: string;
  previousValue?: string;
  newValue?: string;
}
