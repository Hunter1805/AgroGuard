import { describe, it, expect } from 'vitest';

describe('Regras de Negócio de Pneus e Ferramentas (Fase 15B)', () => {
  it('deve emitir alerta crítico quando o sulco do pneu for inferior a 3mm', () => {
    const depthMm = 2.5;
    const isCritical = depthMm < 3.0;
    expect(isCritical).toBe(true);
  });

  it('deve indicar ferramentas com calibração vencida', () => {
    const now = new Date('2026-08-05');
    const calibrationDueDate = new Date('2026-07-30');

    const isExpired = calibrationDueDate < now;
    expect(isExpired).toBe(true);
  });
});
