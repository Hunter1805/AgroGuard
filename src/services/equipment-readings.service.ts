import type {
  CreateReadingInput,
  MeterReading,
  MeterReplacement,
  ReadingStats,
  ReadingsFilterState,
  ReadingValidationResult,
} from '../types/equipment-readings';
import { equipmentService } from './equipment.service';

const INITIAL_READINGS_MOCK: MeterReading[] = [
  {
    id: 'rd-101',
    equipmentId: 'EQ-001',
    equipmentName: 'Trator Massey Ferguson 265',
    equipmentCode: 'TR-001',
    meterId: 'm-1',
    meterName: 'Horímetro Principal',
    meterType: 'horimetro',
    unit: 'h',
    previousValue: 6792,
    value: 6800,
    difference: 8,
    readingAt: '2026-08-04 08:30',
    source: 'checklist',
    status: 'valida',
    validationType: 'normal',
    notes: 'Leitura efetuada no checklist diário de início de turno.',
    createdBy: 'Carlos Silva',
    createdAt: '2026-08-04T08:30:00Z',
  },
  {
    id: 'rd-102',
    equipmentId: 'EQ-002',
    equipmentName: 'Colhedora John Deere S680',
    equipmentCode: 'CH-002',
    meterId: 'm-2',
    meterName: 'Horímetro Industrial',
    meterType: 'horimetro',
    unit: 'h',
    previousValue: 3450,
    value: 3420,
    difference: -30,
    readingAt: '2026-08-04 09:15',
    source: 'manual',
    status: 'pendente_aprovacao',
    validationType: 'regressiva',
    justification: 'Possível erro de digitação pelo operador ou substituição de relógio.',
    createdBy: 'Roberto Alves',
    createdAt: '2026-08-04T09:15:00Z',
  },
  {
    id: 'rd-103',
    equipmentId: 'EQ-003',
    equipmentName: 'Caminhão Mercedes-Benz Axor',
    equipmentCode: 'CM-003',
    meterId: 'm-3',
    meterName: 'Odômetro de Frota',
    meterType: 'odometro',
    unit: 'km',
    previousValue: 142100,
    value: 143800,
    difference: 1700,
    readingAt: '2026-08-03 18:00',
    source: 'manual',
    status: 'suspeita',
    validationType: 'muito_alta',
    notes: 'Viagem de longa distância entre fazendas.',
    justification: 'Transporte de colheita inter-unidades autorizado.',
    createdBy: 'Marcos Lima',
    createdAt: '2026-08-03T18:00:00Z',
  },
  {
    id: 'rd-104',
    equipmentId: 'EQ-001',
    equipmentName: 'Trator Massey Ferguson 265',
    equipmentCode: 'TR-001',
    meterId: 'm-1',
    meterName: 'Horímetro Principal',
    meterType: 'horimetro',
    unit: 'h',
    previousValue: 6792,
    value: 6792,
    difference: 0,
    readingAt: '2026-08-03 07:00',
    source: 'checklist',
    status: 'valida',
    validationType: 'duplicada',
    justification: 'Equipamento parado em manutenção preventiva o dia todo.',
    createdBy: 'Carlos Silva',
    createdAt: '2026-08-03T07:00:00Z',
  },
];

class EquipmentReadingsService {
  private readings: MeterReading[] = [...INITIAL_READINGS_MOCK];
  private replacements: MeterReplacement[] = [];

