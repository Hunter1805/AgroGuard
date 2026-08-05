import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { EquipmentRepository } from './equipment.repository';
import { EquipmentService } from './equipment.service';
import { createReadingSchema } from './equipment.schemas';
import { AppError } from '../../shared/errors/AppError';
import type { ApiResponse } from '../../shared/http/ApiResponse';

const prisma = new PrismaClient();
const repo = new EquipmentRepository(prisma);
const service = new EquipmentService(repo);

export async function equipmentRoutes(app: FastifyInstance) {
  app.get('/api/v1/equipment', {
    schema: {
      description: 'Listar equipamentos da frota',
      tags: ['Equipamentos'],
    },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const { page, pageSize, search } = request.query as { page?: number; pageSize?: number; search?: string };
    const result = await service.listEquipments(request.actor, page, pageSize, search);
    const response: ApiResponse<typeof result.data> = { data: result.data, meta: result.meta };
    return reply.send(response);
  });

  app.get('/api/v1/equipment/:id', {
    schema: {
      description: 'Ficha e medidores do equipamento',
      tags: ['Equipamentos'],
    },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const { id } = request.params as { id: string };
    const data = await service.getEquipmentDetail(id, request.actor);
    const response: ApiResponse<typeof data> = { data };
    return reply.send(response);
  });

  app.post('/api/v1/readings', {
    schema: {
      description: 'Registrar nova leitura de medidor (horímetro/odômetro)',
      tags: ['Equipamentos'],
    },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const body = createReadingSchema.parse(request.body);
    const data = await service.registerReading(request.actor, body.equipmentId, body.meterId, body.readingValue);
    const response: ApiResponse<typeof data> = { data };
    return reply.status(201).send(response);
  });
}
