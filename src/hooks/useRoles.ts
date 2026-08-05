import { useState, useEffect } from 'react';
import { rolesService } from '../services/roles.service';
import type { AccessRole } from '../types/roles';

export function useRoles() {
  const [roles, setRoles] = useState<AccessRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    setLoading(true);
    const data = await rolesService.getRoles();
    setRoles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const duplicateRole = async (id: string) => {
    await rolesService.duplicateRole(id);
    await fetchRoles();
  };

  const toggleRoleStatus = async (id: string, active: boolean) => {
    await rolesService.setRoleStatus(id, active);
    await fetchRoles();
  };

  return {
    roles,
    loading,
    duplicateRole,
    toggleRoleStatus,
    refetchRoles: fetchRoles,
  };
}
