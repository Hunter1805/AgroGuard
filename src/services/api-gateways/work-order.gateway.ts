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
    nature: (wo.nature as any) || 'MAINTENANCE',
    maintenanceType: wo.maintenanceType || null,
    correctiveMode: wo.correctiveMode || null,
    trigger: (wo.trigger as any) || 'MANUAL',
    priority: (wo.priority as any) || 'NORMAL',
    status: (wo.status as any) || 'aberta',
    description: wo.description,
    openedAt: wo.openedAt,
    requesterId: wo.openedByUserId || 'sys',
    requesterName: wo.openedByUser?.name || 'Sistema',
    impact: 'sem_impacto' as any,
    equipmentCanOperate: true,
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
      nature: data.nature || 'MAINTENANCE',
      maintenanceType: data.maintenanceType || null,
      correctiveMode: data.correctiveMode || null,
      trigger: data.trigger || 'MANUAL',
      priority: data.priority || 'NORMAL',
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
    nature: wo.nature,
    maintenanceType: wo.maintenanceType,
    correctiveMode: wo.correctiveMode,
    trigger: wo.trigger,
    priority: wo.priority,
    status: wo.status,
    description: wo.description,
    openedAt: wo.openedAt,
    requesterId: 'sys',
    requesterName: 'Sistema API',
    impact: 'sem_impacto' as any,
    equipmentCanOperate: true,
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
