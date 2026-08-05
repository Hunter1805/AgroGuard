import type { TireMovementLog, TireAction } from '../types/tire-movement';
import { tiresService } from './tires.service';

let movements: TireMovementLog[] = [
  {
    id: 'MOV-1001',
    date: '2025-01-15T08:00:00Z',
    tireId: 'PN-0891',
    action: 'instalacao',
    equipmentId: 'EQ-003',
    equipmentName: 'Trator Massey Ferguson 275 03',
    destinationPositionId: 'pos-2e-in',
    destinationPositionName: 'Eixo 2 — Traseiro Esquerdo',
    reading: 7800,
    responsibleId: 'RESP-01',
    responsibleName: 'Carlos Silva',
    notes: 'Instalação de pneu novo para início da safra.',
    statusAfter: 'instalado',
  },
  {
    id: 'MOV-1002',
    date: '2025-01-15T08:00:00Z',
    tireId: 'PN-0892',
    action: 'instalacao',
    equipmentId: 'EQ-003',
    equipmentName: 'Trator Massey Ferguson 275 03',
    destinationPositionId: 'pos-2d-in',
    destinationPositionName: 'Eixo 2 — Traseiro Direito',
    reading: 7800,
    responsibleId: 'RESP-01',
    responsibleName: 'Carlos Silva',
    notes: 'Instalação de pneu novo.',
    statusAfter: 'instalado',
  },
  {
    id: 'MOV-1003',
    date: '2026-07-20T10:00:00Z',
    tireId: 'PN-0901',
    action: 'recapagem',
    responsibleId: 'RESP-02',
    responsibleName: 'Roberto Alves',
    cost: 850,
    notes: 'Enviado para a Recapadora Rodagil para primeira recapagem.',
    statusAfter: 'em_recapagem',
  },
];

