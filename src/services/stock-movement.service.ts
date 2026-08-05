import type { StockMovement, StockMovementFilter } from '../types/stock-movement';
import { partsService } from './parts.service';
import { stockCalculationService } from './stock-calculation.service';

let movementsStore: StockMovement[] = [
  {
    id: 'MOV-001',
    code: 'ENT-2026-001',
    itemId: 'PART-001',
    itemCode: 'FLT-0150',
    itemName: 'Filtro de Óleo Lubrificante Motor',
    itemType: 'filtro',
    controlUnit: 'Unidade',
    type: 'entrada',
    quantity: 20,
    date: '2026-08-01T09:00:00Z',
    origin: 'compra',
    supplierName: 'AgroPeças Distribuidora',
    invoiceNumber: 'NF-2026-8891',
    unitCost: 68.00,
    totalCost: 1360.00,
    previousAverageCost: 63.00,
    posteriorAverageCost: 65.50,
    responsibleName: 'Roberto Alves (Almoxarife)',
    notes: 'Entrada de compra regular conforme pedido de compras nº 4501.',
    createdAt: '2026-08-01T09:00:00Z',
  },
  {
    id: 'MOV-002',
    code: 'SAI-2026-001',
    itemId: 'PART-001',
    itemCode: 'FLT-0150',
    itemName: 'Filtro de Óleo Lubrificante Motor',
    itemType: 'filtro',
    controlUnit: 'Unidade',
    type: 'consumo',
    quantity: 2,
    date: '2026-08-02T14:00:00Z',
    destination: 'ordem_servico',
    workOrderId: 'OS-2026-101',
    workOrderCode: 'OS-2026-101',
    equipmentName: 'Trator Massey Ferguson 275 03',
    unitCost: 65.50,
    totalCost: 131.00,
    responsibleName: 'Carlos Silva (Mecânico)',
    deliveredByName: 'Roberto Alves (Almoxarife)',
    notes: 'Consumo para troca de óleo preventiva da OS-2026-101.',
    createdAt: '2026-08-02T14:00:00Z',
  },
];

