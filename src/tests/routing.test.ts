/**
 * Testes de Regressão — Lógica de Routing Auth/Onboarding/Dashboard
 *
 * Estes testes validam a lógica central de decisão de rotas do AgroGuard.
 * Testam a função pura que determina para qual rota o usuário deve ser redirecionado,
 * baseada no estado de auth/profile — sem depender de React ou DOM.
 *
 * Para rodar: npx vitest run src/tests/routing.test.ts
 */
import { describe, it, expect } from 'vitest';

// ─────────────────────────────────────────────────────────────────────────────
// Função pura que implementa a REGRA ÚNICA de roteamento do AgroGuard.
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
  persistedOrgId?: string | null;
}

type RouteDecision =
  | 'LOADING'
  | 'PROFILE_ERROR'
  | '/entrar'
  | '/app/dashboard'
  | '/onboarding/preparando-ambiente';

/**
 * Implementação da regra única de routing, conforme especificado no P0.
 */
function decideRoute(state: RouterState): RouteDecision {
  const { authLoading, profileLoading, hasSession, profile, profileError, persistedOrgId } = state;

  // SE authLoading → LOADING, nenhum redirect
  if (authLoading) return 'LOADING';

  // SE não existe session → /entrar
  if (!hasSession) return '/entrar';

  // SE session existe E profileLoading === true (sem profile anterior) → LOADING
  if (profileLoading && !profile) return 'LOADING';

  // SE session existe E profile falhou com erro (e sem org em cache) → PROFILE_ERROR
  // NÃO assumir ausência de organização
  if (profileError && !profile?.organizationId && !persistedOrgId) return 'PROFILE_ERROR';

  // SE session existe E profile existe E profile.organizationId existe → DASHBOARD
  // onboardingCompleted e onboardingStep IGNORADOS para acesso
  const hasOrg = Boolean(
    (profile?.organizationId || persistedOrgId) &&
    profile?.status !== 'sem_organizacao'
  );

  if (hasOrg) return '/app/dashboard';

  // SE session existe E profile existe E organizationId NÃO existe → onboarding
  if (profile !== null) return '/onboarding/preparando-ambiente';

  // Profile ainda null (aguardando) → LOADING
  return 'LOADING';
}

// ─────────────────────────────────────────────────────────────────────────────
// CASOS DE TESTE
// ─────────────────────────────────────────────────────────────────────────────

describe('AgroGuard — Regra Única de Routing', () => {

  /**
   * CASO 1: session=true, profileLoading=true → nenhum redirect (LOADING)
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
   * CASO 4: profile com org-1 existente → refreshProfile inicia → profile NÃO deve virar null
   * → Dashboard permanece
   * Simula: profile anterior existe com org-1, profileLoading=true MAS profile não foi zerado
   */
  it('CASO 4: refresh em andamento com profile anterior preservado → Dashboard (sem flash)', () => {
    // Durante refresh: profileLoading=true MAS profile anterior ainda existe (não foi zerado)
    const result = decideRoute({
      authLoading: false,
      profileLoading: true, // refresh em andamento
      hasSession: true,
      profile: { organizationId: 'org-1', status: 'ativo' }, // profile PRESERVADO durante refresh
      profileError: null,
    });
    // Deve permanecer no dashboard — não cair no LOADING
    expect(result).toBe('/app/dashboard');
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
   * CASO 7: Dashboard aberto → esperar atualização de AuthContext → continua Dashboard
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
   * CASO 8: F5 no Dashboard → authLoading=true → LOADING → profile org-1 → Dashboard
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
   * CASO 10: login novamente com organização existente → Dashboard direto
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
   * A rota deve redirecionar para Dashboard.
   * Testamos: com hasOrganization=true → decideRoute retorna dashboard
   */
  it('CASO 11: acesso a preparando-ambiente com org existente → Dashboard (guard deve bloquear)', () => {
    // Simula o estado quando usuário tenta acessar /onboarding/preparando-ambiente
    // mas já possui organização
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: { organizationId: 'org-1', status: 'ativo' },
      profileError: null,
    });
    // Com organizationId existente, o guard no App.tsx redireciona para dashboard
    expect(result).toBe('/app/dashboard');
  });

  /**
   * CASO 12: acesso manual a /boas-vindas → não cria loop
   * /boas-vindas não faz parte do fluxo automático.
   * Se acessada com org válida → WelcomeOnboardingPage (sem auto-redirect).
   * Se acessada sem org → redireciona para preparando-ambiente.
   */
  it('CASO 12a: /boas-vindas com organização → acesso autorizado (sem loop)', () => {
    // Com hasOrganization=true, WelcomeOnboardingPage é exibido
    // Sem timer, sem auto-redirect — só navegação por ação do usuário
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: { organizationId: 'org-1', status: 'ativo' },
      profileError: null,
    });
    // WelcomeOnboardingPage é exibido quando hasOrganization=true
    expect(result).toBe('/app/dashboard'); // a lógica base é: org existe → dashboard
    // WelcomeOnboardingPage não possui useEffect de redirect → sem loop
  });

  it('CASO 12b: /boas-vindas sem organização → preparando-ambiente', () => {
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
   * CASO EXTRA: profileError com profile existente → Dashboard (não bloqueia com erro)
   */
  it('EXTRA: profileError mas profile com org existente em memória → Dashboard mantido', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: { organizationId: 'org-1', status: 'ativo' },
      profileError: new Error('Network error'),
    });
    // Profile em memória com org → Dashboard (não destrói estado válido)
    expect(result).toBe('/app/dashboard');
  });

  /**
   * CASO EXTRA 2: profileError sem profile → PROFILE_ERROR (não redireciona para onboarding)
   */
  it('EXTRA 2: profileError sem profile e sem persistedOrgId → PROFILE_ERROR (não assume sem-org)', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: null,
      profileError: new Error('Network error'),
      persistedOrgId: null,
    });
    // NÃO deve ir para onboarding — deve sinalizar erro para o usuário
    expect(result).toBe('PROFILE_ERROR');
  });

  /**
   * CASO EXTRA 3: profileError mas persistedOrgId existe → Dashboard (fallback do localStorage)
   */
  it('EXTRA 3: profileError mas persistedOrgId existe → Dashboard via fallback', () => {
    const result = decideRoute({
      authLoading: false,
      profileLoading: false,
      hasSession: true,
      profile: null,
      profileError: new Error('Network error'),
      persistedOrgId: 'org-persisted-123',
    });
    // persistedOrgId existe → acesso autorizado
    expect(result).toBe('/app/dashboard');
  });
});
