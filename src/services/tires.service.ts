import type { Tire, EquipmentTireConfiguration, TireStatus, TireCondition } from '../types/tires';
import { mockStorage } from './mock-storage';

// Mock DB de pneus com dados representativos de fazenda
const defaultTires: Tire[] = [
  {
    id: 'PN-0891',
    internalCode: 'PN-0891',
    brand: 'Pirelli',
    model: 'TM95 Agro',
    size: '18.4-30',
    constructionType: 'diagonal',
    application: 'Trator Traseiro',
    serialNumber: 'PIR-98214-A',
    dotCode: 'DOT 1224',
    manufacturingDate: '2024-03-15',
    acquisitionDate: '2024-05-10',
    acquisitionValue: 4800,
    supplierId: 'SUP-01',
    warrantyEndDate: '2026-05-10',
    initialTreadDepth: 35,
    currentTreadDepth: 28,
    minimumTreadDepth: 8,
    recommendedMinimumPressure: 28,
    recommendedMaximumPressure: 34,
    pressureUnit: 'psi',
    hasTube: true,
    usesWaterBallast: true,
    status: 'instalado',
    condition: 'bom',
    currentEquipmentId: 'EQ-003', // Trator Massey Ferguson 275 03
    currentPositionId: 'pos-2e-in',
    installationDate: '2025-01-15T08:00:00Z',
    installationReading: 7800,
    installationReadingUnit: 'h',
    accumulatedHours: 300,
    retreadCount: 0,
    maximumRetreads: 2,
    notes: 'Operando normalmente em preparo de solo.',
    createdAt: '2024-05-10T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'PN-0892',
    internalCode: 'PN-0892',
    brand: 'Pirelli',
    model: 'TM95 Agro',
    size: '18.4-30',
    constructionType: 'diagonal',
    application: 'Trator Traseiro',
    serialNumber: 'PIR-98215-B',
    dotCode: 'DOT 1224',
    manufacturingDate: '2024-03-15',
    acquisitionDate: '2024-05-10',
    acquisitionValue: 4800,
    supplierId: 'SUP-01',
    warrantyEndDate: '2026-05-10',
    initialTreadDepth: 35,
    currentTreadDepth: 27.5,
    minimumTreadDepth: 8,
    recommendedMinimumPressure: 28,
    recommendedMaximumPressure: 34,
    pressureUnit: 'psi',
    hasTube: true,
    usesWaterBallast: true,
    status: 'instalado',
    condition: 'bom',
    currentEquipmentId: 'EQ-003',
    currentPositionId: 'pos-2d-in',
    installationDate: '2025-01-15T08:00:00Z',
    installationReading: 7800,
    installationReadingUnit: 'h',
    accumulatedHours: 300,
    retreadCount: 0,
    maximumRetreads: 2,
    notes: 'Operando normalmente.',
    createdAt: '2024-05-10T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'PN-0893',
    internalCode: 'PN-0893',
    brand: 'Firestone',
    model: 'Guide Grip',
    size: '7.50-16',
    constructionType: 'diagonal',
    application: 'Trator Dianteiro',
    serialNumber: 'FIR-44102',
    dotCode: 'DOT 4023',
    manufacturingDate: '2023-10-01',
    acquisitionDate: '2023-11-20',
    acquisitionValue: 1200,
    initialTreadDepth: 22,
    currentTreadDepth: 12,
    minimumTreadDepth: 4,
    recommendedMinimumPressure: 32,
    recommendedMaximumPressure: 38,
    pressureUnit: 'psi',
    hasTube: true,
    usesWaterBallast: false,
    status: 'instalado',
    condition: 'atencao',
    currentEquipmentId: 'EQ-003',
    currentPositionId: 'pos-1e',
    installationDate: '2024-06-10T08:00:00Z',
    installationReading: 7500,
    installationReadingUnit: 'h',
    accumulatedHours: 600,
    retreadCount: 0,
    maximumRetreads: 1,
    notes: 'Apresenta pequeno desgaste assimétrico no ombro externo.',
    createdAt: '2023-11-20T10:00:00Z',
    updatedAt: '2026-08-03T09:30:00Z',
  },
  {
    id: 'PN-0894',
    internalCode: 'PN-0894',
    brand: 'Firestone',
    model: 'Guide Grip',
    size: '7.50-16',
    constructionType: 'diagonal',
    application: 'Trator Dianteiro',
    serialNumber: 'FIR-44103',
    dotCode: 'DOT 4023',
    manufacturingDate: '2023-10-01',
    acquisitionDate: '2023-11-20',
    acquisitionValue: 1200,
    initialTreadDepth: 22,
    currentTreadDepth: 13,
    minimumTreadDepth: 4,
    recommendedMinimumPressure: 32,
    recommendedMaximumPressure: 38,
    pressureUnit: 'psi',
    hasTube: true,
    usesWaterBallast: false,
    status: 'instalado',
    condition: 'atencao',
    currentEquipmentId: 'EQ-003',
    currentPositionId: 'pos-1d',
    installationDate: '2024-06-10T08:00:00Z',
    installationReading: 7500,
    installationReadingUnit: 'h',
    accumulatedHours: 600,
    retreadCount: 0,
    maximumRetreads: 1,
    createdAt: '2023-11-20T10:00:00Z',
    updatedAt: '2026-08-03T09:30:00Z',
  },
  {
    id: 'PN-0900',
    internalCode: 'PN-0900',
    brand: 'Michelin',
    model: 'X Multi Z',
    size: '295/80 R22.5',
    constructionType: 'radial',
    application: 'Caminhão Direcional',
    serialNumber: 'MICH-88123',
    dotCode: 'DOT 0825',
    manufacturingDate: '2025-02-10',
    acquisitionDate: '2025-03-01',
    acquisitionValue: 2900,
    initialTreadDepth: 16,
    currentTreadDepth: 16,
    minimumTreadDepth: 3,
    recommendedMinimumPressure: 110,
    recommendedMaximumPressure: 120,
    pressureUnit: 'psi',
    hasTube: false,
    usesWaterBallast: false,
    status: 'disponivel',
    condition: 'novo',
    retreadCount: 0,
    maximumRetreads: 3,
    notes: 'Pneu reserva em almoxarifado central.',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-01T10:00:00Z',
  },
  {
    id: 'PN-0901',
    internalCode: 'PN-0901',
    brand: 'Bridgestone',
    model: 'M729',
    size: '295/80 R22.5',
    constructionType: 'radial',
    application: 'Caminhão Tração',
    serialNumber: 'BS-55901',
    dotCode: 'DOT 1424',
    manufacturingDate: '2024-04-01',
    acquisitionDate: '2024-05-15',
    acquisitionValue: 3100,
    initialTreadDepth: 20,
    currentTreadDepth: 5,
    minimumTreadDepth: 3,
    recommendedMinimumPressure: 110,
    recommendedMaximumPressure: 120,
    pressureUnit: 'psi',
    hasTube: false,
    usesWaterBallast: false,
    status: 'em_recapagem',
    condition: 'critico',
    retreadCount: 1,
    maximumRetreads: 3,
    notes: 'Enviado para a Recapadora Rodagil em 20/07/2026.',
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'PN-0850',
    internalCode: 'PN-0850',
    brand: 'Goodyear',
    model: 'G800',
    size: '10.00-20',
    constructionType: 'diagonal',
    application: 'Caminhão Antigo',
    serialNumber: 'GY-11029',
    initialTreadDepth: 18,
    currentTreadDepth: 2,
    minimumTreadDepth: 3,
    recommendedMinimumPressure: 90,
    recommendedMaximumPressure: 100,
    pressureUnit: 'psi',
    hasTube: true,
    usesWaterBallast: false,
    status: 'descartado',
    condition: 'inutilizavel',
    retreadCount: 2,
    maximumRetreads: 2,
    notes: 'Corte irreparável no flanco ocorrido na colheita de 2025.',
    createdAt: '2023-01-10T10:00:00Z',
    updatedAt: '2025-11-15T10:00:00Z',
  },
];

