import type { ToolReservation, ToolReservationStatus } from '../types/tools';
import { toolsService } from './tools.service';

let mockReservations: ToolReservation[] = [
  {
    id: 'RES-001',
    code: 'RES-2026-001',
    toolId: 'TOOL-001',
    toolCode: 'FER-001',
    toolName: 'Torquímetro de Estalo 1/2" (20 a 200 Nm)',
    quantity: 1,
    requesterName: 'Marcos Souza',
    workOrderId: 'OS-2026-105',
    workOrderCode: 'OS-105',
    equipmentName: 'TRATOR CASE IH MAGNUM 340',
    expectedPickupDate: '2026-08-10T08:00:00Z',
    expectedReturnDate: '2026-08-12T18:00:00Z',
    priority: 'alta',
    justification: 'Aperto técnico dos parafusos do cabeçote após revisão de 1000h',
    approverName: 'Roberto Alves',
    status: 'aprovada',
  },
];

export const toolReservationService = {
  async getToolReservations(filters?: { search?: string; status?: ToolReservationStatus | 'todos'; workOrderId?: string }): Promise<ToolReservation[]> {
    let result = [...mockReservations];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        r =>
          r.code.toLowerCase().includes(q) ||
          r.toolName.toLowerCase().includes(q) ||
          r.requesterName.toLowerCase().includes(q) ||
          (r.workOrderCode && r.workOrderCode.toLowerCase().includes(q))
      );
    }

    if (filters?.status && filters.status !== 'todos') {
      result = result.filter(r => r.status === filters.status);
    }

    if (filters?.workOrderId) {
      result = result.filter(r => r.workOrderId === filters.workOrderId);
    }

    return Promise.resolve(result);
  },

  async createToolReservation(params: {
    toolId: string;
    quantity: number;
    requesterName: string;
    workOrderId?: string;
    workOrderCode?: string;
    equipmentId?: string;
    equipmentName?: string;
    expectedPickupDate: string;
    expectedReturnDate: string;
    priority?: 'baixa' | 'media' | 'alta' | 'urgente';
    justification?: string;
  }): Promise<ToolReservation> {
    const tool = await toolsService.getToolById(params.toolId);
    if (!tool) throw new Error('Ferramenta não encontrada.');

    if (tool.status === 'baixada' || tool.status === 'perdida') {
      throw new Error('Não é possível reservar uma ferramenta baixada ou perdida.');
    }

    const id = `RES-${String(mockReservations.length + 1).padStart(3, '0')}`;
    const code = `RES-2026-${String(mockReservations.length + 1).padStart(3, '0')}`;

    const newRes: ToolReservation = {
      id,
      code,
      toolId: tool.id,
      toolCode: tool.code,
      toolName: tool.name,
      quantity: params.quantity,
      requesterName: params.requesterName,
      workOrderId: params.workOrderId,
      workOrderCode: params.workOrderCode,
      equipmentId: params.equipmentId,
      equipmentName: params.equipmentName,
      expectedPickupDate: params.expectedPickupDate,
      expectedReturnDate: params.expectedReturnDate,
      priority: params.priority || 'media',
      justification: params.justification,
      status: 'aprovada',
      approverName: 'Almoxarife Automático',
    };

    mockReservations.unshift(newRes);
    return Promise.resolve(newRes);
  },

  async cancelToolReservation(id: string, reason: string): Promise<ToolReservation> {
    const res = mockReservations.find(r => r.id === id);
    if (!res) throw new Error('Reserva não encontrada.');

    res.status = 'cancelada';
    res.notes = `Cancelado: ${reason}`;
    return Promise.resolve(res);
  },
};
