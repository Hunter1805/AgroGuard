import { apiClient } from '../../lib/api/api-client';
import type { WorkOrder } from '../../types/work-order';

export async function fetchWorkOrdersFromApi(search?: string): Promise<WorkOrder[]> {
  const q = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await apiClient<any[]>(`/work-orders${q}`);

  return response.data.map(wo => ({
    id: wo.id,
    code: wo.code,
    title: wo.description,
    equipmentId: wo.equipmentId,
    equipmentName: wo.equipment?.name || 'Equipamento',
    equipmentCode: wo.equipment?.code || 'EQ-000',
    type: (wo.type as any) || 'corretiva',
    priority: (wo.priority as any) || 'media',
    status: (wo.status as any) || 'aberta',
    description: wo.description,
    openedAt: wo.openedAt,
    requesterId: wo.openedByUserId || 'sys',
    requesterName: wo.openedByUser?.name || 'Sistema',
    origin: 'manual' as any,
    impact: 'parada_total' as any,
    equipmentCanOperate: false,
    requiresBlock: false,
    requiresApproval: false,
    createdAt: wo.createdAt,
    updatedAt: wo.updatedAt,
    attachments: [],
    events: [],
  }));
}

export async function createWorkOrderInApi(data: any): Promise<WorkOrder> {
  const response = await apiClient<any>('/work-orders', {
    method: 'POST',
    body: JSON.stringify({
      equipmentId: data.equipmentId,
      type: data.type || 'corretiva',
      priority: data.priority || 'media',
      description: data.description,
    }),
  });

  const wo = response.data;
  return {
    id: wo.id,
    code: wo.code,
    title: wo.description,
    equipmentId: wo.equipmentId,
    equipmentName: 'Equipamento Registrado',
    equipmentCode: 'EQ-000',
    type: wo.type,
    priority: wo.priority,
    status: wo.status,
    description: wo.description,
    openedAt: wo.openedAt,
    requesterId: 'sys',
    requesterName: 'Sistema API',
    origin: 'manual' as any,
    impact: 'parada_total' as any,
    equipmentCanOperate: false,
    requiresBlock: false,
    requiresApproval: false,
    createdAt: wo.createdAt,
    updatedAt: wo.updatedAt,
    attachments: [],
  };
}

export async function transitionWorkOrderStatusInApi(id: string, targetStatus: string): Promise<any> {
  return apiClient(`/work-orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: targetStatus }),
  });
}
