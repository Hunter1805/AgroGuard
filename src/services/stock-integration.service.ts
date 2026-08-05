import { partsService } from './parts.service';
import { stockReservationService } from './stock-reservation.service';
import { stockLotService } from './stock-lot.service';
import type { DashboardAlert } from '../types/dashboard';

export const stockIntegrationService = {
  /**
   * Verifica se uma Ordem de Serviço possui pendências de peças ou reservas não encerradas
   */
  async checkWorkOrderStockPending(workOrderId: string): Promise<{
    hasPending: boolean;
    pendingReservationsCount: number;
    message?: string;
  }> {
    const reservations = await stockReservationService.getStockReservations({
      workOrderId,
    });

    const activeReservations = reservations.filter(r => r.status === 'aprovada' || r.status === 'separada' || r.status === 'parcialmente_atendida');

    if (activeReservations.length > 0) {
      return {
        hasPending: true,
        pendingReservationsCount: activeReservations.length,
        message: `Existem ${activeReservations.length} reservas de peças/insumos pendentes de entrega ou cancelamento para esta OS.`,
      };
    }

    return {
      hasPending: false,
      pendingReservationsCount: 0,
    };
  },

  /**
   * Gera a lista de alertas de estoque para a Central de Alertas e Dashboard
   */
  async generateStockAlerts(): Promise<DashboardAlert[]> {
    const alerts: DashboardAlert[] = [];
    const items = await partsService.getStockItems();
    const lots = await stockLotService.getStockLots();

    // 1. Itens sem estoque
    items.filter(i => i.currentQuantity <= 0 && i.status !== 'arquivado').forEach(i => {
      alerts.push({
        id: `ALT-STOCK-OUT-${i.id}`,
        title: `Item Sem Estoque: ${i.name}`,
        description: `O item ${i.internalCode} zerou no almoxarifado. Recomenda-se emissão de pedido de compras urgente.`,
        type: 'Estoque',
        priority: 'critica',
        status: 'novo',
        createdAt: new Date().toISOString(),
        recommendedAction: 'Emitir Pedido de Compras',
        targetRoute: `/pecas-insumos/${i.id}`,
      });
    });

    // 2. Itens abaixo do mínimo
    items.filter(i => i.currentQuantity <= i.minimumQuantity && i.currentQuantity > 0 && i.status !== 'arquivado').forEach(i => {
      alerts.push({
        id: `ALT-STOCK-LOW-${i.id}`,
        title: `Estoque Baixo: ${i.name}`,
        description: `Saldo atual de ${i.currentQuantity} ${i.controlUnit} está abaixo do mínimo estipulado (${i.minimumQuantity} ${i.controlUnit}).`,
        type: 'Estoque',
        priority: 'alta',
        status: 'novo',
        createdAt: new Date().toISOString(),
        recommendedAction: 'Solicitar Reposição',
        targetRoute: `/pecas-insumos/${i.id}`,
      });
    });

    // 3. Lotes vencendo / vencidos
    lots.filter(l => l.status === 'vencido').forEach(l => {
      alerts.push({
        id: `ALT-LOT-EXP-${l.id}`,
        title: `Lote de Insumo Vencido: ${l.code}`,
        description: `Lote ${l.code} do item ${l.itemName} venceu em ${l.expirationDate}. Item bloqueado para uso normal.`,
        type: 'Estoque',
        priority: 'critica',
        status: 'novo',
        createdAt: new Date().toISOString(),
        recommendedAction: 'Registrar Descarte ou Isolar',
        targetRoute: '/pecas-insumos/lotes',
      });
    });

    return alerts;
  },
};
