import { PrismaClient, MaintenanceScheduleStatus } from '@prisma/client';
import type { ListSchedulesQueryInput } from './maintenance.schema';

export class MaintenanceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listPlans(organizationId: string) {
    return this.prisma.maintenancePlan.findMany({
      where: { organizationId },
      include: { intervals: true, equipments: { include: { equipment: true } },
      },
      orderBy: { name: 'asc' },
    });
  }
  async findPlan(id: string, organizationId: string) {
    return this.prisma.maintenancePlan.findFirst({
      where: { id, organizationId },
      include: { intervals: true, equipments: { include: { equipment: true } },
      },
    });
  }
  async createPlan(data: any) { return this.prisma.maintenancePlan.create({ data, include: { intervals: true, equipments: true } }); }
  async updatePlan(id: string, organizationId: string, data: any) { const r = await this.prisma.maintenancePlan.updateMany({ where: { id, organizationId }, data }); return r.count ? this.findPlan(id, organizationId) : null; }
  async archivePlan(id: string, organizationId: string) { const r = await this.prisma.maintenancePlan.updateMany({ where: { id, organizationId }, data: { archived: true, active: false } }); return r.count > 0; }
  async createInterval(data: any) { return this.prisma.maintenancePlanInterval.create({ data }); }
  async findInterval(id: string, organizationId: string) {
    return this.prisma.maintenancePlanInterval.findFirst({
      where: { id, plan: { organizationId } },
    });
  }
  async updateInterval(id: string, organizationId: string, data: any) { if (!(await this.findInterval(id, organizationId))) return null; return this.prisma.maintenancePlanInterval.update({ where: { id }, data }); }
  async findEquipment(id: string, organizationId: string) { return this.prisma.equipment.findFirst({ where: { id, organizationId } }); }
  async findLink(equipmentId: string, maintenancePlanId: string, organizationId: string) { return this.prisma.maintenancePlanEquipment.findFirst({ where: { equipmentId, maintenancePlanId, organizationId } }); }
  async listLinks(maintenancePlanId: string, organizationId: string) { return this.prisma.maintenancePlanEquipment.findMany({ where: { maintenancePlanId, organizationId }, include: { equipment: true }, orderBy: { createdAt: 'desc' } }); }
  async createLink(data: any) { return this.prisma.maintenancePlanEquipment.create({ data, include: { equipment: true, maintenancePlan: true } }); }
  async deleteLink(id: string, organizationId: string) { const r = await this.prisma.maintenancePlanEquipment.deleteMany({ where: { id, organizationId } }); return r.count > 0; }
  async findWorkOrder(id: string, organizationId: string) { return this.prisma.workOrder.findFirst({ where: { id, organizationId } }); }
  async findSchedule(id: string, organizationId: string) { return this.prisma.maintenanceSchedule.findFirst({ where: { id, organizationId } }); }
  async listSchedules(organizationId: string, q: ListSchedulesQueryInput) {
    const now = new Date(); const where: any = { organizationId };
    if (q.equipmentId) where.equipmentId = q.equipmentId; if (q.maintenancePlanId) where.maintenancePlanId = q.maintenancePlanId; if (q.status) where.status = q.status;
    const dates: any = {}; if (q.startDate) dates.gte = q.startDate; if (q.endDate) dates.lte = q.endDate;
    if (q.overdue) { dates.lt = now; where.status = { in: [MaintenanceScheduleStatus.DUE, MaintenanceScheduleStatus.OVERDUE] }; }
    if (q.upcoming) { dates.gte = now; where.status = { in: [MaintenanceScheduleStatus.SCHEDULED, MaintenanceScheduleStatus.DUE] }; }
    if (Object.keys(dates).length) where.scheduledDate = dates;
    const page = q.page || 1; const pageSize = q.pageSize || 50; const [items, total] = await Promise.all([this.prisma.maintenanceSchedule.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, include: { equipment: true, maintenancePlan: true, maintenancePlanInterval: true, workOrder: true }, orderBy: { scheduledDate: 'asc' } }), this.prisma.maintenanceSchedule.count({ where })]); return { items, total, page, pageSize };
  }
  async createSchedule(data: any) { return this.prisma.maintenanceSchedule.create({ data, include: { equipment: true, maintenancePlan: true, maintenancePlanInterval: true } }); }
  async updateSchedule(id: string, organizationId: string, data: any) { const r = await this.prisma.maintenanceSchedule.updateMany({ where: { id, organizationId }, data }); return r.count ? this.prisma.maintenanceSchedule.findFirst({ where: { id, organizationId }, include: { equipment: true, maintenancePlan: true, maintenancePlanInterval: true, workOrder: true } }) : null; }
}
