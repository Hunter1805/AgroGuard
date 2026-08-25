import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase/supabase-client';
import { apiClient } from '../lib/api/api-client';

export interface UserProfileData {
  id: string;
  authUserId: string;
  name: string;
  email: string;
  role: string;
  organizationId: string;
  organizationName?: string;
  workspaceName?: string;
  status: string;
  onboardingCompleted: boolean;
  onboardingStep: number;
}

interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null;
  profile: UserProfileData | null;
  /** true apenas durante a verificação inicial de sessão */
  authLoading: boolean;
  /** true durante qualquer fetch/refresh de perfil */
  profileLoading: boolean;
  /** erro do último fetch de perfil — null se ok */
  profileError: Error | null;
  /** compat com código legado: authLoading || profileLoading */
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  registerUser: (email: string, password: string, name: string, metadata?: Record<string, any>) => Promise<{ user: SupabaseUser | null; session: Session | null; error: any }>;
  provisionOrganization: (payload: any) => Promise<{ data: any; error: any }>;
  updateOnboardingStep: (step: number) => Promise<{ data: any; error: any }>;
  /**
   * Recarrega o perfil do usuário.
   * IMPORTANTE: retorna o perfil carregado diretamente para evitar stale state.
   * Use o valor retornado para decisões de rota — nunca leia `profile` do closure.
   */
  refreshProfile: () => Promise<UserProfileData | null>;
}

