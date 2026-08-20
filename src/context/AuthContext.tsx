import React, { createContext, useContext, useEffect, useState } from 'react';
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
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  registerUser: (email: string, password: string, name: string, metadata?: Record<string, any>) => Promise<{ user: SupabaseUser | null; session: Session | null; error: any }>;
  provisionOrganization: (payload: any) => Promise<{ data: any; error: any }>;
  updateOnboardingStep: (step: number) => Promise<{ data: any; error: any }>;
  refreshProfile: () => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user, false);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // TOKEN_REFRESHED e USER_UPDATED: não re-busca o perfil para evitar race condition durante onboarding
        if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') return;
        // Se já temos um profile válido com organizationId em memória, não re-busca
        // para evitar destruir o estado logo após o provisionamento
        setProfile((currentProfile) => {
          if (currentProfile?.organizationId) {
            setLoading(false);
            return currentProfile; // mantém o profile válido
          }
          // Não temos profile válido ainda, busca da API
          fetchUserProfile(session.user!, false);
          return currentProfile;
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: SupabaseUser, forceOverwrite = true) => {
    // Lê o organizationId persistido localmente (fonte de verdade após provisionamento)
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
        setProfile((prev) => {
          if (prev?.organizationId && !res.data.organizationId) {
            return prev; // preserva o profile com organização
          }
          return finalData;
        });
        localStorage.setItem(`agroguard_user_profile_${authUser.id}`, JSON.stringify(finalData));
        localStorage.setItem('agroguard_user_profile', JSON.stringify(finalData));
        // Persiste o orgId se veio da API
        if (res.data.organizationId) {
          localStorage.setItem(`agroguard_org_id_${authUser.id}`, res.data.organizationId);
        }
      } else {
        if (forceOverwrite || !persistedOrgId) {
          setProfile((prev) => {
            if (prev?.organizationId) return prev; // nunca destrói profile com organização
            return getFallbackProfile(authUser);
          });
        }
      }
    } catch {
      // Em erro de rede, usa fallback mas preserva o profile atual se tiver organizationId
      setProfile((prev) => {
        if (prev?.organizationId) return prev; // Não destrói um profile válido
        return getFallbackProfile(authUser);
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('agroguard_user_profile');
    setSession(null);
    setUser(null);
    setProfile(null);
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