// Configurações de eixos mockadas por equipamento
const defaultConfigs: EquipmentTireConfiguration[] = [
  {
    id: 'CONF-EQ-003',
    equipmentId: 'EQ-003',
    axleCount: 2,
    spareTireCount: 1,
    pressureUnit: 'psi',
    active: true,
    axles: [
      {
        id: 'axle-1',
        order: 1,
        name: 'Eixo 1 (Dianteiro - Direcional)',
        type: 'direcional',
        sideConfiguration: 'simples',
        positions: [
          {
            id: 'pos-1e',
            code: '1E',
            name: 'Dianteiro Esquerdo',
            axleId: 'axle-1',
            axleOrder: 1,
            side: 'esquerdo',
            installedTireId: 'PN-0893',
            recommendedSize: '7.50-16',
            recommendedMinimumPressure: 32,
            recommendedMaximumPressure: 38,
          },
          {
            id: 'pos-1d',
            code: '1D',
            name: 'Dianteiro Direito',
            axleId: 'axle-1',
            axleOrder: 1,
            side: 'direito',
            installedTireId: 'PN-0894',
            recommendedSize: '7.50-16',
            recommendedMinimumPressure: 32,
            recommendedMaximumPressure: 38,
          },
        ],
      },
      {
        id: 'axle-2',
        order: 2,
        name: 'Eixo 2 (Traseiro - Tração)',
        type: 'tracao',
        sideConfiguration: 'simples',
        positions: [
          {
            id: 'pos-2e-in',
            code: '2E',
            name: 'Traseiro Esquerdo',
            axleId: 'axle-2',
            axleOrder: 2,
            side: 'esquerdo',
            installedTireId: 'PN-0891',
            recommendedSize: '18.4-30',
            recommendedMinimumPressure: 28,
            recommendedMaximumPressure: 34,
          },
          {
            id: 'pos-2d-in',
            code: '2D',
            name: 'Traseiro Direito',
            axleId: 'axle-2',
            axleOrder: 2,
            side: 'direito',
            installedTireId: 'PN-0892',
            recommendedSize: '18.4-30',
            recommendedMinimumPressure: 28,
            recommendedMaximumPressure: 34,
          },
        ],
      },
    ],
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
  },
];

