import { PrismaClient } from '@prisma/client';
import { parsePagination, type PaginationInput } from '../../shared/utils/pagination';

export class StockRepository {
  constructor(private prisma: PrismaClient) {}

  async findItems(organizationId: string, pagination: PaginationInput, query?: string) {
    const { skip, take, page, pageSize } = parsePagination(pagination);
    const where = {
      organizationId,
      status: 'ativo',
      ...(query ? { OR: [{ code: { contains: query, mode: 'insensitive' as const } }, { name: { contains: query, mode: 'insensitive' as const } }] } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.stockItem.findMany({
        where,
        skip,
        take,
        include: {
          unitMeasure: true,
          balances: { include: { warehouse: true } },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.stockItem.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async findBalance(warehouseId: string, stockItemId: string) {
    return this.prisma.stockBalance.findUnique({
      where: { warehouseId_stockItemId: { warehouseId, stockItemId } },
    });
  }

  async findItemById(id: string, organizationId: string) {
    return this.prisma.stockItem.findFirst({
      where: { id, organizationId },
    });
  }

  async findWorkOrderById(id: string, organizationId: string) {
    return this.prisma.workOrder.findFirst({
      where: { id, organizationId },
    });
  }

  async processMovementTransaction(warehouseId: string, stockItemId: string, type: 'entrada' | 'saida' | 'ajuste', quantity: number, unitCost: number, workOrderId?: string) {
    return this.prisma.$transaction(async (tx) => {
      const balance = await tx.stockBalance.findUnique({
        where: { warehouseId_stockItemId: { warehouseId, stockItemId } },
      });

      const currentQty = balance ? Number(balance.quantity) : 0;
      const currentVersion = balance ? balance.version : 1;

      let newQty = currentQty;
      if (type === 'entrada') newQty += quantity;
      else if (type === 'saida') newQty -= quantity;
      else if (type === 'ajuste') newQty = quantity;

      if (newQty < 0) {
        throw new Error('INSUFFICIENT_STOCK');
      }

      if (balance) {
        const updated = await tx.stockBalance.updateMany({
          where: { warehouseId, stockItemId, version: currentVersion },
          data: {
            quantity: newQty,
            version: { increment: 1 },
          },
        });

        if (updated.count === 0) throw new Error('OPTIMISTIC_LOCK_ERROR');
      } else {
        await tx.stockBalance.create({
          data: {
            warehouseId,
            stockItemId,
            quantity: newQty,
          },
        });
      }

      const movement = await tx.stockMovement.create({
        data: {
          stockItemId,
          workOrderId: workOrderId || null,
          type,
          quantity,
          unitCost,
        },
      });

      return movement;
    });
  }
}
