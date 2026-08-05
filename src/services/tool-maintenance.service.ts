import type { ToolMaintenance, ToolMaintenanceStatus, ToolMaintenanceType } from '../types/tool-maintenance';
import { toolsService } from './tools.service';

let mockMaintenances: ToolMaintenance[] = [
  {
    id: 'TOOLMNT-001',
    toolId: 'TOOL-004',
    toolCode: 'FER-004',
    toolName: 'Parafusadeira Pneumática de Impacto 1/2"',
    type: 'corretiva',
    problemDescription: 'Perda de força de impacto e vazamento de ar pelo gatilho',
    openedDate: '2026-08-02T09:00:00Z',
    responsibleName: 'Roberto Alves',
    providerName: 'Oficina Pneumática Express',
    status: 'em_execucao',
    notes: 'Aguardando reparo do kit de vedação interno',
  },
];

export const toolMaintenanceService = {
  async getToolMaintenances(filters?: { search?: string; toolId?: string; status?: ToolMaintenanceStatus | 'todos' }): Promise<ToolMaintenance[]> {
    let result = [...mockMaintenances];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        m =>
          m.toolName.toLowerCase().includes(q) ||
          m.toolCode.toLowerCase().includes(q) ||
          m.problemDescription.toLowerCase().includes(q)
      );
    }

    if (filters?.toolId) {
      result = result.filter(m => m.toolId === filters.toolId);
    }

    if (filters?.status && filters.status !== 'todos') {
      result = result.filter(m => m.status === filters.status);
    }

    return Promise.resolve(result);
  },

  async createToolMaintenance(params: {
    toolId: string;
    type: ToolMaintenanceType;
    problemDescription: string;
    responsibleName: string;
    providerName?: string;
    workOrderId?: string;
    notes?: string;
  }): Promise<ToolMaintenance> {
    const tool = await toolsService.getToolById(params.toolId);
    if (!tool) throw new Error('Ferramenta não encontrada.');

    const newMnt: ToolMaintenance = {
      id: `TOOLMNT-${Date.now()}`,
      toolId: tool.id,
      toolCode: tool.code,
      toolName: tool.name,
      type: params.type,
      problemDescription: params.problemDescription,
      openedDate: new Date().toISOString(),
      responsibleName: params.responsibleName,
      providerName: params.providerName,
      status: 'em_execucao',
      workOrderId: params.workOrderId,
      notes: params.notes,
    };

    mockMaintenances.unshift(newMnt);

    await toolsService.updateTool(tool.id, {
      status: 'em_manutencao',
      unavailabilityReason: `Em manutenção (${params.type}): ${params.problemDescription}`,
    });

    return Promise.resolve(newMnt);
  },

  async completeToolMaintenance(
    id: string,
    params: { serviceExecuted: string; appliedParts?: string; cost?: number; notes?: string }
  ): Promise<ToolMaintenance> {
    const mnt = mockMaintenances.find(m => m.id === id);
    if (!mnt) throw new Error('Manutenção de ferramenta não encontrada.');

    mnt.status = 'concluida';
    mnt.completedDate = new Date().toISOString();
    mnt.serviceExecuted = params.serviceExecuted;
    mnt.appliedParts = params.appliedParts;
    mnt.cost = params.cost;

    const tool = await toolsService.getToolById(mnt.toolId);
    if (tool) {
      await toolsService.updateTool(tool.id, {
        status: 'disponivel',
        unavailabilityReason: undefined,
        lastMaintenanceDate: new Date().toISOString().split('T')[0],
      });
    }

    return Promise.resolve(mnt);
  },
};
