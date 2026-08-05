export interface TireRecommendation {
  id: string;
  category: string; // Ex: 'Trator', 'Caminhão', 'Colhedora', 'Pulverizador'
  application?: string; // Ex: 'Preparo de Solo', 'Transporte Rodoviário', 'Colheita Pesada'
  equipmentModel?: string; // Ex: 'Massey Ferguson 275', 'Volvo FH 360'
  size: string; // Ex: '18.4-30', '295/80 R22.5'
  axleType?: 'direcional' | 'tracao' | 'livre' | 'implemento' | 'motriz' | 'outro';
  positionSide?: 'esquerdo' | 'direito' | 'central' | 'estepe' | 'todas';
  loadCondition?: 'vazio' | 'parcial' | 'carga_maxima';
  minPressure: number;
  maxPressure: number;
  unit: 'psi' | 'bar' | 'kpa';
  withWaterBallast?: boolean;
  withoutWaterBallast?: boolean;
  sourceRecommendation?: string; // Ex: 'Manual do Fabricante', 'Tabela Michelin'
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

let recommendations: TireRecommendation[] = [
  {
    id: 'REC-001',
    category: 'Trator',
    application: 'Preparo de Solo',
    equipmentModel: 'Trator Massey Ferguson 275',
    size: '18.4-30',
    axleType: 'tracao',
    positionSide: 'todas',
    loadCondition: 'carga_maxima',
    minPressure: 28,
    maxPressure: 34,
    unit: 'psi',
    withWaterBallast: true,
    withoutWaterBallast: false,
    sourceRecommendation: 'Manual Pirelli Agro 2024',
    notes: 'Utilizar 75% de lastro de água em solos argilosos.',
    active: true,
    createdAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-07-01T10:00:00Z',
  },
  {
    id: 'REC-002',
    category: 'Trator',
    application: 'Operações Leves / Pulverização',
    equipmentModel: 'Trator Massey Ferguson 275',
    size: '7.50-16',
    axleType: 'direcional',
    positionSide: 'todas',
    loadCondition: 'parcial',
    minPressure: 32,
    maxPressure: 38,
    unit: 'psi',
    withWaterBallast: false,
    withoutWaterBallast: true,
    sourceRecommendation: 'Manual do Fabricante MF',
    notes: 'Verificar alinhamento e folga dos pinos a cada 100 horas.',
    active: true,
    createdAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-07-01T10:00:00Z',
  },
  {
    id: 'REC-003',
    category: 'Caminhão',
    application: 'Transporte de Grãos / Rodoviário',
    equipmentModel: 'Caminhão Volvo FH 360',
    size: '295/80 R22.5',
    axleType: 'tracao',
    positionSide: 'todas',
    loadCondition: 'carga_maxima',
    minPressure: 110,
    maxPressure: 120,
    unit: 'psi',
    withWaterBallast: false,
    withoutWaterBallast: true,
    sourceRecommendation: 'Tabela Técnica Bridgestone',
    notes: 'Calibrar sempre com os pneus frios.',
    active: true,
    createdAt: '2026-07-05T14:30:00Z',
    updatedAt: '2026-07-05T14:30:00Z',
  },
];

export const tireRecommendationService = {
  async getRecommendations(filters?: { category?: string; size?: string; activeOnly?: boolean }): Promise<TireRecommendation[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    let result = [...recommendations];

    if (filters?.category) {
      result = result.filter(r => r.category.toLowerCase().includes(filters.category!.toLowerCase()));
    }
    if (filters?.size) {
      result = result.filter(r => r.size.toLowerCase().includes(filters.size!.toLowerCase()));
    }
    if (filters?.activeOnly) {
      result = result.filter(r => r.active);
    }

    return result.sort((a, b) => a.category.localeCompare(b.category));
  },

  async getRecommendationById(id: string): Promise<TireRecommendation | undefined> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return recommendations.find(r => r.id === id);
  },

  async createRecommendation(data: Omit<TireRecommendation, 'id' | 'createdAt' | 'updatedAt'>): Promise<TireRecommendation> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (data.minPressure > data.maxPressure) {
      throw new Error('A pressão mínima não pode ser superior à pressão máxima.');
    }
    if (!data.size || !data.unit) {
      throw new Error('Medida do pneu e unidade de pressão são obrigatórias.');
    }

    const newRec: TireRecommendation = {
      ...data,
      id: `REC-${Date.now()}`,
      active: data.active ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    recommendations.push(newRec);
    return newRec;
  },

  async updateRecommendation(id: string, data: Partial<TireRecommendation>): Promise<TireRecommendation> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const idx = recommendations.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Recomendação não encontrada.');

    const updated = {
      ...recommendations[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    if (updated.minPressure > updated.maxPressure) {
      throw new Error('A pressão mínima não pode ser superior à pressão máxima.');
    }

    recommendations[idx] = updated;
    return updated;
  }
};

