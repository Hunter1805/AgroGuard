export type StockInventoryStatus =
  | 'rascunho'
  | 'planejado'
  | 'em_contagem'
  | 'aguardando_recontagem'
  | 'aguardando_aprovacao'
  | 'concluido'
  | 'cancelado';

export type StockInventoryType =
  | 'geral'
  | 'por_almoxarifado'
  | 'por_categoria'
  | 'por_localizacao'
  | 'rotativo'
  | 'personalizado';

export interface StockInventoryItem {
  id: string;
  inventoryId: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  controlUnit: string;

  systemQuantity: number;
  firstCount?: number;
  secondCount?: number;
  approvedQuantity?: number;

  difference: number;
  unitCost: number;
  differenceValue: number;

  status: 'pendente' | 'divergente' | 'conforme' | 'recontar' | 'ajustado';
  notes?: string;
}

export interface StockInventory {
  id: string;
  code: string;
  title: string;
  type: StockInventoryType;
  warehouseId?: string;
  warehouseName?: string;
  categoryName?: string;

  status: StockInventoryStatus;
  plannedDate: string;
  startDate?: string;
  completedDate?: string;

  responsibleName: string;
  counterNames?: string[];
  approverName?: string;

  totalItemsCount: number;
  divergentItemsCount: number;
  totalDifferenceValue: number;

  items: StockInventoryItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockInventoryFilter {
  search?: string;
  status?: StockInventoryStatus | 'todos';
  type?: StockInventoryType | 'todos';
}
