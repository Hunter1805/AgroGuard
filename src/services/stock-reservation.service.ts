import type { StockReservation, StockReservationFilter } from '../types/stock-reservation';
import { partsService } from './parts.service';
import { stockMovementService } from './stock-movement.service';

let reservationsStore: StockReservation[] = [
  {
    id: 'RES-001',
    code: 'RES-2026-001',
    itemId: 'PART-001',
    itemCode: 'FLT-0150',
    itemName: 'Filtro de Óleo Lubrificante Motor',
    controlUnit: 'Unidade',
    requestedQuantity: 4,
    approvedQuantity: 4,
    fulfilledQuantity: 0,
    workOrderId: 'OS-2026-105',
    workOrderCode: 'OS-2026-105',
    equipmentName: 'Trator Valtra A750 14',
    requesterName: 'Marcos Souza (Mecânico)',
    approverName: 'Roberto Alves (Supervisor)',
    expectedUseDate: '2026-08-06',
    priority: 'alta',
    status: 'separada',
    justification: 'Preventiva agendada para 250 horas',
    createdAt: '2026-08-03T10:00:00Z',
    updatedAt: '2026-08-04T08:00:00Z',
  },
];

export const stockReservationService = {
  async getStockReservations(filters?: StockReservationFilter): Promise<StockReservation[]> {
    let items = [...reservationsStore];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        r =>
          r.code.toLowerCase().includes(q) ||
          r.itemName.toLowerCase().includes(q) ||
          r.requesterName.toLowerCase().includes(q) ||
          (r.workOrderCode && r.workOrderCode.toLowerCase().includes(q))
      );
    }

    if (filters?.status && filters.status !== 'todas') {
      items = items.filter(r => r.status === filters.status);
    }

    if (filters?.itemId) {
      items = items.filter(r => r.itemId === filters.itemId);
    }

    if (filters?.workOrderId) {
      items = items.filter(r => r.workOrderId === filters.workOrderId);
    }

    return items;
  },

  async createStockReservation(data: {
    itemId: string;
    quantity: number;
    workOrderId?: string;
    workOrderCode?: string;
    equipmentName?: string;
    requesterName: string;
    expectedUseDate: string;
    priority?: 'baixa' | 'media' | 'alta' | 'urgente';
    justification?: string;
  }): Promise<StockReservation> {
    const item = await partsService.getStockItemById(data.itemId);
    if (!item) throw new Error('Item de estoque não encontrado.');

    if (data.quantity > item.availableQuantity) {
      throw new Error(
        `Quantidade solicitada (${data.quantity} ${item.controlUnit}) é maior que a quantidade disponível (${item.availableQuantity} ${item.controlUnit}).`
      );
    }

    const newReservation: StockReservation = {
      id: `RES-${Date.now()}`,
      code: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      itemId: item.id,
      itemCode: item.internalCode,
      itemName: item.name,
      controlUnit: item.controlUnit,
      requestedQuantity: data.quantity,
      approvedQuantity: data.quantity,
      fulfilledQuantity: 0,
      workOrderId: data.workOrderId,
      workOrderCode: data.workOrderCode,
      equipmentName: data.equipmentName,
      requesterName: data.requesterName,
      expectedUseDate: data.expectedUseDate,
      priority: data.priority || 'media',
      status: 'aprovada',
      justification: data.justification,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Aumentar a quantidade reservada no item
    await partsService.updateStockItem(item.id, {
      reservedQuantity: item.reservedQuantity + data.quantity,
    });

    reservationsStore.unshift(newReservation);
    return newReservation;
  },

  async fulfillStockReservation(id: string, fulfilledQuantity: number, responsibleName: string): Promise<StockReservation> {
    const index = reservationsStore.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Reserva não encontrada.');

    const res = reservationsStore[index];
    const item = await partsService.getStockItemById(res.itemId);
    if (!item) throw new Error('Item não encontrado.');

    // Registrar a saída/consumo real
    await stockMovementService.registerStockOutput({
      itemId: res.itemId,
      quantity: fulfilledQuantity,
      type: 'consumo',
      workOrderId: res.workOrderId,
      workOrderCode: res.workOrderCode,
      equipmentName: res.equipmentName,
      responsibleName,
      notes: `Atendimento de reserva ${res.code}`,
    });

    // Reduzir a quantidade reservada
    const newReserved = Math.max(0, item.reservedQuantity - fulfilledQuantity);
    await partsService.updateStockItem(item.id, {
      reservedQuantity: newReserved,
    });

    const newStatus = res.fulfilledQuantity + fulfilledQuantity >= res.approvedQuantity ? 'atendida' : 'parcialmente_atendida';

    const updatedRes: StockReservation = {
      ...res,
      fulfilledQuantity: res.fulfilledQuantity + fulfilledQuantity,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    reservationsStore[index] = updatedRes;
    return updatedRes;
  },

  async cancelStockReservation(id: string, cancelReason: string): Promise<StockReservation> {
    const index = reservationsStore.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Reserva não encontrada.');

    const res = reservationsStore[index];
    const item = await partsService.getStockItemById(res.itemId);
    if (!item) throw new Error('Item não encontrado.');

    const pendingQty = res.approvedQuantity - res.fulfilledQuantity;

    if (pendingQty > 0) {
      const newReserved = Math.max(0, item.reservedQuantity - pendingQty);
      await partsService.updateStockItem(item.id, {
        reservedQuantity: newReserved,
      });
    }

    const updatedRes: StockReservation = {
      ...res,
      status: 'cancelada',
      cancelReason,
      updatedAt: new Date().toISOString(),
    };

    reservationsStore[index] = updatedRes;
    return updatedRes;
  },
};
