import type { ChecklistExecution, ChecklistAnswer, ChecklistExecutionStatus } from '../types/checklist';
import { checklistTemplateService } from './checklist-template.service';
import { checklistNonConformityService } from './checklist-nonconformity.service';
import { equipmentReadingsService } from './equipment-readings.service';
import { equipmentService } from './equipment.service';

const MOCK_EXECUTIONS: ChecklistExecution[] = [
  {
    id: 'exec-101',
    code: 'CHK-2026-00101',
    templateId: 'tpl-1',
    templateName: 'Checklist Diário de Trator e Implemento',
    templateType: 'diario',
    templateVersion: 3,
    equipmentId: '1',
    equipmentCode: 'TR-01',
    equipmentName: 'TRATOR MASSEY 265 01 4x2',
    operatorId: 'op-01',
    operatorName: 'Motorista / Operador (Marcos Paulo)',
    startedAt: '2026-08-04 05:30:00',
    completedAt: '2026-08-04 05:45:00',
    horimeterReading: 6810,
    status: 'concluido_com_nao_conformidade',
    finalCondition: 'liberado_com_restricao',
    answers: [
      {
        id: 'ans-1',
        itemId: 'item-1001',
        result: 'nao_conforme',
        notes: 'Pequeno vazamento detectado embaixo do cárter.',
        photoUrls: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format'],
        immediateAction: 'Instalada bandeja de contenção.',
        answeredAt: '2026-08-04 05:35:00',
      },
      {
        id: 'ans-2',
        itemId: 'item-1002',
        result: 'conforme',
        photoUrls: [],
        answeredAt: '2026-08-04 05:37:00',
      },
      {
        id: 'ans-3',
        itemId: 'item-1003',
        result: 'conforme',
        photoUrls: [],
        answeredAt: '2026-08-04 05:40:00',
      },
    ],
    generalNotes: 'Trator liberado apenas para operações leves no pátio até reparo na oficina.',
    operatorSignature: 'Marcos Paulo - 04/08/2026',
    createdAt: '2026-08-04 05:30:00',
    updatedAt: '2026-08-04 05:45:00',
  },
  {
    id: 'exec-102',
    code: 'CHK-2026-00102',
    templateId: 'tpl-1',
    templateName: 'Checklist Diário de Trator e Implemento',
    templateType: 'diario',
    templateVersion: 3,
    equipmentId: '2',
    equipmentCode: 'TR-02',
    equipmentName: 'TRATOR MASSEY 290 02 4X4',
    operatorId: 'op-02',
    operatorName: 'Operador de Máquinas (José da Silva)',
    startedAt: '2026-08-03 05:40:00',
    completedAt: '2026-08-03 05:50:00',
    horimeterReading: 4320,
    status: 'concluido_com_nao_conformidade',
    finalCondition: 'bloqueado',
    answers: [
      {
        id: 'ans-4',
        itemId: 'item-1003',
        result: 'nao_conforme',
        notes: 'Óleo zerado na vareta, risco extremo de fundir!',
        photoUrls: [],
        immediateAction: 'Chave recolhida e máquina interditada.',
        answeredAt: '2026-08-03 05:45:00',
      },
    ],
    generalNotes: 'BLOQUEIO IMEDIATO NO PÁTIO. Acionada Ordem de Serviço OS-2026-049.',
    operatorSignature: 'José da Silva - 03/08/2026',
    createdAt: '2026-08-03 05:40:00',
    updatedAt: '2026-08-03 05:50:00',
  },
  {
    id: 'exec-103',
    code: 'CHK-2026-00103',
    templateId: 'tpl-3',
    templateName: 'Checklist de Segurança para Caminhões de Apoio',
    templateType: 'seguranca',
    templateVersion: 2,
    equipmentId: '3',
    equipmentCode: 'CAM-01',
    equipmentName: 'MERCEDES-BENZ ATEGO 2426',
    operatorId: 'op-03',
    operatorName: 'Motorista Rodoviário (Antonio Carlos)',
    startedAt: '2026-08-04 06:00:00',
    status: 'em_andamento',
    answers: [
      {
        id: 'ans-5',
        itemId: 'item-3001',
        result: 'conforme',
        photoUrls: [],
      },
    ],
    createdAt: '2026-08-04 06:00:00',
    updatedAt: '2026-08-04 06:10:00',
  },
];

class ChecklistExecutionService {
  private executions: ChecklistExecution[] = [...MOCK_EXECUTIONS];

