import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../shared/errors/AppError';
import type { ApiResponse } from '../../shared/http/ApiResponse';
import { createTireSchema, updateTireSchema, tireMovementSchema } from './tires.schemas';

const prisma = new PrismaClient();

interface Actor {
  organizationId: string;
  userId: string;
}

async function getTireOrThrow(organizationId: string, id: string) {
  const tire = await prisma.tire.findFirst({ where: { id, organizationId } });
  if (!tire) throw new AppError('Pneu não encontrado.', 404, 'NOT_FOUND');
  return tire;
}

/** Validações de negócio replicadas do front (mantêm integridade p/ qualquer cliente). */
function validateTireBusinessRules(metadata: Record<string, any>) {
  if (
    metadata.currentTreadDepth !== undefined &&
    metadata.initialTreadDepth !== undefined &&
    Number(metadata.currentTreadDepth) > Number(metadata.initialTreadDepth) &&
    !String(metadata.notes ?? '').includes('Recapagem')
  ) {
    throw new AppError('A profundidade atual do sulco não pode superar a profundidade inicial sem justificativa/recapagem.', 422, 'BUSINESS_RULE_VIOLATION');
  }
  if (
    metadata.recommendedMinimumPressure !== undefined &&
    metadata.recommendedMaximumPressure !== undefined &&
    Number(metadata.recommendedMinimumPressure) > Number(metadata.recommendedMaximumPressure)
  ) {
    throw new AppError('A pressão mínima recomendada não pode superar a pressão máxima.', 422, 'BUSINESS_RULE_VIOLATION');
  }
}

