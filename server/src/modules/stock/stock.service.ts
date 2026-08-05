import { StockRepository } from './stock.repository';
import { AppError } from '../../shared/errors/AppError';
import { createPaginationMeta } from '../../shared/utils/pagination';
import type { RequestActor } from '../../shared/http/RequestActor';

export class StockService {
  constructor(private repo: StockRepository) {}

  async listStockItems(actor: RequestActor, page?: number, pageSize?: number, query?: string) {
    const result = await this.repo.findItems(actor.organizationId, { page, pageSize }, query);
    return {
      data: result.items,
      meta: createPaginationMeta(result.total, result.page, result.pageSize),
    };
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
