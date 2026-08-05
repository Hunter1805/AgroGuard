import React from 'react';
import { usePermission } from '../../../hooks/usePermission';
import { AccessDeniedState } from './AccessDeniedState';
import type { PermissionAction, PermissionModule } from '../../../types/permissions';

interface PermissionRouteProps {
  module: PermissionModule;
  action?: PermissionAction;
  userId?: string;
  element: React.ReactElement;
}

export const PermissionRoute: React.FC<PermissionRouteProps> = ({
  module,
  action = 'visualizar',
  userId = 'usr-01',
  element,
}) => {
  const { allowed, reason, loading } = usePermission(module, action, userId);

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center min-h-[50vh] text-[13px] text-on-surface-variant animate-pulse">
        Verificando credenciais de acesso...
      </div>
    );
  }

  if (!allowed) {
    return <AccessDeniedState reason={reason} moduleName={module} />;
  }

  return element;
};