export const tireMovementService = {
  async getMovements(filters?: { tireId?: string; equipmentId?: string; action?: TireAction }): Promise<TireMovementLog[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    let result = [...movements];

    if (filters?.tireId) {
      result = result.filter(m => m.tireId === filters.tireId);
    }
    if (filters?.equipmentId) {
      result = result.filter(m => m.equipmentId === filters.equipmentId || m.destinationEquipmentId === filters.equipmentId);
    }
    if (filters?.action) {
      result = result.filter(m => m.action === filters.action);
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async logMovement(data: Omit<TireMovementLog, 'id'>): Promise<TireMovementLog> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const newLog: TireMovementLog = {
      ...data,
      id: `MOV-${Date.now()}`,
    };
    movements.push(newLog);
    return newLog;
  },

  // 1. Instalação
  async installTire(data: {
    tireId: string;
    equipmentId: string;
    equipmentName: string;
    positionId: string;
    positionName: string;
    date?: string;
    reading?: number;
    pressureAtInstallation?: number;
    treadDepthAtInstallation?: number;
    responsibleId: string;
    responsibleName: string;
    notes?: string;
  }): Promise<void> {
    const tire = await tiresService.getTireById(data.tireId);
    if (!tire) throw new Error('Pneu não encontrado.');
    if (tire.status === 'instalado') {
      throw new Error('Este pneu já está instalado em outro equipamento.');
    }
    if (tire.status === 'descartado' || tire.status === 'condenado') {
      throw new Error('Não é possível instalar um pneu descartado ou condenado.');
    }

    // Atualiza status do pneu
    await tiresService.updateTire(data.tireId, {
      status: 'instalado',
      currentEquipmentId: data.equipmentId,
      currentPositionId: data.positionId,
      installationDate: data.date || new Date().toISOString(),
      installationReading: data.reading,
      currentTreadDepth: data.treadDepthAtInstallation ?? tire.currentTreadDepth,
    });

    // Atualiza configuração de eixos do equipamento se existir
    const config = await tiresService.getEquipmentTireConfiguration(data.equipmentId);
    if (config) {
      const updatedAxles = config.axles.map(axle => ({
        ...axle,
        positions: axle.positions.map(p => (p.id === data.positionId ? { ...p, installedTireId: data.tireId } : p)),
      }));
      await tiresService.saveEquipmentTireConfiguration(data.equipmentId, { axles: updatedAxles });
    }

    await this.logMovement({
      date: data.date || new Date().toISOString(),
      tireId: data.tireId,
      action: 'instalacao',
      equipmentId: data.equipmentId,
      equipmentName: data.equipmentName,
      destinationPositionId: data.positionId,
      destinationPositionName: data.positionName,
      reading: data.reading,
      responsibleId: data.responsibleId,
      responsibleName: data.responsibleName,
      notes: data.notes,
      statusAfter: 'instalado',
    });
  },

  // 2. Remoção
  async removeTire(data: {
    tireId: string;
    equipmentId: string;
    equipmentName: string;
    positionId: string;
    positionName: string;
    destinationStatus: 'disponivel' | 'em_reparo' | 'em_recapagem' | 'condenado' | 'descartado';
    date?: string;
    reading?: number;
    treadDepthAtRemoval?: number;
    removalReason?: string;
    responsibleId: string;
    responsibleName: string;
    notes?: string;
  }): Promise<void> {
    const tire = await tiresService.getTireById(data.tireId);
    if (!tire) throw new Error('Pneu não encontrado.');

    let accumulated = tire.accumulatedHours || 0;
    if (tire.installationReading && data.reading && data.reading > tire.installationReading) {
      accumulated += data.reading - tire.installationReading;
    }

    await tiresService.updateTire(data.tireId, {
      status: data.destinationStatus,
      currentEquipmentId: undefined,
      currentPositionId: undefined,
      installationDate: undefined,
      installationReading: undefined,
      accumulatedHours: accumulated,
      currentTreadDepth: data.treadDepthAtRemoval ?? tire.currentTreadDepth,
    });

    // Desvincula da posição do equipamento
    const config = await tiresService.getEquipmentTireConfiguration(data.equipmentId);
    if (config) {
      const updatedAxles = config.axles.map(axle => ({
        ...axle,
        positions: axle.positions.map(p => (p.installedTireId === data.tireId ? { ...p, installedTireId: undefined } : p)),
      }));
      await tiresService.saveEquipmentTireConfiguration(data.equipmentId, { axles: updatedAxles });
    }

    await this.logMovement({
      date: data.date || new Date().toISOString(),
      tireId: data.tireId,
      action: 'remocao',
      equipmentId: data.equipmentId,
      equipmentName: data.equipmentName,
      originPositionId: data.positionId,
      originPositionName: data.positionName,
      reading: data.reading,
      responsibleId: data.responsibleId,
      responsibleName: data.responsibleName,
      notes: `${data.removalReason ? `Motivo: ${data.removalReason}. ` : ''}${data.notes || ''}`.trim(),
      statusAfter: data.destinationStatus,
    });
  },

  // 3. Rodízio
  async rotateTires(data: {
    equipmentId: string;
    equipmentName: string;
    date?: string;
    reading?: number;
    pos1Id: string;
    pos1Name: string;
    pos1TireId: string;
    pos2Id: string;
    pos2Name: string;
    pos2TireId: string;
    responsibleId: string;
    responsibleName: string;
    notes?: string;
  }): Promise<void> {
    if (data.pos1Id === data.pos2Id) throw new Error('Não é possível realizar rodízio com a mesma posição.');

    // Atualiza pneu A
    await tiresService.updateTire(data.pos1TireId, { currentPositionId: data.pos2Id });
    // Atualiza pneu B
    await tiresService.updateTire(data.pos2TireId, { currentPositionId: data.pos1Id });

    // Atualiza mapa de posições do equipamento
    const config = await tiresService.getEquipmentTireConfiguration(data.equipmentId);
    if (config) {
      const updatedAxles = config.axles.map(axle => ({
        ...axle,
        positions: axle.positions.map(p => {
          if (p.id === data.pos1Id) return { ...p, installedTireId: data.pos2TireId };
          if (p.id === data.pos2Id) return { ...p, installedTireId: data.pos1TireId };
          return p;
        }),
      }));
      await tiresService.saveEquipmentTireConfiguration(data.equipmentId, { axles: updatedAxles });
    }

    // Registra movimento pneu 1
    await this.logMovement({
      date: data.date || new Date().toISOString(),
      tireId: data.pos1TireId,
      action: 'rodizio',
      equipmentId: data.equipmentId,
      equipmentName: data.equipmentName,
      originPositionId: data.pos1Id,
      originPositionName: data.pos1Name,
      destinationPositionId: data.pos2Id,
      destinationPositionName: data.pos2Name,
      reading: data.reading,
      responsibleId: data.responsibleId,
      responsibleName: data.responsibleName,
      notes: `Rodízio com Pneu ${data.pos2TireId}. ${data.notes || ''}`.trim(),
      statusAfter: 'instalado',
    });

    // Registra movimento pneu 2
    await this.logMovement({
      date: data.date || new Date().toISOString(),
      tireId: data.pos2TireId,
      action: 'rodizio',
      equipmentId: data.equipmentId,
      equipmentName: data.equipmentName,
      originPositionId: data.pos2Id,
      originPositionName: data.pos2Name,
      destinationPositionId: data.pos1Id,
      destinationPositionName: data.pos1Name,
      reading: data.reading,
      responsibleId: data.responsibleId,
      responsibleName: data.responsibleName,
      notes: `Rodízio com Pneu ${data.pos1TireId}. ${data.notes || ''}`.trim(),
      statusAfter: 'instalado',
    });
  },

  // 4. Transferência entre equipamentos
  async transferTire(data: {
    tireId: string;
    originEquipmentId: string;
    originEquipmentName: string;
    originPositionId: string;
    originPositionName: string;
    destEquipmentId: string;
    destEquipmentName: string;
    destPositionId: string;
    destPositionName: string;
    date?: string;
    originReading?: number;
    destReading?: number;
    responsibleId: string;
    responsibleName: string;
    notes?: string;
  }): Promise<void> {
    // Desvincula da origem
    const origConfig = await tiresService.getEquipmentTireConfiguration(data.originEquipmentId);
    if (origConfig) {
      const updatedAxles = origConfig.axles.map(axle => ({
        ...axle,
        positions: axle.positions.map(p => (p.installedTireId === data.tireId ? { ...p, installedTireId: undefined } : p)),
      }));
      await tiresService.saveEquipmentTireConfiguration(data.originEquipmentId, { axles: updatedAxles });
    }

    // Atualiza pneu
    await tiresService.updateTire(data.tireId, {
      status: 'instalado',
      currentEquipmentId: data.destEquipmentId,
      currentPositionId: data.destPositionId,
      installationDate: data.date || new Date().toISOString(),
      installationReading: data.destReading,
    });

    // Vincula ao destino
    const destConfig = await tiresService.getEquipmentTireConfiguration(data.destEquipmentId);
    if (destConfig) {
      const updatedAxles = destConfig.axles.map(axle => ({
        ...axle,
        positions: axle.positions.map(p => (p.id === data.destPositionId ? { ...p, installedTireId: data.tireId } : p)),
      }));
      await tiresService.saveEquipmentTireConfiguration(data.destEquipmentId, { axles: updatedAxles });
    }

    await this.logMovement({
      date: data.date || new Date().toISOString(),
      tireId: data.tireId,
      action: 'transferencia',
      equipmentId: data.originEquipmentId,
      equipmentName: data.originEquipmentName,
      originPositionId: data.originPositionId,
      originPositionName: data.originPositionName,
      destinationEquipmentId: data.destEquipmentId,
      destinationPositionId: data.destPositionId,
      destinationPositionName: data.destPositionName,
      reading: data.destReading ?? data.originReading,
      responsibleId: data.responsibleId,
      responsibleName: data.responsibleName,
      notes: data.notes,
      statusAfter: 'instalado',
    });
  },

  // 5. Substituição integrada (Remove anterior + Instala novo)
  async replaceTire(data: {
    equipmentId: string;
    equipmentName: string;
    positionId: string;
    positionName: string;
    oldTireId: string;
    oldTireDestinationStatus: 'disponivel' | 'em_reparo' | 'em_recapagem' | 'condenado' | 'descartado';
    newTireId: string;
    date?: string;
    reading?: number;
    responsibleId: string;
    responsibleName: string;
    notes?: string;
  }): Promise<void> {
    await this.removeTire({
      tireId: data.oldTireId,
      equipmentId: data.equipmentId,
      equipmentName: data.equipmentName,
      positionId: data.positionId,
      positionName: data.positionName,
      destinationStatus: data.oldTireDestinationStatus,
      date: data.date,
      reading: data.reading,
      responsibleId: data.responsibleId,
      responsibleName: data.responsibleName,
      removalReason: 'Substituição por novo pneu',
      notes: data.notes,
    });

    await this.installTire({
      tireId: data.newTireId,
      equipmentId: data.equipmentId,
      equipmentName: data.equipmentName,
      positionId: data.positionId,
      positionName: data.positionName,
      date: data.date,
      reading: data.reading,
      responsibleId: data.responsibleId,
      responsibleName: data.responsibleName,
      notes: `Substituiu pneu ${data.oldTireId}`,
    });
  },

  // 6. Reparo / Recapagem / Descarte
  async sendTireToRepair(data: { tireId: string; responsibleId: string; responsibleName: string; cost?: number; notes?: string }): Promise<void> {
    await tiresService.updateTire(data.tireId, { status: 'em_reparo' });
    await this.logMovement({
      date: new Date().toISOString(),
      tireId: data.tireId,
      action: 'reparo',
      responsibleId: data.responsibleId,
      responsibleName: data.responsibleName,
      cost: data.cost,
      notes: `Envio para reparo: ${data.notes || ''}`.trim(),
      statusAfter: 'em_reparo',
    });
  },

  async completeTireRepair(data: { tireId: string; responsibleId: string; responsibleName: string; cost?: number; notes?: string }): Promise<void> {
    await tiresService.updateTire(data.tireId, { status: 'disponivel' });
    await this.logMovement({
      date: new Date().toISOString(),
      tireId: data.tireId,
      action: 'reparo',
      responsibleId: data.responsibleId,
      responsibleName: data.responsibleName,
      cost: data.cost,
      notes: `Retorno de reparo concluído com sucesso. ${data.notes || ''}`.trim(),
      statusAfter: 'disponivel',
    });
  },

  async sendTireToRetread(data: { tireId: string; responsibleId: string; responsibleName: string; cost?: number; notes?: string }): Promise<void> {
    const tire = await tiresService.getTireById(data.tireId);
    if (!tire) throw new Error('Pneu não encontrado.');
    if (tire.status === 'condenado' || tire.status === 'descartado') {
      throw new Error('Não é possível recapar pneu condenado ou descartado.');
    }
    if (tire.maximumRetreads !== undefined && tire.retreadCount >= tire.maximumRetreads) {
      throw new Error(`Este pneu já atingiu o limite máximo de ${tire.maximumRetreads} recapagens.`);
    }

    await tiresService.updateTire(data.tireId, { status: 'em_recapagem' });
    await this.logMovement({
      date: new Date().toISOString(),
      tireId: data.tireId,
      action: 'recapagem',
      responsibleId: data.responsibleId,
      responsibleName: data.responsibleName,
      cost: data.cost,
      notes: `Envio para recapagem. ${data.notes || ''}`.trim(),
      statusAfter: 'em_recapagem',
    });
  },

  async completeTireRetread(data: {
    tireId: string;
    newTreadDepth: number;
    responsibleId: string;
    responsibleName: string;
    cost?: number;
    notes?: string;
  }): Promise<void> {
    const tire = await tiresService.getTireById(data.tireId);
    if (!tire) throw new Error('Pneu não encontrado.');

    await tiresService.updateTire(data.tireId, {
      status: 'recapado',
      condition: 'bom',
      currentTreadDepth: data.newTreadDepth,
      retreadCount: (tire.retreadCount || 0) + 1,
    });

    await this.logMovement({
      date: new Date().toISOString(),
      tireId: data.tireId,
      action: 'recapagem',
      responsibleId: data.responsibleId,
      responsibleName: data.responsibleName,
      cost: data.cost,
      notes: `Retorno de recapagem concluído (${data.newTreadDepth}mm sulco). ${data.notes || ''}`.trim(),
      statusAfter: 'recapado',
    });
  },

  async discardTire(data: {
    tireId: string;
    reason: string;
    residualValue?: number;
    responsibleId: string;
    responsibleName: string;
    notes?: string;
  }): Promise<void> {
    await tiresService.updateTire(data.tireId, {
      status: 'descartado',
      condition: 'inutilizavel',
      currentEquipmentId: undefined,
      currentPositionId: undefined,
    });

    await this.logMovement({
      date: new Date().toISOString(),
      tireId: data.tireId,
      action: 'descarte',
      responsibleId: data.responsibleId,
      responsibleName: data.responsibleName,
      cost: data.residualValue ? -data.residualValue : undefined,
      notes: `Motivo: ${data.reason}. ${data.notes || ''}`.trim(),
      statusAfter: 'descartado',
    });
  }
};

