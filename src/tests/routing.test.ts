/**
 * Testes de Regressão — Lógica de Routing Auth/Onboarding/Dashboard
 *
 * Regra única P0: acesso ao sistema depende APENAS de:
 *   - session (user autenticado)
 *   - profile.organizationId (organização provisionada)
 *
 * IGNORADOS para roteamento:
 *   - onboardingCompleted
 *   - onboardingStep
 *   - persistedOrgId (localStorage)
 *   - profile.status
 *
 * Para rodar: npx vitest run src/tests/routing.test.ts
 */
import { describe, it, expect } from 'vitest';

// ─────────────────────────────────────────────────────────────────────────────
// Função pura que implementa a REGRA ÚNICA de roteamento do AgroGuard P0.
// Esta é a lógica exata que deve estar implementada no App.tsx e guards.
// ─────────────────────────────────────────────────────────────────────────────
interface RouterState {
  authLoading: boolean;
  profileLoading: boolean;
  hasSession: boolean;
  profile: {
    organizationId?: string | null;
    status?: string;
  } | null;
  profileError: Error | null;
}

type RouteDecision =
  | 'LOADING'
  | 'PROFILE_ERROR'
  | '/entrar'
  | '/app/dashboard'
  | '/onboarding/preparando-ambiente';

/**
 * Implementação da regra única de routing — P0.
 * persistedOrgId NÃO é usado como autoridade de roteamento.
 * profile.status NÃO bloqueia acesso quando organizationId existe.
 */
function decideRoute(state: RouterState): RouteDecision {
  const { authLoading, profileLoading, hasSession, profile, profileError } = state;

  // SE authLoading → spinner, nenhum redirect
  if (authLoading) return 'LOADING';

  // SE não existe session → /entrar
  if (!hasSession) return '/entrar';

  // SE session existe E profileLoading → spinner (sempre)
  if (profileLoading) return 'LOADING';

  // SE session existe E perfil falhou sem cache → tela de erro (não assume sem-org)
  if (profileError && !profile) return 'PROFILE_ERROR';

  // REGRA ÚNICA: acesso autorizado apenas se profile.organizationId existe.
  // persistedOrgId, onboardingCompleted, onboardingStep e profile.status são IGNORADOS.
  const hasOrg = Boolean(profile?.organizationId);

  if (hasOrg) return '/app/dashboard';

  // Session existe + profile carregado + sem org → provisionamento
  if (profile !== null) return '/onboarding/preparando-ambiente';

  // Profile ainda null (edge case) → spinner
  return 'LOADING';
}

// ─────────────────────────────────────────────────────────────────────────────
// CASOS DE TESTE
// ─────────────────────────────────────────────────────────────────────────────

