import type { WorkOrder, WorkOrderTimelineEvent, WorkOrderStatus } from '../types/work-order';
import type { WorkOrderExecutionData } from '../types/work-order-execution';
import { dataSourceConfig } from '../config/data-source.config';
import { fetchWorkOrdersFromApi, createWorkOrderInApi } from './api-gateways/work-order.gateway';
import { mockStorage } from './mock-storage';

export function normalizeWorkOrder(data: any): WorkOrder {
  const normalized = { ...data };

  // 1. Normalizar prioridade
  if (data.priority) {
    const prio = String(data.priority).toLowerCase();
    if (prio === 'baixa' || prio === 'low') normalized.priority = 'LOW';
    else if (prio === 'media' || prio === 'normal') normalized.priority = 'NORMAL';
    else if (prio === 'alta' || prio === 'high') normalized.priority = 'HIGH';
    else if (prio === 'urgente' || prio === 'urgent') normalized.priority = 'URGENT';
    else if (prio === 'critica' || prio === 'critical') normalized.priority = 'CRITICAL';
    else normalized.priority = data.priority;
  } else {
    normalized.priority = 'NORMAL';
  }

  // 2. Normalizar natureza
  if (!data.nature) {
    if (data.type === 'inspecao') {
      normalized.nature = 'INSPECTION';
    } else if (data.type === 'melhoria') {
      normalized.nature = 'IMPROVEMENT';
    } else {
      normalized.nature = 'MAINTENANCE';
    }
  }

  // 3. Normalizar maintenanceType & correctiveMode
  if (normalized.nature === 'MAINTENANCE' && !data.maintenanceType) {
    const legacyType = data.type;
    if (legacyType === 'preventiva') {
      normalized.maintenanceType = 'PREVENTIVE';
      normalized.correctiveMode = null;
    } else if (legacyType === 'preditiva') {
      normalized.maintenanceType = 'PREDICTIVE';
      normalized.correctiveMode = null;
    } else if (legacyType === 'corretiva_planejada' || legacyType === 'corretiva') {
      normalized.maintenanceType = 'CORRECTIVE';
      normalized.correctiveMode = 'PLANNED';
    } else if (legacyType === 'emergencial') {
      normalized.maintenanceType = 'CORRECTIVE';
      normalized.correctiveMode = 'EMERGENCY';
    } else if (legacyType === 'corretiva_nao_planejada') {
      normalized.maintenanceType = 'CORRECTIVE';
      normalized.correctiveMode = null;
    } else {
      // Valor padrão seguro para tipo corretiva genérica legada sem modo definido
      normalized.maintenanceType = 'CORRECTIVE';
      normalized.correctiveMode = 'PLANNED';
    }
  } else if (normalized.nature !== 'MAINTENANCE') {
    normalized.maintenanceType = null;
    normalized.correctiveMode = null;
  }

  // 4. Normalizar trigger / origin
  if (!data.trigger) {
    if (data.origin) {
      const orig = String(data.origin).toLowerCase();
      if (orig === 'manual') normalized.trigger = 'MANUAL';
      else if (orig === 'checklist' || orig === 'nao_conformidade') normalized.trigger = 'CHECKLIST';
      else if (orig === 'manutencao_preventiva') normalized.trigger = 'SCHEDULE';
      else if (orig === 'alerta') normalized.trigger = 'ALERT';
      else if (orig === 'falha') normalized.trigger = 'FAILURE';
      else if (orig === 'inspecao_pneu') normalized.trigger = 'INSPECTION';
      else if (orig === 'solicitacao_operador') normalized.trigger = 'OPERATOR_REPORT';
      else normalized.trigger = 'MANUAL';
    } else if (data.type === 'preventiva') {
      normalized.trigger = 'SCHEDULE';
    } else {
      normalized.trigger = 'MANUAL';
    }
  }

  return normalized as WorkOrder;
}

