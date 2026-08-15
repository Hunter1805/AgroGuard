import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthCallbackPage: React.FC = () => {
  const { user, profile, loading: authLoading, provisionOrganization, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [statusText, setStatusText] = useState('Autenticando...');
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const processAuthCallback = async () => {
      // 0. Checar se o Supabase retornou um erro de link expirado ou já utilizado na URL
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const errorDescription = hashParams.get('error_description');
      const errorCode = hashParams.get('error_code');

      if (errorCode === 'otp_expired' || (errorDescription && (errorDescription.includes('expired') || errorDescription.includes('invalid')))) {
        setError('Este link de confirmação expirou ou já foi utilizado. Por favor, faça login com seu e-mail e senha para acessar.');
        return;
      }

      // Se ainda está carregando o estado do useAuth, aguarda
      if (authLoading) return;
      if (cancelled) return;
      setError(null);

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
          if (cancelled) return;
          return;
        } catch (err) {
          if (cancelled) return;
          setError('Não foi possível obter os dados de acesso do servidor.');
          return;
        }
      }

      // 2. Se o usuário está bloqueado
      if (profile.status === 'bloqueado' || profile.status === 'inativo') {
        if (cancelled) return;
        navigate('/acesso-bloqueado');
        return;
      }

      // 3. Se o usuário não tem organização vinculada, executa o provisionamento automático
      if (!profile.organizationId) {
        setStatusText('Criando seu ambiente operacional...');
        try {
          const pendingDataString = localStorage.getItem('agroguard_onboarding_pending');
          const pendingData = pendingDataString ? JSON.parse(pendingDataString) : {};

          // Tenta o provisionamento direto sem retries desnecessários se os dados estiverem visivelmente ausentes
          const result = await provisionOrganization(pendingData);
          const provisionError = result.error;

          if (cancelled) return;

          if (provisionError) {
            const msg = provisionError.message || '';
            const code = provisionError.code || '';
            // Se faltarem dados do onboarding, redireciona IMEDIATAMENTE para a tela com formulário manual
            if (
              code === 'ONBOARDING_DATA_MISSING' ||
              msg.includes('não localizados') ||
              msg.includes('indisponíveis') ||
              !pendingData.organizationName
            ) {
              navigate('/onboarding/preparando-ambiente?erro=dados_ausentes', { replace: true });
            } else {
              setError(provisionError.message || 'Erro ao criar seu ambiente. Tente novamente.');
            }
            return;
          }

          // Limpa o localStorage de forma segura
          localStorage.removeItem('agroguard_onboarding_pending');
          navigate('/boas-vindas', { replace: true });
          return;
        } catch (err: any) {
          if (cancelled) return;
          setError('Falha temporária ao sincronizar seu perfil. Tente novamente.');
          return;
        }
      }

      // 4. Se já possui organização mas não completou o onboarding
      if (!profile.onboardingCompleted) {
        if (cancelled) return;
        navigate('/boas-vindas');
        return;
      }

      // 5. Fluxo normal: Dashboard
      if (cancelled) return;
      navigate('/app/dashboard');
    };

    processAuthCallback();
    return () => {
      cancelled = true;
    };
  }, [user, profile, authLoading, attempt, navigate, provisionOrganization, refreshProfile]);

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
                setError(null);
                setStatusText('Sincronizando seu perfil...');
                setAttempt((current) => current + 1);
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-md py-2.5 transition-colors"
            >
              Tentar novamente
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
