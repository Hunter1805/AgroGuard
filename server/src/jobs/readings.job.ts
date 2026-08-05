import type { ScheduledJob, JobContext, JobResult } from '../shared/jobs/scheduler.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReadingsAutomationJob implements ScheduledJob {
  name = 'readings-check';

  async execute(context: JobContext): Promise<JobResult> {
    const start = Date.now();
    let processed = 0;

    // Buscar equipamentos sem leituras recentes
    const equipments = await prisma.equipment.findMany({
      where: { status: 'operacional', archivedAt: null },
      include: { meterReadings: { take: 1, orderBy: { readingDate: 'desc' } } },
    });

    for (const eq of equipments) {
      const lastReading = eq.meterReadings[0];
      const daysSince = lastReading
        ? (context.triggeredAt.getTime() - lastReading.readingDate.getTime()) / (1000 * 3600 * 24)
        : 999;

      if (daysSince > 7) {
        processed++;
      }
    }

    return {
      jobName: this.name,
      success: true,
      itemsProcessed: processed,
      durationMs: Date.now() - start,
      message: `Verificação de leituras efetuada: ${processed} equipamentos sem apontamento recente identificados.`,
    };
  }
}
