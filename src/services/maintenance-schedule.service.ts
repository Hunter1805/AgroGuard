import type { MaintenanceSchedule, MaintenanceScheduleFilterState } from '../types/maintenance-schedule';
import { maintenanceService as legacyOrderService } from './maintenance.service';

let mockSchedules: MaintenanceSchedule[] = [
  {
    id: 'PRG-5001',
    code: 'PRG-5001',
    equipmentId: 'EQ-022',
    equipmentCode: 'TR-022',
    equipmentName: 'Trator LS U80 22 4x4',
    planId: 'PLN-V5-01',
    planName: 'Plano Preventivo Trator LS U80 (2026)',
    intervalId: 'INT-200H',
    intervalName: 'A Cada 200 Horas (Troca de Óleo)',
    scheduledDate: '2026-08-05',
    scheduledTime: '08:00',
    dueReading: 6200,
    meterType: 'horimetro',
    currentReading: 6185,
    priority: 'HIGH',
    status: 'programada',
    responsibleName: 'Eng. Mecânico (Carlos Roberto)',
    teamName: 'Equipe de Manutenção Interna',
    workshopName: 'Oficina Central Sede',
    farmName: 'Fazenda Santa Rita',
    estimatedDurationMinutes: 120,
    requiresEquipmentStop: true,
    parts: [
      { id: 'p1', name: 'Filtro de Óleo do Motor', quantity: 1, unit: 'Peça', required: true },
      { id: 'p2', name: 'Anel de Vedação do Bujão', quantity: 1, unit: 'Peça', required: true },
    ],
    supplies: [
      { id: 's1', name: 'Óleo Lubrificante SAE 15W-40', quantity: 8.5, unit: 'Litros', required: true },
    ],
    tools: [
      { id: 't1', name: 'Chave de Filtro de Óleo', required: true },
      { id: 't2', name: 'Recipiente para Coleta de Óleo Usado', required: true },
    ],
    observations: 'Agendado para o primeiro horário antes da liberação para preparo do solo.',
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'PRG-5002',
    code: 'PRG-5002',
    equipmentId: 'EQ-001',
    equipmentCode: 'MAS-01',
    equipmentName: 'Trator Massey 265 01 4x2',
    planId: 'PLN-V5-02',
    planName: 'Plano Preventivo Massey 265 (Safra 26)',
    intervalId: 'INT-50H',
    intervalName: 'A Cada 50 Horas (Lubrificação e Nível)',
    scheduledDate: '2026-08-06',
    scheduledTime: '14:00',
    dueReading: 3450,
    meterType: 'horimetro',
    currentReading: 3442,
    priority: 'NORMAL',
    status: 'planejada',
    responsibleName: 'Supervisor Operacional (Roberto Campos)',
    teamName: 'Oficina Móvel Campo',
    workshopName: 'Caminhão de Comboio',
    farmName: 'Fazenda Bela Vista',
    estimatedDurationMinutes: 45,
    requiresEquipmentStop: true,
    parts: [],
    supplies: [
      { id: 's2', name: 'Graxa de Lítio EP2', quantity: 0.5, unit: 'Kg', required: true },
    ],
    tools: [
      { id: 't3', name: 'Bomba de Graxa Pneumática', required: true },
    ],
    observations: 'Parada no intervalo de turno no talhão 12.',
    createdAt: '2026-08-02T14:20:00Z',
    updatedAt: '2026-08-02T14:20:00Z',
  },
  {
    id: 'PRG-5003',
    code: 'PRG-5003',
    equipmentId: 'EQ-005',
    equipmentCode: 'COL-01',
    equipmentName: 'Colhedora John Deere S700',
    planId: 'PLN-V5-03',
    planName: 'Plano Colhedora S-Series Anual',
    intervalId: 'INT-500H',
    intervalName: 'Revisão Hidráulica 500h',
    scheduledDate: '2026-08-03',
    scheduledTime: '07:30',
    dueReading: 12500,
    meterType: 'horimetro',
    currentReading: 12515,
    priority: 'CRITICAL',
    status: 'aguardando_pecas',
    responsibleName: 'Técnico Concessionaria JD',
    teamName: 'Especialista Hidráulico Externo',
    workshopName: 'Concessionária Autorizada',
    farmName: 'Fazenda Santa Rita',
    estimatedDurationMinutes: 360,
    requiresEquipmentStop: true,
    parts: [
      { id: 'p3', name: 'Kit de Filtros Hidráulicos Alta Pressão', quantity: 2, unit: 'Kit', required: true },
    ],
    supplies: [
      { id: 's3', name: 'Óleo Hidráulico Hy-Gard', quantity: 80, unit: 'Litros', required: true },
    ],
    tools: [],
    observations: 'Serviço em atraso devido ao prazo de entrega de filtros autorizados na oficina.',
    createdAt: '2026-07-28T08:00:00Z',
    updatedAt: '2026-08-04T16:00:00Z',
  },
];

