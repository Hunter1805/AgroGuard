import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle2, ArrowRight, Building, Cpu, Users, Calendar, Play, ExternalLink, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWelcomeOnboarding } from '../../hooks/useWelcomeOnboarding';
import { Building2 } from 'lucide-react';

export const WelcomeOnboardingPage: React.FC = () => {
  const { profile } = useAuth();
  const { loading, statuses, completedCount } = useWelcomeOnboarding();
  const navigate = useNavigate();

  const displayName = profile?.name || '';
  const organizationName = profile?.organizationName || '';
  const workspaceName = profile?.workspaceName || '';

  const steps = [
    {
      number: 1,
      title: 'Complete os dados da empresa',
      description: 'Adicione informações como CNPJ, endereço e unidades operacionais adicionais.',
      icon: <Building className="w-5 h-5" />,
      buttonText: 'Configurar',
      routeStart: '/app/configuracoes?tab=gerais',
      routeVerify: '/app/configuracoes?tab=gerais',
    },
    {
      number: 2,
      title: 'Cadastre seu primeiro equipamento',
      description: 'Insira o código, medidor atual e tipo de máquina para iniciar a operação.',
      icon: <Cpu className="w-5 h-5" />,
      buttonText: 'Cadastrar',
      routeStart: '/equipamentos/novo',
      routeVerify: '/equipamentos',
    },
    {
      number: 3,
      title: 'Convide sua equipe',
      description: 'Adicione seus mecânicos, motoristas e gestores de frota com perfis de acesso apropriados.',
      icon: <Users className="w-5 h-5" />,
      buttonText: 'Convidar',
      routeStart: '/app/configuracoes?tab=usuarios',
      routeVerify: '/app/configuracoes?tab=usuarios',
    },
    {
      number: 4,
      title: 'Configure sua primeira rotina',
      description: 'Programe uma manutenção preventiva, crie um checklist ou cadastre peças e insumos no estoque.',
      icon: <Calendar className="w-5 h-5" />,
      buttonText: 'Configurar',
      routeStart: '/manutencoes/planos',
      routeVerify: '/manutencoes/planos',
    },
  ];

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
            <button
              onClick={() => navigate('/app/dashboard')}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Play size={12} className="fill-current" />
              Entrar no AgroGuard
            </button>
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
              <Shield size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-md border-emerald-100 bg-emerald-50 p-4">
          {displayName && <p className="text-lg font-bold text-slate-900">Olá, {displayName}.</p>}
          <p className="mt-1 text-sm text-slate-600">Seu ambiente está pronto!</p>
          {organizationName && (
            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <Building2 size={16} />
              {organizationName}
            </div>
          )}
          {workspaceName && (
            <p className="mt-1 text-xs text-slate-500 font-medium">
              Workspace: {workspaceName}
            </p>
          )}
          <p className="mt-1 text-xs text-slate-500">Seu AgroGuard foi criado e está pronto para você começar.</p>
        </div>

        {/* Progresso de Onboarding */}
        <div className="bg-slate-50 p-4 rounded-md border border-slate-150 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
            <span>Primeiros passos</span>
            {loading ? (
              <span className="text-slate-400">Carregando progresso...</span>
            ) : (
              <span className="text-emerald-600 font-bold">{completedCount} de 4 etapas concluídas</span>
            )}
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-500 ease-out"
              style={{ width: `${loading ? 0 : (completedCount / 4) * 100}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-500 italic mt-1">
            Você pode configurar estes itens agora ou continuar depois.
          </p>
        </div>

        {/* Lista de Etapas */}
        <div className="space-y-4">
          {steps.map((step) => {
            const stepStatus = statuses[step.number] || { completed: false, error: null };
            const isCompleted = stepStatus.completed;
            const hasError = stepStatus.error !== null;

            return (
              <div
                key={step.number}
                className={`p-4 rounded-md border flex gap-4 transition-all ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-300 bg-white shadow-sm'
                }`}
              >
                {/* Icone e Numero */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-900 text-white'
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
                    {!isCompleted && !hasError && (
                      <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                        A fazer
                      </span>
                    )}
                    {hasError && (
                      <span className="text-[10px] font-semibold bg-red-100 text-red-700 px-1.5 py-0.5 rounded flex items-center gap-1 border border-red-200">
                        <AlertCircle size={10} />
                        {stepStatus.error}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 leading-snug">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                </div>

                {/* Ação */}
                <div className="flex items-center shrink-0">
                  <button
                    onClick={() => navigate(isCompleted ? step.routeVerify : step.routeStart)}
                    className={`px-3 py-2 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCompleted
                        ? 'border border-emerald-200 hover:bg-emerald-100 text-emerald-700 bg-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        Verificar
                        <ExternalLink size={12} />
                      </>
                    ) : (
                      <>
                        {step.buttonText}
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
            onClick={() => navigate('/app/dashboard')}
            className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            Continuar configurando depois
            <ArrowRight size={14} className="mt-0.5" />
          </button>

          <button
            onClick={() => navigate('/app/dashboard')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Play size={12} className="fill-current" />
            Entrar no AgroGuard
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOnboardingPage;
