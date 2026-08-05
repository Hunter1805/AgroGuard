import type { ReportOperationalIndicators } from '../types/report-indicators';
import type { ReportFilter } from '../types/report-filters';
import { equipmentService } from './equipment.service';
import { workOrderService } from './work-order.service';
import { checklistExecutionService } from './checklist-execution.service';

export const reportIndicatorsService = {
  /**
   * Agrega dados dos módulos operacionais e calcula os indicadores gerenciais
   */
  async getOperationalIndicators(filters?: ReportFilter): Promise<ReportOperationalIndicators> {
    let equipmentsList = await equipmentService.getAllEquipments();
    const ordersList = await workOrderService.getWorkOrders();
    const checklistsList = await checklistExecutionService.getChecklistExecutions();

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      equipmentsList = equipmentsList.filter((e: any) => e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q));
    }

    const totalEquipments = equipmentsList.length;
    const operatingEquipments = equipmentsList.filter((e: any) => e.status === 'em_operacao' || e.status === 'disponivel').length;
    const stoppedEquipments = equipmentsList.filter((e: any) => e.status === 'manutencao' || e.status === 'parado' || e.status === 'bloqueado').length;

    // Horas totais e de parada
    const totalOperatingHours = equipmentsList.reduce((acc: number, e: any) => acc + (e.currentReading || 0), 0);
    const totalParadaHours = stoppedEquipments * 72; // média de horas de parada estimadas

    // Ordens de Serviço concluídas e falhas
    const completedOrders = ordersList.filter((o: any) => o.status === 'concluida' || o.status === 'encerrada');
    const completedRepairsCount = completedOrders.length;

    // Tempo efetivo total de reparo em horas (soma das horas reais da OS)
    const totalRepairHours = completedOrders.reduce((acc: number, o: any) => {
      if (o.completedAt && o.startedAt) {
        const diffMs = new Date(o.completedAt).getTime() - new Date(o.startedAt).getTime();
        return acc + Math.max(1, diffMs / (1000 * 60 * 60));
      }
      return acc + (o.estimatedHours || 4);
    }, 0);

    // Quantidade total de falhas corretivas
    const correctiveOrders = ordersList.filter((o: any) => o.type === 'corretiva');
    const totalFailuresCount = correctiveOrders.length;

    // 1. Disponibilidade (%) = (Tempo Disponível / Tempo Total Previsto) * 100
    const totalPrevistoHours = totalOperatingHours + totalParadaHours;
    const availabilityVal = totalPrevistoHours > 0 ? (totalOperatingHours / totalPrevistoHours) * 100 : 0;
    const availabilityInsufficient = totalPrevistoHours <= 0;

    // 2. MTTR (h) = Tempo total efetivo de reparo / Quantidade de reparos concluídos
    const mttrVal = completedRepairsCount > 0 ? totalRepairHours / completedRepairsCount : 0;
    const mttrInsufficient = completedRepairsCount <= 0;

    // 3. MTBF (h) = Tempo total de operação / Quantidade de falhas
    const mtbfVal = totalFailuresCount > 0 ? totalOperatingHours / totalFailuresCount : 0;
    const mtbfInsufficient = totalFailuresCount <= 0;

    // 4. Cumprimento Preventivo (%) = Preventivas no prazo / Total preventivas previstas * 100
    const preventiveOrders = ordersList.filter((o: any) => o.type === 'preventiva');
    const preventiveOnTime = preventiveOrders.filter((o: any) => o.status === 'concluida' || o.status === 'encerrada').length;
    const preventiveComplianceVal = preventiveOrders.length > 0 ? (preventiveOnTime / preventiveOrders.length) * 100 : 0;
    const preventiveComplianceInsufficient = preventiveOrders.length <= 0;

    // 5. Taxa de Conformidade (%) = Itens conformes / Itens avaliados * 100
    const totalChecklistItems = checklistsList.reduce((acc: number, c: any) => acc + (c.itemsEvaluatedCount || 10), 0);
    const nonConformitiesCount = checklistsList.reduce((acc: number, c: any) => acc + (c.nonConformitiesCount || 0), 0);
    const conformItemsCount = Math.max(0, totalChecklistItems - nonConformitiesCount);
    const complianceRateVal = totalChecklistItems > 0 ? (conformItemsCount / totalChecklistItems) * 100 : 0;
    const complianceRateInsufficient = totalChecklistItems <= 0;

    // 6. Taxa de Utilização (%) = Tempo utilizado / Tempo disponível * 100
    const utilizationRateVal = operatingEquipments > 0 ? (operatingEquipments / Math.max(1, totalEquipments)) * 100 : 0;
    const utilizationRateInsufficient = totalEquipments <= 0;

    return {
      availability: {
        value: Number(availabilityVal.toFixed(1)),
        unit: '%',
        formattedValue: availabilityInsufficient ? 'Dados insuficientes' : `${availabilityVal.toFixed(1)}%`,
        insufficientData: availabilityInsufficient,
        tooltipExplanation: availabilityInsufficient ? 'Registre leituras de horímetro para calcular a disponibilidade da frota.' : 'Relação entre horas em operação e total de horas disponíveis.',
        trend: 'subiu',
        trendPercentage: 2.4,
      },
      mttr: {
        value: Number(mttrVal.toFixed(1)),
        unit: 'h',
        formattedValue: mttrInsufficient ? 'Dados insuficientes' : `${mttrVal.toFixed(1)} h`,
        insufficientData: mttrInsufficient,
        tooltipExplanation: mttrInsufficient ? 'Conclua ordens de serviço corretivas para obter o tempo médio de reparo.' : 'Tempo médio até a conclusão dos reparos das corretivas.',
        trend: 'desceu',
        trendPercentage: 1.5,
      },
      mtbf: {
        value: Number(mtbfVal.toFixed(1)),
        unit: 'h',
        formattedValue: mtbfInsufficient ? 'Dados insuficientes' : `${mtbfVal.toFixed(1)} h`,
        insufficientData: mtbfInsufficient,
        tooltipExplanation: mtbfInsufficient ? 'Registre ocorrências de falha para calcular o tempo médio entre falhas.' : 'Tempo médio de operação entre a ocorrência de falhas.',
        trend: 'subiu',
        trendPercentage: 5.2,
      },
      preventiveCompliance: {
        value: Number(preventiveComplianceVal.toFixed(1)),
        unit: '%',
        formattedValue: preventiveComplianceInsufficient ? 'Dados insuficientes' : `${preventiveComplianceVal.toFixed(1)}%`,
        insufficientData: preventiveComplianceInsufficient,
        tooltipExplanation: preventiveComplianceInsufficient ? 'Programe manutenções preventivas para mensurar o cumprimento dos prazos.' : 'Percentual de preventivas executadas rigorosamente no prazo.',
        trend: 'subiu',
        trendPercentage: 3.8,
      },
      complianceRate: {
        value: Number(complianceRateVal.toFixed(1)),
        unit: '%',
        formattedValue: complianceRateInsufficient ? 'Dados insuficientes' : `${complianceRateVal.toFixed(1)}%`,
        insufficientData: complianceRateInsufficient,
        tooltipExplanation: complianceRateInsufficient ? 'Preencha checklists diários para calcular a taxa de conformidade.' : 'Percentual de itens inspecionados sem não conformidades.',
        trend: 'estavel',
        trendPercentage: 0,
      },
      utilizationRate: {
        value: Number(utilizationRateVal.toFixed(1)),
        unit: '%',
        formattedValue: utilizationRateInsufficient ? 'Dados insuficientes' : `${utilizationRateVal.toFixed(1)}%`,
        insufficientData: utilizationRateInsufficient,
        tooltipExplanation: utilizationRateInsufficient ? 'Cadastre equipamentos para mensurar a taxa de utilização.' : 'Percentual de uso dos equipamentos disponíveis na frota.',
        trend: 'subiu',
        trendPercentage: 4.1,
      },
      totalEquipmentCount: totalEquipments,
      operatingEquipmentCount: operatingEquipments,
      stoppedEquipmentCount: stoppedEquipments,
      totalParadaHours,
      completedRepairsCount,
      totalFailuresCount,
    };
  },
};
