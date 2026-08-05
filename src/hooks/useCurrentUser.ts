import { useAuth } from './useAuth';

export function useCurrentUser() {
  const { user, profile, loading } = useAuth();

  return {
    currentUser: profile ? {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      organizationId: profile.organizationId,
      status: profile.status,
    } : null,
    authUser: user,
    loading,
  };
}
