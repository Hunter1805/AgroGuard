import { PrismaClient } from '@prisma/client';
import { parsePagination, type PaginationInput } from '../../shared/utils/pagination';
import type { WorkOrderStatus } from './work-order.state-machine';

export class WorkOrderRepository {
  constructor(private prisma: PrismaClient) {}

  async findWorkOrders(organizationId: string, pagination: PaginationInput, query?: string) {
    const { skip, take, page, pageSize } = parsePagination(pagination);
    const where = {
      organizationId,
      ...(query ? { OR: [{ code: { contains: query, mode: 'insensitive' as const } }, { description: { contains: query, mode: 'insensitive' as const } }] } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.workOrder.findMany({
        where,
        skip,
        take,
        include: {
          equipment: { include: { model: { include: { brand: true } } } },
          openedByUser: true,
          workshop: true,
        },
        orderBy: { openedAt: 'desc' },
      }),
      this.prisma.workOrder.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async findById(id: string, organizationId: string) {
    return this.prisma.workOrder.findFirst({
      where: { id, organizationId },
      include: {
        equipment: true,
        openedByUser: true,
        workshop: true,
      },
    });
  }

  async createWorkOrder(data: {
    organizationId: string;
    equipmentId: string;
    workshopId?: string;
    openedByUserId?: string;
    code: string;
    nature: string;
    maintenanceType?: string | null;
    correctiveMode?: string | null;
    trigger: string;
    priority: string;
    description: string;
  }) {
    return this.prisma.workOrder.create({
      data,
    });
  }

  async updateStatusTransaction(id: string, newStatus: WorkOrderStatus, currentVersion: number) {
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.workOrder.updateMany({
        where: { id, version: currentVersion },
        data: {
          status: newStatus,
          version: { increment: 1 },
          ...(newStatus === 'encerrada' || newStatus === 'finalizada' ? { closedAt: new Date() } : {}),
        },
      });

      if (updated.count === 0) {
        throw new Error('OPTIMISTIC_LOCK_ERROR');
      }

      return tx.workOrder.findUnique({ where: { id } });
    });
  }
}
