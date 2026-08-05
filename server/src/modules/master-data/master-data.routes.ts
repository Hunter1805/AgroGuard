import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { MasterDataRepository } from './master-data.repository';
import { MasterDataService } from './master-data.service';
import type { ApiResponse } from '../../shared/http/ApiResponse';

const prisma = new PrismaClient();
const repo = new MasterDataRepository(prisma);
const service = new MasterDataService(repo);

export async function masterDataRoutes(app: FastifyInstance) {
  app.get('/api/v1/master-data', {
    schema: {
      description: 'Obter catálogos mestre (tipos, marcas, modelos, sistemas, fornecedores)',
      tags: ['Master Data'],
    },
  }, async (request, reply) => {
    const data = await service.getAllMasterData();
    const response: ApiResponse<typeof data> = { data };
    return reply.send(response);
  });
}
