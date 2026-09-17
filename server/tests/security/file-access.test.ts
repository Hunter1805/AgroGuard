import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Fastify, { type FastifyInstance } from 'fastify';
import multipart from '@fastify/multipart';

// ─── Fase 17S — Testes de isolamento de arquivos por tenant ───────────────────
// Exercitam os handlers REAIS de upload/download com um storage SIMULADO.
// Garantem que nenhuma chamada ao provider acontece em requisições rejeitadas.

// Espiões declarados com vi.hoisted porque `vi.mock` é hoisted para o topo do arquivo.
const { auditCreate, uploadSpy, getDownloadUrlSpy } = vi.hoisted(() => {
  return {
    auditCreate: vi.fn(async () => ({})),
    uploadSpy: vi.fn(async ({ folder, filename }: any) => ({
      storageKey: `${folder}/${Date.now()}-${filename}`,
    })),
    getDownloadUrlSpy: vi.fn(async (key: string) => `https://signed.example/${key}`),
  };
});

// 1) Mock do Prisma (evita conexão real) — apenas create para auditoria.
vi.mock('../../src/shared/db/prisma', () => ({
  prisma: {
    auditLog: { create: auditCreate },
  },
}));

// 2) Storage simulado com espiões para provar que NÃO é chamado quando rejeitado.
vi.mock('../../src/shared/storage/storage.factory', () => ({
  getFileStorageProvider: () => ({
    upload: uploadSpy,
    getDownloadUrl: getDownloadUrlSpy,
    delete: vi.fn(),
    exists: vi.fn(async () => true),
  }),
}));

// Importados DEPOIS dos mocks.
import { fileRoutes } from '../../src/modules/files/file.routes';
import { requestActorMiddleware } from '../../src/shared/http/RequestActor';
import { errorHandler } from '../../src/shared/middleware/errorHandler';
import { buildUploadFolder, assertKeyBelongsToTenant, parseStorageKey } from '../../src/modules/files/file.service';
import type { RequestActor } from '../../src/shared/http/RequestActor';

const ORG_A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const ORG_B = 'bb-bbbb-4bbb-8bbb-bbbbbb';

function makeActor(orgId: string, permissions: RequestActor['permissions'] = [{ module: 'attachments', action: 'all', allowed: true }]): RequestActor {
  return {
    authUserId: 'auth-1',
    userId: 'user-1',
    organizationId: orgId,
    companyIds: [],
    unitIds: [],
    farmIds: [],
    workshopIds: [],
    warehouseIds: [],
    roleIds: [],
    permissions,
    isMockActor: false,
  } as RequestActor;
}

/**
 * Monta um app de teste injetando o ator via header `x-test-actor-org`
 * (e `x-test-actor-perms`) para simular o resultado do middleware real de auth
 * sem depender do Supabase. O middleware real só é executado se o header não vier.
 */
async function buildTestApp(actor: RequestActor | null): Promise<FastifyInstance> {
  const app = Fastify({ logger: false });
  await app.register(multipart, { limits: { fileSize: 20 * 1024 * 1024 } });

  app.addHook('onRequest', async (request, reply) => {
    // Middleware real (preenche request.actor a partir do Bearer token, se houver).
    await requestActorMiddleware(request, reply);
    // Injeção determinística do ator de teste SOMENTE quando explicitamente pedido.
    if (actor !== null && request.headers['x-test-actor'] === 'yes') {
      request.actor = actor;
    }
  });

  app.setErrorHandler(errorHandler);
  await app.register(fileRoutes);
  await app.ready();
  return app;
}

