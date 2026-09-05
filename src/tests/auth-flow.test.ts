import { describe, it, expect } from 'vitest';

// Classe ApiError mockada para simular o comportamento real do frontend
class ApiError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

// Simulador do estado global da aplicação e do fluxo de callback/onboarding
class AuthFlowSimulator {
  public session = false;
  public user: { id: string; email: string } | null = null;
  public profile: any = null;
  public authLoading = false;
  public profileLoading = false;
  public profileError: any = null;

  // Rota ativa
  public currentPath = '';

  // Refs
  public navigatedRef = false;
  public processingRef = false;
  public provisioningAttempted = false;

  // Status UI
  public statusText = '';
  public uiError: string | null = null;
  public uiSpinner = false;

  // Contadores de rede para verificar concorrência
  public usersMeCalls = 0;
  public provisionCalls = 0;
  public pendingOnboarding = false;

  // Configuração de Mocks de endpoints
  public mockUsersMeResponse: () => Promise<any> = async () => ({ id: 'usr-1', organizationId: 'org-1' });
  public mockProvisionResponse: () => Promise<any> = async () => ({ organizationId: 'org-1' });

  // Suporte a AbortController e timeouts de teste
  public abortController = new AbortController();
  public unmounted = false;
  public activeFetchPromise: Promise<any> | null = null;

  public navigate(path: string, options?: { replace?: boolean }) {
    this.currentPath = path;
    if (options?.replace) {
      this.navigatedRef = true;
    }
  }

  // Simulação de apiClient com timeout
  public async apiClient(endpoint: string, options: { method?: string; body?: string; signal?: AbortSignal } = {}) {
    if (endpoint === '/users/me') {
      this.usersMeCalls++;
      if (options.signal) {
        return new Promise<any>((resolve, reject) => {
          const onAbort = () => reject(new ApiError('Requisição abortada pelo usuário.', 'ABORT_ERROR', 0));
          if (options.signal?.aborted) return onAbort();
          options.signal?.addEventListener('abort', onAbort);
          this.mockUsersMeResponse().then(
            (val) => { options.signal?.removeEventListener('abort', onAbort); resolve(val); },
            (err) => { options.signal?.removeEventListener('abort', onAbort); reject(err); }
          );
        });
      }
      return await this.mockUsersMeResponse();
    }
    if (endpoint === '/onboarding/provision') {
      this.provisionCalls++;
      if (options.signal) {
        return new Promise<any>((resolve, reject) => {
          const onAbort = () => reject(new ApiError('Requisição abortada pelo usuário.', 'ABORT_ERROR', 0));
          if (options.signal?.aborted) return onAbort();
          options.signal?.addEventListener('abort', onAbort);
          this.mockProvisionResponse().then(
            (val) => { options.signal?.removeEventListener('abort', onAbort); resolve(val); },
            (err) => { options.signal?.removeEventListener('abort', onAbort); reject(err); }
          );
        });
      }
      return await this.mockProvisionResponse();
    }
    throw new Error('Not found');
  }

  // Simulação de fetchUserProfile da AuthContext
  public async fetchUserProfile(options: { signal?: AbortSignal } = {}) {
    // Simula Promise compartilhada (activeFetchPromise)
    if (this.activeFetchPromise) {
      const signal = options.signal;
      if (signal) {
        return new Promise<any>((resolve, reject) => {
          const onAbort = () => reject(new ApiError('Requisição abortada pelo usuário.', 'ABORT_ERROR', 0));
          if (signal.aborted) return onAbort();
          signal.addEventListener('abort', onAbort);
          this.activeFetchPromise!.then(
            (val) => { signal.removeEventListener('abort', onAbort); resolve(val); },
            (err) => { signal.removeEventListener('abort', onAbort); reject(err); }
          );
        });
      }
      return this.activeFetchPromise;
    }

    const runFetch = async () => {
      this.profileLoading = true;
      try {
        const data = await this.apiClient('/users/me', options);
        this.profile = data;
        this.profileError = null;
        return data;
      } catch (err: any) {
        const isNotProvisioned = err?.code === 'PROFILE_NOT_PROVISIONED';
        this.profile = {
          id: this.user?.id || '',
          organizationId: '',
          status: isNotProvisioned ? 'sem_organizacao' : 'erro',
        };
        if (isNotProvisioned) {
          this.profileError = null;
        } else {
          this.profileError = err;
        }
        throw err;
      } finally {
        this.profileLoading = false;
      }
    };

    this.activeFetchPromise = runFetch();
    try {
      return await this.activeFetchPromise;
    } finally {
      this.activeFetchPromise = null;
    }
  }

