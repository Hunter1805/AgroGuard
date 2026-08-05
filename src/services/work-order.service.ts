import type { WorkOrder, WorkOrderTimelineEvent, WorkOrderStatus } from '../types/work-order';
import type { WorkOrderExecutionData } from '../types/work-order-execution';
import { dataSourceConfig } from '../config/data-source.config';
import { fetchWorkOrdersFromApi, createWorkOrderInApi } from './api-gateways/work-order.gateway';

// Mock DB
let workOrders: WorkOrder[] = [];
let executions: Record<string, WorkOrderExecutionData> = {};
let timelines: Record<string, WorkOrderTimelineEvent[]> = {};

export const workOrderService = {
  // ─── Consultas ─────────────────────────────────────────────────────────────
  async getWorkOrders(): Promise<WorkOrder[]> {
    if (dataSourceConfig.workOrders === 'api') {
      return fetchWorkOrdersFromApi();
    }
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...workOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getWorkOrderById(id: string): Promise<WorkOrder | undefined> {
    if (dataSourceConfig.workOrders === 'api') {
      const list = await fetchWorkOrdersFromApi();
      return list.find(wo => wo.id === id);
    }
    await new Promise(resolve => setTimeout(resolve, 200));
    return workOrders.find(wo => wo.id === id);
  },

  async getExecutionData(orderId: string): Promise<WorkOrderExecutionData | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return executions[orderId];
  },

  async getTimelineEvents(orderId: string): Promise<WorkOrderTimelineEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return timelines[orderId] || [];
  },

  // ─── Ações de Ciclo de Vida ────────────────────────────────────────────────
  async createWorkOrder(data: Partial<WorkOrder>): Promise<WorkOrder> {
    if (dataSourceConfig.workOrders === 'api') {
      return createWorkOrderInApi(data);
    }
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = `OS-${Date.now().toString().slice(-6)}`;
    
    const newOrder: WorkOrder = {
      ...data,
      id: newId,
      code: newId,
      status: 'aberta', // Status inicial default, a menos que especificado
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: data.attachments || []
    } as WorkOrder;

    workOrders.push(newOrder);
    
    // Iniciar dados vazios
    executions[newId] = {
      tasks: [],
      pauses: [],
      services: [],
      parts: [],
      supplies: [],
      tools: [],
      tests: []
    };

    timelines[newId] = [];
    this.addTimelineEvent(newId, 'Criação', 'Ordem de serviço criada no sistema', data.requesterId || 'sys', data.requesterName || 'Sistema', undefined, 'aberta');

    return newOrder;
  },

  async updateWorkOrderOpening(id: string, data: Partial<WorkOrder>): Promise<WorkOrder> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = workOrders.findIndex(wo => wo.id === id);
    if (index === -1) throw new Error('OS não encontrada');

    const updated = { ...workOrders[index], ...data, updatedAt: new Date().toISOString() };
    workOrders[index] = updated;

    this.addTimelineEvent(id, 'Alteração', 'Dados de abertura alterados', 'sys', 'Sistema', updated.status, updated.status);

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
    const index = workOrders.findIndex(wo => wo.id === id);
    if (index === -1) throw new Error('OS não encontrada');

    const oldStatus = workOrders[index].status;
    const updated = { ...workOrders[index], ...data, status: newStatus, updatedAt: new Date().toISOString() };
    workOrders[index] = updated;

    this.addTimelineEvent(id, actionTitle, description, userId, userName, oldStatus, newStatus);
    
    return updated;
  },

  addTimelineEvent(orderId: string, action: string, description: string, userId: string, userName: string, prevStatus?: WorkOrderStatus, newStatus?: WorkOrderStatus, relatedData?: any) {
    if (!timelines[orderId]) timelines[orderId] = [];
    timelines[orderId].push({
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
  }
};
