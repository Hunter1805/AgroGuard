import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, RefreshCw, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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

export const AuthCallbackPage: React.FC = () => {
  const { user, authLoading, refreshProfile, provisionOrganization } = useAuth();
  const navigate = useNavigate();

  const [statusText, setStatusText] = useState('Autenticando...');
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Refs de controle de ciclo de vida e concorrência
  const startedRef = useRef(false);
  const callbackAbortControllerRef = useRef<AbortController | null>(null);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackStartedAtRef = useRef<number>(0);
  const errorTypeRef = useRef<string>('TIMEOUT');

  // 1. Mount: Iniciar relógio e timer global absoluto imediatamente no mount
  useEffect(() => {
    console.log('[AUTH_TRACE] callback mounted');
    callbackStartedAtRef.current = performance.now();
    
    // AbortController exclusivo para as requisições deste mount
    const abortController = new AbortController();
    callbackAbortControllerRef.current = abortController;

    // Teto absoluto de 30 segundos (30.000 ms)
    const timeoutMs = 30_000;
    
    safetyTimerRef.current = setTimeout(() => {
      const elapsed = Math.round(performance.now() - callbackStartedAtRef.current);
      console.error(`[AUTH_TRACE] ERROR callback timeout absoluto atingido (${elapsed}ms)`);
      
      // Aborta todas as requisições em andamento
      abortController.abort();
      
      // Define erro de timeout técnico apropriado
      setErrorCode(errorTypeRef.current || 'AUTH-PROFILE-TIMEOUT');
      setError('Não foi possível concluir a configuração da sua conta.');
    }, timeoutMs);

    return () => {
      // Cleanup: cancela timers e aborta requests ao desmontar
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      if (callbackAbortControllerRef.current) {
        callbackAbortControllerRef.current.abort();
      }
    };
  }, []);

  // 2. Fluxo de Autenticação/Onboarding: Rodar uma única vez quando authLoading for resolvido
  useEffect(() => {
    // Aguarda carregar estado de autenticação inicial
    if (authLoading) return;

    if (!user) {
      if (import.meta.env.DEV) {
        console.debug('[AUTH_DEBUG] AuthCallbackPage: sem usuário → /entrar');
      }
      console.log('[AUTH_TRACE] no user found, redirecting to login');
      navigate('/entrar');
      return;
    }

    // Impede múltiplas execuções simultâneas deste fluxo
    if (startedRef.current) return;
    startedRef.current = true;

    const runAuthCallbackFlow = async () => {
      const signal = callbackAbortControllerRef.current?.signal;
      const callbackStart = callbackStartedAtRef.current;

      // 0. Checar se o Supabase retornou um erro de link expirado ou já utilizado na URL
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const errorDescription = hashParams.get('error_description');
      const errorCodeParam = hashParams.get('error_code');

      if (
        errorCodeParam === 'otp_expired' ||
        (errorDescription && (errorDescription.includes('expired') || errorDescription.includes('invalid')))
      ) {
        if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
        setErrorCode('LINK-EXPIRED');
        setError('Este link de confirmação expirou ou já foi utilizado. Por favor, faça login com seu e-mail e senha para acessar.');
        return;
      }

      console.log('[AUTH_TRACE] getSession END'); // Sessão resolvida pelo useAuth (authLoading virou false)
      setStatusText('Sincronizando seu perfil...');

      try {
        // --- Etapa 1: /users/me (refreshProfile #1) ---
        console.log('[AUTH_TRACE] refreshProfile #1 START');
        errorTypeRef.current = 'AUTH-PROFILE-TIMEOUT';
        
        let updatedProfile = await refreshProfile({ signal });
        
        console.log('[AUTH_TRACE] refreshProfile #1 END');

        if (signal?.aborted) return;

        // Se não possui organização, provisiona
        if (!updatedProfile?.organizationId) {
          console.log('[AUTH_TRACE] provision START');
          errorTypeRef.current = 'PROVISION-TIMEOUT';
          setStatusText('Provisionando seu ambiente...');

          // Chama provisionamento no backend
          const { error: provisionError } = await provisionOrganization(getProvisionPayload(user), { signal });
          if (provisionError) throw provisionError;
          
          localStorage.removeItem('agroguard_onboarding_pending');
          console.log('[AUTH_TRACE] provision END');

          if (signal?.aborted) return;

          // Confirmação final (refreshProfile #2)
          console.log('[AUTH_TRACE] refreshProfile #2 START');
          errorTypeRef.current = 'PROFILE-REFRESH-TIMEOUT';
          setStatusText('Confirmando seu ambiente...');
          
          updatedProfile = await refreshProfile({ signal });
          
          console.log('[AUTH_TRACE] refreshProfile #2 END');
        }

        if (signal?.aborted) return;

        // Se o usuário está bloqueado ou inativo, redireciona
        if (updatedProfile?.status === 'bloqueado' || updatedProfile?.status === 'inativo') {
          console.log('[AUTH_TRACE] user status is blocked or inactive, redirecting');
          if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
          navigate('/acesso-bloqueado');
          return;
        }

        // O callback só termina com organização confirmada no perfil atualizado
        if (!updatedProfile?.organizationId) {
          throw new Error('Não foi possível confirmar a organização após o provisionamento.');
        }

        console.log('[AUTH_TRACE] organizationId confirmed');
        console.log('[AUTH_TRACE] navigate dashboard');

        // Sucesso total, desliga o safety timer
        if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
        
        const totalMs = Math.round(performance.now() - callbackStart);
        console.log(`[AUTH_TRACE] Flow completed in ${totalMs}ms. Navigating to dashboard.`);
        
        navigate('/app/dashboard', { replace: true });
        
      } catch (err: any) {
        // Se o fluxo foi cancelado/abortado, ignora erros tardios (o timeout já cuidou disso)
        if (signal?.aborted) {
          console.log('[AUTH_TRACE] Late request failure ignored (flow was aborted).');
          return;
        }

        const elapsed = Math.round(performance.now() - callbackStart);
        console.error(`[AUTH_TRACE] ERROR no fluxo de callback (${elapsed}ms):`, err.message || err);
        
        if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
        
        // Mapear erro técnico para código curto
        let code = errorTypeRef.current || 'AUTH-CALLBACK-ERROR';
        if (err.message?.includes('sessão') || err.message?.includes('session')) {
          code = 'SESSION-TIMEOUT';
        } else if (err.code === 'REQUEST_TIMEOUT' || err.statusCode === 408) {
          code = errorTypeRef.current || 'TIMEOUT';
        }

        setErrorCode(code);
        setError(err.message || 'Falha ao conectar com o servidor para sincronizar perfil.');
      }
    };

    runAuthCallbackFlow();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, attempt]);

  const handleRetry = () => {
    startedRef.current = false;
    setError(null);
    setErrorCode(null);
    setStatusText('Sincronizando seu perfil...');
    
    // Recria timer e abort controller para o retry
    const abortController = new AbortController();
    callbackAbortControllerRef.current = abortController;
    callbackStartedAtRef.current = performance.now();
    errorTypeRef.current = 'TIMEOUT';

    safetyTimerRef.current = setTimeout(() => {
      const elapsed = Math.round(performance.now() - callbackStartedAtRef.current);
      console.error(`[AUTH_TRACE] ERROR callback timeout absoluto atingido no retry (${elapsed}ms)`);
      abortController.abort();
      setErrorCode(errorTypeRef.current || 'AUTH-PROFILE-TIMEOUT');
      setError('Não foi possível concluir a configuração da sua conta.');
    }, 30_000);

    setAttempt((curr) => curr + 1);
  };

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
              {errorCode && (
                <div className="pt-1">
                  <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-200 uppercase">
                    Código: {errorCode}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={handleRetry}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-md py-2.5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw size={14} />
                Tentar novamente
              </button>
              <button
                onClick={() => navigate('/entrar', { replace: true })}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs rounded-md py-2.5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
              <p className="text-xs text-slate-400 mt-1">
                Isso não deve demorar mais do que 30 segundos.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;
