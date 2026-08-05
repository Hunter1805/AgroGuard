import type { TireCondition } from '../types/tires';

export interface PressureStatusResult {
  status: 'normal' | 'baixa' | 'alta';
  diff: number;
  message: string;
}

export const tireCalculationService = {
  /**
   * Vida restante (%) = (sulco atual - sulco mínimo) / (sulco inicial - sulco mínimo) * 100
   */
  calculateRemainingLife(initialTreadDepth: number, currentTreadDepth: number, minimumTreadDepth: number): number {
    if (!initialTreadDepth || initialTreadDepth <= minimumTreadDepth) return 0;
    
    const life = ((currentTreadDepth - minimumTreadDepth) / (initialTreadDepth - minimumTreadDepth)) * 100;
    return Math.max(0, Math.min(100, Math.round(life * 10) / 10));
  },

  /**
   * Classificação por porcentagem de vida restante:
   * Acima de 60%: bom (ou novo se sulco atual == inicial)
   * Entre 30% e 60%: atenção
   * Entre 10% e 30%: crítico
   * Abaixo de 10%: crítico / próxima substituição
   * Igual ou abaixo do mínimo: inutilizável
   */
  calculateCondition(
    remainingLifePercent: number,
    currentTreadDepth?: number,
    minimumTreadDepth?: number,
    initialTreadDepth?: number
  ): TireCondition {
    if (minimumTreadDepth !== undefined && currentTreadDepth !== undefined && currentTreadDepth <= minimumTreadDepth) {
      return 'inutilizavel';
    }
    if (initialTreadDepth !== undefined && currentTreadDepth !== undefined && currentTreadDepth >= initialTreadDepth) {
      return 'novo';
    }
    if (remainingLifePercent <= 0) return 'inutilizavel';
    if (remainingLifePercent < 10) return 'critico';
    if (remainingLifePercent < 30) return 'critico';
    if (remainingLifePercent < 60) return 'atencao';
    return 'bom';
  },

  /**
   * Avalia a pressão informada comparando com o mínimo e máximo recomendados.
   */
  calculatePressureStatus(
    measuredPressure: number,
    minRecommended?: number,
    maxRecommended?: number,
    unit: 'psi' | 'bar' | 'kpa' = 'psi'
  ): PressureStatusResult {
    if (minRecommended === undefined && maxRecommended === undefined) {
      return { status: 'normal', diff: 0, message: 'Pressão dentro da normalidade' };
    }

    const min = minRecommended ?? (maxRecommended ? maxRecommended * 0.85 : measuredPressure);
    const max = maxRecommended ?? (minRecommended ? minRecommended * 1.15 : measuredPressure);

    if (measuredPressure < min) {
      const diff = Math.round((min - measuredPressure) * 10) / 10;
      return {
        status: 'baixa',
        diff,
        message: `Pressão abaixo do recomendado (${measuredPressure} ${unit} vs mín ${min} ${unit})`,
      };
    }

    if (measuredPressure > max) {
      const diff = Math.round((measuredPressure - max) * 10) / 10;
      return {
        status: 'alta',
        diff,
        message: `Pressão acima do recomendado (${measuredPressure} ${unit} vs máx ${max} ${unit})`,
      };
    }

    return { status: 'normal', diff: 0, message: 'Pressão correta' };
  }
};