export const maintenanceScheduleService = {
  async getMaintenanceSchedules(filters?: Partial<MaintenanceScheduleFilterState>): Promise<MaintenanceSchedule[]> {
    let result = [...mockSchedules];
    if (!filters) return Promise.resolve(result);

    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.code.toLowerCase().includes(q) ||
          s.equipmentName.toLowerCase().includes(q) ||
          (s.planName && s.planName.toLowerCase().includes(q)) ||
          (s.intervalName && s.intervalName.toLowerCase().includes(q)) ||
          s.responsibleName.toLowerCase().includes(q)
      );
    }

    if (filters.equipmentId && filters.equipmentId !== 'todos') {
      result = result.filter((s) => s.equipmentId === filters.equipmentId);
    }
    if (filters.status && filters.status !== 'todos') {
      result = result.filter((s) => s.status === filters.status);
    }
    if (filters.priority && filters.priority !== 'todos') {
      result = result.filter((s) => s.priority === filters.priority);
    }
    if (filters.responsible && filters.responsible !== 'todos') {
      result = result.filter((s) => s.responsibleName.toLowerCase().includes(filters.responsible!.toLowerCase()));
    }
    if (filters.workshop && filters.workshop !== 'todos') {
      result = result.filter((s) => s.workshopName && s.workshopName.toLowerCase().includes(filters.workshop!.toLowerCase()));
    }

    // Ordenar por data cronologicamente
    result.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
    return Promise.resolve(result);
  },

  async getScheduleById(id: string): Promise<MaintenanceSchedule | undefined> {
    const found = mockSchedules.find((s) => s.id === id || s.code === id);
    return Promise.resolve(found ? { ...found } : undefined);
  },

  async createMaintenanceSchedule(data: Omit<MaintenanceSchedule, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Promise<MaintenanceSchedule> {
    const id = `PRG-${5000 + mockSchedules.length + 1}`;
    const newSchedule: MaintenanceSchedule = {
      ...data,
      id,
      code: id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSchedules.unshift(newSchedule);
    return Promise.resolve(newSchedule);
  },

  async updateMaintenanceSchedule(id: string, updates: Partial<MaintenanceSchedule>): Promise<MaintenanceSchedule> {
    const index = mockSchedules.findIndex((s) => s.id === id || s.code === id);
    if (index === -1) throw new Error('Programação de manutenção não encontrada.');
    mockSchedules[index] = { ...mockSchedules[index], ...updates, updatedAt: new Date().toISOString() };
    return Promise.resolve(mockSchedules[index]);
  },

  async rescheduleMaintenance(id: string, newDate: string, newTime?: string, reason?: string): Promise<MaintenanceSchedule> {
    if (!reason || reason.trim().length < 5) {
      throw new Error('A justificativa de reagendamento / adiamento é obrigatória e deve conter pelo menos 5 caracteres.');
    }
    const index = mockSchedules.findIndex((s) => s.id === id || s.code === id);
    if (index === -1) throw new Error('Programação não encontrada para reagendamento.');

    mockSchedules[index] = {
      ...mockSchedules[index],
      scheduledDate: newDate,
      scheduledTime: newTime || mockSchedules[index].scheduledTime,
      rescheduledReason: reason.trim(),
      status: 'adiada',
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve(mockSchedules[index]);
  },

  async cancelMaintenanceSchedule(id: string, reason?: string): Promise<MaintenanceSchedule> {
    if (!reason || reason.trim().length < 5) {
      throw new Error('A justificativa para o cancelamento é estritamente obrigatória no AgroGuard.');
    }
    const index = mockSchedules.findIndex((s) => s.id === id || s.code === id);
    if (index === -1) throw new Error('Programação de manutenção não localizada.');

    mockSchedules[index] = {
      ...mockSchedules[index],
      status: 'cancelada',
      canceledReason: reason.trim(),
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve(mockSchedules[index]);
  },

  /**
   * Cria uma Ordem de Serviço Preventiva a partir da agenda (reutilizando a camada de OS).
   */
  async createPreventiveOrder(scheduleId: string): Promise<{ orderId: string; schedule: MaintenanceSchedule }> {
    const index = mockSchedules.findIndex((s) => s.id === scheduleId || s.code === scheduleId);
    if (index === -1) throw new Error('Serviço programado não localizado.');
    
    const sched = mockSchedules[index];
    const newOrderId = `OS-PREV-${Date.now().toString().slice(-4)}`;
    
    // Integrar via legacy order service
    await legacyOrderService.createOrder({
      id: newOrderId,
      equipment: sched.equipmentName,
      equipmentKind: 'Máquina',
      type: 'Preventiva',
      maintenanceSubtype: `Plano: ${sched.planName} (${sched.intervalName})` as any,
      priority: sched.priority === 'CRITICAL' || sched.priority === 'URGENT' || sched.priority === 'HIGH' ? 'Alta' : 'Média',
      status: 'Em Progresso',
      date: sched.scheduledDate.slice(0, 10),
      costEstimate: 'R$ 1.500,00',
      technician: sched.responsibleName,
      requester: 'Plano Preventivo Automático',
      failureLocation: sched.workshopName || 'Oficina Central',
      openDate: new Date().toLocaleDateString('pt-BR'),
      responsible: sched.responsibleName,
    } as any);

    mockSchedules[index] = {
      ...sched,
      status: 'em_execucao',
      preventiveOrderId: newOrderId,
      updatedAt: new Date().toISOString(),
    };

    return Promise.resolve({ orderId: newOrderId, schedule: mockSchedules[index] });
  },
};
