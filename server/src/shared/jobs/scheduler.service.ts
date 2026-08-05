export interface JobContext {
  organizationId?: string;
  triggeredAt: Date;
}

export interface JobResult {
  jobName: string;
  success: boolean;
  itemsProcessed: number;
  durationMs: number;
  message: string;
  error?: string;
}

export interface ScheduledJob {
  name: string;
  execute(context: JobContext): Promise<JobResult>;
}

export class SchedulerService {
  private jobs: Map<string, ScheduledJob> = new Map();
  private timer: NodeJS.Timeout | null = null;

  registerJob(job: ScheduledJob): void {
    this.jobs.set(job.name, job);
  }

  async runJob(jobName: string, context?: Partial<JobContext>): Promise<JobResult> {
    const job = this.jobs.get(jobName);
    if (!job) {
      throw new Error(`Job '${jobName}' não encontrado no Scheduler.`);
    }

    const start = Date.now();
    const jobCtx: JobContext = {
      triggeredAt: context?.triggeredAt || new Date(),
      organizationId: context?.organizationId,
    };

    try {
      const result = await job.execute(jobCtx);
      result.durationMs = Date.now() - start;
      return result;
    } catch (err: any) {
      return {
        jobName,
        success: false,
        itemsProcessed: 0,
        durationMs: Date.now() - start,
        message: `Falha na execução da automação '${jobName}'.`,
        error: err.message,
      };
    }
  }

  async runAll(context?: Partial<JobContext>): Promise<JobResult[]> {
    const results: JobResult[] = [];
    for (const jobName of this.jobs.keys()) {
      const res = await this.runJob(jobName, context);
      results.push(res);
    }
    return results;
  }

  startPeriodicExecution(intervalMs = 300000): void {
    if (this.timer) return;
    this.timer = setInterval(async () => {
      console.log('⏰ Executando ciclo de automações operacionais agendadas...');
      await this.runAll();
    }, intervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const schedulerService = new SchedulerService();
