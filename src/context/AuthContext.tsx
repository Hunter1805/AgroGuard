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
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      const res = await apiClient<UserProfileData>('/users/me');
      if (res.data) {
        setProfile(res.data);
      } else {
        // Fallback estruturado
        setProfile({
          id: '',
          authUserId: authUser.id,
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário AgroGuard',
          email: authUser.email || '',
          role: '',
          organizationId: '',
          status: 'novo',
          onboardingCompleted: false,
          onboardingStep: 0,
        });
      }
    } catch {
      // Fallback em caso de erro da API rest
      setProfile({
        id: '',
        authUserId: authUser.id,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário AgroGuard',
        email: authUser.email || '',
        role: '',
        organizationId: '',
        status: 'novo',
        onboardingCompleted: false,
        onboardingStep: 0,
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
      const idempotencyKey = crypto.randomUUID ? crypto.randomUUID() : 'idemp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
      const res = await apiClient<{ message: string; organizationId: string }>('/onboarding/provision', {
        method: 'POST',
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(payload),
      });
      // Recarrega o perfil para obter a organização recém-vinculada
      if (user) {
        await fetchUserProfile(user);
      }
      return { data: res.data, error: null };
    } catch (e: any) {
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