  async getChecklistExecutions(filters?: {
    search?: string;
    equipmentId?: string;
    templateId?: string;
    type?: string;
    status?: string;
    onlyWithNonConformity?: boolean;
    onlyBlockedEquipment?: boolean;
  }): Promise<ChecklistExecution[]> {
    await new Promise((r) => setTimeout(r, 120));
    return this.executions.filter((ex) => {
      if (filters?.equipmentId && ex.equipmentId !== filters.equipmentId) return false;
      if (filters?.templateId && filters.templateId !== 'todos' && ex.templateId !== filters.templateId) return false;
      if (filters?.type && filters.type !== 'todos' && ex.templateType !== filters.type) return false;
      if (filters?.status && filters.status !== 'todos' && ex.status !== filters.status) return false;
      if (filters?.onlyWithNonConformity && ex.status !== 'concluido_com_nao_conformidade') return false;
      if (filters?.onlyBlockedEquipment && ex.finalCondition !== 'bloqueado') return false;
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        const matches = (ex.code && ex.code.toLowerCase().includes(q)) ||
          (ex.equipmentCode && ex.equipmentCode.toLowerCase().includes(q)) ||
          (ex.equipmentName && ex.equipmentName.toLowerCase().includes(q)) ||
          (ex.templateName && ex.templateName.toLowerCase().includes(q)) ||
          (ex.operatorName && ex.operatorName.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }

  async getChecklistExecutionById(id: string): Promise<ChecklistExecution | undefined> {
    await new Promise((r) => setTimeout(r, 80));
    return this.executions.find((i) => i.id === id || i.code === id);
  }

  async startChecklistExecution(data: {
    templateId: string;
    equipmentId: string;
    operatorName: string;
    horimeterReading?: number;
    odometerReading?: number;
    locationId?: string;
    scheduleId?: string;
    initialPhotoUrl?: string;
    generalNotes?: string;
  }): Promise<ChecklistExecution> {
    await new Promise((r) => setTimeout(r, 200));
    const template = await checklistTemplateService.getChecklistTemplateById(data.templateId);
    if (!template) throw new Error('Modelo de checklist não encontrado');

    const equipment = await equipmentService.getEquipmentById(data.equipmentId);
    const eqCode = equipment ? equipment.plateOrCode : 'EQ-X';
    const eqName = equipment ? equipment.name : 'Equipamento AgroGuard';

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const nextCodeNum = this.executions.length + 101;
    const code = `CHK-2026-00${nextCodeNum}`;

    // Integração Fase 3D: registrar leitura no medidor se fornecido horímetro ou odômetro
    if (data.horimeterReading && equipment) {
      try {
        const prev = equipment.currentHours || 0;
        if (data.horimeterReading !== prev) {
          await equipmentReadingsService.createReading({
            equipmentId: equipment.id,
            meterId: equipment.meters?.[0]?.id || 'm-default',
            meterType: equipment.meterType === 'odometro' ? 'odometro' : 'horimetro',
            unit: equipment.meterType === 'odometro' ? 'km' : 'h',
            previousValue: prev,
            value: data.horimeterReading,
            readingAt: now.slice(0, 16),
            source: 'checklist',
            createdBy: data.operatorName,
            notes: `Apontado via início do Checklist ${code}`,
          });
        }
      } catch (e) {
        console.warn('Leitura da Fase 3D interceptada no checklist:', e);
      }
    }

    const newExecution: ChecklistExecution = {
      id: `exec-${Date.now()}`,
      code,
      templateId: template.id,
      templateName: template.name,
      templateType: template.type,
      templateVersion: template.version,
      equipmentId: data.equipmentId,
      equipmentCode: eqCode,
      equipmentName: eqName,
      scheduleId: data.scheduleId,
      operatorId: 'op-logged',
      operatorName: data.operatorName,
      locationId: data.locationId,
      horimeterReading: data.horimeterReading,
      odometerReading: data.odometerReading,
      status: 'em_andamento',
      answers: [],
      initialPhotoUrl: data.initialPhotoUrl,
      generalNotes: data.generalNotes,
      startedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    this.executions.unshift(newExecution);
    return newExecution;
  }

  async saveChecklistProgress(id: string, answers: ChecklistAnswer[], generalNotes?: string): Promise<ChecklistExecution> {
    const ex = this.executions.find((i) => i.id === id);
    if (!ex) throw new Error('Execução de checklist não encontrada');

    // Merge inteligente de respostas sem perder itens respondidos anteriormente
    answers.forEach((newAns) => {
      const existingIdx = ex.answers.findIndex((a) => a.itemId === newAns.itemId);
      if (existingIdx >= 0) {
        ex.answers[existingIdx] = { ...ex.answers[existingIdx], ...newAns };
      } else {
        ex.answers.push(newAns);
      }
    });

    if (generalNotes !== undefined) {
      ex.generalNotes = generalNotes;
    }
    ex.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return ex;
  }

  async completeChecklistExecution(
    id: string,
    data: {
      answers: ChecklistAnswer[];
      generalNotes?: string;
      operatorSignature: string;
      finalConditionOverride?: 'liberado' | 'liberado_com_restricao' | 'bloqueado';
      requireValidation?: boolean;
    }
  ): Promise<ChecklistExecution> {
    await new Promise((r) => setTimeout(r, 250));
    const ex = await this.saveChecklistProgress(id, data.answers, data.generalNotes);
    const template = await checklistTemplateService.getChecklistTemplateById(ex.templateId);

    let hasNonConformities = false;
    let hasCriticalNonConformity = false;
    let shouldBlockEquipment = false;

    // Verificar todas as repostas
    for (const ans of ex.answers) {
      if (ans.result === 'nao_conforme' || ans.booleanValue === false) {
        hasNonConformities = true;
        // Buscar o item no modelo
        let itemDef: any = null;
        if (template) {
          for (const sec of template.sections) {
            const found = sec.items.find((i) => i.id === ans.itemId);
            if (found) {
              itemDef = found;
              break;
            }
          }
        }

        if (itemDef?.criticality === 'critica') {
          hasCriticalNonConformity = true;
        }
        if (itemDef?.blockEquipment || itemDef?.criticality === 'critica') {
          shouldBlockEquipment = true;
        }

        // Registrar automaticamente no módulo de Não Conformidades!
        await checklistNonConformityService.createNonConformity({
          executionId: ex.id,
          equipmentId: ex.equipmentId,
          equipmentCode: ex.equipmentCode,
          equipmentName: ex.equipmentName,
          itemId: ans.itemId,
          itemTitle: itemDef ? itemDef.title : `Item ${ans.itemId}`,
          checklistName: ex.templateName || 'Checklist da Frota',
          title: ans.notes || `Anomalia identificada no item ${itemDef ? itemDef.code || itemDef.title : ans.itemId}`,
          description: `O operador apontou não conformidade na execução ${ex.code || ex.id}. Observações: ${ans.notes || 'Nenhuma nota informada'}`,
          criticality: itemDef ? itemDef.criticality : 'media',
          status: 'aberta',
          photoUrls: ans.photoUrls || [],
          immediateAction: ans.immediateAction,
          blockedEquipment: Boolean(itemDef?.blockEquipment || itemDef?.criticality === 'critica'),
          responsibleName: 'Equipe Mecânica',
        });
      }
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    ex.completedAt = now;
    ex.operatorSignature = data.operatorSignature;

    // Determinar condição final
    if (shouldBlockEquipment || hasCriticalNonConformity || data.finalConditionOverride === 'bloqueado') {
      ex.finalCondition = 'bloqueado';
      // Alterar status real da máquina se houver bloqueio crítico
      await equipmentService.updateEquipment(ex.equipmentId, { status: 'bloqueado' } as any);
    } else if (hasNonConformities || data.finalConditionOverride === 'liberado_com_restricao') {
      ex.finalCondition = 'liberado_com_restricao';
    } else {
      ex.finalCondition = 'liberado';
    }

    if (data.requireValidation) {
      ex.status = 'aguardando_validacao';
    } else if (hasNonConformities) {
      ex.status = 'concluido_com_nao_conformidade';
    } else {
      ex.status = 'concluido';
    }

    ex.updatedAt = now;
    return ex;
  }

  async validateChecklistExecution(id: string, data: { validatorName: string; comments?: string }): Promise<ChecklistExecution> {
    await new Promise((r) => setTimeout(r, 150));
    const ex = this.executions.find((i) => i.id === id);
    if (!ex) throw new Error('Execução não encontrada');
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    ex.status = ex.answers.some((a) => a.result === 'nao_conforme') ? 'concluido_com_nao_conformidade' : 'concluido';
    ex.validatorName = data.validatorName;
    ex.validatorSignature = `${data.validatorName} - Aprovado em ${now.slice(0, 10)}`;
    if (data.comments) {
      ex.generalNotes = `${ex.generalNotes || ''}\n[Parecer do Supervisor: ${data.comments}]`;
    }
    ex.updatedAt = now;
    return ex;
  }

  async rejectChecklistExecution(id: string, reason: string, validatorName: string): Promise<ChecklistExecution> {
    await new Promise((r) => setTimeout(r, 150));
    const ex = this.executions.find((i) => i.id === id);
    if (!ex) throw new Error('Execução não encontrada');
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    ex.status = 'reprovado' as ChecklistExecutionStatus;
    ex.rejectionReason = reason;
    ex.validatorName = validatorName;
    ex.validatorSignature = `${validatorName} - REPROVADO em ${now.slice(0, 10)}`;
    ex.updatedAt = now;
    return ex;
  }

  async cancelChecklistExecution(id: string, reason: string): Promise<ChecklistExecution> {
    await new Promise((r) => setTimeout(r, 120));
    const ex = this.executions.find((i) => i.id === id);
    if (!ex) throw new Error('Execução não encontrada');
    ex.status = 'cancelado';
    ex.generalNotes = `${ex.generalNotes || ''}\n[CANCELADO: ${reason}]`;
    ex.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return ex;
  }
}

export const checklistExecutionService = new ChecklistExecutionService();
