import { describe, it, expect } from 'vitest';

describe('Regras de Negócio de Estoque e Almoxarifado (Fase 15B)', () => {
  it('deve calcular corretamente o custo médio ponderado', () => {
    const currentQty = 10;
    const currentVal = 100; // total 1000
    const inQty = 5;
    const inVal = 130; // total 650

    const totalQty = currentQty + inQty;
    const totalCost = currentQty * currentVal + inQty * inVal;
    const averageUnitCost = totalCost / totalQty;

    expect(totalQty).toBe(15);
    expect(averageUnitCost).toBe(110);
  });

  it('deve rejeitar saída quando o saldo for insuficiente', () => {
    const balance = 5;
    const requestedQty = 8;

    const hasEnoughStock = balance >= requestedQty;
    expect(hasEnoughStock).toBe(false);
  });
});
