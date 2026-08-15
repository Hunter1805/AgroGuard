import type { ChecklistSchedule } from '../types/checklist';
import { isExplicitMockMode } from '../config/data-source.config';

const MOCK_SCHEDULES: ChecklistSchedule[] = [
  {
    id: 'sch-1',
    templateId: 'tpl-1',
    templateName: 'Checklist Diário de Trator e Implemento',
    equipmentIds: ['1', '2', '3'],
    equipmentTypeIds: ['Trator'],
    frequency: 'diaria',
    dueTime: '06:00',
    responsibleUserIds: ['user-101', 'user-102'],
    validatorUserIds: ['sup-001'],
    startDate: '2026-06-01',
    active: true,
    nextExecutionDate: new Date().toISOString().slice(0, 10),
    createdAt: '2026-06-01 05:00:00',
    updatedAt: '2026-08-01 10:00:00',
  },
  {
    id: 'sch-2',
    templateId: 'tpl-2',
    templateName: 'Inspeção Semanal de Colhedoras de Grãos e Cana',
    equipmentIds: ['4'],
    equipmentTypeIds: ['Colhedora'],
    frequency: 'semanal',
    weekdays: [1], // 1 = Segunda-feira
    dueTime: '07:30',
    responsibleUserIds: ['user-103'],
    validatorUserIds: ['sup-002'],
    startDate: '2026-06-05',
    active: true,
    nextExecutionDate: '2026-08-10',
    createdAt: '2026-06-05 08:30:00',
    updatedAt: '2026-07-20 15:00:00',
  },
  {
    id: 'sch-3',
    templateId: 'tpl-3',
    templateName: 'Checklist de Segurança para Caminhões de Apoio',
    equipmentIds: [],
    equipmentTypeIds: ['Caminhão'],
    frequency: 'dias_personalizados',
    weekdays: [1, 3, 5], // Segunda, Quarta e Sexta
    dueTime: '07:00',
    responsibleUserIds: ['user-104'],
    validatorUserIds: ['sup-001'],
    startDate: '2026-07-01',
    active: true,
    nextExecutionDate: new Date().toISOString().slice(0, 10),
    createdAt: '2026-07-01 09:00:00',
    updatedAt: '2026-08-02 11:30:00',
  },
];

class ChecklistScheduleService {
  private schedules: ChecklistSchedule[] = [...MOCK_SCHEDULES];

  async getChecklistSchedules(filters?: { active?: boolean; frequency?: string; equipmentId?: string }): Promise<ChecklistSchedule[]> {
    await new Promise((r) => setTimeout(r, 100));
    if (!isExplicitMockMode) return [];
    return this.schedules.filter((s) => {
      if (filters?.active !== undefined && s.active !== filters.active) return false;
      if (filters?.frequency && filters.frequency !== 'todas' && s.frequency !== filters.frequency) return false;
      if (filters?.equipmentId) {
        // Se a programação englobar esse ID explícito
        if (s.equipmentIds.length > 0 && !s.equipmentIds.includes(filters.equipmentId)) {
          return false;
        }
      }
      return true;
    });
  }

  async getChecklistScheduleById(id: string): Promise<ChecklistSchedule | undefined> {
    await new Promise((r) => setTimeout(r, 80));
    if (!isExplicitMockMode) return undefined;
    return this.schedules.find((s) => s.id === id);
  }

  async createChecklistSchedule(data: Omit<ChecklistSchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<ChecklistSchedule> {
    await new Promise((r) => setTimeout(r, 180));
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const created: ChecklistSchedule = {
      ...data,
      id: `sch-${Date.now()}`,
      nextExecutionDate: data.startDate || new Date().toISOString().slice(0, 10),
      createdAt: now,
      updatedAt: now,
    };
    this.schedules.unshift(created);
    return created;
  }

  async updateChecklistSchedule(id: string, data: Partial<ChecklistSchedule>): Promise<ChecklistSchedule> {
    await new Promise((r) => setTimeout(r, 180));
    const idx = this.schedules.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Programação de checklist não encontrada');

    const updated: ChecklistSchedule = {
      ...this.schedules[idx],
      ...data,
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };
    this.schedules[idx] = updated;
    return updated;
  }

  async toggleChecklistSchedule(id: string): Promise<ChecklistSchedule> {
    await new Promise((r) => setTimeout(r, 100));
    const sch = this.schedules.find((s) => s.id === id);
    if (!sch) throw new Error('Programação não encontrada');
    sch.active = !sch.active;
    sch.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return sch;
  }
}

export const checklistScheduleService = new ChecklistScheduleService();
