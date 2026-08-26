import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, RefreshCw, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/** Timeout máximo total para o fluxo de callback (ms). */
const CALLBACK_TOTAL_TIMEOUT_MS = 45_000;

/** Se a primeira chamada demorar mais que X ms, exibir mensagem de "acordando servidor". */
const SLOW_FIRST_CALL_THRESHOLD_MS = 6_000;

export const AuthCallbackPage: React.FC = () => {
  const { user, authLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [statusText, setStatusText] = useState('Autenticando...');
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Garante que a navegação final acontece apenas UMA vez por tentativa
  const navigatedRef = useRef(false);
  const processingRef = useRef(false);
  // Ref para o timeout global de segurança
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    navigatedRef.current = false;

    const processAuthCallback = async () => {
      // 0. Checar se o Supabase retornou um erro de link expirado ou já utilizado na URL
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const errorDescription = hashParams.get('error_description');
      const errorCode = hashParams.get('error_code');

      if (
        errorCode === 'otp_expired' ||
        (errorDescription && (errorDescription.includes('expired') || errorDescription.includes('invalid')))
      ) {
        setError(
          'Este link de confirmação expirou ou já foi utilizado. Por favor, faça login com seu e-mail e senha para acessar.'
        );
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

      const callbackStart = performance.now();
      console.log('[AUTH_PERF] session ready:', Math.round(performance.now() - callbackStart), 'ms');

      setStatusText('Sincronizando seu perfil...');

      // Arma timeout global de segurança: garante que o spinner nunca fica >45s
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = setTimeout(() => {
        if (!navigatedRef.current && processingRef.current) {
          processingRef.current = false;
          setError(
            'Estamos demorando mais que o esperado para preparar seu ambiente. Isso pode ocorrer quando o servidor está sendo iniciado.'
          );
        }
      }, CALLBACK_TOTAL_TIMEOUT_MS);

      // --- Etapa 1: /users/me (refreshProfile) ---
      let updatedProfile = null;
      try {
        const meStart = performance.now();
        updatedProfile = await refreshProfile();
        const meMs = Math.round(performance.now() - meStart);
        console.log(`[AUTH_PERF] users/me attempt 1: ${meMs}ms`);

        // Se a primeira chamada foi muito lenta, provavelmente o servidor estava acordando
        if (meMs > SLOW_FIRST_CALL_THRESHOLD_MS) {
          console.warn(`[AUTH_PERF] COLD START DETECTADO: primeira chamada levou ${meMs}ms`);
        }
      } catch (err: any) {
        if (!cancelled && !navigatedRef.current) {
          clearTimeout(safetyTimerRef.current!);
          processingRef.current = false;
          console.error('[AUTH_CALLBACK] Erro em refreshProfile:', err);
          setError(err.message || 'Falha ao conectar com o servidor para sincronizar perfil.');
        }
        return;
      }

      if (cancelled || navigatedRef.current) {
        processingRef.current = false;
        return;
      }

      // Se o usuário está bloqueado, redireciona
      if (updatedProfile?.status === 'bloqueado' || updatedProfile?.status === 'inativo') {
        clearTimeout(safetyTimerRef.current!);
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
      clearTimeout(safetyTimerRef.current!);

      const totalMs = Math.round(performance.now() - callbackStart);

      // Decisão baseada no perfil RETORNADO pelo refreshProfile, nunca no closure stale.
      const destination = updatedProfile?.organizationId
        ? '/app/dashboard'
        : '/onboarding/preparando-ambiente';

      console.log(`[AUTH_PERF] total callback: ${totalMs}ms → ${destination}`);

      processingRef.current = false;
      navigate(destination, { replace: true });
    };

    processAuthCallback();

    return () => {
      cancelled = true;
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, attempt]);

  // Mensagem de status dinâmica baseada no tempo decorrido
  const isMaybeSlowServer = statusText === 'Conectando ao ambiente AgroGuard...';

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
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={() => {
                  setError(null);
                  setStatusText('Sincronizando seu perfil...');
                  setAttempt((current) => current + 1);
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-md py-2.5 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} />
                Tentar novamente
              </button>
              <button
                onClick={() => navigate('/entrar', { replace: true })}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs rounded-md py-2.5 transition-colors flex items-center justify-center gap-2"
              >
                <LogIn size={14} />
                Voltar para entrar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <RefreshCw size={28} className="text-emerald-600 animate-spin mx-auto" />
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                Por favor, aguarde
              </span>
              <p className="text-sm font-semibold text-slate-800">{statusText}</p>
              {isMaybeSlowServer && (
                <p className="text-xs text-slate-400 mt-1">
                  O servidor pode estar sendo iniciado. Isso pode levar alguns segundos.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;
