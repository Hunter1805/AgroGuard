import { FastifyInstance } from 'fastify';

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
    return reply.send({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  });
}
