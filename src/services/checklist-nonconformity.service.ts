import type { ChecklistNonConformity, NonConformityStatus } from '../types/checklist';
import { equipmentService } from './equipment.service';
import { isExplicitMockMode } from '../config/data-source.config';

const MOCK_NON_CONFORMITIES: ChecklistNonConformity[] = [
  {
    id: 'nc-001',
    code: 'NC-2601',
    executionId: 'exec-101',
    equipmentId: '1',
    equipmentCode: 'TR-01',
    equipmentName: 'TRATOR MASSEY 265 01 4x2',
    itemId: 'item-1001',
    itemTitle: 'Ausência de vazamentos embaixo do equipamento (óleo, combustível ou líquido arrefecimento)',
    checklistName: 'Checklist Diário de Trator e Implemento',
    title: 'Vazamento de óleo lubrificante no cárter inferior',
    description: 'Constatado pequeno gotejamento crônico próximo ao bujão do cárter durante inspeção matinal.',
    criticality: 'alta',
    status: 'aberta',
    photoUrls: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format'],
    immediateAction: 'Instalada bandeja contora no pátio e notificado supervisor mecânico.',
    responsibleUserId: 'user-201',
    responsibleName: 'Mecânico Chefe (João Pedro)',
    dueAt: '2026-08-05 17:00:00',
    blockedEquipment: false,
    createdAt: '2026-08-04 06:15:00',
    updatedAt: '2026-08-04 06:15:00',
  },
  {
    id: 'nc-002',
    code: 'NC-2602',
    executionId: 'exec-102',
    equipmentId: '2',
    equipmentCode: 'TR-02',
    equipmentName: 'TRATOR MASSEY 290 02 4X4',
    itemId: 'item-1003',
    itemTitle: 'Nível do Óleo do Motor (vareta entre marca mínima e máxima)',
    checklistName: 'Checklist Diário de Trator e Implemento',
    title: 'Nível de óleo absurdamente baixo no motor',
    description: 'A vareta não marcou nenhuma gota de óleo antes de iniciar o turno de preparo do solo.',
    criticality: 'critica',
    status: 'aguardando_os',
    photoUrls: [],
    immediateAction: 'Máquina desligada e chave retirada do painel com etiqueta de bloqueio!',
    responsibleUserId: 'sup-001',
    responsibleName: 'Supervisor OperACional',
    dueAt: '2026-08-04 12:00:00',
    blockedEquipment: true,
    generatedOrderId: 'OS-2026-049',
    createdAt: '2026-08-03 05:50:00',
    updatedAt: '2026-08-03 07:00:00',
  },
  {
    id: 'nc-003',
    code: 'NC-2603',
    executionId: 'exec-099',
    equipmentId: '4',
    equipmentCode: 'CH-01',
    equipmentName: 'COLHEDora JOHN DEERE S770',
    itemId: 'item-2001',
    itemTitle: 'Desgaste de navalhas do rodo de corte ou plataforma',
    checklistName: 'Inspeção Semanal de Colhedoras',
    title: 'Três navalhas quebadas na lateral da plataforma',
    description: 'Navalhas danificadas por impacto com pedras na lavoura da Unidade Alvorada.',
    criticality: 'alta',
    status: 'resolvida',
    photoUrls: [],
    responsibleName: 'Equipe de Manutenção de Pátio',
    dueAt: '2026-07-30 18:00:00',
    blockedEquipment: false,
    resolvedAt: '2026-07-30 16:30:00',
    resolvedBy: 'Mecânico (Carlos Roberto)',
    resolutionNotes: 'Substituídos o conjunto de navalhas e verificado o alinhamento da plataforma de corte.',
    createdAt: '2026-07-29 08:00:00',
    updatedAt: '2026-07-30 16:30:00',
  },
];

class ChecklistNonConformityService {
  private ncs: ChecklistNonConformity[] = [...MOCK_NON_CONFORMITIES];