  async getAllReadings(filters?: Partial<ReadingsFilterState>): Promise<MeterReading[]> {
    let result = [...this.readings];

    if (!filters) return result;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.equipmentName?.toLowerCase().includes(q) ||
          r.equipmentCode?.toLowerCase().includes(q) ||
          r.createdBy.toLowerCase().includes(q)
      );
    }

    if (filters.equipmentId) {
      result = result.filter((r) => r.equipmentId === filters.equipmentId);
    }

    if (filters.meterType && filters.meterType !== 'todos') {
      result = result.filter((r) => r.meterType === filters.meterType);
    }

    if (filters.status && filters.status !== 'todos') {
      result = result.filter((r) => r.status === filters.status);
    }

    if (filters.source && filters.source !== 'todos') {
      result = result.filter((r) => r.source === filters.source);
    }

    if (filters.onlySuspicious) {
      result = result.filter((r) => r.status === 'suspeita' || r.validationType === 'muito_alta');
    }

    if (filters.onlyRegressive) {
      result = result.filter((r) => r.validationType === 'regressiva');
    }

    if (filters.onlyCorrected) {
      result = result.filter((r) => r.status === 'corrigida' || !!r.correctedFromReadingId);
    }

    return result.sort((a, b) => new Date(b.readingAt).getTime() - new Date(a.readingAt).getTime());
  }

  async getEquipmentReadings(equipmentId: string, filters?: Partial<ReadingsFilterState>): Promise<MeterReading[]> {
    return this.getAllReadings({ ...filters, equipmentId });
  }

  async getReadingById(readingId: string): Promise<MeterReading | null> {
    return this.readings.find((r) => r.id === readingId) || null;
  }

  validateReading(input: {
    previousValue: number;
    value: number;
    meterType: 'horimetro' | 'odometro';
    readingAt: string;
    lastReadingAt?: string;
  }): ReadingValidationResult {
    const diff = input.value - input.previousValue;

    // 1. Regressiva
    if (input.value < input.previousValue) {
      return {
        type: 'regressiva',
        requiresJustification: true,
        requiresApproval: true,
        blocksMeterUpdate: true,
        message: 'A nova leitura é menor que a última leitura válida. Ela será enviada para aprovação e não alterará o medidor até ser validada.',
      };
    }

    // 2. Duplicada (igual)
    if (diff === 0) {
      return {
        type: 'duplicada',
        requiresJustification: true,
        requiresApproval: false,
        blocksMeterUpdate: false,
        message: 'A nova leitura é igual à leitura anterior. Informe uma justificativa para o equipamento parado.',
      };
    }

    // 3. Discrepância / Muito alta (> 24h ou > 1000km em um único lançamento)
    const threshold = input.meterType === 'horimetro' ? 24 : 1000;
    if (diff > threshold) {
      return {
        type: 'muito_alta',
        requiresJustification: true,
        requiresApproval: true,
        blocksMeterUpdate: false,
        message: 'A diferença informada está acima da utilização esperada para este período. Confirme a leitura e informe uma justificativa.',
      };
    }

    // 4. Data retroativa
    if (input.lastReadingAt && new Date(input.readingAt).getTime() < new Date(input.lastReadingAt).getTime()) {
      return {
        type: 'retroativa',
        requiresJustification: true,
        requiresApproval: true,
        blocksMeterUpdate: true,
        message: 'A data informada é anterior ao último registro cadastrado. Será marcada como pendente de análise cronológica.',
      };
    }

    // 5. Normal
    return {
      type: 'normal',
      requiresJustification: false,
      requiresApproval: false,
      blocksMeterUpdate: false,
      message: 'Leitura válida e dentro da tolerância esperada.',
    };
  }

  async createReading(input: CreateReadingInput): Promise<MeterReading> {
    const validation = this.validateReading({
      previousValue: input.previousValue,
      value: input.value,
      meterType: input.meterType,
      readingAt: input.readingAt,
    });

    let status: MeterReading['status'] = 'valida';
    if (validation.requiresApproval) {
      status = validation.type === 'muito_alta' ? 'suspeita' : 'pendente_aprovacao';
    }

    const eq = await equipmentService.getEquipmentById(input.equipmentId);

    const newReading: MeterReading = {
      id: `rd-${Date.now()}`,
      equipmentId: input.equipmentId,
      equipmentName: eq?.name || 'Equipamento',
      equipmentCode: eq?.plateOrCode || input.equipmentId,
      meterId: input.meterId,
      meterName: input.meterType === 'odometro' ? 'Odômetro Principal' : 'Horímetro Principal',
      meterType: input.meterType,
      unit: input.unit,
      previousValue: input.previousValue,
      value: input.value,
      difference: input.value - input.previousValue,
      readingAt: input.readingAt,
      source: input.source,
      status,
      validationType: validation.type,
      photoUrl: input.photoUrl,
      notes: input.notes,
      justification: input.justification,
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
    };

    this.readings.unshift(newReading);

    // Se for válida e não bloquear a atualização do medidor, sincronizar com o equipamento
    if (status === 'valida' && !validation.blocksMeterUpdate) {
      await this.notifyMeterReadingChanged(input.equipmentId, input.meterId, input.value);
    }

    return newReading;
  }

  async approveReading(readingId: string, userId: string): Promise<MeterReading | null> {
    const reading = this.readings.find((r) => r.id === readingId);
    if (!reading) return null;

    reading.status = 'valida';
    reading.approvedBy = userId;
    reading.approvedAt = new Date().toISOString();

    await this.notifyMeterReadingChanged(reading.equipmentId, reading.meterId, reading.value);
    return reading;
  }

  async rejectReading(readingId: string, reason: string, userId: string): Promise<MeterReading | null> {
    const reading = this.readings.find((r) => r.id === readingId);
    if (!reading) return null;

    reading.status = 'rejeitada';
    reading.rejectionReason = reason;
    reading.approvedBy = userId;
    reading.approvedAt = new Date().toISOString();

    return reading;
  }

  async correctReading(
    readingId: string,
    correctedValue: number,
    justification: string,
    userId: string
  ): Promise<MeterReading | null> {
    const original = this.readings.find((r) => r.id === readingId);
    if (!original) return null;

    // Marcar original como corrigida
    original.status = 'corrigida';

    // Gerar novo registro corrigido
    const correctedReading: MeterReading = {
      id: `rd-corr-${Date.now()}`,
      equipmentId: original.equipmentId,
      equipmentName: original.equipmentName,
      equipmentCode: original.equipmentCode,
      meterId: original.meterId,
      meterName: original.meterName,
      meterType: original.meterType,
      unit: original.unit,
      previousValue: original.previousValue,
      value: correctedValue,
      difference: correctedValue - original.previousValue,
      readingAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      source: original.source,
      status: 'valida',
      validationType: 'normal',
      photoUrl: original.photoUrl,
      notes: `Correção da leitura ${original.id}.`,
      justification,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      correctedFromReadingId: original.id,
    };

    this.readings.unshift(correctedReading);
    await this.notifyMeterReadingChanged(original.equipmentId, original.meterId, correctedValue);

    return correctedReading;
  }

  async cancelReading(readingId: string, reason: string, userId: string): Promise<MeterReading | null> {
    const reading = this.readings.find((r) => r.id === readingId);
    if (!reading) return null;

    reading.status = 'cancelada';
    reading.cancelledBy = userId;
    reading.cancelledAt = new Date().toISOString();
    reading.cancellationReason = reason;

    return reading;
  }

  async replaceMeter(data: Omit<MeterReplacement, 'id' | 'createdAt'>): Promise<MeterReplacement> {
    const replacement: MeterReplacement = {
      ...data,
      id: `m-rep-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    this.replacements.push(replacement);

    // Atualizar equipamento com o novo medidor e leitura inicial
    await this.notifyMeterReadingChanged(data.equipmentId, data.newMeterId, data.newInitialReading);

    return replacement;
  }

  async getReadingStats(): Promise<ReadingStats> {
    const all = this.readings;
    return {
      readingsToday: all.filter((r) => r.readingAt.startsWith('2026-08-04')).length,
      equipmentsOverdue: 2,
      suspiciousReadings: all.filter((r) => r.status === 'suspeita').length,
      pendingApproval: all.filter((r) => r.status === 'pendente_aprovacao').length,
      activeMeters: 48,
      equipmentsWithoutMeter: 3,
    };
  }

  async notifyMeterReadingChanged(equipmentId: string, _meterId: string, readingValue: number): Promise<void> {
    const eq = await equipmentService.getEquipmentById(equipmentId);
    if (eq) {
      eq.currentHours = readingValue;
      eq.lastReadingDate = 'Hoje';
      eq.isReadingOverdue = false;
    }
  }
}

export const equipmentReadingsService = new EquipmentReadingsService();
