import { workOrderService } from './work-order.service';
import type { WorkOrderExecutionData, WorkOrderTask } from '../types/work-order-execution';

export const workOrderPlanningService = {
  
  async planWorkOrder(id: string, planningData: Partial<WorkOrderExecutionData>, userId: string, userName: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const execution = await workOrderService.getExecutionData(id);
    if (!execution) throw new Error('Dados de execução não encontrados');

    // Atualiza os dados de planejamento na base de execução
    Object.assign(execution, planningData);

    await workOrderService.changeStatus(id, 'planejada', {}, 'Planejamento Salvo', 'Responsáveis e programação definidos', userId, userName);
  },

  async scheduleWorkOrder(id: string, date: string, time: string, userId: string, userName: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const execution = await workOrderService.getExecutionData(id);
    if (!execution) return;

    execution.scheduledStartDate = date;
    execution.scheduledStartTime = time;

    await workOrderService.changeStatus(id, 'programada', {}, 'Programação Definida', `OS programada para ${new Date(date).toLocaleDateString('pt-BR')} ${time}`, userId, userName);
  },

  async addTasks(id: string, tasks: WorkOrderTask[], userId: string, userName: string): Promise<void> {
    const execution = await workOrderService.getExecutionData(id);
    if (!execution) return;

    execution.tasks.push(...tasks);
    workOrderService.addTimelineEvent(id, 'Tarefas Adicionadas', `${tasks.length} tarefas incluídas no planejamento`, userId, userName);
  }
};
