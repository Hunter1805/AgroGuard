import { AppError } from '../../shared/errors/AppError';

export type WorkOrderStatus =
  | 'aberta'
  | 'planejada'
  | 'em_execucao'
  | 'pausada'
  | 'em_teste'
  | 'aguardando_liberacao'
  | 'finalizada'
  | 'encerrada'
  | 'cancelada';

const VALID_TRANSITIONS: Record<WorkOrderStatus, WorkOrderStatus[]> = {
  aberta: ['planejada', 'em_execucao', 'cancelada'],
  planejada: ['em_execucao', 'cancelada'],
  em_execucao: ['pausada', 'em_teste', 'aguardando_liberacao', 'finalizada', 'cancelada'],
  pausada: ['em_execucao', 'cancelada'],
  em_teste: ['em_execucao', 'aguardando_liberacao', 'cancelada'],
  aguardando_liberacao: ['finalizada', 'em_execucao', 'cancelada'],
  finalizada: ['encerrada', 'em_execucao'],
  encerrada: [],
  cancelada: [],
};

export function validateStatusTransition(currentStatus: WorkOrderStatus, targetStatus: WorkOrderStatus) {
  const allowed = VALID_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    throw new AppError(
      `Transição de status inválida! Não é permitido alterar a OS de '${currentStatus}' para '${targetStatus}'.`,
      422,
      'INVALID_STATUS_TRANSITION'
    );
  }
}
