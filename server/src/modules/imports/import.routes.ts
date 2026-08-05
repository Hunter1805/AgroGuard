import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { ImportService } from './import.service';
import { importBatchSchema } from './import.schemas';
import { AppError } from '../../shared/errors/AppError';
import type { ApiResponse } from '../../shared/http/ApiResponse';

const prisma = new PrismaClient();
const service = new ImportService(prisma);

export async function importRoutes(app: FastifyInstance) {
  app.post('/api/v1/imports', {
    schema: {
      description: 'Executar simulação (Dry Run) ou importação real de dados com mapeamento legado',
      tags: ['Importação'],
    },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const body = importBatchSchema.parse(request.body);
    const data = await service.processImport(request.actor, body);
    const response: ApiResponse<typeof data> = { data };
    return reply.status(body.dryRun ? 200 : 201).send(response);
  });
}