  // Simulação de processAuthCallback no AuthCallbackPage (versão com suporte a timeout absoluto)
  public async triggerAuthCallback(options: { timeoutMs?: number } = {}) {
    this.uiSpinner = true;
    this.uiError = null;
    this.statusText = 'Sincronizando seu perfil...';

    if (this.processingRef) return;
    this.processingRef = true;

    const signal = this.abortController.signal;
    const timeoutMs = options.timeoutMs || 30000;

    const safetyTimer = setTimeout(() => {
      this.abortController.abort();
      this.uiError = 'Não foi possível concluir a configuração da sua conta. (TIMEOUT)';
      this.uiSpinner = false;
    }, timeoutMs);

    try {
      let updatedProfile;
      // Espelha o comportamento do AuthCallbackPage: retentativas automáticas
      // para falhas TRANSITÓRIAS, para QUALQUER usuário (até 3 tentativas).
      const MAX_PROFILE_ATTEMPTS = 3;
      let lastError: any = null;
      let profileLoaded = false;

      for (let attemptIndex = 1; attemptIndex <= MAX_PROFILE_ATTEMPTS; attemptIndex++) {
        if (signal.aborted) break;
        try {
          updatedProfile = await this.fetchUserProfile({ signal });
          profileLoaded = true;
          break;
        } catch (attemptError: any) {
          lastError = attemptError;
          const isTransient = attemptError?.code === 'REQUEST_TIMEOUT' || attemptError?.code === 'NETWORK_ERROR' || [502, 503, 504, 408].includes(attemptError?.statusCode);
          const nonRetryable = [400, 401, 403, 422].includes(attemptError?.statusCode);
          const canRetry = isTransient && !nonRetryable && attemptIndex < MAX_PROFILE_ATTEMPTS;
          if (!canRetry || signal.aborted) throw attemptError;
          this.statusText = 'Finalizando a preparação do seu ambiente...';
        }
      }
      if (!profileLoaded) {
        throw lastError ?? new Error('TIMEOUT');
      }

      if (signal.aborted || this.unmounted) {
        this.uiSpinner = false;
        return;
      }

      clearTimeout(safetyTimer);
      this.uiSpinner = false;

      const destination = updatedProfile?.organizationId
        ? '/app/dashboard'
        : '/onboarding/preparando-ambiente';

      this.navigate(destination, { replace: true });
    } catch (err: any) {
      if (signal.aborted || this.unmounted) {
        this.uiSpinner = false;
        return;
      }

      clearTimeout(safetyTimer);
      this.uiSpinner = false;
      if (err?.code === 'PROFILE_NOT_PROVISIONED') {
        this.navigate('/onboarding/preparando-ambiente', { replace: true });
      } else {
        this.uiError = err.message || 'Falha ao sincronizar perfil.';
      }
    } finally {
      this.processingRef = false;
    }
  }

  // Simulação de autoProvision no PreparingEnvironmentPage
  public async triggerAutoProvision(options: { signal?: AbortSignal } = {}) {
    if (this.processingRef) return;
    this.processingRef = true;
    this.uiSpinner = true;
    this.uiError = null;
    this.statusText = 'Preparando o ambiente...';

    try {
      const provisionData = await this.apiClient('/onboarding/provision', { method: 'POST', signal: options.signal });

      // Simula a atualização do perfil após o provisionamento
      this.mockUsersMeResponse = async () => ({
        id: this.user?.id || 'usr-1',
        organizationId: provisionData.organizationId,
      });

      const updatedProfile = await this.fetchUserProfile(options);

      if (options.signal?.aborted || this.unmounted) {
        this.uiSpinner = false;
        return;
      }

      this.uiSpinner = false;
      if (updatedProfile?.organizationId) {
        this.navigate('/app/dashboard', { replace: true });
      } else {
        this.uiError = 'Não foi possível confirmar o ambiente.';
      }
    } catch (err: any) {
      if (options.signal?.aborted || this.unmounted) {
        this.uiSpinner = false;
        return;
      }
      this.uiError = err.message || 'Erro ao provisionar.';
      this.uiSpinner = false;
    } finally {
      this.processingRef = false;
    }
  }
}

