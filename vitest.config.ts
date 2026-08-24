/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

/**
 * Configuração dedicada do Vitest para testes de lógica pura do frontend.
 * Separada do vite.config.ts para não causar conflitos de tipo.
 */
export default defineConfig({
  test: {
    // Testes de lógica pura (routing, regras de negócio) — sem DOM
    environment: 'node',
    include: ['src/tests/**/*.test.ts'],
  },
});
