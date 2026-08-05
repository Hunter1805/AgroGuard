import { equipmentService } from './equipment.service';
import type {
  EquipmentChecklistSummary,
  EquipmentCostSummary,
  EquipmentDetailData,
  EquipmentDetailSummary,
  EquipmentDocumentSummary,
  EquipmentFailureSummary,
  EquipmentHistoryEvent,
  EquipmentMaintenanceSummary,
  EquipmentOrderSummary,
  EquipmentPartUsage,
  EquipmentPhotoSummary,
  EquipmentReadingSummary,
  EquipmentRecurrentFailureGroup,
  EquipmentTireSummary,
} from '../types/equipment-detail';

export const equipmentDetailService = {
  async getEquipmentDetail(equipmentId: string): Promise<EquipmentDetailData | null> {
    const equipment = await equipmentService.getEquipmentById(equipmentId);
    if (!equipment) return null;

    const [
      summary,
      readings,
      checklists,
      maintenances,
      orders,
      failures,
      recurrentFailures,
      tires,
      parts,
      costs,
      documents,
      photos,
      history,
    ] = await Promise.all([
      this.getEquipmentSummary(equipmentId),
      this.getEquipmentReadingsSummary(equipmentId),
      this.getEquipmentChecklistsSummary(equipmentId),
      this.getEquipmentMaintenanceSummary(equipmentId),
      this.getEquipmentOrdersSummary(equipmentId),
      this.getEquipmentFailuresSummary(equipmentId),
      this.getEquipmentRecurrentFailures(equipmentId),
      this.getEquipmentTiresSummary(equipmentId),
      this.getEquipmentPartsSummary(equipmentId),
      this.getEquipmentCostsSummary(equipmentId),
      this.getEquipmentDocumentsSummary(equipmentId),
      this.getEquipmentPhotosSummary(equipmentId),
      this.getEquipmentHistory(equipmentId),
    ]);

    return {
      equipment,
      summary,
      readings,
      checklists,
      maintenances,
      orders,
      failures,
      recurrentFailures,
      tires,
      parts,
      costs,
      documents,
      photos,
      history,
    };
  },

  async getEquipmentSummary(equipmentId: string): Promise<EquipmentDetailSummary> {
    const eq = await equipmentService.getEquipmentById(equipmentId);
    return {
      openOrders: eq?.hasPendingAlert ? 2 : 1,
      pendingAlerts: eq?.hasPendingAlert ? 3 : 0,
      overdueMaintenance: eq?.maintenanceStatus === 'vencida' ? 1 : 0,
      pendingChecklists: eq?.isReadingOverdue ? 1 : 0,
      openFailures: eq?.status === 'bloqueado' || eq?.status === 'manutencao' ? 1 : 0,
      accumulatedCost: 14850.00,
      availabilityPercent: eq?.status === 'operante' || eq?.status === 'em_operacao' ? 94.5 : 42.0,
      lastReadingText: 'Hoje às 08:30 (Carlos Silva)',
      lastChecklistText: 'Hoje às 06:45 (Aprovado com 0 pendências)',
    };
  },

  async getEquipmentReadingsSummary(equipmentId: string): Promise<EquipmentReadingSummary[]> {
    const eq = await equipmentService.getEquipmentById(equipmentId);
    const unit = eq?.meterType === 'odometro' ? 'km' : 'h';
    const curr = eq?.currentHours || 1200;

    return [
      {
        id: 'rd-1',
        dateTime: '04/08/2026 08:30',
        meterId: 'm-1',
        meterName: 'Horímetro/Odômetro Principal',
        meterType: eq?.meterType === 'odometro' ? 'odometro' : 'horimetro',
        unit,
        previousValue: curr - 8,
        newValue: curr,
        difference: 8,
        source: 'Checklist Diário',
        user: eq?.operatorName || 'Carlos Silva',
        status: 'normal',
      },
      {
        id: 'rd-2',
        dateTime: '03/08/2026 17:15',
        meterId: 'm-1',
        meterName: 'Horímetro/Odômetro Principal',
        meterType: eq?.meterType === 'odometro' ? 'odometro' : 'horimetro',
        unit,
        previousValue: curr - 15,
        newValue: curr - 8,
        difference: 7,
        source: 'Registro Rápido',
        user: 'Roberto Alves',
        status: 'normal',
      },
      {
        id: 'rd-3',
        dateTime: '02/08/2026 07:45',
        meterId: 'm-1',
        meterName: 'Horímetro/Odômetro Principal',
        meterType: eq?.meterType === 'odometro' ? 'odometro' : 'horimetro',
        unit,
        previousValue: curr - 24,
        newValue: curr - 15,
        difference: 9,
        source: 'Checklist Diário',
        user: 'Paulo Souza',
        status: 'normal',
      },
    ];
  },

  async getEquipmentChecklistsSummary(equipmentId: string): Promise<EquipmentChecklistSummary[]> {
    const eq = await equipmentService.getEquipmentById(equipmentId);
    return [
      {
        id: 'chk-001',
        code: 'CHK-089',
        scheduledDate: '04/08/2026',
        executionDate: '04/08/2026 06:45',
        modelName: `Checklist Diário — ${eq?.assetType || 'Trator'}`,
        type: 'Diário',
        status: 'Concluído',
        nonConformitiesCount: 0,
        finalResult: 'Aprovado',
        operatorName: eq?.operatorName || 'Carlos Silva',
      },
      {
        id: 'chk-002',
        code: 'CHK-075',
        scheduledDate: '03/08/2026',
        executionDate: '03/08/2026 06:50',
        modelName: `Checklist Diário — ${eq?.assetType || 'Trator'}`,
        type: 'Diário',
        status: 'Com Ressalva',
        nonConformitiesCount: 1,
        finalResult: 'Aprovado com Restrição',
        operatorName: 'Roberto Alves',
      },
    ];
  },

  async getEquipmentMaintenanceSummary(equipmentId: string): Promise<EquipmentMaintenanceSummary[]> {
    const eq = await equipmentService.getEquipmentById(equipmentId);
    return [
      {
        id: 'maint-1',
        title: 'Revisão Periódica de 250 Horas',
        type: 'Preventiva',
        planName: eq?.maintenancePlanName || 'Plano Preventivo Padrão',
        planCode: 'PLN-250H',
        triggerType: 'Leitura',
        targetValue: '250 h',
        dueDate: eq?.nextMaintenanceDate || '20/08/2026',
        progressPercent: eq?.maintenanceStatus === 'vencida' ? 100 : 78,
        status: eq?.maintenanceStatus === 'vencida' ? 'Vencida' : eq?.maintenanceStatus === 'proxima' ? 'Próxima' : 'Em Dia',
        serviceOrderId: 'OS-0042',
      },
      {
        id: 'maint-2',
        title: 'Troca de Filtro de Sucção e Óleo Hidráulico',
        type: 'Preventiva',
        planName: 'Plano Sistema Hidráulico',
        planCode: 'PLN-HIDR',
        triggerType: 'Data',
        dueDate: '15/09/2026',
        progressPercent: 45,
        status: 'Em Dia',
      },
    ];
  },

  async getEquipmentOrdersSummary(equipmentId: string): Promise<EquipmentOrderSummary[]> {
    const eq = await equipmentService.getEquipmentById(equipmentId);
    return [
      {
        id: 'os-1',
        number: 'OS-2026-0042',
        openingDate: '01/08/2026',
        type: 'Corretiva não planejada',
        description: 'Verificação de vazamento de óleo e regulagem de vedações.',
        priority: eq?.status === 'bloqueado' ? 'Crítico' : 'Alto',
        status: eq?.status === 'manutencao' ? 'Em Execução' : 'Aberta',
        responsibleName: 'João Mecânico',
        timeOpenHours: 72,
        cost: 1450.00,
      },
      {
        id: 'os-2',
        number: 'OS-2026-0028',
        openingDate: '15/07/2026',
        type: 'Preventiva',
        description: 'Revisão geral de 250h e calibração de instrumentos.',
        priority: 'Médio',
        status: 'Encerrada',
        responsibleName: 'Pedro Antunes',
        timeOpenHours: 8,
        cost: 2100.00,
      },
    ];
  },

  async getEquipmentFailuresSummary(_equipmentId: string): Promise<EquipmentFailureSummary[]> {
    return [
      {
        id: 'fl-1',
        code: 'FL-014',
        date: '02/08/2026',
        system: 'Sistema Hidráulico',
        subsystem: 'Linha de Pressão',
        component: 'Filtro de Sucção',
        symptom: 'Pressão de óleo abaixo do limite de segurança',
        causeIdentified: 'Acúmulo de partículas no elemento filtrante',
        criticality: 'Alto',
        status: 'OS Criada',
        relatedOrderId: 'OS-2026-0042',
      },
    ];
  },

  async getEquipmentRecurrentFailures(_equipmentId: string): Promise<EquipmentRecurrentFailureGroup[]> {
    return [
      {
        system: 'Sistema Hidráulico',
        subsystem: 'Linha de Pressão',
        symptom: 'Pressão de óleo abaixo do limite',
        occurrencesCount: 2,
        lastOccurrenceDate: '02/08/2026',
      },
    ];
  },

  async getEquipmentTiresSummary(equipmentId: string): Promise<EquipmentTireSummary> {
    const eq = await equipmentService.getEquipmentById(equipmentId);
    const isVehicle = eq?.assetType === 'Caminhão' || eq?.assetType === 'Veículo';

    return {
      totalTiresInstalled: isVehicle ? 6 : 4,
      axleConfiguration: isVehicle ? '6x2 (Três eixos)' : '4x4 (Tração Integral)',
      recommendedPressureText: isVehicle ? 'Dianteiro: 110 PSI | Traseiro: 120 PSI' : 'Dianteiro: 32 PSI | Traseiro: 38 PSI',
      lastInspectionDate: '25/07/2026',
      anomaliesCount: 0,
      positions: [
        {
          id: 'pos-1',
          axle: 'Eixo 1 (Dianteiro)',
          side: 'Esquerdo',
          position: '1E',
          tireCode: 'PN-0891',
          brand: 'Pirelli',
          measure: '18.4-30',
          currentPressurePsi: 32,
          recommendedPressurePsi: 32,
          treadDepthMm: 14.5,
          condition: 'Excelente',
          lastInspectionDate: '25/07/2026',
        },
        {
          id: 'pos-2',
          axle: 'Eixo 1 (Dianteiro)',
          side: 'Direito',
          position: '1D',
          tireCode: 'PN-0892',
          brand: 'Pirelli',
          measure: '18.4-30',
          currentPressurePsi: 31,
          recommendedPressurePsi: 32,
          treadDepthMm: 14.2,
          condition: 'Excelente',
          lastInspectionDate: '25/07/2026',
        },
      ],
    };
  },

  async getEquipmentPartsSummary(_equipmentId: string): Promise<EquipmentPartUsage[]> {
    return [
      {
        id: 'pt-1',
        date: '15/07/2026',
        itemCode: 'PEC-0412',
        itemName: 'Filtro de Óleo Lubrificante Motor',
        category: 'Filtros',
        quantity: 2,
        unit: 'UN',
        unitCost: 120.00,
        totalCost: 240.00,
        serviceOrderId: 'OS-2026-0028',
        responsibleName: 'Pedro Antunes',
      },
      {
        id: 'pt-2',
        date: '15/07/2026',
        itemCode: 'INS-0090',
        itemName: 'Óleo Motor 15W40 Mineral (Galão 20L)',
        category: 'Lubrificantes',
        quantity: 1,
        unit: 'GL',
        unitCost: 480.00,
        totalCost: 480.00,
        serviceOrderId: 'OS-2026-0028',
        responsibleName: 'Pedro Antunes',
      },
    ];
  },

  async getEquipmentCostsSummary(_equipmentId: string): Promise<EquipmentCostSummary[]> {
    return [
      {
        id: 'cst-1',
        date: '15/07/2026',
        category: 'Preventiva',
        description: 'Manutenção periódica preventiva de 250 horas',
        source: 'Ordem de Serviço OS-2026-0028',
        serviceOrderId: 'OS-2026-0028',
        value: 2100.00,
        responsibleName: 'Pedro Antunes',
      },
      {
        id: 'cst-2',
        date: '01/08/2026',
        category: 'Corretiva',
        description: 'Reparo em vazamento de vedação',
        source: 'Ordem de Serviço OS-2026-0042',
        serviceOrderId: 'OS-2026-0042',
        value: 1450.00,
        responsibleName: 'João Mecânico',
      },
    ];
  },

  async getEquipmentDocumentsSummary(equipmentId: string): Promise<EquipmentDocumentSummary[]> {
    const eq = await equipmentService.getEquipmentById(equipmentId);
    const existing = eq?.documents || [];

    const defaultDocs: EquipmentDocumentSummary[] = [
      {
        id: 'doc-001',
        name: 'CRLV / Documento de Licenciamento 2026.pdf',
        url: '#',
        size: '1.2 MB',
        type: 'Documento',
        uploadedAt: '10/01/2026',
        docType: 'Licenciamento Rodo-Agrícola',
        docNumber: 'LIC-2026-9901',
        issueDate: '10/01/2026',
        dueDate: '31/12/2026',
        status: 'Válido',
        hasAlert: false,
      },
      {
        id: 'doc-002',
        name: 'Laudo de Inspeção de Segurança NR-12.pdf',
        url: '#',
        size: '3.4 MB',
        type: 'Laudo',
        uploadedAt: '05/02/2026',
        docType: 'Laudo NR-12 Segurança',
        docNumber: 'NR12-2026-041',
        issueDate: '05/02/2026',
        dueDate: '05/02/2027',
        status: 'Válido',
        hasAlert: false,
      },
    ];

    if (existing.length > 0) {
      return existing.map((d) => ({
        ...d,
        docType: 'Documento Geral',
        status: 'Válido' as const,
        hasAlert: false,
      }));
    }

    return defaultDocs;
  },

  async getEquipmentPhotosSummary(equipmentId: string): Promise<EquipmentPhotoSummary[]> {
    const eq = await equipmentService.getEquipmentById(equipmentId);
    const existing = eq?.images || [];

    if (existing.length > 0) {
      return existing.map((img, idx) => ({
        ...img,
        category: idx === 0 ? 'Principal' : 'Adicional',
        caption: img.name,
        date: '04/08/2026',
        uploadedBy: 'Sistema AgroGuard',
      }));
    }

    return [
      {
        id: 'ph-1',
        name: 'Vista Frontal e Lateral Principal',
        url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop',
        category: 'Principal',
        caption: 'Foto de apresentação oficial do ativo em operação',
        date: '04/08/2026',
        uploadedBy: 'Carlos Silva',
      },
      {
        id: 'ph-2',
        name: 'Painel de Instrumentos e Horímetro',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
        category: 'Painel',
        caption: 'Foto de comprovação da leitura atual do horímetro',
        date: '04/08/2026',
        uploadedBy: 'Carlos Silva',
      },
    ];
  },

  async getEquipmentHistory(_equipmentId: string): Promise<EquipmentHistoryEvent[]> {
    return [
      {
        id: 'h-1',
        type: 'leitura',
        title: 'Leitura de Horímetro Registrada',
        description: 'Leitura atualizada para 6.800h (+8h desde o último checklist).',
        dateTime: '04/08/2026 08:30',
        userName: 'Carlos Silva',
        sourceModule: 'Checklist Diário',
      },
      {
        id: 'h-2',
        type: 'ordem_servico',
        title: 'Ordem de Serviço Aberta (OS-2026-0042)',
        description: 'Abertura de OS para verificação de vedação do sistema hidráulico.',
        dateTime: '01/08/2026 14:20',
        userName: 'João Mecânico',
        sourceModule: 'Ordens de Serviço',
        relatedLink: '/ordens-servico/OS-2026-0042',
      },
      {
        id: 'h-3',
        type: 'manutencao',
        title: 'Manutenção Preventiva 250h Concluída',
        description: 'Troca de óleos e substituição de elementos filtrantes.',
        dateTime: '15/07/2026 11:00',
        userName: 'Pedro Antunes',
        sourceModule: 'Manutenções Preventivas',
      },
      {
        id: 'h-4',
        type: 'cadastro',
        title: 'Equipamento Cadastrado na Frota',
        description: 'Ativo inserido no sistema com tag de patrimônio PAT-0012.',
        dateTime: '10/01/2026 09:00',
        userName: 'Administrador',
        sourceModule: 'Cadastro de Equipamentos',
      },
    ];
  },
};
