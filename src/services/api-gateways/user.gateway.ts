import { apiClient } from '../../lib/api/api-client';
import type { SystemUser } from '../../types/users';

export async function fetchUsersFromApi(search?: string): Promise<SystemUser[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await apiClient<any[]>(`/users${query}`);

  return response.data.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    employeeCode: u.employeeCode || undefined,
    type: (u.type as any) || 'interno',
    status: (u.status as any) || 'ativo',
    roleIds: u.userRoles?.map((ur: any) => ur.roleId) || ['role-consulta'],
    primaryRoleId: u.userRoles?.[0]?.roleId || 'role-consulta',
    primaryRoleName: u.userRoles?.[0]?.role?.name || 'Usuário AgroGuard',
    companyIds: ['emp-01'],
    unitIds: ['und-01'],
    farmIds: [],
    teamIds: [],
    specialtyIds: [],
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    createdBy: 'Sistema API',
  }));
}

export async function createUserInApi(data: Partial<SystemUser>): Promise<SystemUser> {
  const response = await apiClient<any>('/users', {
    method: 'POST',
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      employeeCode: data.employeeCode,
      type: data.type || 'interno',
    }),
  });

  const u = response.data;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    employeeCode: u.employeeCode,
    type: u.type,
    status: u.status,
    roleIds: ['role-consulta'],
    primaryRoleId: 'role-consulta',
    primaryRoleName: 'Usuário AgroGuard',
    companyIds: ['emp-01'],
    unitIds: ['und-01'],
    farmIds: [],
    teamIds: [],
    specialtyIds: [],
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    createdBy: 'Sistema API',
  };
}