export const stockMovementService = {
  async getStockMovements(filters?: StockMovementFilter): Promise<StockMovement[]> {
    let items = [...movementsStore];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        m =>
          m.code.toLowerCase().includes(q) ||
          m.itemName.toLowerCase().includes(q) ||
          m.itemCode.toLowerCase().includes(q) ||
          (m.workOrderCode && m.workOrderCode.toLowerCase().includes(q))
      );
    }

    if (filters?.type && filters.type !== 'todos') {
      items = items.filter(m => m.type === filters.type);
    }

    if (filters?.itemId) {
      items = items.filter(m => m.itemId === filters.itemId);
    }

    if (filters?.workOrderId) {
      items = items.filter(m => m.workOrderId === filters.workOrderId);
    }

    return items;
  },

  async registerStockEntry(data: {
    itemId: string;
    quantity: number;
    unitCost: number;
    supplierName?: string;
    invoiceNumber?: string;
    documentNumber?: string;
    lotCode?: string;
    manufacturingDate?: string;
    expirationDate?: string;
    responsibleName: string;
    notes?: string;
  }): Promise<StockMovement> {
    const item = await partsService.getStockItemById(data.itemId);
    if (!item) throw new Error('Item de estoque não encontrado.');

    const qtyValidation = stockCalculationService.validateQuantity(item, data.quantity);
    if (!qtyValidation.valid) throw new Error(qtyValidation.message);

    if (data.unitCost < 0) throw new Error('O custo unitário não pode ser negativo.');

    if (item.controlsLot && !data.lotCode) {
      throw new Error(`O item ${item.name} exige informação de número de lote na entrada.`);
    }

    if (item.controlsExpiration && !data.expirationDate) {
      throw new Error(`O item ${item.name} exige informação de data de validade na entrada.`);
    }

    const previousAverageCost = item.averageCost;
    const newAverageCost = stockCalculationService.calculateNewAverageCost(
      item.currentQuantity,
      item.averageCost,
      data.quantity,
      data.unitCost
    );

    const newCurrentQuantity = item.currentQuantity + data.quantity;

    await partsService.updateStockItem(item.id, {
      currentQuantity: newCurrentQuantity,
      averageCost: newAverageCost,
      lastPurchaseCost: data.unitCost,
    });

    const newMovement: StockMovement = {
      id: `MOV-${Date.now()}`,
      code: `ENT-${Math.floor(1000 + Math.random() * 9000)}`,
      itemId: item.id,
      itemCode: item.internalCode,
      itemName: item.name,
      itemType: item.type,
      controlUnit: item.controlUnit,
      type: 'entrada',
      quantity: data.quantity,
      date: new Date().toISOString(),
      origin: 'compra',
      supplierName: data.supplierName,
      invoiceNumber: data.invoiceNumber,
      documentNumber: data.documentNumber,
      lotCode: data.lotCode,
      manufacturingDate: data.manufacturingDate,
      expirationDate: data.expirationDate,
      unitCost: data.unitCost,
      totalCost: Number((data.quantity * data.unitCost).toFixed(2)),
      previousAverageCost,
      posteriorAverageCost: newAverageCost,
      responsibleName: data.responsibleName,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    movementsStore.unshift(newMovement);
    return newMovement;
  },

  async registerStockOutput(data: {
    itemId: string;
    quantity: number;
    type: 'saida' | 'consumo' | 'descarte';
    workOrderId?: string;
    workOrderCode?: string;
    equipmentName?: string;
    responsibleName: string;
    deliveredByName?: string;
    lossReason?: string;
    notes?: string;
  }): Promise<StockMovement> {
    const item = await partsService.getStockItemById(data.itemId);
    if (!item) throw new Error('Item de estoque não encontrado.');

    const availValidation = stockCalculationService.validateOutputAvailability(item, data.quantity);
    if (!availValidation.valid) throw new Error(availValidation.message);

    const newCurrentQuantity = item.currentQuantity - data.quantity;

    await partsService.updateStockItem(item.id, {
      currentQuantity: newCurrentQuantity,
    });

    const newMovement: StockMovement = {
      id: `MOV-${Date.now()}`,
      code: `SAI-${Math.floor(1000 + Math.random() * 9000)}`,
      itemId: item.id,
      itemCode: item.internalCode,
      itemName: item.name,
      itemType: item.type,
      controlUnit: item.controlUnit,
      type: data.type,
      quantity: data.quantity,
      date: new Date().toISOString(),
      destination: data.workOrderId ? 'ordem_servico' : 'outro',
      workOrderId: data.workOrderId,
      workOrderCode: data.workOrderCode,
      equipmentName: data.equipmentName,
      unitCost: item.averageCost,
      totalCost: Number((data.quantity * item.averageCost).toFixed(2)),
      responsibleName: data.responsibleName,
      deliveredByName: data.deliveredByName,
      lossReason: data.lossReason,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    movementsStore.unshift(newMovement);
    return newMovement;
  },

  async registerStockReturn(data: {
    originalMovementId?: string;
    itemId: string;
    quantity: number;
    workOrderCode?: string;
    returnCondition: StockMovement['returnCondition'];
    responsibleName: string;
    notes?: string;
  }): Promise<StockMovement> {
    const item = await partsService.getStockItemById(data.itemId);
    if (!item) throw new Error('Item de estoque não encontrado.');

    const canReturnToStock = data.returnCondition === 'lacrado' || data.returnCondition === 'aberto_utilizavel';

    if (canReturnToStock) {
      await partsService.updateStockItem(item.id, {
        currentQuantity: item.currentQuantity + data.quantity,
      });
    }

    const newMovement: StockMovement = {
      id: `MOV-${Date.now()}`,
      code: `DEV-${Math.floor(1000 + Math.random() * 9000)}`,
      itemId: item.id,
      itemCode: item.internalCode,
      itemName: item.name,
      itemType: item.type,
      controlUnit: item.controlUnit,
      type: 'devolucao',
      quantity: data.quantity,
      date: new Date().toISOString(),
      origin: 'devolucao_sobra',
      workOrderCode: data.workOrderCode,
      returnCondition: data.returnCondition,
      canReturnToStock,
      unitCost: item.averageCost,
      totalCost: Number((data.quantity * item.averageCost).toFixed(2)),
      responsibleName: data.responsibleName,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    movementsStore.unshift(newMovement);
    return newMovement;
  },
};
