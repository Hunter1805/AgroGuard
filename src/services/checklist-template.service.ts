import type { ChecklistTemplate } from '../types/checklist';
import { isExplicitMockMode } from '../config/data-source.config';

// Mocks iniciais com modelos ricos e detalhados para a frota AgroGuard
const MOCK_TEMPLATES: ChecklistTemplate[] = [
  {
    id: 'tpl-1',
    code: 'MOD-001',
    name: 'Checklist Diário de Trator e Implemento',
    description: 'Inspeção diária pré-operacional para verificação mecânica, níveis de fluidos e itens de segurança obrigatórios do trator.',
    type: 'diario',
    applicableEquipmentTypeIds: ['Trator', 'Implemento'],
    applicableModelIds: [],
    specificEquipmentIds: [],
    active: true,
    version: 3,
    createdAt: '2026-05-10 07:00:00',
    updatedAt: '2026-08-01 14:30:00',
    createdBy: 'Eng. Mecânico (Carlos Roberto)',
    sections: [
      {
        id: 'sec-101',
        title: '1. Inspeção Visual e Estrutura Externa',
        description: 'Verificação da carroceria, engates, lataria e possíveis vazamentos visíveis no pátio.',
        order: 1,
        items: [
          {
            id: 'item-1001',
            code: 'EST-01',
            title: 'Ausência de vazamentos embaixo do equipamento (óleo, combustível ou líquido arrefecimento)',
            description: 'Verifique atentamente o chão e a parte inferior do cárter e transmissão.',
            order: 1,
            responseType: 'conformidade',
            criticality: 'alta',
            required: true,
            allowNotApplicable: false,
            requireNotesOnNonConformity: true,
            requirePhotoOnNonConformity: true,
            generateAlert: true,
            createOrderAutomatically: false,
            blockEquipment: false,
            correctionGuidance: 'Em caso de gotejamento ou vazamento ativo, acione a oficina antes de dar partida.',
          },
          {
            id: 'item-1002',
            code: 'EST-02',
            title: 'Estado dos Pneus e Rodados (pressão e avarias nas laterais/garras)',
            description: 'Inspecione cortes profundos nas garras ou escorgamentos dos parafusos.',
            order: 2,
            responseType: 'conformidade',
            criticality: 'media',
            required: true,
            allowNotApplicable: false,
            requireNotesOnNonConformity: true,
            requirePhotoOnNonConformity: true,
            generateAlert: true,
            createOrderAutomatically: false,
            blockEquipment: false,
          },
        ],
      },
      {
        id: 'sec-102',
        title: '2. Níveis de Fluidos e Lubrificação',
        description: 'Verificação com o motor desligado no terreno plano.',
        order: 2,
        items: [
          {
            id: 'item-1003',
            code: 'FLU-01',
            title: 'Nível do Óleo do Motor (vareta entre marca mínima e máxima)',
            order: 1,
            responseType: 'conformidade',
            criticality: 'critica',
            required: true,
            allowNotApplicable: false,
            requireNotesOnNonConformity: true,
            requirePhotoOnNonConformity: true,
            generateAlert: true,
            createOrderAutomatically: true,
            blockEquipment: true,
            correctionGuidance: 'CRÍTICO: Nunca operar com óleo abaixo do mínimo! Se faltar, complete com Óleo 15W40 especificado ou solicite bloqueio imediato.',
          },
          {
            id: 'item-1004',
            code: 'FLU-02',
            title: 'Nível de Água do Radiador e Reservatório de Expansão',
            order: 2,
            responseType: 'conformidade',
            criticality: 'critica',
            required: true,
            allowNotApplicable: false,
            requireNotesOnNonConformity: true,
            requirePhotoOnNonConformity: true,
            generateAlert: true,
            createOrderAutomatically: false,
            blockEquipment: true,
            correctionGuidance: 'Com o motor frio, verifique o nível da água de arrefecimento. Perigo de fundir o motor.',
          },
        ],
      },
      {
        id: 'sec-103',
        title: '3. Itens de Segurança e Painel',
        description: 'Sinalização luzes de freio, giroflex e buzina.',
        order: 3,
        items: [
          {
            id: 'item-1005',
            code: 'SEG-01',
            title: 'Funcionamento de Luzes, Faróis, Seta e Buzina de Ré',
            order: 1,
            responseType: 'sim_nao',
            criticality: 'alta',
            required: true,
            allowNotApplicable: false,
            requireNotesOnNonConformity: true,
            requirePhotoOnNonConformity: false,
            generateAlert: true,
            createOrderAutomatically: false,
            blockEquipment: false,
            correctionGuidance: 'Luzes inoperantes exigem reparo elétrico antes do deslocamento noturno ou em vias.',
          },
        ],
      },
    ],
  },
  {
    id: 'tpl-2',
    code: 'MOD-002',
    name: 'Inspeção Semanal de Colhedoras de Grãos e Cana',
    description: 'Verificação preventiva semanal com foco no sistema de corte, limpeza, esteiras e mancais de rotação pesada.',
    type: 'semanal',
    applicableEquipmentTypeIds: ['Colhedora'],
    applicableModelIds: [],
    specificEquipmentIds: [],
    active: true,
    version: 1,
    createdAt: '2026-06-15 08:00:00',
    updatedAt: '2026-06-15 08:00:00',
    createdBy: 'Coordenador de Máquinas (Marcelo Farias)',
    sections: [
      {
        id: 'sec-201',
        title: '1. Sistema de Corte e Industrial',
        order: 1,
        items: [
          {
            id: 'item-2001',
            code: 'IND-01',
            title: 'Desgaste de navalhas do rodo de corte ou plataforma',
            order: 1,
            responseType: 'conformidade',
            criticality: 'alta',
            required: true,
            allowNotApplicable: false,
            requireNotesOnNonConformity: true,
            requirePhotoOnNonConformity: true,
            generateAlert: true,
            createOrderAutomatically: true,
            blockEquipment: false,
          },
        ],
      },
    ],
  },
  {
    id: 'tpl-3',
    code: 'MOD-003',
    name: 'Checklist de Segurança para Caminhões de Apoio',
    description: 'Inspeção obrigatória antes da circulação em estradas rurais de escoamento da safra.',
    type: 'seguranca',
    applicableEquipmentTypeIds: ['Caminhão', 'Veículo'],
    applicableModelIds: [],
    specificEquipmentIds: [],
    active: true,
    version: 2,
    createdAt: '2026-07-01 10:00:00',
    updatedAt: '2026-07-20 16:00:00',
    createdBy: 'Técnico em Seg. do Trabalho (Renata Costa)',
    sections: [
      {
        id: 'sec-301',
        title: '1. Equipamentos Obrigatórios e Freios',
        order: 1,
        items: [
          {
            id: 'item-3001',
            title: 'Freio de serviço e freio de estacionamento respondendo perfeitamente',
            order: 1,
            responseType: 'conformidade',
            criticality: 'critica',
            required: true,
            allowNotApplicable: false,
            requireNotesOnNonConformity: true,
            requirePhotoOnNonConformity: false,
            generateAlert: true,
            createOrderAutomatically: true,
            blockEquipment: true,
            correctionGuidance: 'Problema no freio requer bloqueio absoluto de tráfego do veículo.',
          },
        ],
      },
    ],
  },
];

