import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle2, ArrowRight, Building, Cpu, Users, Calendar, Play, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const WelcomeOnboardingPage: React.FC = () => {
  const { profile, updateOnboardingStep } = useAuth();
  const navigate = useNavigate();

  // O progresso de onboarding atual pode ser lido do profile (onboardingStep)
  const currentStep = profile?.onboardingStep || 0;

  const [loadingStep, setLoadingStep] = useState<number | null>(null);

  const steps = [
    {
      number: 1,
      title: 'Complete os dados da empresa',
      description: 'Adicione informações como CNPJ, endereço e unidades operacionais adicionais.',
      icon: <Building className="w-5 h-5" />,
      route: '/app/configuracoes?tab=gerais',
    },
    {
      number: 2,
      title: 'Cadastre seu primeiro equipamento',
      description: 'Insira o código, medidor atual e tipo de máquina para iniciar a operação.',
      icon: <Cpu className="w-5 h-5" />,
      route: '/equipamentos/novo',
    },
    {
      number: 3,
      title: 'Convide sua equipe',
      description: 'Adicione seus mecânicos, motoristas e gestores de frota com perfis de acesso apropriados.',
      icon: <Users className="w-5 h-5" />,
      route: '/app/usuarios',
    },
    {
      number: 4,
      title: 'Configure sua primeira rotina',
      description: 'Programe uma manutenção preventiva, crie um checklist ou cadastre peças e insumos no estoque.',
      icon: <Calendar className="w-5 h-5" />,
      route: '/manutencoes/planos',
    },
  ];

  const handleStepAction = async (stepNum: number, route: string) => {
    setLoadingStep(stepNum);
    try {
      // Avança a etapa de onboarding no banco local
      if (stepNum > currentStep) {
        await updateOnboardingStep(stepNum);
      }
      navigate(route);
    } catch (err) {
      console.error('Erro ao atualizar onboarding step:', err);
      navigate(route);
    } finally {
      setLoadingStep(null);
    }
  };

  const handleSkipOnboarding = async () => {
    try {
      // Ao explorar, podemos marcar como completo ou apenas ir para o dashboard
      // O prompt diz: "O usuário também poderá selecionar: Explorar o sistema. O progresso ficará salvo e poderá ser retomado depois."
      // Se ele for para o dashboard, ele pode retomar o onboarding a partir do dashboard.
      // E para marcar como concluído de verdade, ele precisa terminar a etapa 4 ou clicar em concluir.
      // Se ele quer explorar, vamos mandar para o dashboard /app/dashboard diretamente sem fechar o progresso.
      navigate('/app/dashboard');
    } catch (err) {
      navigate('/app/dashboard');
    }
  };

  const handleFinishOnboarding = async () => {
    try {
      // Marca como concluído (passo 4)
      await updateOnboardingStep(4);
      navigate('/app/dashboard');
    } catch (err) {
      navigate('/app/dashboard');
    }
  };

  const completedCount = currentStep;

  return (
    <div className="min-h-screen w-full flex bg-slate-50 justify-center items-center p-6 text-slate-800 font-sans">
      <div className="w-full max-w-[640px] bg-white p-8 rounded-lg border border-slate-200 shadow-sm space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bem-vindo ao AgroGuard</h1>
            <p className="text-xs text-slate-500">Prepare seu ambiente para começar a gerenciar sua frota.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
              <Shield size={20} />
            </div>
          </div>
        </div>

        {/* Progresso de Onboarding */}
        <div className="bg-slate-50 p-4 rounded-md border border-slate-150 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
            <span>Progresso de configuração</span>
            <span className="text-emerald-600 font-bold">{completedCount} de 4 etapas concluídas</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-500 ease-out"
              style={{ width: `${(completedCount / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Lista de Etapas */}
        <div className="space-y-4">
          {steps.map((step) => {
            const isCompleted = currentStep >= step.number;
            const isCurrent = currentStep === step.number - 1;

            return (
              <div
                key={step.number}
                className={`p-4 rounded-md border flex gap-4 transition-all ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isCurrent
                    ? 'border-slate-300 bg-white shadow-sm'
                    : 'border-slate-100 bg-slate-50/50 opacity-60'
                }`}
              >
                {/* Icone e Numero */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-600'
                      : isCurrent
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : step.icon}
                </div>

                {/* Textos */}
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Etapa {step.number}</span>
                    {isCompleted && (
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                        Concluído
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded animate-pulse">
                        A fazer
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 leading-snug">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                </div>

                {/* Ação */}
                <div className="flex items-center shrink-0">
                  <button
                    onClick={() => handleStepAction(step.number, step.route)}
                    disabled={loadingStep !== null || (!isCompleted && !isCurrent)}
                    className={`px-3 py-2 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                      isCompleted
                        ? 'border border-emerald-200 hover:bg-emerald-100 text-emerald-700 bg-white'
                        : isCurrent
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {loadingStep === step.number ? (
                      <div className="w-3.5 h-3.5 border-2 border-emerald-700/30 border-t-emerald-700 rounded-full animate-spin"></div>
                    ) : isCompleted ? (
                      <>
                        Verificar
                        <ExternalLink size={12} />
                      </>
                    ) : (
                      <>
                        Iniciar
                        <Play size={12} className="fill-current" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rodapé e Ações Finais */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-xs">
          <button
            onClick={handleSkipOnboarding}
            className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 transition-colors"
          >
            Explorar o sistema
            <ArrowRight size={14} className="mt-0.5" />
          </button>

          {completedCount >= 3 ? (
            <button
              onClick={handleFinishOnboarding}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded shadow-sm"
            >
              Concluir Configuração
            </button>
          ) : (
            <span className="text-slate-400 font-medium">Continue para liberar o Dashboard</span>
          )}
        </div>
      </div>
    </div>
  );
};
export default WelcomeOnboardingPage;
