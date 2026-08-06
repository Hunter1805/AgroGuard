import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthCallbackPage: React.FC = () => {
  const { user, profile, loading: authLoading, provisionOrganization, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [statusText, setStatusText] = useState('Autenticando...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processAuthCallback = async () => {
      // Se ainda está carregando o estado do useAuth, aguarda
      if (authLoading) return;

      // Se o usuário não está autenticado, manda de volta pro login
      if (!user) {
        navigate('/entrar');
        return;
      }

      setStatusText('Sincronizando seu perfil...');

      // 1. Tentar carregar o perfil do usuário caso ainda não esteja disponível
      if (!profile) {
        try {
          await refreshProfile();
          return;
        } catch (err) {
          setError('Não foi possível obter os dados de acesso do servidor.');
          return;
        }
      }

      // 2. Se o usuário está bloqueado
      if (profile.status === 'bloqueado' || profile.status === 'inativo') {
        navigate('/acesso-bloqueado');
        return;
      }

      // 3. Se o usuário não tem organização vinculada, executa o provisionamento automático
      if (!profile.organizationId) {
        setStatusText('Criando seu ambiente operacional...');
        try {
          const pendingDataString = localStorage.getItem('agroguard_onboarding_pending');
          const pendingData = pendingDataString ? JSON.parse(pendingDataString) : {};

          const { error: provisionError } = await provisionOrganization(pendingData);

          if (provisionError) {
            // Se faltarem dados do onboarding (metadados indisponíveis na nuvem)
            if (
              provisionError.code === 'ONBOARDING_DATA_MISSING' || 
              (provisionError.message && provisionError.message.includes('não localizados'))
            ) {
              navigate('/onboarding/preparando-ambiente?erro=dados_ausentes');
            } else {
              setError(provisionError.message || 'Erro ao criar seu ambiente. Tente novamente.');
            }
            return;
          }

          // Limpa o localStorage de forma segura
          localStorage.removeItem('agroguard_onboarding_pending');

          setStatusText('Ambiente pronto! Preparando seu primeiro acesso...');
          setTimeout(() => navigate('/boas-vindas'), 1500);
          return;
        } catch (err: any) {
          setError('Falha ao processar provisionamento do ambiente.');
          return;
        }
      }

      // 4. Se já possui organização mas não completou o onboarding
      if (!profile.onboardingCompleted) {
        navigate('/boas-vindas');
        return;
      }

      // 5. Fluxo normal: Dashboard
      navigate('/app/dashboard');
    };

    processAuthCallback();
  }, [user, profile, authLoading]);

  return (
    <div className="min-h-screen w-full flex bg-slate-50 justify-center items-center p-6 text-slate-800 font-sans">
      <div className="w-full max-w-[400px] bg-white p-8 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-6">
        {/* Topo - Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2.5 rounded-lg text-white shadow-md">
            <Shield size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">AgroGuard</span>
        </div>

        {error ? (
          <div className="space-y-4 w-full">
            <div className="bg-red-50 text-red-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-950">Falha na sincronização</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{error}</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('agroguard_onboarding_pending');
                navigate('/entrar');
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-md py-2.5 transition-colors"
            >
              Voltar para o Login
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <RefreshCw size={28} className="text-emerald-600 animate-spin mx-auto" />
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Por favor, aguarde</span>
              <p className="text-sm font-semibold text-slate-800">{statusText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AuthCallbackPage;
