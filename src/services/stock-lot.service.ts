import type { StockLot, StockLotFilter } from '../types/stock-lot';

let lotsStore: StockLot[] = [
  {
    id: 'LOT-001',
    itemId: 'PART-002',
    itemCode: 'OIL-15W40',
    itemName: 'Óleo Lubrificante 15W40 Mineral Premium',
    code: 'LT-2026-8801',
    manufacturingDate: '2025-11-15',
    expirationDate: '2026-08-15',
    initialQuantity: 300,
    currentQuantity: 240,
    reservedQuantity: 60,
    unitCost: 28.50,
    supplierName: 'Shell Brasil',
    invoiceNumber: 'NF-2026-1190',
    status: 'proximo_vencimento',
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'LOT-002',
    itemId: 'PART-003',
    itemCode: 'GRS-LITIO',
    itemName: 'Graxa de Lítio NLGI 2 para Chassi e Pinos',
    code: 'LT-2025-4491',
    manufacturingDate: '2024-07-10',
    expirationDate: '2026-07-10',
    initialQuantity: 10,
    currentQuantity: 4,
    reservedQuantity: 1,
    unitCost: 450.00,
    supplierName: 'Texaco Lubrificantes',
    status: 'vencido',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-07-11T08:00:00Z',
  },
];

export const stockLotService = {
  async getStockLots(filters?: StockLotFilter): Promise<StockLot[]> {
    let items = [...lotsStore];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        l =>
          l.code.toLowerCase().includes(q) ||
          (l.itemName && l.itemName.toLowerCase().includes(q)) ||
          (l.itemCode && l.itemCode.toLowerCase().includes(q))
      );
    }

    if (filters?.status && filters.status !== 'todos') {
      items = items.filter(l => l.status === filters.status);
    }

    if (filters?.itemId) {
      items = items.filter(l => l.itemId === filters.itemId);
    }

    if (filters?.expiringOnly) {
      items = items.filter(l => l.status === 'proximo_vencimento');
    }

    if (filters?.expiredOnly) {
      items = items.filter(l => l.status === 'vencido');
    }

    return items;
  },

  async getStockLotById(id: string): Promise<StockLot | undefined> {
    return lotsStore.find(l => l.id === id);
  },

  async createStockLot(data: Omit<StockLot, 'id' | 'createdAt' | 'updatedAt' | 'reservedQuantity'>): Promise<StockLot> {
    const newLot: StockLot = {
      ...data,
      id: `LOT-${Date.now()}`,
      reservedQuantity: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    lotsStore.push(newLot);
    return newLot;
  },
};
