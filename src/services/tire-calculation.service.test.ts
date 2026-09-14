import { describe, expect, it } from 'vitest';
import { tireCalculationService } from './tire-calculation.service';

describe('tireCalculationService.calculateRemainingLife', () => {
  it('retorna 100% quando o sulco atual iguala o inicial', () => {
    expect(tireCalculationService.calculateRemainingLife(20, 20, 4)).toBe(100);
  });

  it('retorna 0% quando o sulco atual atinge o mínimo', () => {
    expect(tireCalculationService.calculateRemainingLife(20, 4, 4)).toBe(0);
  });

  it('calcula a vida proporcional entre mínimo e inicial', () => {
    // (12 - 4) / (20 - 4) * 100 = 50
    expect(tireCalculationService.calculateRemainingLife(20, 12, 4)).toBe(50);
  });

  it('arredonda para 1 casa decimal', () => {
    // (10.5 - 4) / (20 - 4) * 100 = 40.625 -> 40.6
    expect(tireCalculationService.calculateRemainingLife(20, 10.5, 4)).toBe(40.6);
  });

  it('retorna 0% para entradas inválidas ou abaixo do mínimo', () => {
    expect(tireCalculationService.calculateRemainingLife(0, 5, 4)).toBe(0);
    expect(tireCalculationService.calculateRemainingLife(4, 3, 4)).toBe(0);
  });

  it('nunca ultrapassa os limites de 0 e 100', () => {
    const above = tireCalculationService.calculateRemainingLife(20, 25, 4);
    expect(above).toBeLessThanOrEqual(100);
    expect(tireCalculationService.calculateRemainingLife(20, 4, 4)).toBeGreaterThanOrEqual(0);
  });
});

describe('tireCalculationService.calculateCondition (fronteiras 0/10/30/60%)', () => {
  it('classifica como inutilizavel quando o sulco é igual ou menor ao mínimo', () => {
    expect(tireCalculationService.calculateCondition(80, 4, 4, 20)).toBe('inutilizavel');
    expect(tireCalculationService.calculateCondition(80, 3, 4, 20)).toBe('inutilizavel');
  });

  it('classifica como novo quando o sulco atual é igual ao inicial', () => {
    expect(tireCalculationService.calculateCondition(100, 20, 4, 20)).toBe('novo');
  });

  it('classifica vida 0% como inutilizavel', () => {
    expect(tireCalculationService.calculateCondition(0)).toBe('inutilizavel');
    expect(tireCalculationService.calculateCondition(-5)).toBe('inutilizavel');
  });

  it('classifica abaixo de 30% como critico', () => {
    expect(tireCalculationService.calculateCondition(10)).toBe('critico');
    expect(tireCalculationService.calculateCondition(29.9)).toBe('critico');
  });

  it('classifica exatamente 30% como atencao (limite do < 30)', () => {
    expect(tireCalculationService.calculateCondition(30)).toBe('atencao');
  });

  it('classifica logo acima de 30% como atencao', () => {
    expect(tireCalculationService.calculateCondition(30.1)).toBe('atencao');
    expect(tireCalculationService.calculateCondition(59.9)).toBe('atencao');
  });

  it('classifica 60% como bom', () => {
    expect(tireCalculationService.calculateCondition(60)).toBe('bom');
    expect(tireCalculationService.calculateCondition(100)).toBe('bom');
  });
});

describe('tireCalculationService.calculatePressureStatus', () => {
  it('retorna normal quando nenhum limite recomendado é informado', () => {
    expect(tireCalculationService.calculatePressureStatus(32)).toEqual({
      status: 'normal',
      diff: 0,
      message: 'Pressão dentro da normalidade',
    });
  });

  it('detecta pressão baixa e calcula a diferença arredondada', () => {
    // min 30, medido 26 -> diff 4
    const result = tireCalculationService.calculatePressureStatus(26, 30, 40, 'psi');
    expect(result.status).toBe('baixa');
    expect(result.diff).toBe(4);
    expect(result.message).toContain('Pressão abaixo do recomendado');
    expect(result.message).toContain('26 psi');
    expect(result.message).toContain('mín 30 psi');
  });

  it('arredonda a diferença de pressão baixa para 1 casa decimal', () => {
    // min 30, medido 27.36 -> diff 2.64 -> 2.6
    const result = tireCalculationService.calculatePressureStatus(27.36, 30, 40);
    expect(result.status).toBe('baixa');
    expect(result.diff).toBe(2.6);
  });

  it('detecta pressão alta e calcula a diferença arredondada', () => {
    // max 40, medido 44.4 -> diff 4.4
    const result = tireCalculationService.calculatePressureStatus(44.4, 30, 40, 'bar');
    expect(result.status).toBe('alta');
    expect(result.diff).toBe(4.4);
    expect(result.message).toContain('Pressão acima do recomendado');
    expect(result.message).toContain('44.4 bar');
    expect(result.message).toContain('máx 40 bar');
  });

  it('considera normal quando a pressão está dentro da faixa', () => {
    expect(tireCalculationService.calculatePressureStatus(35, 30, 40)).toEqual({
      status: 'normal',
      diff: 0,
      message: 'Pressão correta',
    });
  });

  it('trata a fronteira exata do mínimo como normal', () => {
    expect(tireCalculationService.calculatePressureStatus(30, 30, 40).status).toBe('normal');
    expect(tireCalculationService.calculatePressureStatus(40, 30, 40).status).toBe('normal');
  });

  it('deriva a faixa a partir de um único limite informado', () => {
    // Só máximo: min implícito = 40 * 0.85 = 34
    expect(tireCalculationService.calculatePressureStatus(30, undefined, 40)).toMatchObject({
      status: 'baixa',
      diff: 4,
    });
    // Só mínimo: max implícito = 30 * 1.15 = 34.5
    expect(tireCalculationService.calculatePressureStatus(36, 30, undefined)).toMatchObject({
      status: 'alta',
      diff: 1.5,
    });
  });
});
