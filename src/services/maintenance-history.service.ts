import type { MaintenanceHistoryEntry, MaintenanceHistoryFilterState } from '../types/maintenance-schedule';

let mockHistory: MaintenanceHistoryEntry[] = [
  {
    id: 'HIST-9001',
    code: 'HST-9001',
    equipmentId: 'EQ-022',
    equipmentCode: 'TR-022',
    equipmentName: 'Trator LS U80 22 4x4',
    planId: 'PLN-V5-01',
    planName: 'Plano Preventivo Trator LS U80 (2026)',
    planVersion: 1,
    intervalId: 'INT-100H',
    intervalName: 'A Cada 100 Horas (Lubrificação e Inspeção)',
    triggerType: 'horas',
    completedDate: '2026-07-15',
    meterReading: 6000,
    meterType: 'horimetro',
    preventiveOrderId: 'OS-3982',
    responsibleName: 'Eng. Mecânico (Carlos Roberto)',
    workshopName: 'Oficina Central Sede',
    estimatedMinutes: 60,
    realizedMinutes: 55,
    totalCost: 185.00,
    result: 'aprovado',
    nextDueDate: '2026-08-15',
    nextDueReading: 6100,
    tasksCompleted: [
      { title: 'Lubrificar todos os pontos de graxa com graxa EP2', completed: true, notes: 'Todos os 18 bicos engraxados em conformidade.' },
      { title: 'Inspecionar tensão das correias do motor', completed: true, notes: 'Tensão adequada.' },
    ],
    partsConsumed: [],
    suppliesConsumed: [
      { name: 'Graxa de Lítio EP2', quantity: 0.8, unit: 'Kg', cost: 45.00 },
    ],
    observations: 'Serviço concluído mais rápido que o estimado. Trator liberado em perfeitas condições.',
    createdAt: '2026-07-15T16:30:00Z',
  },
  {
    id: 'HIST-9002',
    code: 'HST-9002',
    equipmentId: 'EQ-001',
    equipmentCode: 'MAS-01',
    equipmentName: 'Trator Massey 265 01 4x2',
    planId: 'PLN-V5-02',
    planName: 'Plano Preventivo Massey 265 (Safra 26)',
    planVersion: 1,
    intervalId: 'INT-200H',
    intervalName: 'A Cada 200 Horas ou 6 Meses (Regra Combinada)',
    triggerType: 'combinado',
    completedDate: '2026-06-20',
    meterReading: 3240,
    meterType: 'horimetro',
    preventiveOrderId: 'OS-3840',
    responsibleName: 'Técnico de Oficina (Marcos Lima)',
    workshopName: 'Oficina Central Sede',
    estimatedMinutes: 180,
    realizedMinutes: 210,
    totalCost: 890.00,
    result: 'aprovado_com_restricao',
    nextDueDate: '2026-12-20',
    nextDueReading: 3440,
    tasksCompleted: [
      { title: 'Troca de Óleo do Motor e Filtros', completed: true, notes: 'Filtros de óleo e diesel substituídos.' },
      { title: 'Inspeção de Vazamentos Hidráulicos', completed: true, notes: 'Detectado leve suor nas mangueiras dianteiras. Monitorar.' },
    ],
    partsConsumed: [
      { name: 'Filtro de Óleo Massey', quantity: 1, unit: 'Peça', cost: 120.00 },
      { name: 'Filtro de Combustível Secundário', quantity: 1, unit: 'Peça', cost: 85.00 },
    ],
    suppliesConsumed: [
      { name: 'Óleo SAE 15W-40', quantity: 8.0, unit: 'Litros', cost: 320.00 },
    ],
    observations: 'Aprovado com restrição para observação periódica de mangueira hidráulica.',
    createdAt: '2026-06-20T17:00:00Z',
  },
];

export const maintenanceHistoryService = {
  async getMaintenanceHistory(filters?: Partial<MaintenanceHistoryFilterState>): Promise<MaintenanceHistoryEntry[]> {
    let result = [...mockHistory];
    if (!filters) return Promise.resolve(result);

    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (h) =>
          h.code.toLowerCase().includes(q) ||
          h.equipmentName.toLowerCase().includes(q) ||
          h.planName.toLowerCase().includes(q) ||
          h.intervalName.toLowerCase().includes(q) ||
          h.responsibleName.toLowerCase().includes(q) ||
          (h.preventiveOrderId && h.preventiveOrderId.toLowerCase().includes(q))
      );
    }
    if (filters.equipmentId && filters.equipmentId !== 'todos') {
      result = result.filter((h) => h.equipmentId === filters.equipmentId);
    }
    if (filters.planId && filters.planId !== 'todos') {
      result = result.filter((h) => h.planId === filters.planId);
    }
    if (filters.result && filters.result !== 'todos') {
      result = result.filter((h) => h.result === filters.result);
    }
    if (filters.onlyWithOrder) {
      result = result.filter((h) => !!h.preventiveOrderId);
    }
    if (filters.onlyWithDelay) {
      result = result.filter((h) => h.realizedMinutes > h.estimatedMinutes * 1.15);
    }

    result.sort((a, b) => new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime());
    return Promise.resolve(result);
  },

  async getHistoryById(id: string): Promise<MaintenanceHistoryEntry | undefined> {
    const found = mockHistory.find((h) => h.id === id || h.code === id);
    return Promise.resolve(found ? { ...found } : undefined);
  },

  async completeMaintenance(data: Omit<MaintenanceHistoryEntry, 'id' | 'code' | 'createdAt'>): Promise<MaintenanceHistoryEntry> {
    const id = `HIST-${9000 + mockHistory.length + 1}`;
    const newEntry: MaintenanceHistoryEntry = {
      ...data,
      id,
      code: `HST-${9000 + mockHistory.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    mockHistory.unshift(newEntry);
    return Promise.resolve(newEntry);
  },
};
