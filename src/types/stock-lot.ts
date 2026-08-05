export type StockLotStatus =
  | 'ativo'
  | 'proximo_vencimento'
  | 'vencido'
  | 'esgotado'
  | 'bloqueado'
  | 'descartado';

export interface StockLot {
  id: string;
  itemId: string;
  itemCode?: string;
  itemName?: string;
  code: string;

  manufacturingDate?: string;
  expirationDate?: string;

  initialQuantity: number;
  currentQuantity: number;
  reservedQuantity: number;

  unitCost: number;

  supplierId?: string;
  supplierName?: string;
  documentNumber?: string;
  invoiceNumber?: string;

  status: StockLotStatus;

  createdAt: string;
  updatedAt: string;
}

export interface StockLotFilter {
  search?: string;
  status?: StockLotStatus | 'todos';
  itemId?: string;
  expiringOnly?: boolean;
  expiredOnly?: boolean;
}
