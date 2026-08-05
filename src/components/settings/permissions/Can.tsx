import React from 'react';
import { usePermission } from '../../../hooks/usePermission';
import type { PermissionAction, PermissionModule } from '../../../types/permissions';

interface CanProps {
  module: PermissionModule;
  action: PermissionAction;
  userId?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({
  module,
  action,
  userId = 'usr-01',
  children,
  fallback = null,
}) => {
  const { allowed, loading } = usePermission(module, action, userId);

  if (loading) return null;
  if (!allowed) return <>{fallback}</>;

  return <>{children}</>;
};
