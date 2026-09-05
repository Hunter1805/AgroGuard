import { FastifyInstance } from 'fastify';
import { prisma } from '../../shared/db/prisma';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/api/health', {
    schema: {
      description: 'Endpoint de verificação de saúde da aplicação backend AgroGuard',
      tags: ['Health Check'],
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'ok' },
            database: { type: 'string', example: 'connected' },
            timestamp: { type: 'string', example: '2026-08-05T10:30:00.000Z' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const dbStart = performance.now();
    let database = 'connected';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      database = 'disconnected';
      request.log.warn({ error: error instanceof Error ? error.message : 'unknown' }, '[HEALTH] database ping failed');
    }
    return reply.send({
      status: 'ok',
      database,
      databasePingMs: Number((performance.now() - dbStart).toFixed(2)),
      timestamp: new Date().toISOString(),
    });
  });
}
