import type { ApiResponse, ApiErrorResponse } from './api-types';
import { supabase } from '../supabase/supabase-client';
import { withTimeout } from '../../services/auth-flow.service';

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

// Em produção, nunca use localhost: o navegador resolveria esse endereço
// para o computador do usuário, e não para o servidor da API.
const BASE_URL = configuredBaseUrl || (
  import.meta.env.PROD
    ? 'https://api.agroguard.com.br/api/v1'
    : 'http://localhost:3333/api/v1'
);

/** Códigos HTTP que nunca devem ser retentados. */
const NON_RETRYABLE_STATUS = new Set([400, 401, 403, 422]);

export class ApiError extends Error {
  public readonly code: string;
  public readonly fieldErrors?: Record<string, string[]>;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode: number, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
  }
}

export interface ApiClientOptions extends RequestInit {
  /**
   * Timeout em ms para esta requisição específica.
   * Padrão: 10 000 ms (10s).
   */
  timeoutMs?: number;
}

/**
 * Determina se um erro é passível de retry.
 * Nunca retenta erros de autenticação/autorização/validação.
 */
export function isRetryableError(err: unknown): boolean {
  if (err instanceof ApiError) {
    if (NON_RETRYABLE_STATUS.has(err.statusCode)) return false;
    if (err.code === 'REQUEST_TIMEOUT' || err.code === 'NETWORK_ERROR') return true;
    if (err.statusCode === 502 || err.statusCode === 503 || err.statusCode === 504) return true;
    return false;
  }
  return true; // erros desconhecidos são tentados
}

/**
 * Auxiliar para combinar múltiplos AbortSignals.
 * O sinal resultante será cancelado se qualquer um dos sinais fornecidos for cancelado.
 */
interface CombinedSignalResult {
  signal: AbortSignal | undefined;
  cleanup?: () => void;
}

/**
 * Auxiliar para combinar múltiplos AbortSignals.
 * O sinal resultante será cancelado se qualquer um dos sinais fornecidos for cancelado.
 */
function combineSignals(...signals: Array<AbortSignal | undefined | null>): CombinedSignalResult {
  const activeSignals = signals.filter((s): s is AbortSignal => !!s);
  if (activeSignals.length === 0) return { signal: undefined };
  if (activeSignals.length === 1) return { signal: activeSignals[0] };

  const controller = new AbortController();
  const onAbort = () => {
    controller.abort();
    cleanup();
  };

  const cleanup = () => {
    for (const signal of activeSignals) {
      signal.removeEventListener('abort', onAbort);
    }
  };

  for (const signal of activeSignals) {
    if (signal.aborted) {
      controller.abort();
      cleanup();
      return { signal: controller.signal };
    }
    signal.addEventListener('abort', onAbort);
  }

  return { signal: controller.signal, cleanup };
}

/**
 * "Aquece" o servidor da API (Render free tier tem cold start de ~25s).
 * Dispara um ping fire-and-forget para o /api/health em paralelo ao login,
 * de forma que o servidor esteja acordado quando o fluxo de auth precisar dele.
 * Nunca lança erro — é apenas uma otimização de latência.
 */
export function warmUpApi(): Promise<void> {
  const base = BASE_URL.replace(/\/api\/v1\/?$/, '');
  return fetch(`${base}/api/health`, { method: 'GET' })
    .then(() => console.log('[AUTH_TRACE] warmUpApi: servidor acordado'))
    .catch((err) => console.warn('[AUTH_TRACE] warmUpApi falhou (ignorado):', err?.message || err));
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<ApiResponse<T>> {
  const { timeoutMs = 10_000, ...fetchOptions } = options;
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const isMe = endpoint.includes('/users/me');
  const isProvision = endpoint.includes('/onboarding/provision');

  if (isMe) {
    console.log(`[AUTH_TRACE] GET /users/me START (timeout: ${timeoutMs}ms)`);
  } else if (isProvision) {
    console.log(`[AUTH_TRACE] POST /onboarding/provision START (timeout: ${timeoutMs}ms)`);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  const sessionStart = performance.now();
  console.log('[AUTH_TRACE] getSession START');
  let session = null;

  try {
    // Timeout para obter a sessão para evitar deadlock antes do fetch de fato
    const sessionPromise = supabase.auth.getSession();
    const sessionRes = await withTimeout(
      sessionPromise,
      Math.min(5000, timeoutMs),
      'Erro ao obter sessão (Timeout)'
    );
    session = sessionRes.data.session;
    console.log(`[AUTH_TRACE] getSession END (${Math.round(performance.now() - sessionStart)}ms)`);
  } catch (err: any) {
    console.log(`[AUTH_TRACE] ERROR getSession (${Math.round(performance.now() - sessionStart)}ms):`, err.message || err);
    throw err;
  }

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Combina o signal recebido no options com o sinal de timeout local do apiClient
  const { signal: combinedSignal, cleanup: signalCleanup } = combineSignals(options.signal, controller.signal);

  const reqStart = performance.now();
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: combinedSignal,
    });

    clearTimeout(timeoutId);
    if (signalCleanup) signalCleanup();

    const reqMs = Math.round(performance.now() - reqStart);

    if (isMe) {
      console.log(`[AUTH_TRACE] GET /users/me END (${reqMs}ms)`);
    } else if (isProvision) {
      console.log(`[AUTH_TRACE] POST /onboarding/provision END (${reqMs}ms)`);
    }

    if (import.meta.env.DEV) {
      console.debug(`[AUTH_PERF] ${fetchOptions.method || 'GET'} ${endpoint}: ${reqMs}ms | status: ${response.status}`);
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorPayload = data as ApiErrorResponse;
      const msg = errorPayload.error?.message || 'Erro inesperado na comunicação com o servidor.';
      const code = errorPayload.error?.code || 'INTERNAL_ERROR';
      throw new ApiError(msg, code, response.status, errorPayload.error?.fieldErrors);
    }

    return data as ApiResponse<T>;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (signalCleanup) signalCleanup();

    const reqMs = Math.round(performance.now() - reqStart);

    if (isMe) {
      console.log(`[AUTH_TRACE] ERROR GET /users/me (${reqMs}ms):`, err.message || err);
    } else if (isProvision) {
      console.log(`[AUTH_TRACE] ERROR POST /onboarding/provision (${reqMs}ms):`, err.message || err);
    }

    if (err instanceof ApiError) throw err;
    if (err.name === 'AbortError') {
      if (import.meta.env.DEV) {
        console.warn(`[AUTH_PERF] TIMEOUT em ${reqMs}ms | endpoint: ${endpoint}`);
      }
      throw new ApiError(
        `Tempo limite excedido na resposta do servidor (${Math.round(timeoutMs / 1000)}s). Tente novamente.`,
        'REQUEST_TIMEOUT',
        408
      );
    }
    throw new ApiError(err.message || 'Erro de conexão com o servidor.', 'NETWORK_ERROR', 500);
  }
}
