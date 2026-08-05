import { describe, it, expect } from 'vitest';
import { validateStatusTransition, type WorkOrderStatus } from '../src/modules/work-orders/work-order.state-machine';
import { AppError } from '../src/shared/errors/AppError';

describe('WorkOrder StateMachine Tests', () => {
  it('deve permitir transição válida de aberta para em_execucao', () => {
    expect(() => validateStatusTransition('aberta', 'em_execucao')).not.toThrow();
  });

  it('deve permitir transição de em_execucao para em_teste', () => {
    expect(() => validateStatusTransition('em_execucao', 'em_teste')).not.toThrow();
  });

  it('deve bloquear transição inválida de encerrada para aberta', () => {
    expect(() => validateStatusTransition('encerrada', 'aberta')).toThrow(AppError);
  });

  it('deve bloquear transição inválida de cancelada para em_execucao', () => {
    expect(() => validateStatusTransition('cancelada', 'em_execucao')).toThrow(AppError);
  });
});
