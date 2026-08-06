/**
 * Feature flag de versão de UI.
 *
 * Configurar em .env.local:
 *   VITE_UI_VERSION=corporate-v1   → nova interface corporativa
 *   VITE_UI_VERSION=legacy         → interface atual (padrão)
 *
 * Regra: a condicional é centralizada no App.tsx.
 * Nunca espalhar `isCorpUI` diretamente nos componentes de leaf.
 */
export const UI_VERSION =
  import.meta.env.VITE_UI_VERSION?.trim() || 'legacy';

/** `true` quando a interface corporativa v1.1.0 está ativa. */
export const isCorporateUI = UI_VERSION === 'corporate-v1';
export const isCorpUI = isCorporateUI;
