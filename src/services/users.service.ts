import type { SystemUser, UserStatus } from '../types/users';
import { dataSourceConfig } from '../config/data-source.config';
import { fetchUsersFromApi, createUserInApi } from './api-gateways/user.gateway';

let mockUsers: SystemUser[] = [
  {
    id: 'usr-01',
    name: 'Carlos Eduardo',
    email: 'carlos.eduardo@agroguard.com.br',
    phone: '(16) 99765-4321',
    documentNumber: '123.456.789-00',
    type: 'interno',
    status: 'ativo',
    roleIds: ['role-admin'],
    primaryRoleId: 'role-admin',
    primaryRoleName: 'Administrador do Sistema',
    companyIds: ['emp-01'],
    unitIds: ['und-01', 'und-02'],
    farmIds: ['fzm-01'],
    teamIds: ['eqp-01'],
    specialtyIds: ['esp-01'],
    jobTitle: 'Gerente de Manutenção & Frotas',
    employeeCode: 'MAT-1001',
    lastAccessAt: '2026-08-05T09:15:00Z',
    invitationAcceptedAt: '2026-01-10T10:00:00Z',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-08-05T09:15:00Z',
    createdBy: 'Sistema',
  },
  {
    id: 'usr-02',
    name: 'Lucas Pereira',
    email: 'lucas.pereira@agroguard.com.br',
    phone: '(16) 98877-6655',
    documentNumber: '987.654.321-11',
    type: 'interno',
    status: 'ativo',
    roleIds: ['role-mecanico'],
    primaryRoleId: 'role-mecanico',
    primaryRoleName: 'Mecânico Diesel',
    companyIds: ['emp-01'],
    unitIds: ['und-01'],
    farmIds: ['fzm-01'],
    teamIds: ['eqp-01'],
    specialtyIds: ['esp-01'],
    jobTitle: 'Técnico em Mecânica Diesel',
    employeeCode: 'MAT-1002',
    lastAccessAt: '2026-08-05T08:30:00Z',
    invitationAcceptedAt: '2026-01-15T11:00:00Z',
    createdAt: '2026-01-15T11:00:00Z',
    updatedAt: '2026-08-05T08:30:00Z',
    createdBy: 'Carlos Eduardo',
  },
  {
    id: 'usr-03',
    name: 'Juliana Paes',
    email: 'juliana.paes@agroguard.com.br',
    phone: '(16) 97766-5544',
    type: 'interno',
    status: 'ativo',
    roleIds: ['role-almoxarife'],
    primaryRoleId: 'role-almoxarife',
    primaryRoleName: 'Almoxarife',
    companyIds: ['emp-01'],
    unitIds: ['und-01'],
    farmIds: [],
    teamIds: ['eqp-03'],
    specialtyIds: [],
    jobTitle: 'Supervisora de Estoque e Materiais',
    employeeCode: 'MAT-1003',
    lastAccessAt: '2026-08-04T17:45:00Z',
    invitationAcceptedAt: '2026-02-01T09:00:00Z',
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-08-04T17:45:00Z',
    createdBy: 'Carlos Eduardo',
  },
  {
    id: 'usr-04',
    name: 'Marcos Souza',
    email: 'marcos.souza@agroguard.com.br',
    phone: '(16) 96655-4433',
    type: 'interno',
    status: 'bloqueado',
    blockedReason: 'Excesso de tentativas incorretas de login em simulação',
    roleIds: ['role-operador'],
    primaryRoleId: 'role-operador',
    primaryRoleName: 'Operador de Trator',
    companyIds: ['emp-01'],
    unitIds: ['und-02'],
    farmIds: ['fzm-01'],
    teamIds: ['eqp-02'],
    specialtyIds: [],
    jobTitle: 'Operador de Máquinas Agrícolas',
    employeeCode: 'MAT-1004',
    lastAccessAt: '2026-07-28T14:20:00Z',
    createdAt: '2026-03-10T14:00:00Z',
    updatedAt: '2026-07-28T14:20:00Z',
    createdBy: 'Carlos Eduardo',
  },
  {
    id: 'usr-05',
    name: 'Fernanda Lima',
    email: 'fernanda.lima@consultoriaagro.com',
    type: 'consultor',
    status: 'convite_pendente',
    roleIds: ['role-auditor'],
    primaryRoleId: 'role-auditor',
    primaryRoleName: 'Auditor Agrícola',
    companyIds: ['emp-01'],
    unitIds: ['und-01', 'und-02'],
    farmIds: [],
    teamIds: [],
    specialtyIds: [],
    jobTitle: 'Consultora Externa de Qualidade',
    invitationSentAt: '2026-08-02T10:00:00Z',
    createdAt: '2026-08-02T10:00:00Z',
    updatedAt: '2026-08-02T10:00:00Z',
    createdBy: 'Carlos Eduardo',
  },
];

