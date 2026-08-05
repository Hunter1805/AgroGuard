import { toolLoanService } from './tool-loan.service';
import { toolsService } from './tools.service';

export interface WorkOrderToolCheckResult {
  hasPendingTools: boolean;
  unreturnedToolsCount: number;
  unreturnedToolsList: { toolName: string; quantity: number; borrowerName: string }[];
}

export const toolIntegrationService = {
  /**
   * Verifica ferramentas emprestadas associadas a uma Ordem de Serviço antes de seu encerramento.
   */
  async checkWorkOrderToolPendencies(workOrderId: string): Promise<WorkOrderToolCheckResult> {
    const loans = await toolLoanService.getToolLoans({ workOrderId });
    const activeLoans = loans.filter(l => l.status === 'ativo' || l.status === 'atrasado' || l.status === 'parcialmente_devolvido');

    const unreturnedList: { toolName: string; quantity: number; borrowerName: string }[] = [];

    activeLoans.forEach(loan => {
      loan.items.forEach(item => {
        const pendingQty = item.quantity - item.returnedQuantity;
        if (pendingQty > 0) {
          unreturnedList.push({
            toolName: item.toolName,
            quantity: pendingQty,
            borrowerName: loan.borrowerName,
          });
        }
      });
    });

    return {
      hasPendingTools: unreturnedList.length > 0,
      unreturnedToolsCount: unreturnedList.reduce((acc, i) => acc + i.quantity, 0),
      unreturnedToolsList: unreturnedList,
    };
  },

  /**
   * Retorna os alertas simulados de ferramentas para integração com a Central de Alertas e Dashboard.
   */
  async getToolAlerts(): Promise<any[]> {
    const stats = await toolsService.getToolsDashboard();
    const alerts: any[] = [];

    if (stats.overdueLoans > 0) {
      alerts.push({
        id: 'ALT-TOOL-001',
        title: 'Empréstimos de Ferramentas Atrasados',
        description: `Existem ${stats.overdueLoans} empréstimos com prazo de devolução vencido na oficina.`,
        severity: 'alta',
        module: 'ferramentas',
        createdAt: new Date().toISOString(),
        actionUrl: '/ferramentas/emprestimos',
      });
    }

    if (stats.expiredCalibrations > 0) {
      alerts.push({
        id: 'ALT-TOOL-002',
        title: 'Calibração de Ferramentas Vencida',
        description: `Existem ${stats.expiredCalibrations} ferramentas com calibração vencida (ex: Multímetro Digital).`,
        severity: 'critica',
        module: 'ferramentas',
        createdAt: new Date().toISOString(),
        actionUrl: '/ferramentas/calibracoes',
      });
    }

    if (stats.incompleteKits > 0) {
      alerts.push({
        id: 'ALT-TOOL-003',
        title: 'Kit de Ferramentas Incompleto',
        description: `O Kit de Bordo (Trator MF 265) possui 1 item ausente em conferência recente.`,
        severity: 'media',
        module: 'ferramentas',
        createdAt: new Date().toISOString(),
        actionUrl: '/ferramentas/kits',
      });
    }

    return Promise.resolve(alerts);
  },
};
