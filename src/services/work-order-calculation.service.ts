import { workOrderService } from './work-order.service';

export const workOrderCalculationService = {

  async calculateDowntime(orderId: string): Promise<number> {
    const order = await workOrderService.getWorkOrderById(orderId);
    const execution = await workOrderService.getExecutionData(orderId);
    
    if (!order || !execution) return 0;

    // Se o equipamento foi liberado e retomou operação
    const end = execution.release?.operationResumedAt || execution.release?.releasedAt || new Date().toISOString();
    
    // Início da falha ou abertura da OS
    const start = order.failureDateTime || order.openedAt;

    const ms = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(0, Math.floor(ms / (1000 * 60))); // Retorna em minutos
  },

  async calculateGrossExecutionTime(orderId: string): Promise<number> {
    const execution = await workOrderService.getExecutionData(orderId);
    if (!execution || !execution.executionStartedAt) return 0;

    const start = new Date(execution.executionStartedAt).getTime();
    const end = execution.executionEndedAt ? new Date(execution.executionEndedAt).getTime() : new Date().getTime();

    return Math.max(0, Math.floor((end - start) / (1000 * 60)));
  },

  async calculateTotalPausesTime(orderId: string): Promise<number> {
    const execution = await workOrderService.getExecutionData(orderId);
    if (!execution || !execution.pauses) return 0;

    let totalMs = 0;
    for (const pause of execution.pauses) {
      const pStart = new Date(pause.startedAt).getTime();
      const pEnd = pause.endedAt ? new Date(pause.endedAt).getTime() : new Date().getTime();
      totalMs += (pEnd - pStart);
    }

    return Math.floor(totalMs / (1000 * 60));
  },

  async calculateMTTR(orderId: string): Promise<number> {
    const gross = await this.calculateGrossExecutionTime(orderId);
    const pauses = await this.calculateTotalPausesTime(orderId);
    
    return Math.max(0, gross - pauses);
  }
};
