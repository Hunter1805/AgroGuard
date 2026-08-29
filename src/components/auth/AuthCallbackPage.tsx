import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, RefreshCw, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AUTH_FLOW_TOTAL_TIMEOUT_MS, clearAuthFlow, startAuthFlow } from '../../services/auth-flow.service';

function getProvisionPayload(user: NonNullable<ReturnType<typeof useAuth>['user']>) {
  const metadata = user.user_metadata || {};
  const pending = JSON.parse(localStorage.getItem('agroguard_onboarding_pending') || '{}');
  return {
    ownerName: pending.ownerName || metadata.name || user.email?.split('@')[0] || 'Proprietário',
    organizationName: pending.organizationName || metadata.organizationName,
    workspaceName: pending.workspaceName || metadata.workspaceName,
    segment: pending.segment || metadata.segment || 'AGRICULTURE',
    estimatedEquipmentCount: pending.estimatedEquipmentCount || metadata.estimatedEquipmentCount || '11_50',
    phone: pending.phone || metadata.phone || null,
    acceptedTermsVersion: pending.acceptedTermsVersion || metadata.acceptedTermsVersion || '2026-08',
    acceptedPrivacyVersion: pending.acceptedPrivacyVersion || metadata.acceptedPrivacyVersion || '2026-08',
  };
}

/** Limite absoluto do fluxo de autenticação (sessão + perfil + provisionamento + refresh). */
const CALLBACK_TOTAL_TIMEOUT_MS = AUTH_FLOW_TOTAL_TIMEOUT_MS;

/** Se a primeira chamada demorar mais que X ms, exibir mensagem de "acordando servidor". */
const SLOW_FIRST_CALL_THRESHOLD_MS = 6_000;

export const AuthCallbackPage: React.FC = () => {
  const { user, authLoading, profileLoading, refreshProfile, provisionOrganization } = useAuth();
  const navigate = useNavigate();

  const [statusText, setStatusText] = useState('Autenticando...');
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Garante que a navegação final acontece apenas UMA vez por tentativa
  const navigatedRef = useRef(false);
  const processingRef = useRef(false);
  // Ref para o timeout global de segurança
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expiredRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    navigatedRef.current = false;
    expiredRef.current = false;

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

      // Aguarda o estado de auth inicial ser resolvido.
      // A rota /auth/callback é imune a profileLoading para evitar deadlock de bootstrap.
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
      startAuthFlow();

      const callbackStart = performance.now();
      console.log('[AUTH_PERF] session ready:', Math.round(performance.now() - callbackStart), 'ms');

      setStatusText('Sincronizando seu perfil...');

      // Hard timeout absoluto: nenhuma tentativa pode manter o fluxo ativo além de 40s.
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = setTimeout(() => {
        if (!navigatedRef.current && processingRef.current) {
          expiredRef.current = true;
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

      if (cancelled || expiredRef.current || navigatedRef.current) {
        processingRef.current = false;
        return;
      }

      // Usuário sem organização é provisionado no próprio callback; não há tela intermediária.
      if (!updatedProfile?.organizationId) {
        if (expiredRef.current) return;
        try {
          setStatusText('Provisionando seu ambiente...');
          const { error: provisionError } = await provisionOrganization(getProvisionPayload(user));
          if (provisionError) throw provisionError;
          localStorage.removeItem('agroguard_onboarding_pending');
          setStatusText('Confirmando seu ambiente...');
          updatedProfile = await refreshProfile();
        } catch (err: any) {
          if (!cancelled && !expiredRef.current) {
            clearTimeout(safetyTimerRef.current!);
            processingRef.current = false;
            setError(err?.message || 'Falha ao provisionar e confirmar seu ambiente.');
          }
          return;
        }
        if (expiredRef.current) return;
      }

      // Se o usuário está bloqueado, redireciona
      if (updatedProfile?.status === 'bloqueado' || updatedProfile?.status === 'inativo') {
        clearTimeout(safetyTimerRef.current!);
        processingRef.current = false;
        navigate('/acesso-bloqueado');
        return;
      }

      // Evita navegar múltiplas vezes
      if (expiredRef.current || navigatedRef.current) {
        processingRef.current = false;
        return;
      }

      // O callback só termina com organização confirmada no perfil atualizado.
      if (!updatedProfile?.organizationId) {
        clearTimeout(safetyTimerRef.current!);
        processingRef.current = false;
        setError('Não foi possível confirmar a organização após o provisionamento.');
        return;
      }
      navigatedRef.current = true;
      clearTimeout(safetyTimerRef.current!);

      const totalMs = Math.round(performance.now() - callbackStart);
      const destination = '/app/dashboard';
      console.log(`[AUTH_PERF] total callback: ${totalMs}ms → ${destination}`);
      clearAuthFlow();
      processingRef.current = false;
      navigate(destination, { replace: true });
    };

    processAuthCallback();

    return () => {
      cancelled = true;
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, profileLoading, attempt]);

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
