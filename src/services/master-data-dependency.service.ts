import type { MasterDataDependencyCheckResult } from '../types/master-data-dependency';

export const masterDataDependencyService = {
  /**
   * Verifica se o registro possui vínculos com Equipamentos, OSs, Preventivas, Pneus, Ferramentas, etc.
   */
  async checkDependencies(type: string, id: string): Promise<MasterDataDependencyCheckResult> {
    const key = `${type}_${id}`;
    const mockDependencyCountMap: Record<string, number> = {
      'emp-01': 14,
      'und-01': 8,
      'fzm-01': 5,
      'mar-01': 12,
      'mod-01': 6,
      'sis-01': 18,
      'pri-03': 9,
      'for-01': 15,
    };

    const count = mockDependencyCountMap[id] || mockDependencyCountMap[key] || 0;

    if (count > 0) {
      return {
        hasDependencies: true,
        canDelete: false,
        dependencies: [
          { moduleName: 'Equipamentos', count: Math.ceil(count / 2), relatedSummary: `${Math.ceil(count / 2)} equipamento(s) vinculado(s)`, targetRoute: '/equipamentos' },
          { moduleName: 'Ordens de Serviço', count: Math.floor(count / 2), relatedSummary: `${Math.floor(count / 2)} ordem(ns) de serviço vinculada(s)`, targetRoute: '/ordens-servico' },
        ],
      };
    }

    return {
      hasDependencies: false,
      canDelete: true,
      dependencies: [],
    };
  },
};
