import { FastifyInstance } from 'fastify';
import type { ApiResponse } from '../../shared/http/ApiResponse';

export async function auditRoutes(app: FastifyInstance) {
  app.get('/api/audit', async (request, reply) => {
    const response: ApiResponse<any[]> = {
      data: [],
      meta: { page: 1, pageSize: 25, total: 0, totalPages: 0 },
    };
    return reply.send(response);
  });
}
