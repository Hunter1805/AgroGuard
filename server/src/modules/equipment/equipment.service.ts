import { EquipmentRepository } from './equipment.repository';
import { AppError } from '../../shared/errors/AppError';
import { createPaginationMeta } from '../../shared/utils/pagination';
import type { RequestActor } from '../../shared/http/RequestActor';

export class EquipmentService {
  constructor(private repo: EquipmentRepository) {}

  async listEquipments(actor: RequestActor, page?: number, pageSize?: number, query?: string) {
    const result = await this.repo.findEquipments(actor.organizationId, { page, pageSize }, query);
    return {
      data: result.items,
      meta: createPaginationMeta(result.total, result.page, result.pageSize),
    };
  }

  async getEquipmentDetail(id: string, actor: RequestActor) {
    const eq = await this.repo.findById(id, actor.organizationId);
    if (!eq) {
      throw new AppError('Equipamento não encontrado.', 404, 'NOT_FOUND');
    }
    return eq;
  }

  async registerReading(actor: RequestActor, equipmentId: string, meterId: string, value: number) {
    const eq = await this.getEquipmentDetail(equipmentId, actor);
    const meter = eq.meters.find(m => m.id === meterId);

    if (!meter) {
      throw new AppError('Medidor não pertence a este equipamento.', 400, 'BUSINESS_RULE_VIOLATION');
    }

    // Regra de Validação de Leitura Regressiva
    const currentVal = Number(meter.currentValue);
    if (value < currentVal) {
      throw new AppError(
        `Leitura regressiva não permitida! O valor atual é ${currentVal} e o informado foi ${value}.`,
        422,
        'BUSINESS_RULE_VIOLATION'
      );
    }

    try {
      return await this.repo.createReadingTransaction(equipmentId, meterId, value, actor.userId, meter.version);
    } catch (err: any) {
      if (err.message === 'OPTIMISTIC_LOCK_ERROR') {
        throw new AppError('Concorrência detectada no medidor. Tente novamente.', 409, 'OPTIMISTIC_LOCK_ERROR');
      }
      throw err;
    }
  }
}
