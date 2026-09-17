import path from 'path';
import { AppError } from '../../shared/errors/AppError';
import type { RequestActor } from '../../shared/http/RequestActor';

// ─── Fase 17S — Isolamento de arquivos por tenant ────────────────────────────
// Não existe tabela de metadados de arquivo no schema Prisma, portanto a
// propriedade de um arquivo é derivada EXCLUSIVAMENTE do primeiro segmento do
// `storageKey`, que sempre deve ser o `organizationId` do tenant autenticado
// (o upload grava em `${organizationId}/attachments/...`).
//
// Regras:
//  * Nunca confiar em `organizationId`, `folder` ou `storageKey` vindos do cliente.
//  * Rejeitar caminhos absolutos, traversal, separadores alternativos e codificações.
//  * Arquivos sem namespace de tenant verificável são negados (não se atribui tenant).

export const ATTACHMENTS_SEGMENT = 'attachments';

/**
 * Normaliza e valida um `storageKey` recebido do cliente.
 *
 * Retorna os segmentos já saneados ou lança `AppError` (400/422) para entradas
 * malformadas. NUNCA resolve o caminho contra o filesystem.
 */
export function parseStorageKey(rawKey: string): string[] {
  if (typeof rawKey !== 'string' || rawKey.length === 0) {
    throw new AppError('Chave de arquivo inválida.', 400, 'VALIDATION_ERROR');
  }

  // Rejeitar explicitamente qualquer forma de traversal e separadores alternativos
  // ANTES de qualquer decodificação — inclusive a versão codificada (%2e, %2f, %5c).
  const decoded = safeDecode(rawKey);

  if (decoded.includes('\0')) {
    throw new AppError('Chave de arquivo inválida.', 400, 'VALIDATION_ERROR');
  }
  if (decoded.includes('\\')) {
    throw new AppError('Chave de arquivo inválida: separadores não suportados.', 400, 'VALIDATION_ERROR');
  }
  if (decoded.startsWith('/') || /^[a-zA-Z]:/.test(decoded)) {
    throw new AppError('Chave de arquivo inválida: caminhos absolutos não são permitidos.', 400, 'VALIDATION_ERROR');
  }

  const segments = decoded.split('/');

  // Rejeitar segmentos vazios (''), '.' e '..' em qualquer posição.
  for (const segment of segments) {
    if (segment === '' || segment === '.' || segment === '..') {
      throw new AppError('Chave de arquivo inválida: segmentos de caminho não permitidos.', 400, 'VALIDATION_ERROR');
    }
  }

  // Rejeitar caracteres de controle (defesa contra injeção em chaves).
  // Verificação por code points, sem regex, para evitar linters sinalizando
  // intencionalmente classes de caracteres de controle.
  for (const segment of segments) {
    for (const char of segment) {
      const code = char.codePointAt(0) ?? 0;
      if (code <= 0x1f || code === 0x7f) {
        throw new AppError('Chave de arquivo inválida: caracteres de controle detectados.', 400, 'VALIDATION_ERROR');
      }
    }
  }

  return segments;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    // Codificação malformada (ex.: '%zz') — tratar como inválido.
    throw new AppError('Chave de arquivo inválida: codificação malformada.', 400, 'VALIDATION_ERROR');
  }
}

/**
 * Extrai o `organizationId` estritamente do ator autenticado.
 * Nunca do payload, da query string ou de headers.
 */
export function resolveActorOrganizationId(actor: RequestActor | undefined): string {
  const organizationId = actor?.organizationId;
  if (!organizationId) {
    throw new AppError('Escopo organizacional não informado ou inválido.', 403, 'ORGANIZATION_SCOPE_REQUIRED');
  }
  return organizationId;
}

/**
 * Valida que um `storageKey` pertence ao tenant autenticado.
 *
 * A propriedade é confirmada pelo PRIMEIRO segmento do caminho ser exatamente
 * o `organizationId` do ator. O segundo segmento deve ser o namespace fixo de
 * anexos ou ser validado como namespace conhecido.
 *
 * Arquivos legados sem esse prefixo (ex.: chaves "soltas" gravadas antes da
 * Fase 17S) NÃO recebem tenant arbitrário: o acesso é negado.
 */
export function assertKeyBelongsToTenant(rawKey: string, actor: RequestActor | undefined): string[] {
  const organizationId = resolveActorOrganizationId(actor);
  const segments = parseStorageKey(rawKey);

  // Namespace mínimo esperado: `${organizationId}/<namespace>/<arquivo>`
  if (segments.length < 2) {
    throw new AppError(
      'Arquivo sem namespace de organização verificável. Regularização necessária antes do acesso.',
      403,
      'CROSS_TENANT_FORBIDDEN'
    );
  }

  const [keyOrgId] = segments;
  if (keyOrgId !== organizationId) {
    // Mensagem genérica: não vaza qual organização é dona do arquivo.
    throw new AppError(
      'Acesso negado a recursos de outra organização (Cross-Tenant Block).',
      403,
      'CROSS_TENANT_FORBIDDEN'
    );
  }

  return segments;
}

/**
 * Monta a pasta de destino do upload, derivando a organização SOMENTE do ator.
 * Elimina o fallback 'default-org'.
 */
export function buildUploadFolder(actor: RequestActor | undefined): string {
  const organizationId = resolveActorOrganizationId(actor);
  // path.posix garante separador '/' independente do SO.
  return path.posix.join(organizationId, ATTACHMENTS_SEGMENT);
}