class ChecklistTemplateService {
  private templates: ChecklistTemplate[] = [...MOCK_TEMPLATES];

  async getChecklistTemplates(filters?: { search?: string; type?: string; active?: boolean }): Promise<ChecklistTemplate[]> {
    await new Promise((r) => setTimeout(r, 100));
    if (!isExplicitMockMode) return [];
    return this.templates.filter((t) => {
      if (t.archivedAt) return false;
      if (filters?.active !== undefined && t.active !== filters.active) return false;
      if (filters?.type && filters.type !== 'todos' && t.type !== filters.type) return false;
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(query) || t.code.toLowerCase().includes(query);
        if (!matchesName) return false;
      }
      return true;
    });
  }

  async getChecklistTemplateById(id: string): Promise<ChecklistTemplate | undefined> {
    await new Promise((r) => setTimeout(r, 100));
    if (!isExplicitMockMode) return undefined;
    return this.templates.find((t) => t.id === id);
  }

  async createChecklistTemplate(data: Omit<ChecklistTemplate, 'id' | 'code' | 'version' | 'createdAt' | 'updatedAt' | 'createdBy'> & { createdBy?: string }): Promise<ChecklistTemplate> {
    await new Promise((r) => setTimeout(r, 200));
    const nextNum = this.templates.length + 1;
    const code = `MOD-00${nextNum}`;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const newTemplate: ChecklistTemplate = {
      ...data,
      id: `tpl-${Date.now()}`,
      code,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy || 'Usuário do Sistema',
    };
    this.templates.unshift(newTemplate);
    return newTemplate;
  }

  async updateChecklistTemplate(id: string, data: Partial<ChecklistTemplate>): Promise<ChecklistTemplate> {
    await new Promise((r) => setTimeout(r, 200));
    const idx = this.templates.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Modelo não encontrado');

    const updated: ChecklistTemplate = {
      ...this.templates[idx],
      ...data,
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };
    this.templates[idx] = updated;
    return updated;
  }

  async duplicateChecklistTemplate(id: string): Promise<ChecklistTemplate> {
    await new Promise((r) => setTimeout(r, 150));
    const source = await this.getChecklistTemplateById(id);
    if (!source) throw new Error('Modelo de origem não encontrado');

    const nextNum = this.templates.length + 1;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const copy: ChecklistTemplate = {
      ...source,
      id: `tpl-copy-${Date.now()}`,
      code: `MOD-00${nextNum}`,
      name: `${source.name} (Cópia)`,
      version: 1,
      createdAt: now,
      updatedAt: now,
      sections: source.sections.map((sec) => ({
        ...sec,
        id: `sec-${Date.now()}-${sec.order}`,
        items: sec.items.map((it) => ({
          ...it,
          id: `item-${Date.now()}-${it.order}`,
        })),
      })),
    };
    this.templates.unshift(copy);
    return copy;
  }

  // Quando um modelo já possui execuções e é re-versionado
  async createChecklistTemplateVersion(id: string): Promise<ChecklistTemplate> {
    await new Promise((r) => setTimeout(r, 200));
    const old = this.templates.find((t) => t.id === id);
    if (!old) throw new Error('Modelo original não encontrado');

    // Arquivar a versão antiga (mantendo para execuções anteriores)
    old.archivedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    old.active = false;

    // Criar a nova versão ativa
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const nextVer: ChecklistTemplate = {
      ...old,
      id: `tpl-ver-${Date.now()}`,
      version: (old.version || 1) + 1,
      archivedAt: undefined,
      active: true,
      createdAt: now,
      updatedAt: now,
    };
    this.templates.unshift(nextVer);
    return nextVer;
  }

  async archiveChecklistTemplate(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 100));
    const t = this.templates.find((i) => i.id === id);
    if (t) {
      t.active = false;
      t.archivedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }
  }
}

export const checklistTemplateService = new ChecklistTemplateService();
