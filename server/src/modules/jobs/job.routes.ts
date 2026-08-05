import { FastifyInstance } from 'fastify';
import { schedulerService } from '../../shared/jobs/scheduler.service';
import { ReadingsAutomationJob } from '../../jobs/readings.job';
import { MaintenanceAutomationJob } from '../../jobs/maintenance.job';
import { StockAutomationJob } from '../../jobs/stock.job';
import { requireAuthentication } from '../../shared/middleware/authGuard';
import type { ApiResponse } from '../../shared/http/ApiResponse';

// Registrar automações no serviço central
schedulerService.registerJob(new ReadingsAutomationJob());
schedulerService.registerJob(new MaintenanceAutomationJob());
schedulerService.registerJob(new StockAutomationJob());

export async function jobRoutes(app: FastifyInstance) {
  app.post('/api/v1/jobs/run-all', {
    preHandler: [requireAuthentication()],
    schema: {
      description: 'Executar ciclo de todas as automações operacionais agendadas',
      tags: ['Automações & Jobs'],
    },
  }, async (request, reply) => {
    const results = await schedulerService.runAll({ organizationId: request.actor?.organizationId });
    const response: ApiResponse<typeof results> = { data: results };
    return reply.send(response);
  });
}
