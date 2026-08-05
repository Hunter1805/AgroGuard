import type { StockInventory, StockInventoryFilter, StockInventoryItem } from '../types/stock-inventory';
import { partsService } from './parts.service';

let inventoriesStore: StockInventory[] = [
  {
    id: 'INV-001',
    code: 'INV-2026-001',
    title: 'Inventário Mensal de Filtros e Lubrificantes',
    type: 'por_categoria',
    categoryName: 'Óleos e Lubrificantes',
    warehouseName: 'Almoxarifado Central',
    status: 'concluido',
    plannedDate: '2026-07-30',
    startDate: '2026-07-30T08:00:00Z',
    completedDate: '2026-07-30T17:00:00Z',
    responsibleName: 'Roberto Alves (Almoxarife)',
    counterNames: ['Roberto Alves', 'Carlos Silva'],
    approverName: 'Fernando Costa (Gerente de Campo)',
    totalItemsCount: 12,
    divergentItemsCount: 1,
    totalDifferenceValue: -57.00,
    items: [
      {
        id: 'INVI-001',
        inventoryId: 'INV-001',
        itemId: 'PART-002',
        itemCode: 'OIL-15W40',
        itemName: 'Óleo Lubrificante 15W40 Mineral Premium',
        controlUnit: 'Litro',
        systemQuantity: 242,
        firstCount: 240,
        secondCount: 240,
        approvedQuantity: 240,
        difference: -2,
        unitCost: 28.50,
        differenceValue: -57.00,
        status: 'ajustado',
        notes: 'Divergência pequena por derramamento durante drenagem',
      },
    ],
    notes: 'Inventário realizado com recontagem aceita.',
    createdAt: '2026-07-28T09:00:00Z',
    updatedAt: '2026-07-30T17:30:00Z',
  },
];

export const stockInventoryService = {
  async getStockInventories(filters?: StockInventoryFilter): Promise<StockInventory[]> {
    let items = [...inventoriesStore];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(i => i.title.toLowerCase().includes(q) || i.code.toLowerCase().includes(q));
    }

    if (filters?.status && filters.status !== 'todos') {
      items = items.filter(i => i.status === filters.status);
    }

    if (filters?.type && filters.type !== 'todos') {
      items = items.filter(i => i.type === filters.type);
    }

    return items;
  },

  async createStockInventory(data: {
    title: string;
    type: StockInventory['type'];
    warehouseName?: string;
    categoryName?: string;
    plannedDate: string;
    responsibleName: string;
  }): Promise<StockInventory> {
    const stockItems = await partsService.getStockItems();

    const inventoryItems: StockInventoryItem[] = stockItems.map(si => ({
      id: `INVI-${Math.floor(1000 + Math.random() * 9000)}`,
      inventoryId: '',
      itemId: si.id,
      itemCode: si.internalCode,
      itemName: si.name,
      controlUnit: si.controlUnit,
      systemQuantity: si.currentQuantity,
      difference: 0,
      unitCost: si.averageCost,
      differenceValue: 0,
      status: 'pendente',
    }));

    const newInventory: StockInventory = {
      id: `INV-${Date.now()}`,
      code: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      title: data.title,
      type: data.type,
      warehouseName: data.warehouseName,
      categoryName: data.categoryName,
      status: 'planejado',
      plannedDate: data.plannedDate,
      responsibleName: data.responsibleName,
      totalItemsCount: inventoryItems.length,
      divergentItemsCount: 0,
      totalDifferenceValue: 0,
      items: inventoryItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inventoryItems.forEach(item => {
      item.inventoryId = newInventory.id;
    });

    inventoriesStore.unshift(newInventory);
    return newInventory;
  },

  async registerInventoryCount(id: string, counts: { itemId: string; count: number }[]): Promise<StockInventory> {
    const index = inventoriesStore.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Inventário não encontrado.');

    const inv = inventoriesStore[index];
    let divergentCount = 0;
    let totalDiffVal = 0;

    const updatedItems = inv.items.map(item => {
      const foundCount = counts.find(c => c.itemId === item.itemId);
      if (!foundCount) return item;

      const firstCount = foundCount.count;
      const difference = firstCount - item.systemQuantity;
      const differenceValue = Number((difference * item.unitCost).toFixed(2));
      const status = difference !== 0 ? 'divergente' : 'conforme';

      if (difference !== 0) {
        divergentCount++;
        totalDiffVal += differenceValue;
      }

      return {
        ...item,
        firstCount,
        approvedQuantity: firstCount,
        difference,
        differenceValue,
        status: status as any,
      };
    });

    const updatedInv: StockInventory = {
      ...inv,
      status: divergentCount > 0 ? 'aguardando_aprovacao' : 'concluido',
      startDate: inv.startDate || new Date().toISOString(),
      divergentItemsCount: divergentCount,
      totalDifferenceValue: totalDiffVal,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    };

    inventoriesStore[index] = updatedInv;
    return updatedInv;
  },

  async approveStockInventory(id: string, approverName: string): Promise<StockInventory> {
    const index = inventoriesStore.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Inventário não encontrado.');

    const inv = inventoriesStore[index];

    // Para cada item divergente, aplicar o ajuste físico
    for (const item of inv.items) {
      if (item.difference !== 0 && item.approvedQuantity !== undefined) {
        const itemObj = await partsService.getStockItemById(item.itemId);
        if (itemObj) {
          await partsService.updateStockItem(itemObj.id, {
            currentQuantity: item.approvedQuantity,
          });
        }
      }
    }

    const updatedInv: StockInventory = {
      ...inv,
      status: 'concluido',
      approverName,
      completedDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inventoriesStore[index] = updatedInv;
    return updatedInv;
  },
};
