import { describe, it, expect } from 'vitest';
import { buildApp } from '../../src/app';

describe('Testes de Integração de Rotas API (Fase 15B)', () => {
  it('deve responder status 200 na rota de healthcheck /health', async () => {
    const app = await buildApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/health',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.status).toBe('ok');
  });

  it('deve retornar 404 padronizado para rota inexistente', async () => {
    const app = await buildApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/rota-que-nao-existe',
    });

    expect(response.statusCode).toBe(404);
    const body = JSON.parse(response.body);
    expect(body.error.code).toBe('NOT_FOUND');
  });
});
