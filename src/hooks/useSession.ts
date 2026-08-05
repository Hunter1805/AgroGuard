import { useAuth } from './useAuth';

export function useSession() {
  const { session, loading, logout } = useAuth();

  return {
    session,
    token: session?.access_token || null,
    isAuthenticated: !!session,
    loading,
    logout,
  };
}