export const workOrderService = {
  // ─── Consultas ─────────────────────────────────────────────────────────────
  async getWorkOrders(): Promise<WorkOrder[]> {
    if (dataSourceConfig.workOrders === 'api') {
      return fetchWorkOrdersFromApi();
    }
    await new Promise(resolve => setTimeout(resolve, 300));
    const list = await mockStorage.get<any>('work_orders', []);
    return list.map((wo: any) => normalizeWorkOrder(wo)).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getWorkOrderById(id: string): Promise<WorkOrder | undefined> {
    if (dataSourceConfig.workOrders === 'api') {
      const list = await fetchWorkOrdersFromApi();
      return list.find(wo => wo.id === id);
    }
    await new Promise(resolve => setTimeout(resolve, 200));
    const list = await mockStorage.get<any>('work_orders', []);
    const found = list.find((wo: any) => wo.id === id);
    return found ? normalizeWorkOrder(found) : undefined;
  },

  async getExecutionData(orderId: string): Promise<WorkOrderExecutionData | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const list = await mockStorage.get<any>('work_order_executions', []);
    const found = list.find((e: any) => e.orderId === orderId);
    return found?.data;
  },

  async getTimelineEvents(orderId: string): Promise<WorkOrderTimelineEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const list = await mockStorage.get<any>('work_order_timelines', []);
    const found = list.find((t: any) => t.orderId === orderId);
    return found?.events || [];
  },

  // ─── Ações de Ciclo de Vida ────────────────────────────────────────────────
  async createWorkOrder(data: Partial<WorkOrder>): Promise<WorkOrder> {
    if (dataSourceConfig.workOrders === 'api') {
      return createWorkOrderInApi(normalizeWorkOrder(data));
    }
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = `OS-${Date.now().toString().slice(-6)}`;
    
    const newOrder = normalizeWorkOrder({
      ...data,
      id: newId,
      code: newId,
      status: 'aberta', // Status inicial default, a menos que especificado
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: data.attachments || []
    });

    const list = await mockStorage.get<WorkOrder>('work_orders', []);
    list.push(newOrder);
    await mockStorage.set('work_orders', list);
    
    // Iniciar dados vazios
    const execs = await mockStorage.get<any>('work_order_executions', []);
    execs.push({
      orderId: newId,
      data: {
        tasks: [],
        pauses: [],
        services: [],
        parts: [],
        supplies: [],
        tools: [],
        tests: []
      }
    });
    await mockStorage.set('work_order_executions', execs);

    const timelines = await mockStorage.get<any>('work_order_timelines', []);
    timelines.push({
      orderId: newId,
      events: []
    });
    await mockStorage.set('work_order_timelines', timelines);

    await this.addTimelineEvent(newId, 'Criação', 'Ordem de serviço criada no sistema', data.requesterId || 'sys', data.requesterName || 'Sistema', undefined, 'aberta');

    return newOrder;
  },

  async updateWorkOrderOpening(id: string, data: Partial<WorkOrder>): Promise<WorkOrder> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const list = await mockStorage.get<WorkOrder>('work_orders', []);
    const index = list.findIndex(wo => wo.id === id);
    if (index === -1) throw new Error('OS não encontrada');

    const updated = normalizeWorkOrder({ ...list[index], ...data, updatedAt: new Date().toISOString() });
    list[index] = updated;
    await mockStorage.set('work_orders', list);

    await this.addTimelineEvent(id, 'Alteração', 'Dados de abertura alterados', 'sys', 'Sistema', updated.status, updated.status);

    return updated;
  },

  async triageWorkOrder(id: string, data: Partial<WorkOrder>): Promise<WorkOrder> {
    return this.changeStatus(id, 'em_triagem', data, 'Triagem', 'OS enviada para triagem');
  },

  async approveWorkOrder(id: string, data: Partial<WorkOrder>): Promise<WorkOrder> {
    return this.changeStatus(id, 'aguardando_aprovacao', data, 'Aprovação Solicitada', 'OS enviada para aprovação');
  },

  async cancelWorkOrder(id: string, reason: string, userId: string, userName: string): Promise<WorkOrder> {
    const order = await this.changeStatus(id, 'cancelada', {}, 'Cancelamento', reason, userId, userName);
    return order;
  },

  async reopenWorkOrder(id: string, reason: string, userId: string, userName: string): Promise<WorkOrder> {
    const order = await this.changeStatus(id, 'aberta', {}, 'Reabertura', reason, userId, userName);
    return order;
  },

  // ─── Utilitários Internos ──────────────────────────────────────────────────
  async changeStatus(id: string, newStatus: WorkOrderStatus, data: Partial<WorkOrder> = {}, actionTitle: string, description: string, userId: string = 'sys', userName: string = 'Sistema'): Promise<WorkOrder> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const list = await mockStorage.get<WorkOrder>('work_orders', []);
    const index = list.findIndex(wo => wo.id === id);
    if (index === -1) throw new Error('OS não encontrada');

    const oldStatus = list[index].status;
    const updated = { ...list[index], ...data, status: newStatus, updatedAt: new Date().toISOString() };
    list[index] = updated;
    await mockStorage.set('work_orders', list);

    await this.addTimelineEvent(id, actionTitle, description, userId, userName, oldStatus, newStatus);
    
    return updated;
  },

  async addTimelineEvent(orderId: string, action: string, description: string, userId: string, userName: string, prevStatus?: WorkOrderStatus, newStatus?: WorkOrderStatus, relatedData?: any) {
    const timelines = await mockStorage.get<any>('work_order_timelines', []);
    let idx = timelines.findIndex((t: any) => t.orderId === orderId);
    if (idx === -1) {
      timelines.push({ orderId, events: [] });
      idx = timelines.length - 1;
    }
    timelines[idx].events.push({
      id: `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      date: new Date().toISOString(),
      action,
      description,
      userId,
      userName,
      previousStatus: prevStatus,
      newStatus,
      relatedData
    });
    await mockStorage.set('work_order_timelines', timelines);
  }
};
