import type { ScheduledJob, JobContext, JobResult } from '../shared/jobs/scheduler.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MaintenanceAutomationJob implements ScheduledJob {
  name = 'maintenance-check';

  async execute(_context: JobContext): Promise<JobResult> {
    const start = Date.now();
    
    // Contagem de ordens abertas para recálculo de status
    const openWOs = await prisma.workOrder.count({
      where: { status: { in: ['aberta', 'em_andamento', 'aguardando_peca'] } },
    });

    return {
      jobName: this.name,
      success: true,
      itemsProcessed: openWOs,
      durationMs: Date.now() - start,
      message: `Automação de manutenções executada com sucesso. ${openWOs} Ordens de Serviço monitoradas.`,
    };
  }
}