export const tiresService = {
  // ─── Indicadores do Dashboard de Pneus ─────────────────────────────────────
  async getTireDashboard() {
    await new Promise(resolve => setTimeout(resolve, 200));
    const list = await mockStorage.get<Tire>('tires', defaultTires);
    
    const total = list.length;
    const instalados = list.filter(t => t.status === 'instalado').length;
    const estoque = list.filter(t => t.status === 'disponivel' || t.status === 'recapado').length;
    const emReparo = list.filter(t => t.status === 'em_reparo').length;
    const emRecapagem = list.filter(t => t.status === 'em_recapagem').length;
    const anomalias = list.filter(t => t.condition === 'atencao' || t.condition === 'critico').length;
    const sulcoCritico = list.filter(t => (t.currentTreadDepth || 0) <= (t.minimumTreadDepth || 0)).length;
    const pressaoIrregular = list.filter(t => t.status === 'instalado' && t.condition === 'atencao').length; // mock
    const inspecoesAtrasadas = 2; // mock
    const proximosSubstituicao = list.filter(t => t.condition === 'critico').length;
    
    const custoAcumulado = list.reduce((acc, t) => acc + (t.acquisitionValue || 0), 0);
    const custoMedio = total > 0 ? custoAcumulado / total : 0;

    return {
      total,
      instalados,
      estoque,
      emReparo,
      emRecapagem,
      anomalias,
      sulcoCritico,
      pressaoIrregular,
      inspecoesAtrasadas,
      proximosSubstituicao,
      custoAcumulado,
      custoMedio,
    };
  },

  // ─── Pneus ────────────────────────────────────────────────────────────────
  async getTires(filters?: {
    search?: string;
    status?: TireStatus;
    condition?: TireCondition;
    brand?: string;
    size?: string;
    equipmentId?: string;
    hasAnomaly?: boolean;
    pressureIrregular?: boolean;
    treadCritical?: boolean;
  }): Promise<Tire[]> {
    await new Promise(resolve => setTimeout(resolve, 250));
    const list = await mockStorage.get<Tire>('tires', defaultTires);
    let result = [...list].filter(t => !t.archivedAt);

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        t =>
          t.internalCode.toLowerCase().includes(q) ||
          t.brand?.toLowerCase().includes(q) ||
          t.model?.toLowerCase().includes(q) ||
          t.size.toLowerCase().includes(q) ||
          t.serialNumber?.toLowerCase().includes(q)
      );
    }
    if (filters?.status) {
      result = result.filter(t => t.status === filters.status);
    }
    if (filters?.condition) {
      result = result.filter(t => t.condition === filters.condition);
    }
    if (filters?.brand) {
      result = result.filter(t => t.brand?.toLowerCase() === filters.brand?.toLowerCase());
    }
    if (filters?.size) {
      result = result.filter(t => t.size.toLowerCase() === filters.size?.toLowerCase());
    }
    if (filters?.equipmentId) {
      result = result.filter(t => t.currentEquipmentId === filters.equipmentId);
    }
    if (filters?.hasAnomaly) {
      result = result.filter(t => t.condition === 'atencao' || t.condition === 'critico' || t.condition === 'inutilizavel');
    }
    if (filters?.treadCritical) {
      result = result.filter(t => (t.currentTreadDepth || 0) <= (t.minimumTreadDepth || 0));
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getTireById(id: string): Promise<Tire | undefined> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const list = await mockStorage.get<Tire>('tires', defaultTires);
    return list.find(t => t.id === id);
  },

  async createTire(data: Partial<Tire>): Promise<Tire> {
    await new Promise(resolve => setTimeout(resolve, 350));
    const list = await mockStorage.get<Tire>('tires', defaultTires);
    
    if (!data.internalCode) {
      throw new Error('O código interno do pneu é obrigatório.');
    }
    if (list.some(t => t.internalCode.toLowerCase() === data.internalCode!.toLowerCase())) {
      throw new Error('Já existe um pneu cadastrado com este código interno.');
    }
    if (!data.size) {
      throw new Error('A medida do pneu é obrigatória.');
    }
    if (data.acquisitionValue !== undefined && data.acquisitionValue < 0) {
      throw new Error('O valor de aquisição não pode ser negativo.');
    }
    if (
      data.currentTreadDepth !== undefined &&
      data.initialTreadDepth !== undefined &&
      data.currentTreadDepth > data.initialTreadDepth &&
      !data.notes?.includes('Recapagem')
    ) {
      throw new Error('A profundidade atual do sulco não pode superar a profundidade inicial sem justificativa/recapagem.');
    }
    if (
      data.recommendedMinimumPressure !== undefined &&
      data.recommendedMaximumPressure !== undefined &&
      data.recommendedMinimumPressure > data.recommendedMaximumPressure
    ) {
      throw new Error('A pressão mínima recomendada não pode superar a pressão máxima.');
    }

    const newTire: Tire = {
      ...data,
      id: `PN-${Date.now()}`,
      internalCode: data.internalCode,
      size: data.size,
      status: data.status || 'disponivel',
      condition: data.condition || 'novo',
      pressureUnit: data.pressureUnit || 'psi',
      hasTube: data.hasTube ?? false,
      usesWaterBallast: data.usesWaterBallast ?? false,
      retreadCount: data.retreadCount || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Tire;

    list.push(newTire);
    await mockStorage.set('tires', list);
    return newTire;
  },

  async updateTire(id: string, data: Partial<Tire>): Promise<Tire> {
    await new Promise(resolve => setTimeout(resolve, 350));
    const list = await mockStorage.get<Tire>('tires', defaultTires);
    const index = list.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Pneu não encontrado.');

    if (data.internalCode && data.internalCode !== list[index].internalCode) {
      if (list.some(t => t.internalCode.toLowerCase() === data.internalCode!.toLowerCase())) {
        throw new Error('Já existe um pneu com este código interno.');
      }
    }

    const updated = { ...list[index], ...data, updatedAt: new Date().toISOString() };
    list[index] = updated;
    await mockStorage.set('tires', list);
    return updated;
  },

  async archiveTire(id: string): Promise<void> {
    const list = await mockStorage.get<Tire>('tires', defaultTires);
    const index = list.findIndex(t => t.id === id);
    if (index !== -1) {
      list[index].archivedAt = new Date().toISOString();
      list[index].updatedAt = new Date().toISOString();
      await mockStorage.set('tires', list);
    }
  },

  // ─── Configuração de Eixos ────────────────────────────────────────────────
  async getEquipmentTireConfiguration(equipmentId: string): Promise<EquipmentTireConfiguration | undefined> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const list = await mockStorage.get<EquipmentTireConfiguration>('tire_configs', defaultConfigs);
    return list.find(c => c.equipmentId === equipmentId);
  },

  async saveEquipmentTireConfiguration(equipmentId: string, data: Partial<EquipmentTireConfiguration>): Promise<EquipmentTireConfiguration> {
    await new Promise(resolve => setTimeout(resolve, 350));
    const list = await mockStorage.get<EquipmentTireConfiguration>('tire_configs', defaultConfigs);
    const index = list.findIndex(c => c.equipmentId === equipmentId);
    
    let result: EquipmentTireConfiguration;
    if (index !== -1) {
      result = {
        ...list[index],
        ...data,
        updatedAt: new Date().toISOString(),
      } as EquipmentTireConfiguration;
      list[index] = result;
    } else {
      result = {
        id: `CONF-${Date.now()}`,
        equipmentId,
        axleCount: data.axleCount || 2,
        spareTireCount: data.spareTireCount || 0,
        pressureUnit: data.pressureUnit || 'psi',
        axles: data.axles || [],
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      list.push(result);
    }

    await mockStorage.set('tire_configs', list);
    return result;
  }
};

