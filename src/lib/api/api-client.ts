import type { ApiResponse, ApiErrorResponse } from './api-types';
import { supabase } from '../supabase/supabase-client';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333/api/v1';

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

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const { data: { session } } = await supabase.auth.getSession();
  console.log(`[apiClient] Requisição para ${url}. Sessão ativa: ${!!session}. Token presente: ${!!session?.access_token}`);
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });

    clearTimeout(timeoutId);

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
    if (err instanceof ApiError) throw err;
    if (err.name === 'AbortError') {
      throw new ApiError('Tempo limite excedido na resposta do servidor. Tente novamente.', 'REQUEST_TIMEOUT', 408);
    }
    throw new ApiError(err.message || 'Erro de conexão com o servidor.', 'NETWORK_ERROR', 500);
  }
}
