import { describe, expect, it } from 'vitest';
import type { StockItem } from '../types/parts';
import { stockCalculationService } from './stock-calculation.service';

/** Item mínimo e válido; sobrescreva apenas os campos relevantes de cada caso. */
function makeItem(overrides: Partial<StockItem> = {}): StockItem {
  return {
    id: 'item-1',
    internalCode: 'PEC-001',
    name: 'Filtro de óleo',
    type: 'filtro',
    controlUnit: 'un',
    allowsFractionalQuantity: false,
    currentQuantity: 10,
    reservedQuantity: 2,
    availableQuantity: 8,
    minimumQuantity: 5,
    averageCost: 25,
    totalStockValue: 250,
    controlsLot: false,
    controlsExpiration: false,
    status: 'ativo',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('stockCalculationService.calculateAvailableQuantity', () => {
  it('subtrai a quantidade reservada da atual', () => {
    expect(stockCalculationService.calculateAvailableQuantity(10, 4)).toBe(6);
  });

  it('nunca retorna valor negativo', () => {
    expect(stockCalculationService.calculateAvailableQuantity(3, 10)).toBe(0);
  });
});

describe('stockCalculationService.calculateNewAverageCost', () => {
  it('aplica a média ponderada simples', () => {
    // (10 * 25 + 10 * 35) / 20 = 30
    expect(stockCalculationService.calculateNewAverageCost(10, 25, 10, 35)).toBe(30);
  });

  it('aplica a média ponderada com entrada fracionária', () => {
    // (1 * 10 + 2 * 0.1) / 3 = 3.4
    expect(stockCalculationService.calculateNewAverageCost(1, 10, 2, 0.1)).toBe(3.4);
  });

  it('arredonda dízimas para 4 casas decimais', () => {
    // (2 * 10 + 1 * 5) / 3 = 8.333... -> 8.3333
    expect(stockCalculationService.calculateNewAverageCost(2, 10, 1, 5)).toBe(8.3333);
    // (1 * 10 + 2 * 5) / 3 = 6.666... -> 6.6667
    expect(stockCalculationService.calculateNewAverageCost(1, 10, 2, 5)).toBe(6.6667);
  });

  it('retorna o custo de entrada quando a quantidade total é zero ou negativa', () => {
    // Sem estoque atual e sem entrada: o divisor é zero, então usa o custo de entrada.
    expect(stockCalculationService.calculateNewAverageCost(0, 0, 0, 12.5)).toBe(12.5);
    expect(stockCalculationService.calculateNewAverageCost(5, 10, -5, 42)).toBe(42);
  });
});

describe('stockCalculationService.validateQuantity', () => {
  it('rejeita quantidade menor ou igual a zero', () => {
    expect(stockCalculationService.validateQuantity(makeItem(), 0)).toEqual({
      valid: false,
      message: 'A quantidade deve ser maior que zero.',
    });
    expect(stockCalculationService.validateQuantity(makeItem(), -1).valid).toBe(false);
  });

  it('rejeita quantidade fracionada quando o item não permite decimais', () => {
    const result = stockCalculationService.validateQuantity(
      makeItem({ name: 'Rolamento', allowsFractionalQuantity: false }),
      2.5
    );
    expect(result.valid).toBe(false);
    expect(result.message).toContain('Rolamento');
  });

  it('aceita fracionado quando o item permite decimais', () => {
    expect(stockCalculationService.validateQuantity(
      makeItem({ allowsFractionalQuantity: true }),
      2.5
    )).toEqual({ valid: true });
  });
});

describe('stockCalculationService.validateOutputAvailability', () => {
  it('bloqueia saída de item com status bloqueado', () => {
    const result = stockCalculationService.validateOutputAvailability(
      makeItem({ name: 'Óleo 15W40', status: 'bloqueado', availableQuantity: 100 }),
      1
    );
    expect(result.valid).toBe(false);
    expect(result.message).toBe('O item Óleo 15W40 está BLOQUEADO e não pode ser movimentado.');
  });

  it('bloqueia saída de item arquivado', () => {
    const result = stockCalculationService.validateOutputAvailability(
      makeItem({ status: 'arquivado' }),
      1
    );
    expect(result.valid).toBe(false);
    expect(result.message).toContain('ARQUIVADO');
  });

  it('rejeita quando a quantidade solicitada supera o disponível', () => {
    const result = stockCalculationService.validateOutputAvailability(
      makeItem({ availableQuantity: 5, controlUnit: 'L' }),
      6
    );
    expect(result.valid).toBe(false);
    expect(result.message).toContain('supera o estoque disponível');
  });

  it('aceita retirada dentro do saldo disponível', () => {
    expect(stockCalculationService.validateOutputAvailability(
      makeItem({ availableQuantity: 5 }),
      5
    )).toEqual({ valid: true });
  });
});

describe('stockCalculationService.updateCalculatedItemFields', () => {
  it('recalcula disponível e valor total do estoque', () => {
    const updated = stockCalculationService.updateCalculatedItemFields(
      makeItem({ currentQuantity: 12, reservedQuantity: 3, averageCost: 10.5 })
    );
    expect(updated.availableQuantity).toBe(9);
    expect(updated.totalStockValue).toBe(126);
  });

  it('atualiza o timestamp updatedAt', () => {
    const updated = stockCalculationService.updateCalculatedItemFields(makeItem());
    expect(updated.updatedAt).not.toBe('2026-01-01T00:00:00.000Z');
    expect(new Date(updated.updatedAt).getTime()).not.toBeNaN();
  });

  it('mantém o status quando é bloqueado, descontinuado, arquivado ou inativo', () => {
    for (const status of ['bloqueado', 'descontinuado', 'arquivado', 'inativo'] as const) {
      const updated = stockCalculationService.updateCalculatedItemFields(
        makeItem({ status, currentQuantity: 0 })
      );
      expect(updated.status).toBe(status);
    }
  });

  it('marca sem_estoque quando a quantidade atual zera', () => {
    const updated = stockCalculationService.updateCalculatedItemFields(
      makeItem({ currentQuantity: 0, reservedQuantity: 0, minimumQuantity: 5, status: 'ativo' })
    );
    expect(updated.status).toBe('sem_estoque');
    expect(updated.availableQuantity).toBe(0);
  });

  it('marca estoque_baixo quando atinge o mínimo', () => {
    const updated = stockCalculationService.updateCalculatedItemFields(
      makeItem({ currentQuantity: 5, reservedQuantity: 0, minimumQuantity: 5, status: 'ativo' })
    );
    expect(updated.status).toBe('estoque_baixo');
  });

  it('reativa como ativo quando a quantidade fica acima do mínimo', () => {
    const updated = stockCalculationService.updateCalculatedItemFields(
      makeItem({ currentQuantity: 20, reservedQuantity: 0, minimumQuantity: 5, status: 'sem_estoque' })
    );
    expect(updated.status).toBe('ativo');
  });
});
