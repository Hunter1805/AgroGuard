import type {
  Tool,
  ToolFilter,
  ToolsDashboardStats,
  ToolHistoryLog,
  TirePressureEntry,
} from '../types/tools';
import { mockStorage } from './mock-storage';

const defaultTools: Tool[] = [
  {
    id: 'TOOL-001',
    code: 'FER-001',
    name: 'Torquímetro de Estalo 1/2" (20 a 200 Nm)',
    category: 'Medição',
    subcategory: 'Torquímetros',
    description: 'Torquímetro de precisão para aperto controlado de cabeçotes e rodas',
    technicalSpec: 'Encaixe 1/2", Escala 20-200 Nm, Resolução 1 Nm',
    controlType: 'individual',
    brand: 'Gedore',
    model: 'Torcofix K 4550-20',
    serialNumber: 'SN-998822',
    patrimonyNumber: 'PAT-4401',
    totalQuantity: 1,
    availableQuantity: 1,
    minimumQuantity: 1,
    unitOfMeasure: 'UN',
    location: {
      company: 'AgroGuard',
      unit: 'Sede Principal',
      farm: 'Fazenda Primavera',
      workshop: 'Oficina Central',
      warehouse: 'Almoxarifado Geral',
      cabinet: 'Armário A2',
      drawer: 'Gaveta 01',
      detailedLocation: 'Armário A2 - Prateleira de Instrumentos',
    },
    currentResponsibleName: 'Roberto Alves (Mecânico Chefe)',
    acquisitionDate: '2025-01-15',
    acquisitionValue: 1450.0,
    supplierName: 'Gedore Brasil',
    invoiceNumber: 'NF-10492',
    warrantyEndDate: '2027-01-15',
    status: 'disponivel',
    condition: 'excelente',
    lastInspectionDate: '2026-07-01',
    requiresCalibration: true,
    calibrationType: 'Aferição de Torque',
    calibrationFrequencyValue: 6,
    calibrationFrequencyUnit: 'meses',
    lastCalibrationDate: '2026-02-10',
    nextCalibrationDate: '2026-08-10', // Próxima da data atual (2026-08-05)
    calibrationCompany: 'Inmetro / TecnoCalib',
    requiresMaintenance: true,
    maintenanceFrequencyDays: 180,
    priority: 'Alta',
  },
  {
    id: 'TOOL-002',
    code: 'FER-002',
    name: 'Multímetro Digital Automotivo CAT III',
    category: 'Elétrica',
    subcategory: 'Diagnóstico',
    description: 'Multímetro para teste de alternadores, baterias e chicotes elétricos',
    technicalSpec: 'True RMS, 1000V DC/750V AC, Frequência e RPM',
    controlType: 'individual',
    brand: 'Fluke',
    model: 'Fluke 88V',
    serialNumber: 'FLK-880291',
    patrimonyNumber: 'PAT-4402',
    totalQuantity: 1,
    availableQuantity: 0,
    minimumQuantity: 1,
    unitOfMeasure: 'UN',
    location: {
      company: 'AgroGuard',
      unit: 'Sede Principal',
      workshop: 'Oficina Elétrica',
      detailedLocation: 'Bancada 03',
    },
    currentResponsibleName: 'Carlos Silva',
    acquisitionDate: '2024-06-10',
    acquisitionValue: 3200.0,
    supplierName: 'Fluke do Brasil',
    invoiceNumber: 'NF-8821',
    status: 'emprestada',
    condition: 'boa',
    requiresCalibration: true,
    calibrationType: 'Calibração Elétrica Standard',
    calibrationFrequencyValue: 12,
    calibrationFrequencyUnit: 'meses',
    lastCalibrationDate: '2025-07-01',
    nextCalibrationDate: '2026-07-01', // Vencida!
    calibrationCompany: 'CalibraSp',
    priority: 'Alta',
  },
  {
    id: 'TOOL-003',
    code: 'FER-003',
    name: 'Jogo de Chave Combinada (6mm a 32mm)',
    category: 'Chaves',
    subcategory: 'Manuais',
    description: 'Jogo completo de chaves em cromo vanádio com suporte articulado',
    technicalSpec: '26 peças, aço Cr-V forjado e polido',
    controlType: 'quantidade',
    brand: 'Sata',
    model: 'ST09022SJ',
    totalQuantity: 5,
    availableQuantity: 3,
    minimumQuantity: 2,
    unitOfMeasure: 'JOGO',
    location: {
      company: 'AgroGuard',
      workshop: 'Oficina Mecânica',
      warehouse: 'Almoxarifado',
      cabinet: 'Bancada Principal',
      detailedLocation: 'Gaveteiro Geral',
    },
    acquisitionDate: '2024-03-20',
    acquisitionValue: 680.0,
    supplierName: 'Ferramentas Kennedy',
    status: 'disponivel',
    condition: 'boa',
    requiresCalibration: false,
    priority: 'Alta',
  },
  {
    id: 'TOOL-004',
    code: 'FER-004',
    name: 'Parafusadeira Pneumática de Impacto 1/2"',
    category: 'Pneumática',
    subcategory: 'Impacto',
    description: 'Chave de impacto pneumática com torque elevado de 650 Nm',
    technicalSpec: 'Soquete 1/2", Consumo de ar 4,5 PCM, 7000 RPM',
    controlType: 'individual',
    brand: 'Puma',
    model: 'AT-2810',
    serialNumber: 'PUM-77112',
    patrimonyNumber: 'PAT-4404',
    totalQuantity: 1,
    availableQuantity: 0,
    minimumQuantity: 1,
    unitOfMeasure: 'UN',
    location: {
      workshop: 'Oficina Central',
    },
    currentResponsibleName: 'Marcos Souza',
    acquisitionDate: '2023-11-05',
    acquisitionValue: 890.0,
    status: 'em_manutencao',
    condition: 'regular',
    unavailabilityReason: 'Troca do rotor e palhetas de vedação',
    requiresMaintenance: true,
    priority: 'Alta',
  },
  {
    id: 'TOOL-005',
    code: 'FER-005',
    name: 'Máquina de Solda Inversora 250A',
    category: 'Solda',
    subcategory: 'Inversoras',
    description: 'Inversora de solda portátil Bivolt para eletrodo revestido e TIG',
    technicalSpec: '250A, Ciclo de trabalho 60%, Bivolt automático 110/220V',
    controlType: 'individual',
    brand: 'Esab',
    model: 'HandyArc 250i',
    serialNumber: 'ESB-44109',
    patrimonyNumber: 'PAT-4405',
    totalQuantity: 1,
    availableQuantity: 1,
    minimumQuantity: 1,
    unitOfMeasure: 'UN',
    location: {
      workshop: 'Bancada de Solda',
    },
    acquisitionDate: '2024-09-12',
    acquisitionValue: 2100.0,
    supplierName: 'Balmer / Esab Direct',
    status: 'disponivel',
    condition: 'excelente',
    requiresCalibration: false,
    priority: 'Média',
  },
];

