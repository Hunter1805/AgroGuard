import type { ScheduledJob, JobContext, JobResult } from '../shared/jobs/scheduler.service';
import { prisma } from '../shared/db/prisma';

export class StockAutomationJob implements ScheduledJob {
  name = 'stock-check';

  async execute(_context: JobContext): Promise<JobResult> {
    const start = Date.now();
    
    const lowStockItems = await prisma.stockItem.count({
      where: { status: 'ativo' },
    });

    return {
      jobName: this.name,
      success: true,
      itemsProcessed: lowStockItems,
      durationMs: Date.now() - start,
      message: `Automação de estoque executada com sucesso. ${lowStockItems} itens verificados.`,
    };
  }
}
