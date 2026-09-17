import type { FastifyInstance } from 'fastify';
import { getFileStorageProvider } from '../../shared/storage/storage.factory';
import { ALLOWED_MIME_TYPES } from './file.schemas';
import { AppError } from '../../shared/errors/AppError';
import type { ApiResponse } from '../../shared/http/ApiResponse';
import { requireAuthentication, requireOrganizationScope, requirePermission } from '../../shared/middleware/authGuard';
import { AuditService } from '../../shared/services/audit.service';
import { prisma } from '../../shared/db/prisma';
import { buildUploadFolder, assertKeyBelongsToTenant } from './file.service';

// ─── Fase 17S — Rotas de arquivos autenticadas e isoladas por tenant ─────────
// Upload e download exigem: autenticação + escopo organizacional + permissão.
// A organização é SEMPRE derivada do RequestActor (nunca do cliente/payload).
// A propriedade do arquivo é validada ANTES de qualquer chamada ao provider.
// Não há mais fallback 'default-org'.

const audit = new AuditService(prisma);

const guard = (action: string) => ({
  preHandler: [requireAuthentication(), requireOrganizationScope(), requirePermission('attachments', action)],
});

const actor = (request: any) => {
  if (!request.actor) throw new AppError('Contexto não informado.', 401, 'ACCESS_DENIED');
  return request.actor;
};

/**
 * O provider é resolvido de forma preguiçosa (lazy) e memoizada, para que uma
 * configuração ausente/inválida NÃO derrube o boot do servidor — só falha quando
 * uma operação de arquivo é de fato solicitada (fail-fast no ponto de uso).
 */
let cachedStorage: ReturnType<typeof getFileStorageProvider> | null = null;
function storage() {
  if (!cachedStorage) {
    cachedStorage = getFileStorageProvider();
  }
  return cachedStorage;
}

export async function fileRoutes(app: FastifyInstance) {
  app.post('/api/v1/files', {
    ...guard('create'),
    schema: {
      description: 'Upload de arquivo (fotos, PDFs, planilhas) via Multipart',
      tags: ['Arquivos'],
    },
  }, async (request, reply) => {
    const currentActor = actor(request);

    // A pasta de destino é derivada EXCLUSIVAMENTE do tenant autenticado.
    // Nenhum organizationId/folder recebido do cliente é considerado.
    const folder = buildUploadFolder(currentActor);

    const data = await request.file();
    if (!data) {
      throw new AppError('Nenhum arquivo enviado no corpo da requisição.', 400, 'VALIDATION_ERROR');
    }

    if (!ALLOWED_MIME_TYPES.includes(data.mimetype)) {
      throw new AppError(`Tipo de arquivo '${data.mimetype}' não permitido.`, 422, 'VALIDATION_ERROR');
    }

    const buffer = await data.toBuffer();

    // Provider só é chamado depois de auth, org scope, permissão e validação de MIME.
    const stored = await storage().upload({
      filename: data.filename,
      mimeType: data.mimetype,
      buffer,
      folder,
    });

    // Defesa em profundidade: a chave devolvida pelo provider deve pertencer ao
    // namespace do tenant. Se o provider devolver algo fora do namespace, rejeita.
    assertKeyBelongsToTenant(stored.storageKey, currentActor);

    const fileMeta = {
      id: `file-${Date.now()}`,
      originalName: data.filename,
      mimeType: data.mimetype,
      size: buffer.length,
      storageKey: stored.storageKey,
      status: 'available',
      uploadedAt: new Date().toISOString(),
    };

    // Auditoria: registra apenas metadados. Nunca conteúdo, token ou URL assinada.
    await audit.log({
      actor: currentActor,
      module: 'attachments',
      entityType: 'file',
      entityId: fileMeta.id,
      action: 'upload',
      newData: {
        originalName: fileMeta.originalName,
        mimeType: fileMeta.mimeType,
        size: fileMeta.size,
        storageKey: fileMeta.storageKey,
      },
      requestId: (request.headers['x-request-id'] as string) || request.id,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    const response: ApiResponse<typeof fileMeta> = { data: fileMeta };
    return reply.status(201).send(response);
  });

  app.get('/api/v1/files/:key/download', {
    ...guard('read'),
    schema: {
      description: 'Gerar URL de download / streaming seguro do arquivo',
      tags: ['Arquivos'],
    },
  }, async (request, reply) => {
    const currentActor = actor(request);
    const { key } = request.params as { key: string };

    // Valida namespace/traversal e confirma a propriedade pelo tenant ANTES
    // de assinar o download. A chave do cliente nunca é repassada crua.
    assertKeyBelongsToTenant(key, currentActor);

    const url = await storage().getDownloadUrl(key, 3600);

    // Auditoria do download: registra a chave, nunca a URL assinada.
    await audit.log({
      actor: currentActor,
      module: 'attachments',
      entityType: 'file',
      entityId: key,
      action: 'download',
      newData: { storageKey: key },
      requestId: (request.headers['x-request-id'] as string) || request.id,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    const response: ApiResponse<{ downloadUrl: string }> = { data: { downloadUrl: url } };
    return reply.send(response);
  });
}
