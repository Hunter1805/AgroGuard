import type { FastifyInstance } from 'fastify';
import { EquipmentRepository } from './equipment.repository';
import { EquipmentService } from './equipment.service';
import { createReadingSchema, createEquipmentSchema, updateEquipmentSchema } from './equipment.schemas';
import { AppError } from '../../shared/errors/AppError';
import type { ApiResponse } from '../../shared/http/ApiResponse';
import { prisma } from '../../shared/db/prisma';
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

  app.post('/api/v1/equipment', {
    schema: {
      description: 'Cadastrar equipamento na frota',
      tags: ['Equipamentos'],
    },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const body = createEquipmentSchema.parse(request.body);

    const duplicate = await repo.findByCode(body.code, request.actor.organizationId);
    if (duplicate) {
      throw new AppError(`Já existe um equipamento com o código ${body.code}.`, 409, 'DUPLICATE_RECORD');
    }

    // Auto-resolve empresa e unidade se não informados
    let companyId = body.companyId;
    if (!companyId) {
      let company = await prisma.company.findFirst({ where: { organizationId: request.actor.organizationId } });
      if (!company) {
        company = await prisma.company.create({
          data: { organizationId: request.actor.organizationId, code: 'EMP-01', name: 'Empresa Principal' }
        });
      }
      companyId = company.id;
    }

    let unitId = body.unitId;
    if (!unitId) {
      let unit = await prisma.unit.findFirst({ where: { organizationId: request.actor.organizationId } });
      if (!unit) {
        unit = await prisma.unit.create({
          data: { organizationId: request.actor.organizationId, companyId, code: 'UND-01', name: 'Unidade Principal' }
        });
      }
      unitId = unit.id;
    }

    // Auto-resolve tipo de equipamento
    let equipmentTypeId = body.equipmentTypeId;
    if (!equipmentTypeId) {
      const typeName = body.assetType || 'Trator';
      let eqType = await prisma.equipmentType.findFirst({
        where: { OR: [{ name: { equals: typeName, mode: 'insensitive' } }, { code: { equals: typeName.slice(0, 10).toUpperCase() } }] }
      });
      if (!eqType) {
        eqType = await prisma.equipmentType.create({
          data: { code: typeName.slice(0, 10).toUpperCase(), name: typeName }
        });
      }
      equipmentTypeId = eqType.id;
    }

    // Auto-resolve marca e modelo
    let modelId = body.modelId;
    if (!modelId) {
      const brandName = body.brand || 'Geral';
      let brand = await prisma.brand.findFirst({
        where: { OR: [{ name: { equals: brandName, mode: 'insensitive' } }, { code: { equals: brandName.slice(0, 10).toUpperCase() } }] }
      });
      if (!brand) {
        brand = await prisma.brand.create({
          data: { code: brandName.slice(0, 10).toUpperCase(), name: brandName }
        });
      }
      const modelName = body.model || 'Padrão';
      let model = await prisma.model.findFirst({
        where: { brandId: brand.id, OR: [{ name: { equals: modelName, mode: 'insensitive' } }, { code: { equals: modelName.slice(0, 10).toUpperCase() } }] }
      });
      if (!model) {
        model = await prisma.model.create({
          data: { brandId: brand.id, code: modelName.slice(0, 10).toUpperCase(), name: modelName }
        });
      }
      modelId = model.id;
    }

    const equipment = await repo.createEquipment(request.actor.organizationId, {
      ...body,
      companyId,
      unitId,
      equipmentTypeId,
      modelId,
    });
    const response: ApiResponse<typeof equipment> = { data: equipment };
    return reply.status(201).send(response);
  });

  app.patch('/api/v1/equipment/:id', {
    schema: {
      description: 'Atualizar equipamento',
      tags: ['Equipamentos'],
    },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const { id } = request.params as { id: string };
    const body = updateEquipmentSchema.parse(request.body);

    const existing = await repo.findById(id, request.actor.organizationId);
    if (!existing) throw new AppError('Equipamento não encontrado.', 404, 'NOT_FOUND');

    const equipment = await repo.updateEquipment(id, body);
    const response: ApiResponse<typeof equipment> = { data: equipment };
    return reply.send(response);
  });

  app.delete('/api/v1/equipment/:id', {
    schema: {
      description: 'Arquivar equipamento (soft delete)',
      tags: ['Equipamentos'],
    },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const { id } = request.params as { id: string };
    const { reason } = request.body as { reason?: string };

    const existing = await repo.findById(id, request.actor.organizationId);
    if (!existing) throw new AppError('Equipamento não encontrado.', 404, 'NOT_FOUND');

    await repo.archiveEquipment(id, reason);
    const response: ApiResponse<{ ok: true }> = { data: { ok: true } };
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
