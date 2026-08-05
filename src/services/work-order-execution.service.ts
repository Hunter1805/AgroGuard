import { workOrderService } from './work-order.service';
import type { WorkOrderPause, WorkOrderTask, WorkOrderTest, WorkOrderRelease } from '../types/work-order-execution';

export const workOrderExecutionService = {

  async startWorkOrder(id: string, userId: string, userName: string): Promise<void> {
    const execution = await workOrderService.getExecutionData(id);
    if (!execution) return;
    
    execution.executionStartedAt = new Date().toISOString();
    await workOrderService.changeStatus(id, 'em_execucao', {}, 'Início da Execução', 'Serviço iniciado na oficina', userId, userName);
  },

  async pauseWorkOrder(id: string, pauseData: Omit<WorkOrderPause, 'id' | 'orderId' | 'active'>, userId: string, userName: string): Promise<void> {
    const execution = await workOrderService.getExecutionData(id);
    if (!execution) return;

    const hasActivePause = execution.pauses.some(p => p.active);
    if (hasActivePause) throw new Error('Já existe uma pausa ativa para esta OS.');

    const newPause: WorkOrderPause = {
      ...pauseData,
      id: `PAUSA-${Date.now()}`,
      orderId: id,
      active: true
    };
    execution.pauses.push(newPause);
    
    await workOrderService.changeStatus(id, 'pausada', {}, 'OS Pausada', `Motivo: ${pauseData.reason}`, userId, userName);
  },

  async resumeWorkOrder(id: string, userId: string, userName: string): Promise<void> {
    const execution = await workOrderService.getExecutionData(id);
    if (!execution) return;

    const activePause = execution.pauses.find(p => p.active);
    if (activePause) {
      activePause.active = false;
      activePause.endedAt = new Date().toISOString();
      activePause.endedBy = userName;
    }

    await workOrderService.changeStatus(id, 'em_execucao', {}, 'Execução Retomada', 'Pausa encerrada, trabalho retomado', userId, userName);
  },

  async completeTask(orderId: string, taskId: string, data: Partial<WorkOrderTask>, userId: string, userName: string): Promise<void> {
    const execution = await workOrderService.getExecutionData(orderId);
    if (!execution) return;

    const task = execution.tasks.find(t => t.id === taskId);
    if (task) {
      Object.assign(task, data);
      task.executedBy = userName;
      task.executedAt = new Date().toISOString();
      workOrderService.addTimelineEvent(orderId, 'Tarefa Concluída', `Tarefa "${task.title}" concluída`, userId, userName);
    }
  },

  async sendToTest(id: string, userId: string, userName: string): Promise<void> {
    await workOrderService.changeStatus(id, 'em_teste', {}, 'Enviado para Teste', 'Execução concluída tecnicamente, aguardando testes de qualidade', userId, userName);
  },

  async registerTest(id: string, testData: Omit<WorkOrderTest, 'id' | 'orderId'>, userId: string, userName: string): Promise<void> {
    const execution = await workOrderService.getExecutionData(id);
    if (!execution) return;

    const newTest: WorkOrderTest = {
      ...testData,
      id: `TESTE-${Date.now()}`,
      orderId: id
    };
    execution.tests.push(newTest);
    
    const actionDesc = testData.result === 'aprovado' ? 'Teste aprovado' : `Teste reprovado: ${testData.notes}`;
    workOrderService.addTimelineEvent(id, 'Teste Realizado', actionDesc, userId, userName);

    if (testData.result === 'reprovado') {
      await workOrderService.changeStatus(id, 'em_execucao', {}, 'Retrabalho Exigido', 'Equipamento retornou à execução após reprovação no teste', userId, userName);
    } else if (testData.result === 'aprovado' || testData.result === 'aprovado_com_restricao') {
      await workOrderService.changeStatus(id, 'aguardando_liberacao', {}, 'Aguardando Liberação', 'Teste aprovado, equipamento aguardando liberação final', userId, userName);
    }
  },

  async releaseEquipment(id: string, releaseData: Omit<WorkOrderRelease, 'orderId'>, userId: string, userName: string): Promise<void> {
    const execution = await workOrderService.getExecutionData(id);
    if (!execution) return;

    execution.release = { ...releaseData, orderId: id };

    await workOrderService.changeStatus(id, 'finalizada', {}, 'Equipamento Liberado', `Condição: ${releaseData.condition}`, userId, userName);
  },

  async finishWorkOrder(id: string, userId: string, userName: string): Promise<void> {
    const execution = await workOrderService.getExecutionData(id);
    if (execution) {
      execution.executionEndedAt = new Date().toISOString();
    }
    await workOrderService.changeStatus(id, 'aguardando_aprovacao_final', {}, 'Execução Finalizada', 'Serviços concluídos e OS enviada para fechamento', userId, userName);
  },

  async closeWorkOrder(id: string, userId: string, userName: string): Promise<void> {
    await workOrderService.changeStatus(id, 'encerrada', {}, 'OS Encerrada', 'Ordem de serviço totalmente aprovada e fechada', userId, userName);
  }
};
