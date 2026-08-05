import type { ToolKit, ToolKitInspection, ToolKitStatus } from '../types/tool-kit';

let mockKits: ToolKit[] = [
  {
    id: 'KIT-001',
    code: 'KIT-MEC-01',
    name: 'Kit Maleta de Campo — Mecânico 01',
    type: 'mecanico',
    description: 'Conjunto de chaves e alicates padrão para atendimento emergencial no campo',
    responsibleName: 'Carlos Silva (Mecânico)',
    teamName: 'Equipe de Campo A',
    location: 'Camionete Hilux Placa ABC-1234',
    deliveryDate: '2026-01-10',
    inspectionFrequencyDays: 30,
    lastInspectionDate: '2026-07-05',
    nextInspectionDate: '2026-08-05',
    responsibilityTermSigned: true,
    status: 'completo',
    items: [
      {
        id: 'KITEM-001',
        toolId: 'TOOL-003',
        toolCode: 'FER-003',
        toolName: 'Jogo de Chave Combinada (6mm a 32mm)',
        expectedQuantity: 1,
        currentQuantity: 1,
        isRequired: true,
        expectedCondition: 'boa',
      },
    ],
  },
  {
    id: 'KIT-002',
    code: 'KIT-TRAT-02',
    name: 'Kit de Bordo — Trator MF 265',
    type: 'equipamento',
    description: 'Ferramentas básicas para aperto e lubrificação diária',
    responsibleName: 'Marcos Souza (Operador)',
    equipmentName: 'TRATOR MASSEY FERGUSON 265 01',
    location: 'Caixa de Ferramentas do Trator',
    inspectionFrequencyDays: 15,
    lastInspectionDate: '2026-07-20',
    nextInspectionDate: '2026-08-04', // Vencida
    status: 'incompleto',
    items: [
      {
        id: 'KITEM-002',
        toolId: 'TOOL-007',
        toolCode: 'FER-007',
        toolName: 'Bomba de Engraxar (Manual) 5Kg',
        expectedQuantity: 1,
        currentQuantity: 0, // Ausente
        isRequired: true,
        expectedCondition: 'boa',
      },
    ],
  },
];

let mockInspections: ToolKitInspection[] = [];

export const toolKitService = {
  async getToolKits(filters?: { search?: string; type?: string; status?: ToolKitStatus | 'todos' }): Promise<ToolKit[]> {
    let result = [...mockKits];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        k =>
          k.name.toLowerCase().includes(q) ||
          k.code.toLowerCase().includes(q) ||
          k.responsibleName.toLowerCase().includes(q)
      );
    }

    if (filters?.type && filters.type !== 'todos') {
      result = result.filter(k => k.type === filters.type);
    }

    if (filters?.status && filters.status !== 'todos') {
      result = result.filter(k => k.status === filters.status);
    }

    return Promise.resolve(result);
  },

  async getToolKitById(id: string): Promise<ToolKit | undefined> {
    const kit = mockKits.find(k => k.id === id || k.code === id);
    return Promise.resolve(kit ? { ...kit } : undefined);
  },

  async inspectToolKit(params: {
    kitId: string;
    inspectorName: string;
    itemsInspection: { itemId: string; foundQuantity: number; condition: string; result: any; notes?: string }[];
    notes?: string;
  }): Promise<ToolKitInspection> {
    const kit = await this.getToolKitById(params.kitId);
    if (!kit) throw new Error('Kit de ferramentas não encontrado.');

    let hasMissing = false;
    let hasDivergence = false;

    const inspectedItems = params.itemsInspection.map(itemParam => {
      const kitItem = kit.items.find(i => i.id === itemParam.itemId);
      const expected = kitItem?.expectedQuantity || 1;

      if (itemParam.foundQuantity < expected) {
        hasMissing = true;
      }
      if (itemParam.result === 'divergente' || itemParam.result === 'danificado') {
        hasDivergence = true;
      }

      if (kitItem) {
        kitItem.currentQuantity = itemParam.foundQuantity;
      }

      return {
        itemId: itemParam.itemId,
        toolId: kitItem?.toolId || '',
        toolName: kitItem?.toolName || 'Item do Kit',
        expectedQuantity: expected,
        foundQuantity: itemParam.foundQuantity,
        condition: itemParam.condition,
        result: itemParam.result,
        notes: itemParam.notes,
      };
    });

    const finalResult = hasDivergence ? 'com_divergencia' : hasMissing ? 'incompleto' : 'completo';

    kit.status = finalResult as any;
    kit.lastInspectionDate = new Date().toISOString().split('T')[0];

    const inspection: ToolKitInspection = {
      id: `KITINSP-${Date.now()}`,
      kitId: kit.id,
      kitCode: kit.code,
      kitName: kit.name,
      date: new Date().toISOString(),
      inspectorName: params.inspectorName,
      items: inspectedItems,
      finalResult,
      notes: params.notes,
    };

    mockInspections.unshift(inspection);
    return Promise.resolve(inspection);
  },
};
