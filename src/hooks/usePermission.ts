import { useState, useEffect } from 'react';
import { permissionsService } from '../services/permissions.service';
import type { PermissionAction, PermissionModule, PermissionCheckResult } from '../types/permissions';

export function usePermission(module: PermissionModule, action: PermissionAction, userId: string = 'usr-01') {
  const [result, setResult] = useState<PermissionCheckResult>({ allowed: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    permissionsService.canUserPerform(userId, module, action).then((res) => {
      if (isMounted) {
        setResult(res);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [module, action, userId]);

  return {
    allowed: result.allowed,
    reason: result.reason,
    source: result.source,
    loading,
  };
}
