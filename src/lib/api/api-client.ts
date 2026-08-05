import type { ApiResponse, ApiErrorResponse } from './api-types';

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

  // Injeção do Ator Mockado Provisório em ambiente de desenvolvimento
  if (import.meta.env.DEV) {
    headers['X-Mock-User-Id'] = 'e5eebc99-9c0b-4ef8-bb6d-6bb9bd380bb1';
    headers['X-Mock-Organization-Id'] = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorPayload = data as ApiErrorResponse;
    const msg = errorPayload.error?.message || 'Erro inesperado na comunicação com o servidor.';
    const code = errorPayload.error?.code || 'INTERNAL_ERROR';
    throw new ApiError(msg, code, response.status, errorPayload.error?.fieldErrors);
  }

  return data as ApiResponse<T>;
}
