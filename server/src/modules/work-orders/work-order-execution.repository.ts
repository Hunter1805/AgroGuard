import { PrismaClient, Prisma, WorkOrderTimelineEventType } from '@prisma/client';
export class WorkOrderExecutionRepository {
  constructor(public readonly prisma: PrismaClient) { }
  order(id: string, org: string) { return this.prisma.workOrder.findFirst({ where: { id, organizationId: org }, select: { id: true } }); }
  execution(id: string, org: string) { return this.prisma.workOrderExecution.findFirst({ where: { workOrderId: id, organizationId: org } }); }
  timeline(id: string, org: string, skip: number, take: number) { const where = { workOrderId: id, organizationId: org }; return Promise.all([this.prisma.workOrderTimeline.findMany({ where, orderBy: { timestamp: 'asc' }, skip, take }), this.prisma.workOrderTimeline.count({ where })]); }
  user(id: string, org: string) { return this.prisma.organizationMembership.findFirst({ where: { userId: id, organizationId: org, status: 'ativo' }, select: { userId: true } }); }
  stock(id: string, org: string) { return this.prisma.stockItem.findFirst({ where: { id, organizationId: org }, select: { id: true } }); }
  tool(id: string, org: string) { return this.prisma.tool.findFirst({ where: { id, organizationId: org }, select: { id: true } }); }
  tx<T>(fn: (db: any) => Promise<T>) { return this.prisma.$transaction(fn); }
  event(db: any, data: { organizationId: string; workOrderId: string; actorUserId: string | null; eventType: WorkOrderTimelineEventType; message: string; metadata?: Prisma.InputJsonValue }) { return db.workOrderTimeline.create({ data }); }
}