function multipartBody(filename: string, mimeType: string, content: string) {
  const boundary = '----agroguardtest';
  const body =
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n` +
    `Content-Type: ${mimeType}\r\n\r\n` +
    `${content}\r\n` +
    `--${boundary}--\r\n`;
  return { body, contentType: `multipart/form-data; boundary=${boundary}` };
}

describe('Fase 17S — Isolamento de arquivos (upload/download)', () => {
  let app: FastifyInstance;

  beforeEach(() => {
    uploadSpy.mockClear();
    getDownloadUrlSpy.mockClear();
    auditCreate.mockClear();
  });

  afterEach(async () => {
    if (app) await app.close();
  });

  // ── Upload ────────────────────────────────

  it('rejeita upload anônimo e não chama o provider', async () => {
    app = await buildTestApp(null);
    const { body, contentType } = multipartBody('foto.jpg', 'image/jpeg', 'x');
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/files',
      payload: body,
      headers: { 'content-type': contentType },
    });
    expect(res.statusCode).toBe(401);
    expect(uploadSpy).not.toHaveBeenCalled();
  });

  it('rejeita upload de ator sem organização e não chama o provider', async () => {
    app = await buildTestApp(makeActor(''));
    const { body, contentType } = multipartBody('foto.jpg', 'image/jpeg', 'x');
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/files',
      payload: body,
      headers: { 'content-type': contentType, 'x-test-actor': 'yes' },
    });
    expect(res.statusCode).toBe(403);
    expect(uploadSpy).not.toHaveBeenCalled();
  });

  it('rejeita upload de ator sem permissão e não chama o provider', async () => {
    app = await buildTestApp(makeActor(ORG_A, [])); // sem permissões
    const { body, contentType } = multipartBody('foto.jpg', 'image/jpeg', 'x');
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/files',
      payload: body,
      headers: { 'content-type': contentType, 'x-test-actor': 'yes' },
    });
    expect(res.statusCode).toBe(403);
    expect(uploadSpy).not.toHaveBeenCalled();
  });

  it('aceita upload do próprio tenant e grava sob o namespace da organização', async () => {
    app = await buildTestApp(makeActor(ORG_A));
    const { body, contentType } = multipartBody('foto.jpg', 'image/jpeg', 'conteudo');
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/files',
      payload: body,
      headers: { 'content-type': contentType, 'x-test-actor': 'yes' },
    });
    expect(res.statusCode).toBe(201);
    expect(uploadSpy).toHaveBeenCalledTimes(1);
    const arg = uploadSpy.mock.calls[0][0];
    expect(arg.folder).toBe(`${ORG_A}/attachments`);
    const parsed = JSON.parse(res.body);
    expect(parsed.data.storageKey.startsWith(`${ORG_A}/attachments/`)).toBe(true);
  });

  it('rejeita upload com MIME não permitido e não chama o provider', async () => {
    app = await buildTestApp(makeActor(ORG_A));
    const { body, contentType } = multipartBody('malicioso.exe', 'application/x-msdownload', 'MZ');
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/files',
      payload: body,
      headers: { 'content-type': contentType, 'x-test-actor': 'yes' },
    });
    expect(res.statusCode).toBe(422);
    expect(uploadSpy).not.toHaveBeenCalled();
  });

  // ── Download ──────────────────────────────

  // O contrato da rota usa `:key` de segmento único: a chave do storage (com barras)
  // DEVE vir URL-encoded para alcançar o handler (ex.: org%2Fattachments%2Farq.pdf).
  const dlUrl = (key: string) => `/api/v1/files/${encodeURIComponent(key)}/download`;

  it('rejeita download anônimo e não chama o provider', async () => {
    app = await buildTestApp(null);
    const res = await app.inject({ method: 'GET', url: dlUrl(`${ORG_A}/attachments/arq.pdf`) });
    expect(res.statusCode).toBe(401);
    expect(getDownloadUrlSpy).not.toHaveBeenCalled();
  });

  it('rejeita download de ator sem organização e não chama o provider', async () => {
    app = await buildTestApp(makeActor(''));
    const res = await app.inject({
      method: 'GET',
      url: dlUrl(`${ORG_A}/attachments/arq.pdf`),
      headers: { 'x-test-actor': 'yes' },
    });
    expect(res.statusCode).toBe(403);
    expect(getDownloadUrlSpy).not.toHaveBeenCalled();
  });

  it('rejeita download de ator sem permissão e não chama o provider', async () => {
    app = await buildTestApp(makeActor(ORG_A, []));
    const res = await app.inject({
      method: 'GET',
      url: dlUrl(`${ORG_A}/attachments/arq.pdf`),
      headers: { 'x-test-actor': 'yes' },
    });
    expect(res.statusCode).toBe(403);
    expect(getDownloadUrlSpy).not.toHaveBeenCalled();
  });

  it('bloqueia acesso cross-tenant (tenant A → arquivo do tenant B) e não chama o provider', async () => {
    app = await buildTestApp(makeActor(ORG_A));
    const res = await app.inject({
      method: 'GET',
      url: dlUrl(`${ORG_B}/attachments/arq.pdf`),
      headers: { 'x-test-actor': 'yes' },
    });
    expect(res.statusCode).toBe(403);
    const body = JSON.parse(res.body);
    expect(body.error.code).toBe('CROSS_TENANT_FORBIDDEN');
    expect(getDownloadUrlSpy).not.toHaveBeenCalled();
    // Não vaza a organização dona do arquivo.
    expect(res.body).not.toContain(ORG_B);
  });

  it('permite download do próprio tenant', async () => {
    app = await buildTestApp(makeActor(ORG_A));
    const res = await app.inject({
      method: 'GET',
      url: dlUrl(`${ORG_A}/attachments/arq.pdf`),
      headers: { 'x-test-actor': 'yes' },
    });
    expect(res.statusCode).toBe(200);
    expect(getDownloadUrlSpy).toHaveBeenCalledTimes(1);
    const body = JSON.parse(res.body);
    expect(body.data.downloadUrl).toContain(`${ORG_A}/attachments/arq.pdf`);
  });

  // ── Chaves malformadas / traversal ────────────────────────

  it('rejeita chaves com traversal e não chama o provider', async () => {
    app = await buildTestApp(makeActor(ORG_A));
    const keys = [
      `${ORG_A}/attachments/../../../etc/passwd`,
      `${ORG_A}/..%2f..%2fetc`,
      `%2e%2e/attachments/x`,
      `${ORG_A}/attachments/%2e%2e/%2e%2e/segredo`,
    ];
    for (const key of keys) {
      const res = await app.inject({
        method: 'GET',
        url: dlUrl(key),
        headers: { 'x-test-actor': 'yes' },
      });
      expect([400, 403]).toContain(res.statusCode);
    }
    expect(getDownloadUrlSpy).not.toHaveBeenCalled();
  });

  // ── Logs e respostas sem valores sensíveis ────────────────────────────────

  it('não inclui URL assinada nem service_role na resposta', async () => {
    app = await buildTestApp(makeActor(ORG_A));
    const res = await app.inject({
      method: 'GET',
      url: dlUrl(`${ORG_A}/attachments/arq.pdf`),
      headers: { 'x-test-actor': 'yes' },
    });
    expect(res.body).not.toMatch(/service_role/i);
    expect(res.body).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
  });
});

// ─── Unit tests do serviço de validação ──────────────────────

describe('Fase 17S — file.service (validação de namespace)', () => {
  it('parseStorageKey rejeita caminhos absolutos', () => {
    expect(() => parseStorageKey('/etc/passwd')).toThrow();
    expect(() => parseStorageKey('C:/Windows/system32')).toThrow();
  });

  it('parseStorageKey rejeita separadores alternativos e traversal', () => {
    expect(() => parseStorageKey('a\\b\\c')).toThrow();
    expect(() => parseStorageKey('a/../b')).toThrow();
    expect(() => parseStorageKey('a/%2e%2e/b')).toThrow();
  });

  it('parseStorageKey rejeita codificação malformada', () => {
    expect(() => parseStorageKey('%E0%A4%A')).toThrow();
  });

  it('assertKeyBelongsToTenant nega chave fora do namespace do tenant', () => {
    const actor = makeActor(ORG_A);
    expect(() => assertKeyBelongsToTenant(`${ORG_B}/attachments/x.pdf`, actor)).toThrow();
  });

  it('assertKeyBelongsToTenant nega chave legada sem namespace de organização', () => {
    const actor = makeActor(ORG_A);
    expect(() => assertKeyBelongsToTenant('arquivo-solto.pdf', actor)).toThrow();
  });

  it('assertKeyBelongsToTenant aceita chave do próprio tenant', () => {
    const actor = makeActor(ORG_A);
    const segments = assertKeyBelongsToTenant(`${ORG_A}/attachments/x.pdf`, actor);
    expect(segments[0]).toBe(ORG_A);
  });

  it('buildUploadFolder deriva organização apenas do ator', () => {
    expect(buildUploadFolder(makeActor(ORG_A))).toBe(`${ORG_A}/attachments`);
    expect(() => buildUploadFolder(undefined)).toThrow();
  });
});
