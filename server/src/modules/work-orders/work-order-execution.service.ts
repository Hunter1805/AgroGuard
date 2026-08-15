import type { RequestActor } from '../../shared/http/RequestActor';
import { AppError } from '../../shared/errors/AppError';
import { AuditService } from '../../shared/services/audit.service';
import { WorkOrderExecutionRepository } from './work-order-execution.repository';

export class WorkOrderExecutionService {
  constructor(private readonly repo: WorkOrderExecutionRepository, private readonly audit: AuditService) {}
  private async order(a: RequestActor, id: string) {
    if (!a.organizationId || !(await this.repo.order(id, a.organizationId))) throw new AppError('Ordem de Serviço não encontrada.', 404, 'NOT_FOUND');
  }
  async getExecution(a: RequestActor, id: string) { await this.order(a, id); return this.repo.execution(id, a.organizationId); }
  async patchExecution(a: RequestActor, id: string, data: any) {
    await this.order(a, id);
    return this.repo.tx(async db => {
      const result = await db.workOrderExecution.upsert({ where: { workOrderId: id }, create: { organizationId: a.organizationId, workOrderId: id, ...data }, update: data });
      await db.workOrderTimeline.create({ data: { organizationId: a.organizationId, workOrderId: id, actorUserId: a.userId || null, eventType: 'UPDATED', message: 'Execução atualizada' } });
      await this.audit.log({ actor: a, module: 'work-orders', entityType: 'WorkOrderExecution', entityId: result.id, action: 'UPDATED' }, db);
      return result;
    });
  }
  async listLabor(a: RequestActor, id: string) { await this.order(a, id); return this.repo.prisma.workOrderLaborEntry.findMany({ where: { workOrderId: id, organizationId: a.organizationId }, orderBy: { startedAt: 'asc' } }); }
  async createLabor(a: RequestActor, id: string, input: any) { await this.order(a, id); return this.repo.prisma.workOrderLaborEntry.create({ data: { ...input, workOrderId: id, organizationId: a.organizationId } }); }
  async updateLabor(a: RequestActor, id: string, entryId: string, input: any) { await this.order(a, id); return this.repo.prisma.workOrderLaborEntry.updateMany({ where: { id: entryId, workOrderId: id, organizationId: a.organizationId }, data: input }); }
  async deleteLabor(a: RequestActor, id: string, entryId: string) { await this.order(a, id); return this.repo.prisma.workOrderLaborEntry.deleteMany({ where: { id: entryId, workOrderId: id, organizationId: a.organizationId } }); }
  async listMaterials(a: RequestActor, id: string) { await this.order(a, id); return this.repo.prisma.workOrderMaterialUsage.findMany({ where: { workOrderId: id, organizationId: a.organizationId }, orderBy: { consumedAt: 'asc' } }); }
  async createMaterial(a: RequestActor, id: string, input: any) { await this.order(a, id); return this.repo.prisma.workOrderMaterialUsage.create({ data: { ...input, totalCost: input.quantity * input.unitCost, workOrderId: id, organizationId: a.organizationId } }); }
  async updateMaterial(a: RequestActor, id: string, usageId: string, input: any) { await this.order(a, id); return this.repo.prisma.workOrderMaterialUsage.updateMany({ where: { id: usageId, workOrderId: id, organizationId: a.organizationId }, data: input }); }
  async deleteMaterial(a: RequestActor, id: string, usageId: string) { await this.order(a, id); return this.repo.prisma.workOrderMaterialUsage.deleteMany({ where: { id: usageId, workOrderId: id, organizationId: a.organizationId } }); }
  async listTools(a: RequestActor, id: string) { await this.order(a, id); return this.repo.prisma.workOrderToolUsage.findMany({ where: { workOrderId: id, organizationId: a.organizationId }, orderBy: { withdrawnAt: 'asc' } }); }
  async createTool(a: RequestActor, id: string, input: any) { await this.order(a, id); return this.repo.prisma.workOrderToolUsage.create({ data: { ...input, workOrderId: id, organizationId: a.organizationId } }); }
  async updateTool(a: RequestActor, id: string, usageId: string, input: any) { await this.order(a, id); return this.repo.prisma.workOrderToolUsage.updateMany({ where: { id: usageId, workOrderId: id, organizationId: a.organizationId }, data: input }); }
  async deleteTool(a: RequestActor, id: string, usageId: string) { await this.order(a, id); return this.repo.prisma.workOrderToolUsage.deleteMany({ where: { id: usageId, workOrderId: id, organizationId: a.organizationId } }); }
  async timeline(a: RequestActor, id: string, page: number, pageSize: number) { await this.order(a, id); const [data, total] = await this.repo.timeline(id, a.organizationId, (page - 1) * pageSize, pageSize); return { data, meta: { page, pageSize, total } }; }
  async note(a: RequestActor, id: string, message: string) { await this.order(a, id); return this.repo.prisma.workOrderTimeline.create({ data: { organizationId: a.organizationId, workOrderId: id, actorUserId: a.userId || null, eventType: 'NOTE_ADDED', message } }); }
}
