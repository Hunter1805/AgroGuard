import type { TireInspectionHeader, TireCalibrationLog } from '../types/tire-inspection';
import { tiresService } from './tires.service';
import { tireMovementService } from './tire-movement.service';

let inspections: TireInspectionHeader[] = [
  {
    id: 'INSP-2026-001',
    equipmentId: 'EQ-003',
    inspectionType: 'rotina',
    date: '2026-08-01T08:30:00Z',
    responsibleId: 'RESP-01',
    responsibleName: 'Carlos Silva',
    horimeterReading: 7800,
    location: 'Oficina Central — Fazenda Primavera',
    notes: 'Verificação periódica semanal de pressão e desgaste de sulco.',
    overallResult: 'atencao',
    createdAt: '2026-08-01T08:30:00Z',
    items: [
      {
        id: 'item-1',
        positionId: 'pos-1e',
        positionName: '1E - Dianteiro Esquerdo',
        tireId: 'PN-0893',
        tireCode: 'PN-0893',
        measuredPressure: 24,
        recommendedPressure: 35,
        pressureDifference: -11,
        pressureUnit: 'psi',
        measuredTreadDepth: 12,
        anomalies: ['desgaste_externo'],
        result: 'atencao',
        recommendedAction: 'calibrar',
        notes: 'Pressão 11 PSI abaixo do recomendado.',
      },
      {
        id: 'item-2',
        positionId: 'pos-1d',
        positionName: '1D - Dianteiro Direito',
        tireId: 'PN-0894',
        tireCode: 'PN-0894',
        measuredPressure: 34,
        recommendedPressure: 35,
        pressureDifference: -1,
        pressureUnit: 'psi',
        measuredTreadDepth: 13,
        anomalies: [],
        result: 'conforme',
        recommendedAction: 'nenhuma',
      },
    ],
  },
];

let calibrations: TireCalibrationLog[] = [
  {
    id: 'CALIB-001',
    equipmentId: 'EQ-003',
    tireId: 'PN-0893',
    positionId: 'pos-1e',
    previousPressure: 24,
    adjustedPressure: 35,
    recommendedPressure: 35,
    unit: 'psi',
    date: '2026-08-03T09:30:00Z',
    responsibleId: 'RESP-01',
    responsibleName: 'Carlos Silva',
    equipmentUsed: 'Calibrador Digital PneuMax',
    notes: 'Ajuste de pressão realizado antes da operação de plantio.',
  },
];

export const tireInspectionService = {
  async getInspections(filters?: { equipmentId?: string; tireId?: string }): Promise<TireInspectionHeader[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    let result = [...inspections];

    if (filters?.equipmentId) {
      result = result.filter(i => i.equipmentId === filters.equipmentId);
    }
    if (filters?.tireId) {
      result = result.filter(i => i.items?.some(item => item.tireId === filters.tireId));
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getInspectionById(id: string): Promise<TireInspectionHeader | undefined> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return inspections.find(i => i.id === id);
  },

  async getCalibrationLogs(tireId?: string): Promise<TireCalibrationLog[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    if (tireId) {
      return calibrations.filter(c => c.tireId === tireId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return [...calibrations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async createInspection(data: Omit<TireInspectionHeader, 'id' | 'createdAt'>): Promise<TireInspectionHeader> {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const newInspection: TireInspectionHeader = {
      ...data,
      id: `INSP-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    inspections.push(newInspection);

    // Atualiza profundidade de sulco nos pneus inspecionados e registra movimentação auditável
    if (newInspection.items) {
      for (const item of newInspection.items) {
        if (item.measuredTreadDepth !== undefined) {
          await tiresService.updateTire(item.tireId, { currentTreadDepth: item.measuredTreadDepth });
        }

        await tireMovementService.logMovement({
          date: newInspection.date || new Date().toISOString(),
          tireId: item.tireId,
          action: 'inspecao',
          equipmentId: newInspection.equipmentId,
          originPositionId: item.positionId,
          originPositionName: item.positionName,
          reading: newInspection.horimeterReading || newInspection.odometerReading,
          responsibleId: newInspection.responsibleId,
          responsibleName: newInspection.responsibleName,
          notes: `Inspeção ${newInspection.id}: Pressão ${item.measuredPressure ?? 'N/I'} PSI, Sulco ${item.measuredTreadDepth ?? 'N/I'}mm. Resultado: ${item.result}.`,
          statusAfter: 'instalado',
        });
      }
    }

    return newInspection;
  },

  async registerCalibration(data: Omit<TireCalibrationLog, 'id'>): Promise<TireCalibrationLog> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newLog: TireCalibrationLog = {
      ...data,
      id: `CALIB-${Date.now()}`,
    };
    
    calibrations.push(newLog);

    // Registra na movimentação auditável
    await tireMovementService.logMovement({
      date: data.date || new Date().toISOString(),
      tireId: data.tireId,
      action: 'calibragem',
      equipmentId: data.equipmentId,
      originPositionId: data.positionId,
      responsibleId: data.responsibleId,
      responsibleName: data.responsibleName,
      notes: `Calibragem: ${data.previousPressure ?? 'N/I'} ${data.unit} ➔ ${data.adjustedPressure} ${data.unit}. ${data.notes || ''}`.trim(),
      statusAfter: 'instalado',
    });

    return newLog;
  }
};