export async function tireRoutes(app: FastifyInstance) {
  // ─── Listar ───
  app.get('/api/v1/tires', {
    schema: { description: 'Listar pneus da frota', tags: ['Pneus'] },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const { search } = request.query as { search?: string };

    const tires = await prisma.tire.findMany({
      where: {
        organizationId: request.actor.organizationId,
        archivedAt: null,
        ...(search
          ? { OR: [
              { code: { contains: search, mode: 'insensitive' as const } },
              { brand: { contains: search, mode: 'insensitive' as const } },
              { model: { contains: search, mode: 'insensitive' as const } },
              { size: { contains: search, mode: 'insensitive' as const } },
              { serialNumber: { contains: search, mode: 'insensitive' as const } },
            ] }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    const response: ApiResponse<typeof tires> = { data: tires };
    return reply.send(response);
  });

  // ─── Detalhe ───
  app.get('/api/v1/tires/:id', {
    schema: { description: 'Detalhe do pneu', tags: ['Pneus'] },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const tire = await getTireOrThrow(request.actor.organizationId, (request.params as any).id);
    const response: ApiResponse<typeof tire> = { data: tire };
    return reply.send(response);
  });

  // ─── Cadastro ───
  app.post('/api/v1/tires', {
    schema: { description: 'Cadastrar pneu', tags: ['Pneus'] },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const body = createTireSchema.parse(request.body);
    const metadata = (body.metadata ?? {}) as Record<string, any>;
    validateTireBusinessRules(metadata);

    const duplicate = await prisma.tire.findFirst({
      where: { organizationId: request.actor.organizationId, code: body.code },
    });
    if (duplicate) {
      throw new AppError(`Já existe um pneu cadastrado com o código ${body.code}.`, 409, 'BUSINESS_RULE_VIOLATION');
    }

    const tire = await prisma.tire.create({
      data: {
        organizationId: request.actor.organizationId,
        code: body.code,
        brand: body.brand,
        model: body.model,
        size: body.size,
        serialNumber: body.serialNumber || null,
        status: body.status || 'disponivel',
        currentDepthMm: body.currentDepthMm ?? metadata.initialTreadDepth ?? 15.0,
        metadata: metadata as any,
      },
    });

    const response: ApiResponse<typeof tire> = { data: tire };
    return reply.status(201).send(response);
  });

  // ─── Edição ───
  app.patch('/api/v1/tires/:id', {
    schema: { description: 'Atualizar pneu', tags: ['Pneus'] },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const existing = await getTireOrThrow(request.actor.organizationId, (request.params as any).id);
    const body = updateTireSchema.parse(request.body);

    if (body.metadata) validateTireBusinessRules({ ...((existing.metadata as object) ?? {}), ...body.metadata } as Record<string, any>);

    const tire = await prisma.tire.update({
      where: { id: existing.id },
      data: {
        ...(body.code !== undefined ? { code: body.code } : {}),
        ...(body.brand !== undefined ? { brand: body.brand } : {}),
        ...(body.model !== undefined ? { model: body.model } : {}),
        ...(body.size !== undefined ? { size: body.size } : {}),
        ...(body.serialNumber !== undefined ? { serialNumber: body.serialNumber || null } : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.currentDepthMm !== undefined ? { currentDepthMm: body.currentDepthMm } : {}),
        ...(body.metadata !== undefined
          ? { metadata: { ...((existing.metadata as object) ?? {}), ...body.metadata } as any }
          : {}),
      },
    });

    const response: ApiResponse<typeof tire> = { data: tire };
    return reply.send(response);
  });

  // ─── Arquivar ───
  app.delete('/api/v1/tires/:id', {
    schema: { description: 'Arquivar pneu (soft delete)', tags: ['Pneus'] },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const existing = await getTireOrThrow(request.actor.organizationId, (request.params as any).id);

    await prisma.tire.update({ where: { id: existing.id }, data: { archivedAt: new Date() } });
    const response: ApiResponse<{ ok: true }> = { data: { ok: true } };
    return reply.send(response);
  });

  // ─── Movimentações (instalar / remover / rodizio / reparo / recapagem / descarte) ───
  app.post('/api/v1/tires/movements', {
    schema: { description: 'Registrar movimentação de pneu', tags: ['Pneus'] },
  }, async (request, reply) => {
    if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
    const actor = request.actor as unknown as Actor;
    const body = tireMovementSchema.parse(request.body);

    const tire = await getTireOrThrow(actor.organizationId, body.tireId);
    const metadata = (tire.metadata ?? {}) as Record<string, any>;

    // Mesmas regras de negócio do front
    if (body.action === 'instalar') {
      if (tire.status === 'instalado') throw new AppError('Este pneu já está instalado em outro equipamento.', 422, 'BUSINESS_RULE_VIOLATION');
      if (tire.status === 'descartado' || tire.status === 'condenado') throw new AppError('Não é possível instalar um pneu descartado ou condenado.', 422, 'BUSINESS_RULE_VIOLATION');
    }
    if ((body.action === 'recapagem') && (tire.status === 'condenado' || tire.status === 'descartado')) {
      throw new AppError('Não é possível recapar pneu condenado ou descartado.', 422, 'BUSINESS_RULE_VIOLATION');
    }
    if (body.action === 'recapagem' && metadata.maximumRetreads !== undefined && Number(metadata.retreadCount ?? 0) >= Number(metadata.maximumRetreads)) {
      throw new AppError(`Este pneu já atingiu o limite máximo de ${metadata.maximumRetreads} recapagens.`, 422, 'BUSINESS_RULE_VIOLATION');
    }

    // Status resultante por ação
    const statusByAction: Record<string, string | undefined> = {
      instalar: 'instalado',
      remover: 'disponivel',
      rodizio: undefined, // não muda status
      transferir: 'instalado',
      reparo: 'em_reparo',
      recapagem: 'em_recapagem',
      descartar: 'descartado',
      condenar: 'condenado',
    };
    const newStatus = statusByAction[body.action];

    const updatedMetadata: Record<string, any> = { ...metadata, ...(body.metadata ?? {}) };
    if (body.action === 'instalar' || body.action === 'transferir') {
      updatedMetadata.installationDate = new Date().toISOString();
      if (body.equipmentId) updatedMetadata.currentEquipmentId = body.equipmentId;
      if (body.positionId) updatedMetadata.currentPositionId = body.positionId;
    }
    if (body.action === 'remover') {
      updatedMetadata.currentEquipmentId = undefined;
      updatedMetadata.currentPositionId = undefined;
    }
    if (body.action === 'recapagem') {
      updatedMetadata.retreadCount = Number(metadata.retreadCount ?? 0) + 1;
    }
    if (body.depthMm !== undefined) {
      updatedMetadata.currentTreadDepth = body.depthMm;
    }

    const updated = await prisma.tire.update({
      where: { id: tire.id },
      data: {
        ...(newStatus ? { status: newStatus } : {}),
        currentDepthMm: body.depthMm !== undefined ? body.depthMm : tire.currentDepthMm,
        metadata: updatedMetadata as any,
      },
    });

    const response: ApiResponse<typeof updated> = { data: updated };
    return reply.send(response);
  });
}
