import type { ApiResponse, ApiErrorResponse } from './api-types';
import { supabase } from '../supabase/supabase-client';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333/api/v1';

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

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<ApiResponse<T>> {
  const { timeoutMs = 10_000, ...fetchOptions } = options;
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  const sessionStart = performance.now();
  const { data: { session } } = await supabase.auth.getSession();
  const sessionMs = Math.round(performance.now() - sessionStart);

  if (import.meta.env.DEV) {
    console.debug(`[AUTH_PERF] getSession: ${sessionMs}ms | endpoint: ${endpoint}`);
  }

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const reqStart = performance.now();
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: fetchOptions.signal || controller.signal,
    });

    clearTimeout(timeoutId);
    const reqMs = Math.round(performance.now() - reqStart);

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
    const reqMs = Math.round(performance.now() - reqStart);

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
