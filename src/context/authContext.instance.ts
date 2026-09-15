import { createContext } from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import type { UserProfileData } from './AuthContext';

export interface AuthContextType {
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
  provisionOrganization: (payload: any, options?: { signal?: AbortSignal; timeoutMs?: number }) => Promise<{ data: any; error: any }>;
  updateOnboardingStep: (step: number) => Promise<{ data: any; error: any }>;
  /**
   * Recarrega o perfil do usuário.
   * IMPORTANTE: retorna o perfil carregado diretamente para evitar stale state.
   * Use o valor retornado para decisões de rota — nunca leia `profile` do closure.
   */
  refreshProfile: (options?: { signal?: AbortSignal; timeoutMs?: number }) => Promise<UserProfileData | null>;
  updateProfile: (data: { name: string; phone?: string }) => Promise<{ data: UserProfileData | null; error: any }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
