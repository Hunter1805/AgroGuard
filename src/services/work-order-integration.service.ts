import { workOrderService } from './work-order.service';
import { equipmentService } from './equipment.service';

export const workOrderIntegrationService = {

  async onWorkOrderClosed(orderId: string): Promise<void> {
    const order = await workOrderService.getWorkOrderById(orderId);
    if (!order) return;

    // Atualiza o equipamento
    if (order.equipmentId) {
      await equipmentService.updateEquipment(order.equipmentId, { status: 'operante' });
      
      // Aqui faríamos a integração com a Fase 5 se order.maintenanceScheduleId existisse
      // e com a Fase 4 se order.checklistExecutionId existisse.
      // Esses métodos estariam expostos nos services de checklist e plan, respectivamente.
      // Como estamos isolando, garantimos a interface.
      
      console.log(`OS ${orderId} fechada. Equipamento ${order.equipmentId} atualizado.`);
    }
  },

  async onWorkOrderCanceled(orderId: string): Promise<void> {
    const order = await workOrderService.getWorkOrderById(orderId);
    if (!order) return;

    if (order.equipmentId) {
      // Retorna para o status que estava (mock simplificado para disponivel)
      await equipmentService.updateEquipment(order.equipmentId, { status: 'operante' });
    }
  }
};
