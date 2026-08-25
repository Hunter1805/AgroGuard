import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthCallbackPage: React.FC = () => {
  const { user, authLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [statusText, setStatusText] = useState('Autenticando...');
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Garante que a navegação final acontece apenas UMA vez por tentativa
  const navigatedRef = useRef(false);
  const processingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    navigatedRef.current = false; // reset a cada nova tentativa (attempt)

    const processAuthCallback = async () => {
      // 0. Checar se o Supabase retornou um erro de link expirado ou já utilizado na URL
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const errorDescription = hashParams.get('error_description');
      const errorCode = hashParams.get('error_code');

      if (errorCode === 'otp_expired' || (errorDescription && (errorDescription.includes('expired') || errorDescription.includes('invalid')))) {
        setError('Este link de confirmação expirou ou já foi utilizado. Por favor, faça login com seu e-mail e senha para acessar.');
        return;
      }

      // Aguarda o estado de auth inicial ser resolvido
      if (authLoading) return;
      if (cancelled) return;
      setError(null);

      // Se o usuário não está autenticado, manda de volta pro login
      if (!user) {
        if (import.meta.env.DEV) {
          console.debug('[AUTH_DEBUG] AuthCallbackPage: sem usuário → /entrar');
        }
        navigate('/entrar');
        return;
      }

      if (processingRef.current) {
        if (import.meta.env.DEV) {
          console.debug('[AUTH_CALLBACK] Processamento já em andamento, abortando chamada paralela.');
        }
        return;
      }
      processingRef.current = true;

      const startTime = Date.now();
      console.log('[AUTH_CALLBACK] 1. session available. Iniciando sincronização do perfil...', { authUserId: user.id });

      setStatusText('Sincronizando seu perfil...');

      // CRÍTICO: refreshProfile retorna o perfil atualizado diretamente.
      // NÃO usar o `profile` do closure (stale state) — usar SOMENTE o retorno desta chamada.
      let updatedProfile = null;
      try {
        console.log('[AUTH_CALLBACK] 2. refreshProfile started');
        const fetchStart = Date.now();
        updatedProfile = await refreshProfile();
        console.log(`[AUTH_CALLBACK] 3. /users/me response recebida em ${Date.now() - fetchStart}ms`, {
          profileId: updatedProfile?.id,
          organizationId: updatedProfile?.organizationId,
          status: updatedProfile?.status,
        });
      } catch (err: any) {
        console.error('[AUTH_CALLBACK] Erro em refreshProfile:', err);
        setError(err.message || 'Falha ao conectar com o servidor para sincronizar perfil.');
        processingRef.current = false;
        return;
      }

      if (cancelled) {
        processingRef.current = false;
        return;
      }

      // Se o usuário está bloqueado, redireciona para acesso bloqueado
      if (updatedProfile?.status === 'bloqueado' || updatedProfile?.status === 'inativo') {
        processingRef.current = false;
        navigate('/acesso-bloqueado');
        return;
      }

      // Evita navegar múltiplas vezes
      if (navigatedRef.current) {
        processingRef.current = false;
        return;
      }

      navigatedRef.current = true;

      // Decisão baseada no perfil RETORNADO pelo refreshProfile, nunca no closure stale.
      // O callback não reprovisiona: a página de preparação é o único fluxo
      // responsável por criar o ambiente quando a organização ainda não existe.
      const destination = updatedProfile?.organizationId
        ? '/app/dashboard'
        : '/onboarding/preparando-ambiente';

      console.log(`[AUTH_CALLBACK] 8. Decision: navegando para ${destination} em ${Date.now() - startTime}ms`);

      processingRef.current = false;
      navigate(destination, { replace: true });
    };

    processAuthCallback();
    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, attempt]);

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
