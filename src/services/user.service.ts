import type { UserProfile } from '../types/user';

const mockUsers: UserProfile[] = [
  { id: '1', name: 'João Silva', role: 'Administrador Geral', unit: 'Fazenda São João', status: 'Ativo', email: 'joao.silva@agroguard.com' },
  { id: '2', name: 'Carlos Eduardo', role: 'Chefe de Oficina', unit: 'Oficina Central', status: 'Ativo', email: 'carlos.eduardo@agroguard.com' },
  { id: '3', name: 'Mariana Costa', role: 'Gestora Financeira', unit: 'Sede Administrativa', status: 'Ativo', email: 'mariana.costa@agroguard.com' },
  { id: '4', name: 'Lucas Pereira', role: 'Técnico de Campo', unit: 'Fazenda São João', status: 'Ativo', email: 'lucas.pereira@agroguard.com' },
];

export const userService = {
  async getCurrentUser(): Promise<UserProfile> {
    return Promise.resolve(mockUsers[0]);
  },

  async getAllUsers(): Promise<UserProfile[]> {
    return Promise.resolve([...mockUsers]);
  },
};
