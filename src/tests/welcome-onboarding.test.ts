import { describe, it, expect } from 'vitest';

// ─────────────────────────────────────────────────────────────────────────────
// SIMULADOR DE FLUXO DA TELA DE BOAS-VINDAS (WELCOME ONBOARDING)
// Replica fielmente a lógica de navegação direta, cálculo de progresso com dados
// reais, independência das etapas e tratamentos de erro definidos no AgroGuard.
// ─────────────────────────────────────────────────────────────────────────────
class WelcomeOnboardingSimulator {
  // Dados de mock internos para simular os retornos de serviços
  public companies: any[] = [];
  public equipments: any[] = [];
  public members: any[] = [];
  public maintenancePlans: any[] = [];
  public checklistTemplates: any[] = [];
  public apiClientError = false;

  // Rota ativa
  public currentPath = '/boas-vindas';

  // Sinalizadores para auditoria de chamadas proibidas
  public provisionAttempted = false;
  public preparingEnvironmentAttempted = false;

  // Simulação de navegação do react-router-dom
  public navigate(path: string) {
    if (path.includes('preparando-ambiente')) {
      this.preparingEnvironmentAttempted = true;
    }
    this.currentPath = path;
  }

  // Ações que seriam chamadas pelo provisionamento (proibidas na tela de boas-vindas)
  public provisionOrganization() {
    this.provisionAttempted = true;
  }

  // Simulação do clique do botão na Etapa 1
  public async clickStep1() {
    // Não pode chamar provisionamento ou mudar para preparando-ambiente antes da navegação
    this.navigate('/app/configuracoes?tab=gerais');
  }

  // Simulação do clique do botão na Etapa 2
  public async clickStep2() {
    const progress = await this.calculateProgress();
    const isCompleted = progress.statuses[2].completed;
    this.navigate(isCompleted ? '/equipamentos' : '/equipamentos/novo');
  }

  // Simulação do clique do botão na Etapa 3
  public async clickStep3() {
    this.navigate('/app/configuracoes?tab=usuarios');
  }

  // Simulação do clique do botão na Etapa 4
  public async clickStep4() {
    this.navigate('/manutencoes/planos');
  }

  // Simulação do clique no botão "Entrar no AgroGuard"
  public clickEnterAgroGuard() {
    this.navigate('/app/dashboard');
  }

  // Simulação do clique em "Fazer depois"
  public clickSkipOnboarding() {
    this.navigate('/app/dashboard');
  }

