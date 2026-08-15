import { WorkOrderRepository } from './work-order.repository';
import { validateStatusTransition, type WorkOrderStatus } from './work-order.state-machine';
import { AppError } from '../../shared/errors/AppError';
import { createPaginationMeta } from '../../shared/utils/pagination';
import type { RequestActor } from '../../shared/http/RequestActor';
import { AuditService } from '../../shared/services/audit.service';

export class WorkOrderService {
  constructor(private repo: WorkOrderRepository, private audit?: AuditService) {}

  async listWorkOrders(actor: RequestActor, page?: number, pageSize?: number, query?: string) {
    const result = await this.repo.findWorkOrders(actor.organizationId, { page, pageSize }, query);
    return {
      data: result.items,
      meta: createPaginationMeta(result.total, result.page, result.pageSize),
    };
  }

  async getWorkOrderDetail(id: string, actor: RequestActor) {
    const wo = await this.repo.findById(id, actor.organizationId);
    if (!wo) {
      throw new AppError('Ordem de Serviço não encontrada.', 404, 'NOT_FOUND');
    }
    return wo;
  }

  async createWorkOrder(actor: RequestActor, data: {
    equipmentId: string;
    workshopId?: string;
    nature?: string;
    maintenanceType?: string | null;
    correctiveMode?: string | null;
    trigger?: string;
    priority?: string;
    description: string;
  }) {
    const code = `OS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const created = await this.repo.createWorkOrder({
      organizationId: actor.organizationId,
      equipmentId: data.equipmentId,
      workshopId: data.workshopId,
      openedByUserId: actor.userId,
      code,
      nature: data.nature || 'MAINTENANCE',
      maintenanceType: data.maintenanceType || null,
      correctiveMode: data.correctiveMode || null,
      trigger: data.trigger || 'MANUAL',
      priority: data.priority || 'NORMAL',
      description: data.description,
    });
    if (this.audit) await this.audit.log({ actor, module: 'work-orders', entityType: 'WorkOrder', entityId: created.id, action: 'CREATED' });
    return created;
  }

  async transitionStatus(actor: RequestActor, id: string, targetStatus: WorkOrderStatus) {
    const wo = await this.getWorkOrderDetail(id, actor);

    // Valida a transição na Máquina de Estados
    validateStatusTransition(wo.status as WorkOrderStatus, targetStatus);

    try {
      return await this.repo.updateStatusTransaction(id, targetStatus, wo.version);
    } catch (err: any) {
      if (err.message === 'OPTIMISTIC_LOCK_ERROR') {
        throw new AppError('Concorrência detectada na Ordem de Serviço. Tente novamente.', 409, 'OPTIMISTIC_LOCK_ERROR');
      }
      throw err;
    }
  }
}
