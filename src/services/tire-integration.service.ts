import { workOrderService } from './work-order.service';
import { tiresService } from './tires.service';
import { tireMovementService } from './tire-movement.service';

export const tireIntegrationService = {
  /**
   * Cria uma Ordem de Serviço Corretiva a partir de uma anomalia grave em inspeção de pneu.
   */
  async createWorkOrderFromInspection(data: {
    inspectionId?: string;
    tireId: string;
    tireCode: string;
    equipmentId: string;
    anomalyDescription: string;
    priority?: 'Alta' | 'Média' | 'Baixa' | 'Crítica';
    recommendedAction?: string;
  }): Promise<string> {
    const os = await workOrderService.createWorkOrder({
      title: `Correção de Pneu ${data.tireCode} — ${data.anomalyDescription}`,
      description: `Ordem de serviço gerada via Inspeção de Pneus.\nPneu: ${data.tireCode} (ID: ${data.tireId})\nAção Recomendada: ${data.recommendedAction || 'Reparo/Substituição imediata'}.\nObservações: ${data.anomalyDescription}`,
      type: 'corretiva_nao_planejada',
      priority: data.priority === 'Crítica' ? 'urgente' : data.priority === 'Alta' ? 'alta' : 'media',
      origin: 'inspecao_pneu',
      equipmentId: data.equipmentId,
      equipmentCanOperate: false,
      requiresBlock: true,
      requiresApproval: false,
    } as any);

    await tireMovementService.logMovement({
      date: new Date().toISOString(),
      tireId: data.tireId,
      action: 'inspecao',
      equipmentId: data.equipmentId,
      responsibleId: 'SISTEMA',
      responsibleName: 'Integração AgroGuard',
      notes: `Ordem de Serviço ${os.id} aberta para resolução de anomalia.`,
      statusAfter: 'instalado',
    });

    return os.id;
  },

  /**
   * Chamado no encerramento da OS para resolver o alerta de pneu e atualizar a condição para normal se aplicável.
   */
  async handleWorkOrderCompleted(_orderId: string, tireId: string): Promise<void> {
    const tire = await tiresService.getTireById(tireId);
    if (tire && (tire.condition === 'atencao' || tire.condition === 'critico')) {
      await tiresService.updateTire(tireId, { condition: 'bom' });
    }
  }
};

