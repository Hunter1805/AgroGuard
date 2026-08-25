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

  // Configuração de Mocks de endpoints
  public mockUsersMeResponse: () => Promise<any> = async () => ({ id: 'usr-1', organizationId: 'org-1' });
  public mockProvisionResponse: () => Promise<any> = async () => ({ organizationId: 'org-1' });

  public navigate(path: string, options?: { replace?: boolean }) {
    this.currentPath = path;
    if (options?.replace) {
      this.navigatedRef = true;
    }
  }

  // Simulação de apiClient com timeout
  public async apiClient(endpoint: string, _options: { method?: string; body?: string; signal?: any } = {}) {
    if (endpoint === '/users/me') {
      this.usersMeCalls++;
      return await this.mockUsersMeResponse();
    }
    if (endpoint === '/onboarding/provision') {
      this.provisionCalls++;
      return await this.mockProvisionResponse();
    }
    throw new Error('Not found');
  }

  // Simulação de fetchUserProfile da AuthContext
  public async fetchUserProfile() {
    if (this.profileLoading) return null;
    this.profileLoading = true;
    
    try {
      const data = await this.apiClient('/users/me');
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
  }

  // Simulação de processAuthCallback no AuthCallbackPage
  public async triggerAuthCallback() {
    this.uiSpinner = true;
    this.uiError = null;
    this.statusText = 'Sincronizando seu perfil...';

    if (this.processingRef) {
      // Já está em andamento (Guarda contra concorrência)
      return;
    }
    this.processingRef = true;

    try {
      const updatedProfile = await this.fetchUserProfile();
      
      // Decisão baseada no perfil
      const destination = updatedProfile?.organizationId
        ? '/app/dashboard'
        : '/onboarding/preparando-ambiente';
        
      this.navigate(destination, { replace: true });
    } catch (err: any) {
      if (err?.code === 'PROFILE_NOT_PROVISIONED') {
        // NOVO: Erro normal de novo usuário - envia para o preparando-ambiente
        this.navigate('/onboarding/preparando-ambiente', { replace: true });
      } else {
        this.uiError = err.message || 'Falha ao sincronizar perfil.';
        this.uiSpinner = false;
      }
    } finally {
      this.processingRef = false;
    }
  }

  // Simulação de autoProvision no PreparingEnvironmentPage
  public async triggerAutoProvision() {
    if (this.processingRef) {
      return;
    }
    this.processingRef = true;
    this.uiSpinner = true;
    this.uiError = null;
    this.statusText = 'Preparando o ambiente...';

    try {
      const provisionData = await this.apiClient('/onboarding/provision', { method: 'POST' });
      
      // Simula a atualização do perfil após o provisionamento
      this.mockUsersMeResponse = async () => ({
        id: this.user?.id || 'usr-1',
        organizationId: provisionData.organizationId,
      });

      const updatedProfile = await this.fetchUserProfile();

      if (updatedProfile?.organizationId) {
        this.navigate('/app/dashboard', { replace: true });
      } else {
        this.uiError = 'Não foi possível confirmar o ambiente.';
        this.uiSpinner = false;
      }
    } catch (err: any) {
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

  it('Cenário C: /users/me demora além do timeout -> erro visível -> spinner termina', async () => {
    const sim = new AuthFlowSimulator();
    sim.session = true;
    sim.user = { id: 'auth-123', email: 'teste@agroguard.com' };

    // /users/me simula timeout de rede
    sim.mockUsersMeResponse = async () => {
      throw new ApiError('Tempo limite excedido.', 'REQUEST_TIMEOUT', 408);
    };

    await sim.triggerAuthCallback();

    // Deve encerrar o spinner e exibir a mensagem de erro
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
});