  async getNonConformities(filters?: {
    search?: string;
    status?: string;
    criticality?: string;
    equipmentId?: string;
    onlyBlocked?: boolean;
  }): Promise<ChecklistNonConformity[]> {
    await new Promise((r) => setTimeout(r, 100));
    if (!isExplicitMockMode) return [];
    return this.ncs.filter((nc) => {
      if (filters?.status && filters.status !== 'todos' && nc.status !== filters.status) return false;
      if (filters?.criticality && filters.criticality !== 'todas' && nc.criticality !== filters.criticality) return false;
      if (filters?.equipmentId && nc.equipmentId !== filters.equipmentId) return false;
      if (filters?.onlyBlocked && !nc.blockedEquipment) return false;
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        const m = nc.title.toLowerCase().includes(query) ||
          nc.description.toLowerCase().includes(query) ||
          (nc.code && nc.code.toLowerCase().includes(query)) ||
          (nc.equipmentCode && nc.equipmentCode.toLowerCase().includes(query));
        if (!m) return false;
      }
      return true;
    });
  }

  async getNonConformityById(id: string): Promise<ChecklistNonConformity | undefined> {
    await new Promise((r) => setTimeout(r, 80));
    return this.ncs.find((i) => i.id === id || i.code === id);
  }

  async createNonConformity(data: Omit<ChecklistNonConformity, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Promise<ChecklistNonConformity> {
    const nextNum = this.ncs.length + 2601;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const created: ChecklistNonConformity = {
      ...data,
      id: `nc-${Date.now()}`,
      code: `NC-${nextNum}`,
      createdAt: now,
      updatedAt: now,
    };
    this.ncs.unshift(created);

    // Se houver bloqueio de equipamento configurado no item não conforme
    if (created.blockedEquipment && created.equipmentId) {
      await equipmentService.updateEquipment(created.equipmentId, {
        status: 'bloqueado',
      } as any);
    }

    return created;
  }

  async assignNonConformity(id: string, responsibleName: string, userId?: string): Promise<ChecklistNonConformity> {
    await new Promise((r) => setTimeout(r, 120));
    const nc = this.ncs.find((i) => i.id === id);
    if (!nc) throw new Error('Não conformidade não encontrada');
    nc.responsibleName = responsibleName;
    if (userId) nc.responsibleUserId = userId;
    if (nc.status === 'aberta') nc.status = 'em_tratamento';
    nc.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return nc;
  }

  async resolveNonConformity(
    id: string,
    data: { solutionApplied: string; resolvedBy: string; photoAfterUrl?: string; unblockEquipment?: boolean }
  ): Promise<ChecklistNonConformity> {
    await new Promise((r) => setTimeout(r, 200));
    const nc = this.ncs.find((i) => i.id === id);
    if (!nc) throw new Error('Não conformidade não encontrada');
    nc.status = 'resolvida';
    nc.resolvedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    nc.resolvedBy = data.resolvedBy;
    nc.resolutionNotes = data.solutionApplied;
    if (data.photoAfterUrl) {
      nc.photoUrls.push(data.photoAfterUrl);
    }
    nc.updatedAt = nc.resolvedAt;

    // Se o usuário solicitou liberação operacional do equipamento
    if (data.unblockEquipment && nc.blockedEquipment && nc.equipmentId) {
      nc.blockedEquipment = false;
      await equipmentService.updateEquipment(nc.equipmentId, {
        status: 'operante',
      } as any);
    }

    return nc;
  }

  async cancelNonConformity(id: string, reason: string): Promise<ChecklistNonConformity> {
    await new Promise((r) => setTimeout(r, 120));
    const nc = this.ncs.find((i) => i.id === id);
    if (!nc) throw new Error('Não conformidade não encontrada');
    nc.status = 'cancelada' as NonConformityStatus;
    nc.resolutionNotes = `Cancelado: ${reason}`;
    nc.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return nc;
  }

  async linkOrderToNonConformity(id: string, orderId: string): Promise<ChecklistNonConformity> {
    await new Promise((r) => setTimeout(r, 100));
    const nc = this.ncs.find((i) => i.id === id);
    if (!nc) throw new Error('Não conformidade não encontrada');
    nc.generatedOrderId = orderId;
    if (nc.status === 'aberta') nc.status = 'aguardando_os';
    nc.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return nc;
  }
}

export const checklistNonConformityService = new ChecklistNonConformityService();
