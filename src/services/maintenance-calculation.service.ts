import type { MaintenancePlanInterval } from '../types/maintenance-plan';
import type { EquipmentMaintenancePlanLink } from '../types/maintenance-schedule';
import type { MaintenanceStatus, MaintenancePriority } from '../types/maintenance';
import { equipmentService } from './equipment.service';

export interface CalculationResult {
  intervalId: string;
  intervalName: string;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  meterType?: 'horimetro' | 'odometro';
  currentReading: number;
  dueReading?: number;
  remainingReading?: number;
  dueDate?: string; // ISO YYYY-MM-DD
  remainingDays?: number;
  consumedPercentage: number;
  ruleTriggered: 'leitura' | 'tempo' | 'combinada';
  isOverdue: boolean;
  isNearDue: boolean;
}

export const maintenanceCalculationService = {
  /**
   * Calcula a data de vencimento com base na data da última manutenção ou data-base e o intervalo de tempo.
   */
  calculateIntervalDueDate(baseDateStr: string, timeInterval: number, timeUnit: 'dias' | 'semanas' | 'meses' | 'anos'): string {
    if (!baseDateStr || isNaN(new Date(baseDateStr).getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    const dt = new Date(baseDateStr);
    switch (timeUnit) {
      case 'dias':
        dt.setDate(dt.getDate() + timeInterval);
        break;
      case 'semanas':
        dt.setDate(dt.getDate() + timeInterval * 7);
        break;
      case 'meses':
        dt.setMonth(dt.getMonth() + timeInterval);
        break;
      case 'anos':
        dt.setFullYear(dt.getFullYear() + timeInterval);
        break;
    }
    return dt.toISOString().split('T')[0];
  },

  /**
   * Calcula a leitura de vencimento somando a leitura base ou última leitura conhecida ao intervalo.
   */
  calculateIntervalDueReading(baseReading: number, readingInterval: number): number {
    return (baseReading || 0) + readingInterval;
  },

  /**
   * Calcula a situação operacional da manutenção aplicando a regra "O QUE OCORRER PRIMEIRO".
   */
  calculateMaintenanceStatus(
    interval: MaintenancePlanInterval,
    link: EquipmentMaintenancePlanLink,
    currentReading: number,
    currentDateStr?: string
  ): CalculationResult {
    const today = currentDateStr ? new Date(currentDateStr) : new Date();
    const baseRead = link.lastKnownMaintenanceReading ?? link.baseReading ?? 0;
    const baseDate = link.lastKnownMaintenanceDate ?? link.baseDate ?? link.startDate;

    let dueReading: number | undefined = undefined;
    let remainingReading: number | undefined = undefined;
    let readingConsumedPct = 0;

    let dueDateStr: string | undefined = undefined;
    let remainingDays: number | undefined = undefined;
    let timeConsumedPct = 0;

    // 1. Cálculo por Leitura (Horas ou Km)
    if ((interval.triggerType === 'horas' || interval.triggerType === 'quilometros' || interval.triggerType === 'combinado') && interval.readingInterval) {
      dueReading = this.calculateIntervalDueReading(baseRead, interval.readingInterval);
      remainingReading = dueReading - currentReading;
      const totalInterval = dueReading - baseRead;
      const consumed = currentReading - baseRead;
      readingConsumedPct = totalInterval > 0 ? Math.min(150, Math.max(0, Math.round((consumed / totalInterval) * 100))) : 0;
    }

    // 2. Cálculo por Tempo
    if ((interval.triggerType === 'dias' || interval.triggerType === 'semanas' || interval.triggerType === 'meses' || interval.triggerType === 'anos' || interval.triggerType === 'combinado') && interval.timeInterval && interval.timeUnit) {
      dueDateStr = this.calculateIntervalDueDate(baseDate, interval.timeInterval, interval.timeUnit);
      const dueDt = new Date(dueDateStr);
      const baseDt = new Date(baseDate);
      const diffMs = dueDt.getTime() - today.getTime();
      remainingDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      
      const totalDays = Math.max(1, Math.round((dueDt.getTime() - baseDt.getTime()) / (1000 * 60 * 60 * 24)));
      const elapsedDays = Math.round((today.getTime() - baseDt.getTime()) / (1000 * 60 * 60 * 24));
      timeConsumedPct = Math.min(150, Math.max(0, Math.round((elapsedDays / totalDays) * 100)));
    }

    // 3. Aplicação da Regra "O Que Ocorrer Primeiro"
    let finalPct = 0;
    let trigger: 'leitura' | 'tempo' | 'combinada' = 'leitura';
    if (dueReading !== undefined && dueDateStr !== undefined) {
      trigger = 'combinada';
      finalPct = Math.max(readingConsumedPct, timeConsumedPct);
    } else if (dueReading !== undefined) {
      trigger = 'leitura';
      finalPct = readingConsumedPct;
    } else {
      trigger = 'tempo';
      finalPct = timeConsumedPct;
    }

    // 4. Determinar Status Operacional (em_dia, proxima, urgente, vencida)
    let status: MaintenanceStatus = 'em_dia';
    let isOverdue = false;
    let isNearDue = false;

    // Verificar se superou margem de atraso (Vencida vs Urgente)
    const toleranceRead = interval.allowedReadingDelay ?? 0;
    const toleranceDays = interval.allowedDaysDelay ?? 0;
    const alertBeforeRead = interval.alertReadingBefore ?? 30; // ex: avisar 30h antes
    const alertBeforeDays = interval.alertDaysBefore ?? 7; // ex: avisar 7 dias antes

    const isOverdueByReading = dueReading !== undefined && currentReading > dueReading + toleranceRead;
    const isOverdueByDays = remainingDays !== undefined && remainingDays < -toleranceDays;

    if (isOverdueByReading || isOverdueByDays) {
      status = 'vencida';
      isOverdue = true;
    } else if ((dueReading !== undefined && currentReading >= dueReading) || (remainingDays !== undefined && remainingDays <= 0)) {
      status = 'urgente';
      isNearDue = true;
    } else if ((remainingReading !== undefined && remainingReading <= alertBeforeRead) || (remainingDays !== undefined && remainingDays <= alertBeforeDays)) {
      status = 'proxima';
      isNearDue = true;
    } else {
      status = 'em_dia';
    }

    return {
      intervalId: interval.id,
      intervalName: interval.name,
      status,
      priority: interval.priority,
      meterType: interval.meterType,
      currentReading,
      dueReading,
      remainingReading,
      dueDate: dueDateStr,
      remainingDays,
      consumedPercentage: finalPct,
      ruleTriggered: trigger,
      isOverdue,
      isNearDue,
    };
  },

  /**
   * Recalcula a situação das manutenções de um equipamento (acionado logo após o apontamento de leitura na Fase 3D).
   */
  async recalculateEquipmentMaintenance(equipmentId: string): Promise<CalculationResult[]> {
    const eq = await equipmentService.getEquipmentById(equipmentId);
    if (!eq) return [];
    
    // Este método servirá de ponte para notificar os alertas globais no Dashboard reativamente.
    // O retorno pode ser aproveitado pelo hook useEquipmentMaintenance.
    return [];
  },
};