const defaultHistory: ToolHistoryLog[] = [
  {
    id: 'HIST-001',
    toolId: 'TOOL-001',
    toolCode: 'FER-001',
    date: '2026-07-01T10:00:00Z',
    event: 'cadastro',
    responsibleName: 'Roberto Alves',
    notes: 'Ferramenta cadastrada no estoque inicial da oficina',
  },
];

const mockTirePressures: TirePressureEntry[] = [
  { id: 1, vehicleType: 'Caminhão', tireMeasure: '275/80R 22,5', pressure: '110' },
  { id: 2, vehicleType: 'Trator Dianteiro traçado', tireMeasure: '12/24 ou 14/24', pressure: '22 a 25' },
];

export const toolsService = {
  async getToolsDashboard(): Promise<ToolsDashboardStats> {
    const list = await mockStorage.get<Tool>('tools', defaultTools);
    const totalTools = list.length;
    const availableTools = list.filter(t => t.status === 'disponivel').length;
    const loanedTools = list.filter(t => t.status === 'emprestada').length;
    const reservedTools = list.filter(t => t.status === 'reservada').length;
    const inMaintenanceTools = list.filter(t => t.status === 'em_manutencao' || t.status === 'aguardando_manutencao').length;
    const damagedTools = list.filter(t => t.status === 'danificada').length;
    const lostTools = list.filter(t => t.status === 'perdida').length;

    const todayStr = new Date().toISOString().split('T')[0];

    const expiredCalibrations = list.filter(
      t => t.requiresCalibration && t.nextCalibrationDate && t.nextCalibrationDate < todayStr
    ).length;

    const next30Days = new Date();
    next30Days.setDate(next30Days.getDate() + 30);
    const next30DaysStr = next30Days.toISOString().split('T')[0];

    const upcomingCalibrations = list.filter(
      t =>
        t.requiresCalibration &&
        t.nextCalibrationDate &&
        t.nextCalibrationDate >= todayStr &&
        t.nextCalibrationDate <= next30DaysStr
    ).length;

    const totalPatrimonyValue = list.reduce((acc, t) => acc + (t.acquisitionValue || 0), 0);

    return {
      totalTools,
      availableTools,
      loanedTools,
      overdueLoans: 1, // mock
      reservedTools,
      inMaintenanceTools,
      damagedTools,
      lostTools,
      expiredCalibrations,
      upcomingCalibrations,
      incompleteKits: 1, // mock
      totalPatrimonyValue,
    };
  },

  async getTools(filter?: ToolFilter): Promise<Tool[]> {
    const list = await mockStorage.get<Tool>('tools', defaultTools);
    let result = [...list];

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        t =>
          t.name.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          (t.brand && t.brand.toLowerCase().includes(q)) ||
          (t.patrimonyNumber && t.patrimonyNumber.toLowerCase().includes(q)) ||
          (t.serialNumber && t.serialNumber.toLowerCase().includes(q))
      );
    }

    if (filter?.category && filter.category !== 'todas') {
      result = result.filter(t => t.category === filter.category);
    }

    if (filter?.status && filter.status !== 'todos') {
      result = result.filter(t => t.status === filter.status);
    }

    if (filter?.condition && filter.condition !== 'todas') {
      result = result.filter(t => t.condition === filter.condition);
    }

    if (filter?.controlType && filter.controlType !== 'todos') {
      result = result.filter(t => t.controlType === filter.controlType);
    }

    if (filter?.belowMinimumOnly) {
      result = result.filter(t => t.minimumQuantity && t.availableQuantity < t.minimumQuantity);
    }

    const todayStr = new Date().toISOString().split('T')[0];

    if (filter?.calibrationOverdueOnly) {
      result = result.filter(t => t.requiresCalibration && t.nextCalibrationDate && t.nextCalibrationDate < todayStr);
    }

    return result;
  },

  async getToolById(id: string): Promise<Tool | undefined> {
    const list = await mockStorage.get<Tool>('tools', defaultTools);
    const tool = list.find(t => t.id === id || t.code === id);
    return tool ? { ...tool } : undefined;
  },

  async createTool(data: Partial<Tool>): Promise<Tool> {
    const list = await mockStorage.get<Tool>('tools', defaultTools);
    const id = `TOOL-${String(list.length + 1).padStart(3, '0')}`;
    const code = data.code || `FER-${String(list.length + 1).padStart(3, '0')}`;

    const newTool: Tool = {
      id,
      code,
      name: data.name || 'Nova Ferramenta',
      category: data.category || 'Geral',
      controlType: data.controlType || 'individual',
      totalQuantity: data.totalQuantity ?? 1,
      availableQuantity: data.totalQuantity ?? 1,
      minimumQuantity: data.minimumQuantity ?? 1,
      location: data.location || { workshop: 'Oficina Central' },
      status: data.status || 'disponivel',
      condition: data.condition || 'excelente',
      acquisitionDate: data.acquisitionDate || new Date().toISOString().split('T')[0],
      acquisitionValue: data.acquisitionValue || 0,
      requiresCalibration: data.requiresCalibration || false,
      requiresMaintenance: data.requiresMaintenance || false,
      brand: data.brand,
      model: data.model,
      serialNumber: data.serialNumber,
      patrimonyNumber: data.patrimonyNumber,
      technicalSpec: data.technicalSpec,
      notes: data.notes,
    };

    list.unshift(newTool);
    await mockStorage.set('tools', list);

    const history = await mockStorage.get<ToolHistoryLog>('tool_history', defaultHistory);
    history.unshift({
      id: `HIST-${Date.now()}`,
      toolId: newTool.id,
      toolCode: newTool.code,
      date: new Date().toISOString(),
      event: 'cadastro',
      responsibleName: 'Operador do Sistema',
      notes: `Cadastro de ferramenta ${newTool.code}`,
    });
    await mockStorage.set('tool_history', history);

    return newTool;
  },

  async updateTool(id: string, data: Partial<Tool>): Promise<Tool> {
    const list = await mockStorage.get<Tool>('tools', defaultTools);
    const index = list.findIndex(t => t.id === id || t.code === id);
    if (index === -1) throw new Error('Ferramenta não encontrada.');

    const updated = { ...list[index], ...data };
    list[index] = updated;
    await mockStorage.set('tools', list);

    const history = await mockStorage.get<ToolHistoryLog>('tool_history', defaultHistory);
    history.unshift({
      id: `HIST-${Date.now()}`,
      toolId: updated.id,
      toolCode: updated.code,
      date: new Date().toISOString(),
      event: 'edicao',
      responsibleName: 'Operador do Sistema',
      notes: `Edição dos dados cadastrais da ferramenta ${updated.code}`,
    });
    await mockStorage.set('tool_history', history);

    return updated;
  },

  async transferTool(
    id: string,
    params: { destinationLocation: string; responsibleName: string; notes?: string }
  ): Promise<Tool> {
    const tool = await this.getToolById(id);
    if (!tool) throw new Error('Ferramenta não encontrada.');

    const origin = tool.location.detailedLocation || tool.location.workshop || 'Estoque';

    tool.location.detailedLocation = params.destinationLocation;
    await this.updateTool(tool.id, { location: tool.location });

    const history = await mockStorage.get<ToolHistoryLog>('tool_history', defaultHistory);
    history.unshift({
      id: `HIST-${Date.now()}`,
      toolId: tool.id,
      toolCode: tool.code,
      date: new Date().toISOString(),
      event: 'transferencia',
      responsibleName: params.responsibleName,
      originLocation: origin,
      destinationLocation: params.destinationLocation,
      notes: params.notes,
    });
    await mockStorage.set('tool_history', history);

    return tool;
  },

  async reportDamage(
    id: string,
    params: { description: string; responsibleName: string; requiresMaintenance: boolean; notes?: string }
  ): Promise<Tool> {
    const tool = await this.getToolById(id);
    if (!tool) throw new Error('Ferramenta não encontrada.');

    const newStatus = params.requiresMaintenance ? 'em_manutencao' : 'danificada';

    const updated = await this.updateTool(tool.id, {
      status: newStatus,
      condition: 'ruim',
      unavailabilityReason: params.description,
    });

    const history = await mockStorage.get<ToolHistoryLog>('tool_history', defaultHistory);
    history.unshift({
      id: `HIST-${Date.now()}`,
      toolId: tool.id,
      toolCode: tool.code,
      date: new Date().toISOString(),
      event: 'dano',
      responsibleName: params.responsibleName,
      previousCondition: tool.condition,
      newCondition: 'ruim',
      notes: params.description,
    });
    await mockStorage.set('tool_history', history);

    return updated;
  },

  async reportLoss(
    id: string,
    params: { description: string; responsibleName: string; notes?: string }
  ): Promise<Tool> {
    const tool = await this.getToolById(id);
    if (!tool) throw new Error('Ferramenta não encontrada.');

    const updated = await this.updateTool(tool.id, {
      status: 'perdida',
      availableQuantity: Math.max(0, tool.availableQuantity - 1),
      unavailabilityReason: params.description,
    });

    const history = await mockStorage.get<ToolHistoryLog>('tool_history', defaultHistory);
    history.unshift({
      id: `HIST-${Date.now()}`,
      toolId: tool.id,
      toolCode: tool.code,
      date: new Date().toISOString(),
      event: 'perda',
      responsibleName: params.responsibleName,
      notes: params.description,
    });
    await mockStorage.set('tool_history', history);

    return updated;
  },

  async recoverTool(
    id: string,
    params: { responsibleName: string; condition: any; notes?: string }
  ): Promise<Tool> {
    const tool = await this.getToolById(id);
    if (!tool) throw new Error('Ferramenta não encontrada.');

    const updated = await this.updateTool(tool.id, {
      status: 'disponivel',
      condition: params.condition,
      availableQuantity: Math.min(tool.totalQuantity, tool.availableQuantity + 1),
      unavailabilityReason: undefined,
    });

    const history = await mockStorage.get<ToolHistoryLog>('tool_history', defaultHistory);
    history.unshift({
      id: `HIST-${Date.now()}`,
      toolId: tool.id,
      toolCode: tool.code,
      date: new Date().toISOString(),
      event: 'recuperacao',
      responsibleName: params.responsibleName,
      previousCondition: 'perdida',
      newCondition: params.condition,
      notes: params.notes,
    });
    await mockStorage.set('tool_history', history);

    return updated;
  },

  async decommissionTool(
    id: string,
    params: { reason: string; residualValue?: number; responsibleName: string; notes?: string }
  ): Promise<Tool> {
    const tool = await this.getToolById(id);
    if (!tool) throw new Error('Ferramenta não encontrada.');

    const updated = await this.updateTool(tool.id, {
      status: 'baixada',
      condition: 'inutilizavel',
      availableQuantity: 0,
      unavailabilityReason: `Baixa física: ${params.reason}`,
    });

    const history = await mockStorage.get<ToolHistoryLog>('tool_history', defaultHistory);
    history.unshift({
      id: `HIST-${Date.now()}`,
      toolId: tool.id,
      toolCode: tool.code,
      date: new Date().toISOString(),
      event: 'baixa',
      responsibleName: params.responsibleName,
      cost: params.residualValue,
      notes: `Motivo da baixa: ${params.reason}. ${params.notes || ''}`,
    });
    await mockStorage.set('tool_history', history);

    return updated;
  },

  async getToolHistory(toolId?: string): Promise<ToolHistoryLog[]> {
    const history = await mockStorage.get<ToolHistoryLog>('tool_history', defaultHistory);
    if (!toolId) return [...history];
    return history.filter(h => h.toolId === toolId || h.toolCode === toolId);
  },

  // Suporte a métodos legados
  async getAllTools(): Promise<Tool[]> {
    return this.getTools();
  },
  async getToolsByPriority(priority: 'Alta' | 'Média'): Promise<Tool[]> {
    const list = await mockStorage.get<Tool>('tools', defaultTools);
    return list.filter(t => t.priority === priority);
  },
};

export const tirePressureService = {
  async getAll(): Promise<TirePressureEntry[]> {
    return Promise.resolve([...mockTirePressures]);
  },
};