describe('AgroGuard — Fluxo Completo de Autenticação e Onboarding (Cenários A-G)', () => {

  it('Cenário A: Usuário existe no Auth mas não no banco local -> redireciona para o preparando-ambiente', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.user = { id: 'auth-123', email: 'novo@agroguard.com' };

    // /users/me retorna 404 PROFILE_NOT_PROVISIONED
    sim.mockUsersMeResponse = async () => {
      throw new ApiError('Perfil não provisionado.', 'PROFILE_NOT_PROVISIONED', 404);
    };

    await sim.triggerAuthCallback();

    // Deve redirecionar para a preparação de ambiente
    expect(sim.currentPath).toBe('/onboarding/preparando-ambiente');
    expect(sim.profileError).toBeNull(); // Não deve definir erro para novo usuário
    expect(sim.profile.organizationId).toBe('');
  });

  it('Cenário B: Provisionamento completa -> atualiza perfil -> Dashboard', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.user = { id: 'auth-123', email: 'novo@agroguard.com' };
    sim.currentPath = '/onboarding/preparando-ambiente';

    // Provisionamento retorna sucesso com o novo ID
    sim.mockProvisionResponse = async () => ({ organizationId: 'org-criada-999' });

    await sim.triggerAutoProvision();

    // Deve ir para o Dashboard
    expect(sim.currentPath).toBe('/app/dashboard');
    expect(sim.uiError).toBeNull();
    expect(sim.profile.organizationId).toBe('org-criada-999');
  });

  it('Cenário P0-A: primeira chamada fria falha, retry único responde -> Dashboard sem erro intermediário', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.pendingOnboarding = true;
    sim.user = { id: 'auth-new', email: 'novo@agroguard.com' };
    let calls = 0;
    sim.mockUsersMeResponse = async () => {
      calls += 1;
      if (calls === 1) throw new ApiError('Tempo limite excedido.', 'REQUEST_TIMEOUT', 408);
      return { id: 'usr-new', organizationId: 'org-new' };
    };

    await sim.triggerAuthCallback();

    expect(sim.usersMeCalls).toBe(2);
    expect(sim.currentPath).toBe('/app/dashboard');
    expect(sim.uiError).toBeNull();
    expect(sim.statusText).toBe('Finalizando a preparação do seu ambiente...');
  });

  it('Cenário P0-B: primeira e segunda chamadas falham -> erro persistente após retry', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.pendingOnboarding = true;
    sim.user = { id: 'auth-new', email: 'novo@agroguard.com' };
    sim.mockUsersMeResponse = async () => {
      throw new ApiError('Tempo limite excedido.', 'REQUEST_TIMEOUT', 408);
    };

    await sim.triggerAuthCallback();

    expect(sim.usersMeCalls).toBe(3);
    expect(sim.uiError).toBe('Tempo limite excedido.');
    expect(sim.currentPath).toBe('');
  });

  it('Cenário P0-C: usuário existente TAMBÉM faz retry em falha transitória (cold start)', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.user = { id: 'auth-existing', email: 'existente@agroguard.com' };
    sim.mockUsersMeResponse = async () => {
      throw new ApiError('Tempo limite excedido.', 'REQUEST_TIMEOUT', 408);
    };

    await sim.triggerAuthCallback();

    expect(sim.usersMeCalls).toBe(3);
    expect(sim.uiError).toBe('Tempo limite excedido.');
  });

  it('Cenário P0-D: 401 nunca faz retry mesmo em cadastro', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.pendingOnboarding = true;
    sim.user = { id: 'auth-new', email: 'novo@agroguard.com' };
    sim.mockUsersMeResponse = async () => {
      throw new ApiError('Não autorizado.', 'UNAUTHORIZED', 401);
    };

    await sim.triggerAuthCallback();

    expect(sim.usersMeCalls).toBe(1);
    expect(sim.uiError).toBe('Não autorizado.');
  });

  it('Cenário C: /users/me demora além do timeout -> erro visível -> spinner termina', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.user = { id: 'auth-123', email: 'teste@agroguard.com' };

    // /users/me simula timeout de rede
    sim.mockUsersMeResponse = async () => {
      throw new ApiError('Tempo limite excedido.', 'REQUEST_TIMEOUT', 408);
    };

    await sim.triggerAuthCallback();

    // Deve encerrar o spinner e exibir a mensagem de erro (após esgotar as retentativas)
    expect(sim.uiSpinner).toBe(false);
    expect(sim.uiError).toBe('Tempo limite excedido.');
    expect(sim.currentPath).toBe(''); // Não navega
  });

  it('Cenário D: /onboarding/provision demora além do timeout -> erro visível -> spinner termina', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.user = { id: 'auth-123', email: 'teste@agroguard.com' };
    sim.currentPath = '/onboarding/preparando-ambiente';

    // provision simula timeout de rede
    sim.mockProvisionResponse = async () => {
      throw new ApiError('Tempo limite excedido no provisionamento.', 'REQUEST_TIMEOUT', 408);
    };

    await sim.triggerAutoProvision();

    // Deve encerrar o spinner e exibir a mensagem de erro
    expect(sim.uiSpinner).toBe(false);
    expect(sim.uiError).toBe('Tempo limite excedido no provisionamento.');
    expect(sim.currentPath).toBe('/onboarding/preparando-ambiente'); // Não navega
  });

  it('Cenário E: duplo onAuthStateChange/callback -> somente um provisionamento ou fetch ativo', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.user = { id: 'auth-123', email: 'novo@agroguard.com' };

    // Simula duas chamadas quase simultâneas disparadas
    const p1 = sim.triggerAuthCallback();
    const p2 = sim.triggerAuthCallback();

    await Promise.all([p1, p2]);

    // Deve ter chamado o endpoint /users/me apenas 1 vez devido ao guard processingRef
    expect(sim.usersMeCalls).toBe(1);
  });

  it('Cenário F: profile já existe com organizationId -> nenhum provisioning -> Dashboard', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.user = { id: 'auth-777', email: 'existente@agroguard.com' };
    sim.mockUsersMeResponse = async () => ({ id: 'usr-777', organizationId: 'org-ja-existe' });

    await sim.triggerAuthCallback();

    // Deve navegar direto pro Dashboard
    expect(sim.currentPath).toBe('/app/dashboard');
    expect(sim.uiError).toBeNull();
    expect(sim.provisionCalls).toBe(0); // Nenhum provisionamento chamado
  });

  it('Cenário G: perfil parcialmente apagado (sem organizationId) -> resposta controlada, redireciona', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.user = { id: 'auth-999', email: 'apagado@agroguard.com' };

    // Usuário existe na tabela User, mas não tem memberships
    sim.mockUsersMeResponse = async () => ({
      id: 'usr-999',
      organizationId: '',
      status: 'sem_organizacao',
    });

    await sim.triggerAuthCallback();

    // Deve identificar como sem organização e redirecionar para a preparação
    expect(sim.currentPath).toBe('/onboarding/preparando-ambiente');
    expect(sim.uiError).toBeNull();
  });

  it('Cenário C-Extra: profile fetch 404 (PROFILE_NOT_PROVISIONED) -> profileLoading é resetado para false', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.user = { id: 'auth-123', email: 'novo@agroguard.com' };

    sim.mockUsersMeResponse = async () => {
      throw new ApiError('Perfil não provisionado.', 'PROFILE_NOT_PROVISIONED', 404);
    };

    try {
      await sim.fetchUserProfile();
    } catch (err) {
      // espera erro
    }

    expect(sim.profileLoading).toBe(false);
  });

  it('Cenário D-Extra: profile fetch timeout -> profileLoading é resetado para false', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.user = { id: 'auth-123', email: 'teste@agroguard.com' };

    sim.mockUsersMeResponse = async () => {
      throw new ApiError('Tempo limite excedido.', 'REQUEST_TIMEOUT', 408);
    };

    try {
      await sim.fetchUserProfile();
    } catch (err) {
      // espera erro
    }

    expect(sim.profileLoading).toBe(false);
  });

  it('Cenário E-Extra: profile fetch AbortError -> profileLoading é resetado para false', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.user = { id: 'auth-123', email: 'teste@agroguard.com' };

    sim.mockUsersMeResponse = async () => {
      throw new ApiError('Requisição abortada pelo usuário.', 'ABORT_ERROR', 0);
    };

    try {
      await sim.fetchUserProfile();
    } catch (err) {
      // espera erro
    }

    expect(sim.profileLoading).toBe(false);
  });

  it('Cenário F-Extra: isFetchingProfile/processingRef concorrência destrava após falha de rede', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.user = { id: 'auth-123', email: 'teste@agroguard.com' };

    sim.mockUsersMeResponse = async () => {
      throw new ApiError('Falha de rede.', 'NETWORK_ERROR', 500);
    };

    // Chamada falha
    await sim.triggerAuthCallback();
    expect(sim.processingRef).toBe(false); // destrava processamento
    expect(sim.uiSpinner).toBe(false);
    expect(sim.uiError).toBe('Falha de rede.');

    // Agora re-tentamos após o servidor voltar e deve funcionar
    sim.mockUsersMeResponse = async () => ({ id: 'usr-1', organizationId: 'org-ok' });
    await sim.triggerAuthCallback();

    expect(sim.currentPath).toBe('/app/dashboard');
    expect(sim.uiError).toBeNull();
  });

  it('Cenário G-Extra: GET /users/me nunca resolve -> timeout simulado -> sai do spinner', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.user = { id: 'auth-123', email: 'novo@agroguard.com' };

    // /users/me nunca resolve (retorna Promise pendente perpétua)
    sim.mockUsersMeResponse = () => new Promise(() => {});

    // Dispara o callback com timeout rápido de 30ms para fins de teste unitário
    await sim.triggerAuthCallback({ timeoutMs: 30 });

    // Deve sair do spinner e indicar erro de timeout
    expect(sim.uiSpinner).toBe(false);
    expect(sim.uiError).toContain('Não foi possível concluir a configuração da sua conta. (TIMEOUT)');
    expect(sim.currentPath).toBe(''); // Não navega
  });

  it('Cenário H-Extra: POST /onboarding/provision nunca resolve -> timeout simulado -> sai do spinner', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.user = { id: 'auth-123', email: 'novo@agroguard.com' };

    // provision nunca resolve
    sim.mockProvisionResponse = () => new Promise(() => {});

    // Dispara o autoProvision com sinal associado ao timeout
    const controller = new AbortController();
    const safetyTimer = setTimeout(() => controller.abort(), 30);

    try {
      await sim.triggerAutoProvision({ signal: controller.signal });
    } catch (e) {
      // espera erro de abort
    }

    clearTimeout(safetyTimer);

    // Deve encerrar o spinner e não ter navegado
    expect(sim.uiSpinner).toBe(false);
    expect(sim.currentPath).toBe('');
  });

  it('Cenário I-Extra: activeFetchPromise nunca resolve -> timeout simulado -> sai do spinner', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.user = { id: 'auth-123', email: 'novo@agroguard.com' };

    // Simula a promise compartilhada de fetch já travada em andamento
    sim.activeFetchPromise = new Promise(() => {});

    // Dispara o callback
    await sim.triggerAuthCallback({ timeoutMs: 30 });

    // Deve encerrar o spinner com timeout
    expect(sim.uiSpinner).toBe(false);
    expect(sim.uiError).toContain('Não foi possível concluir a configuração da sua conta. (TIMEOUT)');
  });

  it('Cenário J-Extra: resposta tardia do backend (após timeout) -> não navega para dashboard', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.user = { id: 'auth-123', email: 'novo@agroguard.com' };

    let resolveUsersMe: any;
    sim.mockUsersMeResponse = () => new Promise((resolve) => {
      resolveUsersMe = resolve;
    });

    // Inicia fluxo com timeout curto de 20ms
    const flowPromise = sim.triggerAuthCallback({ timeoutMs: 20 });

    // Aguarda o timeout disparar
    await new Promise((r) => setTimeout(r, 40));
    await flowPromise;

    expect(sim.uiError).toContain('Não foi possível concluir a configuração da sua conta. (TIMEOUT)');
    expect(sim.currentPath).toBe(''); // Timeout aconteceu, não navegou

    // Resposta tardia resolve agora
    resolveUsersMe({ id: 'usr-1', organizationId: 'org-tardia' });

    // Aguarda microtasks
    await new Promise((r) => setTimeout(r, 10));

    // Mesmo com a resposta resolvendo depois, não pode navegar para o dashboard!
    expect(sim.currentPath).toBe('');
  });

  it('Cenário K-Extra: componente desmonta -> nenhuma promise tardia altera estado/navegação', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.user = { id: 'auth-123', email: 'novo@agroguard.com' };

    let resolveUsersMe: any;
    sim.mockUsersMeResponse = () => new Promise((resolve) => {
      resolveUsersMe = resolve;
    });

    // Inicia fluxo
    const flowPromise = sim.triggerAuthCallback({ timeoutMs: 1000 });

    // Simula desmontagem do componente imediatamente
    sim.unmounted = true;
    sim.abortController.abort();

    // Resposta tardia chega
    resolveUsersMe({ id: 'usr-1', organizationId: 'org-ok' });

    await flowPromise;

    // Não deve ter navegado nem modificado UI
    expect(sim.currentPath).toBe('');
  });
});