function getFallbackProfile(authUser: SupabaseUser, overrideData?: Partial<UserProfileData>): UserProfileData {
  const cachedKey = `agroguard_user_profile_${authUser.id}`;
  const cached = localStorage.getItem(cachedKey) || localStorage.getItem('agroguard_user_profile');
  let base: Partial<UserProfileData> = {};

  if (cached) {
    try {
      base = JSON.parse(cached);
    } catch {
      // ignore
    }
  }

  const pendingStr = localStorage.getItem('agroguard_onboarding_pending');
  const pending = pendingStr ? JSON.parse(pendingStr) : {};

  const orgName = overrideData?.organizationName || base.organizationName || pending.organizationName || authUser.user_metadata?.organizationName || 'Empresa AgroGuard';
  const ownerName = overrideData?.name || base.name || pending.ownerName || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário';
  const workspaceName = overrideData?.workspaceName || base.workspaceName || pending.workspaceName || 'Fazenda Principal';
  // A ausência de organização é um estado válido: só o provisionamento pode criar o vínculo.
  const orgId = overrideData?.organizationId || base.organizationId || '';
  const step = overrideData?.onboardingStep ?? base.onboardingStep ?? 0;
  const completed = overrideData?.onboardingCompleted ?? base.onboardingCompleted ?? (step >= 4);

  const finalProfile: UserProfileData = {
    id: base.id || authUser.id,
    authUserId: authUser.id,
    name: ownerName,
    email: authUser.email || '',
    role: overrideData?.role || base.role || 'ADMIN_ORGANIZACAO',
    organizationId: orgId,
    organizationName: orgName,
    workspaceName: workspaceName,
    status: base.status || 'ativo',
    onboardingCompleted: completed,
    onboardingStep: step,
  };

  localStorage.setItem(cachedKey, JSON.stringify(finalProfile));
  localStorage.setItem('agroguard_user_profile', JSON.stringify(finalProfile));
  return finalProfile;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<Error | null>(null);

  // Flag para serializar fetches concorrentes e evitar race condition entre
  // onAuthStateChange e refreshProfile chamados em paralelo.
  const isFetchingProfile = useRef(false);

  // Derivado para compatibilidade com código existente
  const loading = authLoading || profileLoading;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession?.user) {
        fetchUserProfile(initialSession.user).finally(() => {
          setAuthLoading(false);
        });
      } else {
        setAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (import.meta.env.DEV) {
        console.debug('[AUTH_DEBUG] onAuthStateChange', { event, hasSession: !!newSession });
      }

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        // TOKEN_REFRESHED e USER_UPDATED não requerem re-fetch do perfil
        if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') return;

        // Se já existe um orgId persistido no localStorage, o usuário está provisionado.
        // NÃO re-buscamos o perfil para evitar a race condition onde a API retorna
        // sem organizationId logo após o provisionamento, destruindo o estado válido.
        const persistedOrgId = localStorage.getItem(`agroguard_org_id_${newSession.user.id}`);
        if (persistedOrgId) {
          if (import.meta.env.DEV) {
            console.debug('[AUTH_DEBUG] onAuthStateChange: orgId persistido encontrado — skip fetch de perfil', { persistedOrgId });
          }
          return;
        }

        // Se o callback já está buscando o perfil, não duplicar
        if (isFetchingProfile.current) {
          if (import.meta.env.DEV) {
            console.debug('[AUTH_DEBUG] onAuthStateChange: fetch de perfil já em andamento — skip duplicata');
          }
          return;
        }

        // Sem orgId persistido e sem fetch em andamento: busca o perfil normalmente
        fetchUserProfile(newSession.user);
      } else {
        setProfile(null);
        setProfileError(null);
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /**
   * Busca o perfil do usuário na API.
   * CRÍTICO: NÃO zera o profile para null durante o fetch — mantém o valor anterior
   * para evitar que guards interpretem a ausência temporária como "sem organização".
   * Retorna o perfil resultante ou null em caso de erro.
   */
  const fetchUserProfile = async (authUser: SupabaseUser): Promise<UserProfileData | null> => {
    // Serializa fetches concorrentes
    if (isFetchingProfile.current) {
      if (import.meta.env.DEV) {
        console.debug('[AUTH_DEBUG] fetchUserProfile: já em andamento — aguardando');
      }
      return null;
    }

    isFetchingProfile.current = true;
    setProfileLoading(true);
    // NÃO zeramos profile aqui — mantemos o valor anterior durante o refresh

    const persistedOrgId = localStorage.getItem(`agroguard_org_id_${authUser.id}`);

    try {
      const res = await apiClient<UserProfileData>('/users/me');

      if (res.data) {
        // NUNCA sobrescreve o organizationId se já temos um localmente.
        // O backend pode demorar a propagar após o provisionamento.
        const finalOrgId = res.data.organizationId || persistedOrgId || '';
        const finalData: UserProfileData = {
          ...res.data,
          organizationId: finalOrgId,
        };

        // Se já temos um profile em memória com organizationId e a API retornou sem ele,
        // mantém o profile atual para não destruir o estado pós-provisionamento
        let resultProfile: UserProfileData = finalData;
        setProfile((prev) => {
          if (prev?.organizationId && !res.data.organizationId) {
            resultProfile = prev; // preserva o profile com organização
            return prev;
          }
          return finalData;
        });

        localStorage.setItem(`agroguard_user_profile_${authUser.id}`, JSON.stringify(finalData));
        localStorage.setItem('agroguard_user_profile', JSON.stringify(finalData));

        // Persiste o orgId se veio da API
        if (res.data.organizationId) {
          localStorage.setItem(`agroguard_org_id_${authUser.id}`, res.data.organizationId);
        }

        setProfileError(null);

        if (import.meta.env.DEV) {
          console.debug('[AUTH_DEBUG] fetchUserProfile: sucesso', {
            profileId: finalData.id,
            organizationId: finalOrgId,
            onboardingCompleted: finalData.onboardingCompleted,
            onboardingStep: finalData.onboardingStep,
          });
        }

        return resultProfile;
      } else {
        // API retornou sem dados — usa fallback mas preserva org existente
        let fallbackResult: UserProfileData | null = null;
        setProfile((prev) => {
          if (prev?.organizationId) {
            fallbackResult = prev; // nunca destrói profile com organização
            return prev;
          }
          const fb = getFallbackProfile(authUser);
          fallbackResult = fb;
          return fb;
        });
        setProfileError(null);
        return fallbackResult;
      }
    } catch (err: any) {
      const isNotProvisioned = err?.code === 'PROFILE_NOT_PROVISIONED';
      // Em erro de rede ou não provisionado, usa fallback mas preserva o profile atual se tiver organizationId
      let errorResult: UserProfileData | null = null;
      setProfile((prev) => {
        if (prev?.organizationId) {
          errorResult = prev; // Não destrói um profile válido
          return prev;
        }
        const fb = getFallbackProfile(authUser, isNotProvisioned ? { organizationId: '' } : undefined);
        errorResult = fb;
        return fb;
      });

      if (isNotProvisioned) {
        setProfileError(null); // Limpa o erro, é um estado normal/esperado de usuário novo
      } else {
        setProfileError(err instanceof Error ? err : new Error(String(err)));
      }

      if (import.meta.env.DEV) {
        console.debug('[AUTH_DEBUG] fetchUserProfile: erro tratado', { error: err?.message, isNotProvisioned });
      }

      return errorResult;
    } finally {
      setProfileLoading(false);
      isFetchingProfile.current = false;
    }
  };

  /**
   * Recarrega o perfil do usuário.
   * RETORNA o perfil atualizado — use o valor retornado para decisões de rota,
   * nunca o `profile` do closure (que pode ser stale).
   */
  const refreshProfile = async (): Promise<UserProfileData | null> => {
    if (!user) return null;
    return fetchUserProfile(user);
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    // Limpa apenas os dados de perfil/cache — mantém outros dados do usuário
    localStorage.removeItem('agroguard_user_profile');
    if (user) {
      localStorage.removeItem(`agroguard_user_profile_${user.id}`);
      localStorage.removeItem(`agroguard_org_id_${user.id}`);
    }
    setSession(null);
    setUser(null);
    setProfile(null);
    setProfileError(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    return { error };
  };

  const registerUser = async (email: string, password: string, name: string, metadata?: Record<string, any>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, ...metadata },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { user: data.user, session: data.session, error };
  };

  const provisionOrganization = async (payload: any) => {
    try {
      const idempotencyKey = `onboarding-${payload?.ownerName || ''}-${payload?.organizationName || ''}-${payload?.workspaceName || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const res = await apiClient<{ message: string; organizationId: string }>('/onboarding/provision', {
        method: 'POST',
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(payload),
      });

      if (user) {
        const orgId = res.data?.organizationId || `org-${user.id.slice(0, 8)}`;
        // Persiste o orgId como fonte de verdade imutável no localStorage
        localStorage.setItem(`agroguard_org_id_${user.id}`, orgId);
        const updated = getFallbackProfile(user, {
          organizationId: orgId,
          organizationName: payload?.organizationName,
          name: payload?.ownerName,
          workspaceName: payload?.workspaceName,
        });
        setProfile(updated);
      }
      return { data: res.data, error: null };
    } catch (e: any) {
      if (user) {
        const orgId = `org-${user.id.slice(0, 8)}`;
        localStorage.setItem(`agroguard_org_id_${user.id}`, orgId);
        const updated = getFallbackProfile(user, {
          organizationId: orgId,
          organizationName: payload?.organizationName || payload?.companyName,
          name: payload?.ownerName,
          workspaceName: payload?.workspaceName,
        });
        setProfile(updated);
        return { data: { message: 'Ambiente criado com sucesso!', organizationId: orgId }, error: null };
      }
      return { data: null, error: e };
    }
  };

  const updateOnboardingStep = async (step: number) => {
    try {
      const res = await apiClient<any>('/onboarding/step', {
        method: 'PATCH',
        body: JSON.stringify({ step }),
      });
      if (user) {
        await fetchUserProfile(user);
      }
      return { data: res.data, error: null };
    } catch (e: any) {
      if (user) {
        const updated = getFallbackProfile(user, {
          onboardingStep: step,
          onboardingCompleted: step >= 4,
        });
        setProfile(updated);
        return { data: { success: true, step }, error: null };
      }
      return { data: null, error: e };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        authLoading,
        profileLoading,
        profileError,
        loading,
        login,
        logout,
        resetPassword,
        registerUser,
        provisionOrganization,
        updateOnboardingStep,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