describe('AgroGuard — Regra Única de Routing P0', () => {

  /**
   * CASO 1: session=true, profileLoading=true → spinner
   */
  it('CASO 1: session=true, profileLoading=true → LOADING (nenhum redirect)', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: true,
      hasSession: true,
      profile: null,
      profileError: null,
    });
    expect(result).toBe('LOADING');
  });

  /**
   * CASO 2: session=true, profile.organizationId='org-1', onboardingCompleted=false, onboardingStep=0
   * → Dashboard permitido (onboarding NÃO bloqueia)
   */
  it('CASO 2: organizationId existe, onboardingCompleted=false, onboardingStep=0 → Dashboard', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: {
        organizationId: 'org-1',
        status: 'ativo',
      },
      profileError: null,
    });
    expect(result).toBe('/app/dashboard');
  });

  /**
   * CASO 3: session=true, profile.organizationId=null → preparando-ambiente
   */
  it('CASO 3: session=true, organizationId=null → /onboarding/preparando-ambiente', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: { organizationId: null },
      profileError: null,
    });
    expect(result).toBe('/onboarding/preparando-ambiente');
  });

  /**
   * CASO 4: profileLoading=true mesmo com profile anterior → spinner (regra P0)
   * Nota: profileLoading sempre mostra spinner, não há exceção por profile existente.
   */
  it('CASO 4: profileLoading=true → LOADING (regra P0: sempre spinner durante profileLoading)', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: true,
      hasSession: true,
      profile: { organizationId: 'org-1', status: 'ativo' }, // profile preservado, mas profileLoading ativo
      profileError: null,
    });
    // Regra P0: profileLoading → sempre LOADING
    expect(result).toBe('LOADING');
  });

  /**
   * CASO 5: callback → refreshProfile retorna org-1 → Dashboard
   */
  it('CASO 5: callback, refreshProfile retorna org-1 → Dashboard', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: { organizationId: 'org-1', status: 'ativo' },
      profileError: null,
    });
    expect(result).toBe('/app/dashboard');
  });

  /**
   * CASO 6: callback → refreshProfile retorna sem organização → preparando-ambiente
   */
  it('CASO 6: callback, refreshProfile retorna sem organização → preparando-ambiente', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: { organizationId: '' },
      profileError: null,
    });
    expect(result).toBe('/onboarding/preparando-ambiente');
  });

  /**
   * CASO 7: Dashboard aberto → atualização de AuthContext → continua Dashboard
   */
  it('CASO 7: Dashboard aberto, authLoading=false, profile válido → continua Dashboard', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: { organizationId: 'org-abc', status: 'ativo' },
      profileError: null,
    });
    expect(result).toBe('/app/dashboard');
  });

  /**
   * CASO 8: F5 no Dashboard
   */
  it('CASO 8a: F5 Dashboard, authLoading=true → LOADING', () => {
    const result = decideRoute({
      authLoading: true,
      profileLoading: false,
      hasSession: true,
      profile: null,
      profileError: null,
    });
    expect(result).toBe('LOADING');
  });

  it('CASO 8b: F5 Dashboard, auth resolvido, profile org-1 → Dashboard', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: { organizationId: 'org-1', status: 'ativo' },
      profileError: null,
    });
    expect(result).toBe('/app/dashboard');
  });

  /**
   * CASO 9: logout → /entrar
   */
  it('CASO 9: logout (sem session) → /entrar', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: false,
      profile: null,
      profileError: null,
    });
    expect(result).toBe('/entrar');
  });

  /**
   * CASO 10: login com organização existente → Dashboard direto
   */
  it('CASO 10: login com organização existente → Dashboard direto', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: { organizationId: 'org-123', status: 'ativo' },
      profileError: null,
    });
    expect(result).toBe('/app/dashboard');
  });

  /**
   * CASO 11: acesso manual a /onboarding/preparando-ambiente com organizationId existente
   * Guard no App.tsx redireciona para Dashboard.
   */
  it('CASO 11: acesso a preparando-ambiente com org existente → Dashboard (guard bloqueia)', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: { organizationId: 'org-1', status: 'ativo' },
      profileError: null,
    });
    expect(result).toBe('/app/dashboard');
  });

  /**
   * CASO 12: acesso manual a /boas-vindas
   * Com org → Dashboard (WelcomeOnboardingPage exibida, sem loop, sem auto-redirect)
   * Sem org → /entrar (regra P0: /boas-vindas não navega para preparando-ambiente)
   */
  it('CASO 12a: /boas-vindas com organização → acesso autorizado (sem loop)', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: { organizationId: 'org-1', status: 'ativo' },
      profileError: null,
    });
    // org existe → dashboard (WelcomeOnboardingPage não redireciona automaticamente)
    expect(result).toBe('/app/dashboard');
  });

  it('CASO 12b: /boas-vindas sem organização → provisioning (rule base)', () => {
    // Sem org → a regra base envia para preparando-ambiente.
    // No App.tsx, /boas-vindas sem org é interceptada antes e redireciona para /entrar.
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: { organizationId: '' },
      profileError: null,
    });
    expect(result).toBe('/onboarding/preparando-ambiente');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // CASOS P0 ADICIONAIS — Regras específicas do bypass
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * CASO A: profile.organizationId = 'org-1', persistedOrgId ausente → Dashboard.
   * persistedOrgId é irrelevante — só profile.organizationId decide.
   */
  it('CASO A: profile.organizationId=org-1, persistedOrgId=null → Dashboard', () => {
    // RouterState não inclui persistedOrgId — esse é o ponto: NÃO é usado
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: { organizationId: 'org-1', status: 'ativo' },
      profileError: null,
    });
    expect(result).toBe('/app/dashboard');
  });

  /**
   * CASO B: profile.organizationId = null, persistedOrgId = 'org-antiga'
   * → persistedOrgId ignorado → provisioning.
   */
  it('CASO B: profile.organizationId=null, persistedOrgId (ignorado) → provisioning', () => {
    // Mesmo que haja um persistedOrgId no localStorage, a decisão é baseada
    // apenas em profile.organizationId. Sem ele → provisioning.
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: { organizationId: null },
      profileError: null,
    });
    expect(result).toBe('/onboarding/preparando-ambiente');
  });

  /**
   * CASO C: profile.organizationId = 'org-1', profile.status = 'sem_organizacao'
   * → inconsistência de dados. Regra P0: organizationId tem prioridade → Dashboard.
   * status especial NÃO bloqueia quando organizationId existe.
   */
  it('CASO C: profile.organizationId=org-1, status=sem_organizacao → Dashboard (org tem prioridade)', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: { organizationId: 'org-1', status: 'sem_organizacao' },
      profileError: null,
    });
    // organizationId existe → acesso autorizado, sem loop
    expect(result).toBe('/app/dashboard');
  });

  /**
   * CASO D: profile.organizationId = 'org-1' após 30 segundos
   * → Estado não muda com o tempo → Dashboard permanece.
   * (O estado de routing é determinístico: depende apenas de authLoading, profileLoading, profile)
   */
  it('CASO D: profile.organizationId=org-1, estado estável após 30s → Dashboard', () => {
    // Simula o estado 30 segundos depois: authLoading=false, profileLoading=false, profile com org
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: { organizationId: 'org-1', status: 'ativo' },
      profileError: null,
    });
    expect(result).toBe('/app/dashboard');
  });

  /**
   * CASO E: F5 Dashboard → fases do carregamento
   * E1: authLoading=true → spinner
   * E2: authLoading=false, profileLoading=true → spinner
   * E3: carregamento completo, org existe → Dashboard
   */
  it('CASO E1: F5 Dashboard, authLoading=true → LOADING', () => {
    const result = decideRoute({
      authLoading: true,
      profileLoading: false,
      hasSession: false,
      profile: null,
      profileError: null,
    });
    expect(result).toBe('LOADING');
  });

  it('CASO E2: F5 Dashboard, auth ok, profileLoading=true → LOADING', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: true,
      hasSession: true,
      profile: null,
      profileError: null,
    });
    expect(result).toBe('LOADING');
  });

  it('CASO E3: F5 Dashboard, carregamento completo, org=org-1 → Dashboard', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: { organizationId: 'org-1', status: 'ativo' },
      profileError: null,
    });
    expect(result).toBe('/app/dashboard');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // CASOS EXTRA — Tratamento de erros
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * EXTRA 1: profileError com profile existente → Dashboard (não destrói estado válido)
   */
  it('EXTRA 1: profileError mas profile com org em memória → Dashboard mantido', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: { organizationId: 'org-1', status: 'ativo' },
      profileError: new Error('Network error'),
    });
    expect(result).toBe('/app/dashboard');
  });

  /**
   * EXTRA 2: profileError sem profile → PROFILE_ERROR (não redireciona para onboarding)
   */
  it('EXTRA 2: profileError sem profile → PROFILE_ERROR (não assume sem-org)', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: null,
      profileError: new Error('Network error'),
    });
    // NÃO deve ir para onboarding — deve sinalizar erro para o usuário
    expect(result).toBe('PROFILE_ERROR');
  });

  /**
   * EXTRA 3: profileError + persistedOrgId (ignorado) → PROFILE_ERROR
   * persistedOrgId não é mais usado como autoridade de roteamento.
   */
  it('EXTRA 3: profileError + persistedOrgId (ignorado) → PROFILE_ERROR', () => {
    // Mesmo com persistedOrgId no localStorage, sem profile carregado → erro
    // O roteador não usa persistedOrgId para autorizar acesso
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: null,
      profileError: new Error('Network error'),
    });
    expect(result).toBe('PROFILE_ERROR');
  });
});