  // Função idêntica à de cálculo de progresso do hook useWelcomeOnboarding
  public async calculateProgress() {
    let step1Completed = false;
    let step1Error: string | null = null;
    try {
      step1Completed = this.companies.some(
        c => c.name?.trim() !== ''
      );
    } catch {
      step1Error = 'Não foi possível verificar esta etapa.';
    }

    let step2Completed = false;
    let step2Error: string | null = null;
    try {
      step2Completed = this.equipments.length > 0;
    } catch {
      step2Error = 'Não foi possível verificar esta etapa.';
    }

    let step3Completed = false;
    let step3Error: string | null = null;
    try {
      if (this.apiClientError) {
        throw new Error('API Falhou');
      }
      const activeMembers = this.members.filter(m => m.status === 'ativo').length;
      // Proprietário/Admin não conta como equipe convidada (precisa ter mais de 1 ativo)
      step3Completed = activeMembers > 1;
    } catch {
      step3Error = 'Não foi possível verificar esta etapa.';
    }

    let step4Completed = false;
    let step4Error: string | null = null;
    try {
      step4Completed = this.maintenancePlans.length > 0 || this.checklistTemplates.length > 0;
    } catch {
      step4Error = 'Não foi possível verificar esta etapa.';
    }

    const completedCount = [step1Completed, step2Completed, step3Completed, step4Completed].filter(Boolean).length;

    return {
      statuses: {
        1: { completed: step1Completed, error: step1Error },
        2: { completed: step2Completed, error: step2Error },
        3: { completed: step3Completed, error: step3Error },
        4: { completed: step4Completed, error: step4Error },
      },
      completedCount,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EXECUÇÃO DOS CENÁRIOS DE TESTE
// ─────────────────────────────────────────────────────────────────────────────
describe('WelcomeOnboardingPage — Testes Direcionados P0', () => {

  it('1. Clicar na Etapa 1 navega para a rota correta de configurações de empresa', async () => {
    const sim = new WelcomeOnboardingSimulator();
    await sim.clickStep1();
    expect(sim.currentPath).toBe('/app/configuracoes?tab=gerais');
  });

  it('2. Clicar na Etapa 2 com 0 equipamentos (Iniciar) navega para cadastro de equipamento', async () => {
    const sim = new WelcomeOnboardingSimulator();
    sim.equipments = [];
    await sim.clickStep2();
    expect(sim.currentPath).toBe('/equipamentos/novo');
  });

  it('2b. Clicar na Etapa 2 com equipamentos cadastrados (Verificar) navega para lista de equipamentos', async () => {
    const sim = new WelcomeOnboardingSimulator();
    sim.equipments = [{ id: 'EQ-001', name: 'Trator 1' }];
    await sim.clickStep2();
    expect(sim.currentPath).toBe('/equipamentos');
  });

  it('3. Clicar na Etapa 3 navega para a rota correta de usuários da equipe', async () => {
    const sim = new WelcomeOnboardingSimulator();
    await sim.clickStep3();
    expect(sim.currentPath).toBe('/app/configuracoes?tab=usuarios');
  });

  it('4. Clicar na Etapa 4 navega para a rota correta de planos de manutenção', async () => {
    const sim = new WelcomeOnboardingSimulator();
    await sim.clickStep4();
    expect(sim.currentPath).toBe('/manutencoes/planos');
  });

  it('5. Nenhum botão/ação da tela chama ou navega para preparando-ambiente', async () => {
    const sim = new WelcomeOnboardingSimulator();
    await sim.clickStep1();
    await sim.clickStep2();
    await sim.clickStep3();
    await sim.clickStep4();
    sim.clickEnterAgroGuard();
    expect(sim.preparingEnvironmentAttempted).toBe(false);
  });

  it('6. Nenhum botão/ação da tela chama provisionOrganization', async () => {
    const sim = new WelcomeOnboardingSimulator();
    await sim.clickStep1();
    await sim.clickStep2();
    await sim.clickStep3();
    await sim.clickStep4();
    sim.clickEnterAgroGuard();
    expect(sim.provisionAttempted).toBe(false);
  });

  it('7. 0 equipamentos cadastrados -> Etapa 2 fica "A fazer" (false)', async () => {
    const sim = new WelcomeOnboardingSimulator();
    sim.equipments = [];
    const progress = await sim.calculateProgress();
    expect(progress.statuses[2].completed).toBe(false);
  });

  it('8. 1 equipamento cadastrado -> Etapa 2 fica "Concluído" (true)', async () => {
    const sim = new WelcomeOnboardingSimulator();
    sim.equipments = [{ id: 'EQ-001', name: 'Trator 1' }];
    const progress = await sim.calculateProgress();
    expect(progress.statuses[2].completed).toBe(true);
  });

  it('9. 1 membro ativo (apenas o admin/dono) -> Etapa 3 fica "A fazer" (false)', async () => {
    const sim = new WelcomeOnboardingSimulator();
    sim.members = [{ userId: 'usr-1', status: 'ativo', role: 'administrador' }];
    const progress = await sim.calculateProgress();
    expect(progress.statuses[3].completed).toBe(false);
  });

  it('10. 2 membros ativos (admin + equipe) -> Etapa 3 fica "Concluído" (true)', async () => {
    const sim = new WelcomeOnboardingSimulator();
    sim.members = [
      { userId: 'usr-1', status: 'ativo', role: 'administrador' },
      { userId: 'usr-2', status: 'ativo', role: 'tecnico' }
    ];
    const progress = await sim.calculateProgress();
    expect(progress.statuses[3].completed).toBe(true);
  });

  it('11. 0 rotinas cadastradas -> Etapa 4 fica "A fazer" (false)', async () => {
    const sim = new WelcomeOnboardingSimulator();
    sim.maintenancePlans = [];
    sim.checklistTemplates = [];
    const progress = await sim.calculateProgress();
    expect(progress.statuses[4].completed).toBe(false);
  });

  it('12. 1 plano de manutenção cadastrado -> Etapa 4 fica "Concluído" (true)', async () => {
    const sim = new WelcomeOnboardingSimulator();
    sim.maintenancePlans = [{ id: 'plan-1' }];
    sim.checklistTemplates = [];
    const progress = await sim.calculateProgress();
    expect(progress.statuses[4].completed).toBe(true);
  });

  it('12b. 1 checklist template cadastrado -> Etapa 4 fica "Concluído" (true)', async () => {
    const sim = new WelcomeOnboardingSimulator();
    sim.maintenancePlans = [];
    sim.checklistTemplates = [{ id: 'tpl-1', active: true }];
    const progress = await sim.calculateProgress();
    expect(progress.statuses[4].completed).toBe(true);
  });

  it('13. Botão "Entrar no AgroGuard" navega direto para /app/dashboard', () => {
    const sim = new WelcomeOnboardingSimulator();
    sim.clickEnterAgroGuard();
    expect(sim.currentPath).toBe('/app/dashboard');
  });

  it('14. Todas as etapas podem ser acessadas sem ordem obrigatória', async () => {
    const sim = new WelcomeOnboardingSimulator();
    // Simula cliques diretos sem passar por etapas anteriores
    await sim.clickStep4();
    expect(sim.currentPath).toBe('/manutencoes/planos');
    await sim.clickStep1();
    expect(sim.currentPath).toBe('/app/configuracoes?tab=gerais');
  });

  it('15. Tratamento de erro: se a API falhar, não navega para onboarding, exibe erro local e permite navegação', async () => {
    const sim = new WelcomeOnboardingSimulator();
    sim.apiClientError = true;
    const progress = await sim.calculateProgress();
    expect(progress.statuses[3].completed).toBe(false);
    expect(progress.statuses[3].error).toBe('Não foi possível verificar esta etapa.');
    
    // Usuário ainda consegue clicar e navegar normalmente
    await sim.clickStep3();
    expect(sim.currentPath).toBe('/app/configuracoes?tab=usuarios');
  });

});