export const usersService = {
  async getUsers(query?: string, filters?: any): Promise<SystemUser[]> {
    if (dataSourceConfig.masterData === 'api') {
      return fetchUsersFromApi(query);
    }
    let result = [...mockUsers];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.employeeCode && u.employeeCode.toLowerCase().includes(q))
      );
    }
    if (filters?.status && filters.status !== 'todos') {
      result = result.filter(u => u.status === filters.status);
    }
    return result;
  },

  async getUserById(id: string): Promise<SystemUser | undefined> {
    if (dataSourceConfig.masterData === 'api') {
      const users = await fetchUsersFromApi();
      return users.find((u: SystemUser) => u.id === id);
    }
    return mockUsers.find(u => u.id === id);
  },

  async createUser(data: Partial<SystemUser>): Promise<SystemUser> {
    if (dataSourceConfig.masterData === 'api') {
      return createUserInApi(data);
    }
    const newUser: SystemUser = {
      id: `usr-${Date.now()}`,
      name: data.name || 'Novo Usuário',
      email: data.email || '',
      phone: data.phone,
      documentNumber: data.documentNumber,
      type: data.type || 'interno',
      status: data.status || 'ativo',
      roleIds: data.roleIds || ['role-consulta'],
      primaryRoleId: data.primaryRoleId || 'role-consulta',
      primaryRoleName: data.primaryRoleName || 'Consulta',
      companyIds: data.companyIds || ['emp-01'],
      unitIds: data.unitIds || ['und-01'],
      farmIds: data.farmIds || [],
      teamIds: data.teamIds || [],
      specialtyIds: data.specialtyIds || [],
      jobTitle: data.jobTitle,
      employeeCode: data.employeeCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Usuário Logado',
    };
    mockUsers.unshift(newUser);
    return newUser;
  },

  async updateUser(id: string, data: Partial<SystemUser>): Promise<SystemUser> {
    const idx = mockUsers.findIndex(u => u.id === id);
    if (idx >= 0) {
      mockUsers[idx] = { ...mockUsers[idx], ...data, updatedAt: new Date().toISOString() };
      return mockUsers[idx];
    }
    throw new Error('Usuário não encontrado');
  },

  async blockUser(id: string, reason: string): Promise<void> {
    const u = mockUsers.find(user => user.id === id);
    if (u) {
      u.status = 'bloqueado';
      u.blockedReason = reason;
      u.updatedAt = new Date().toISOString();
    }
  },

  async unblockUser(id: string): Promise<void> {
    const u = mockUsers.find(user => user.id === id);
    if (u) {
      u.status = 'ativo';
      u.blockedReason = undefined;
      u.updatedAt = new Date().toISOString();
    }
  },

  async setStatus(id: string, status: UserStatus, reason?: string): Promise<void> {
    const u = mockUsers.find(user => user.id === id);
    if (u) {
      u.status = status;
      if (reason) u.inactiveReason = reason;
      u.updatedAt = new Date().toISOString();
    }
  },
};
