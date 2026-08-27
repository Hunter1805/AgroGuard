import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, authLoading, profileLoading, profile } = useAuth();
  const location = useLocation();

  if (import.meta.env.DEV) {
    console.debug('[ROUTER_DEBUG]', {
      source: 'ProtectedRoute',
      path: location.pathname,
      hasSession: !!session,
      authLoading,
      profileLoading,
      profileId: profile?.id,
      organizationId: profile?.organizationId,
      redirectTo: !session ? '/entrar' : null,
    });
  }

  // Aguarda resolução de auth E de perfil antes de tomar qualquer decisão
  if (authLoading || (session && profileLoading && !profile)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  // Sem sessão → redireciona para /entrar (corrigido de /login)
  if (!session) {
    return <Navigate to="/entrar" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
