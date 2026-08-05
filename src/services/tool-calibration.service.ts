import type { ToolCalibration, ToolCalibrationResult } from '../types/tool-calibration';
import { toolsService } from './tools.service';

let mockCalibrations: ToolCalibration[] = [
  {
    id: 'CAL-001',
    toolId: 'TOOL-001',
    toolCode: 'FER-001',
    toolName: 'Torquímetro de Estalo 1/2" (20 a 200 Nm)',
    calibrationType: 'Aferição Dinâmica de Torque',
    sentDate: '2026-02-05',
    calibrationDate: '2026-02-10',
    nextCalibrationDate: '2026-08-10',
    responsibleCompany: 'Inmetro / TecnoCalib',
    certificateNumber: 'CERT-2026-9921',
    result: 'aprovada',
    deviationFound: '+0.5% (dentro da tolerância ISO 6789)',
    adjustmentMade: 'Limpeza de catraca e calibração de mola interna',
    cost: 320.0,
    warrantyUntil: '2026-08-10',
    responsibleName: 'Roberto Alves',
    notes: 'Aferição conforme norma ISO 6789',
  },
];

export const toolCalibrationService = {
  async getToolCalibrations(filters?: { search?: string; toolId?: string; result?: ToolCalibrationResult | 'todos' }): Promise<ToolCalibration[]> {
    let result = [...mockCalibrations];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        c =>
          c.toolName.toLowerCase().includes(q) ||
          c.toolCode.toLowerCase().includes(q) ||
          c.responsibleCompany.toLowerCase().includes(q) ||
          (c.certificateNumber && c.certificateNumber.toLowerCase().includes(q))
      );
    }

    if (filters?.toolId) {
      result = result.filter(c => c.toolId === filters.toolId);
    }

    if (filters?.result && filters.result !== 'todos') {
      result = result.filter(c => c.result === filters.result);
    }

    return Promise.resolve(result);
  },

  async registerToolCalibration(params: {
    toolId: string;
    calibrationType: string;
    sentDate: string;
    calibrationDate: string;
    nextCalibrationDate: string;
    responsibleCompany: string;
    certificateNumber?: string;
    result: ToolCalibrationResult;
    deviationFound?: string;
    adjustmentMade?: string;
    cost?: number;
    responsibleName: string;
    notes?: string;
  }): Promise<ToolCalibration> {
    const tool = await toolsService.getToolById(params.toolId);
    if (!tool) throw new Error('Ferramenta não encontrada.');

    const newCalib: ToolCalibration = {
      id: `CAL-${Date.now()}`,
      toolId: tool.id,
      toolCode: tool.code,
      toolName: tool.name,
      calibrationType: params.calibrationType,
      sentDate: params.sentDate,
      calibrationDate: params.calibrationDate,
      nextCalibrationDate: params.nextCalibrationDate,
      responsibleCompany: params.responsibleCompany,
      certificateNumber: params.certificateNumber,
      result: params.result,
      deviationFound: params.deviationFound,
      adjustmentMade: params.adjustmentMade,
      cost: params.cost,
      responsibleName: params.responsibleName,
      notes: params.notes,
    };

    mockCalibrations.unshift(newCalib);

    // Se reprovada, bloqueia a ferramenta. Se aprovada, atualiza datas e restaura disponibilidade.
    if (params.result === 'reprovada') {
      await toolsService.updateTool(tool.id, {
        status: 'aguardando_calibracao',
        condition: 'ruim',
        unavailabilityReason: 'Reprovada na calibração: ' + (params.deviationFound || 'Desvio fora da tolerância'),
      });
    } else {
      await toolsService.updateTool(tool.id, {
        lastCalibrationDate: params.calibrationDate,
        nextCalibrationDate: params.nextCalibrationDate,
        status: tool.status === 'aguardando_calibracao' ? 'disponivel' : tool.status,
      });
    }

    return Promise.resolve(newCalib);
  },
};
