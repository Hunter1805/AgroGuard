import { PrismaClient } from '@prisma/client';
import { StockRepository } from './stock.repository';
import { AppError } from '../../shared/errors/AppError';
import { createPaginationMeta } from '../../shared/utils/pagination';
import type { RequestActor } from '../../shared/http/RequestActor';

export class StockService {
  private prisma: PrismaClient;

  constructor(private repo: StockRepository, prisma?: PrismaClient) {
    this.prisma = prisma ?? new PrismaClient();
  }

  async listStockItems(actor: RequestActor, page?: number, pageSize?: number, query?: string) {
    const result = await this.repo.findItems(actor.organizationId, { page, pageSize }, query);
    return {
      data: result.items,
      meta: createPaginationMeta(result.total, result.page, result.pageSize),
    };
  }

  async createStockItem(actor: RequestActor, input: { unitMeasureId?: string; unitMeasureSymbol?: string; code: string; name: string; partNumber?: string; minQuantity: number }) {
    const existing = await this.prisma.stockItem.findFirst({
      where: { organizationId: actor.organizationId!, code: input.code },
    });
    if (existing) {
      throw new AppError(`O código ${input.code} já está em uso por outro item.`, 409, 'DUPLICATE_RECORD');
    }

    const isUuid = input.unitMeasureId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.unitMeasureId);
    const unit = isUuid
      ? await this.prisma.unitMeasure.findUnique({ where: { id: input.unitMeasureId } })
      : await this.prisma.unitMeasure.findFirst({
          where: {
            OR: [
              ...(input.unitMeasureSymbol ? [{ symbol: { equals: input.unitMeasureSymbol, mode: 'insensitive' as const } }] : []),
              ...(input.unitMeasureSymbol ? [{ code: { equals: input.unitMeasureSymbol, mode: 'insensitive' as const } }] : []),
              ...(input.unitMeasureSymbol ? [{ name: { equals: input.unitMeasureSymbol, mode: 'insensitive' as const } }] : []),
            ],
          },
        });
    if (!unit) {
      throw new AppError('Unidade de medida não encontrada.', 404, 'NOT_FOUND');
    }
    return this.prisma.stockItem.create({
      data: {
        organizationId: actor.organizationId!,
        unitMeasureId: unit.id,
        code: input.code,
        name: input.name,
        partNumber: input.partNumber,
        minQuantity: input.minQuantity,
      },
      include: { unitMeasure: true, balances: { include: { warehouse: true } } },
    });
  }

  async processMovement(
    actor: RequestActor,
    warehouseId: string,
    stockItemId: string,
    type: 'entrada' | 'saida' | 'ajuste',
    quantity: number,
    unitCost: number,
    workOrderId?: string
  ) {
    const item = await this.repo.findItemById(stockItemId, actor.organizationId);
    if (!item) {
      throw new AppError('Item de estoque não encontrado ou pertence a outra organização.', 404, 'NOT_FOUND');
    }

    if (workOrderId) {
      const wo = await this.repo.findWorkOrderById(workOrderId, actor.organizationId);
      if (!wo) {
        throw new AppError('Ordem de serviço não encontrada ou pertence a outra organização.', 404, 'NOT_FOUND');
      }
    }

    try {
      return await this.repo.processMovementTransaction(warehouseId, stockItemId, type, quantity, unitCost, workOrderId);
    } catch (err: any) {
      if (err.message === 'INSUFFICIENT_STOCK') {
        throw new AppError('Saldo insuficiente em estoque para esta operação.', 400, 'INSUFFICIENT_STOCK');
      }
      if (err.message === 'OPTIMISTIC_LOCK_ERROR') {
        throw new AppError('Concorrência detectada no saldo do item. Tente novamente.', 409, 'OPTIMISTIC_LOCK_ERROR');
      }
      throw err;
    }
  }
}
