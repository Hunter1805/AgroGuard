import type { AccessRole } from '../types/roles';
import type { ModulePermission } from '../types/permissions';

const FULL_PERMISSIONS: ModulePermission[] = [
  { module: 'dashboard', actions: { visualizar: true, criar: true, editar: true, aprovar: true, executar: true, cancelar: true, arquivar: true, exportar: true, administrar: true } },
  { module: 'alertas', actions: { visualizar: true, criar: true, editar: true, aprovar: true, executar: true, cancelar: true, arquivar: true, exportar: true, administrar: true } },
  { module: 'equipamentos', actions: { visualizar: true, criar: true, editar: true, aprovar: true, executar: true, cancelar: true, arquivar: true, exportar: true, administrar: true } },
  { module: 'leituras', actions: { visualizar: true, criar: true, editar: true, aprovar: true, executar: true, cancelar: true, arquivar: true, exportar: true, administrar: true } },
  { module: 'checklists', actions: { visualizar: true, criar: true, editar: true, aprovar: true, executar: true, cancelar: true, arquivar: true, exportar: true, administrar: true } },
  { module: 'nao_conformidades', actions: { visualizar: true, criar: true, editar: true, aprovar: true, executar: true, cancelar: true, arquivar: true, exportar: true, administrar: true } },
  { module: 'manutencoes', actions: { visualizar: true, criar: true, editar: true, aprovar: true, executar: true, cancelar: true, arquivar: true, exportar: true, administrar: true } },
  { module: 'ordens_servico', actions: { visualizar: true, criar: true, editar: true, aprovar: true, executar: true, cancelar: true, arquivar: true, exportar: true, administrar: true } },
  { module: 'pneus', actions: { visualizar: true, criar: true, editar: true, aprovar: true, executar: true, cancelar: true, arquivar: true, exportar: true, administrar: true } },
  { module: 'ferramentas', actions: { visualizar: true, criar: true, editar: true, aprovar: true, executar: true, cancelar: true, arquivar: true, exportar: true, administrar: true } },
  { module: 'pecas_insumos', actions: { visualizar: true, criar: true, editar: true, aprovar: true, executar: true, cancelar: true, arquivar: true, exportar: true, administrar: true } },
  { module: 'relatorios', actions: { visualizar: true, criar: true, editar: true, aprovar: true, executar: true, cancelar: true, arquivar: true, exportar: true, administrar: true } },
  { module: 'cadastros', actions: { visualizar: true, criar: true, editar: true, aprovar: true, executar: true, cancelar: true, arquivar: true, exportar: true, administrar: true } },
  { module: 'usuarios', actions: { visualizar: true, criar: true, editar: true, aprovar: true, executar: true, cancelar: true, arquivar: true, exportar: true, administrar: true } },
  { module: 'configuracoes', actions: { visualizar: true, criar: true, editar: true, aprovar: true, executar: true, cancelar: true, arquivar: true, exportar: true, administrar: true } },
  { module: 'auditoria', actions: { visualizar: true, criar: true, editar: true, aprovar: true, executar: true, cancelar: true, arquivar: true, exportar: true, administrar: true } },
];

let mockRoles: AccessRole[] = [
  { id: 'role-admin', code: 'ADMIN', name: 'Administrador do Sistema', description: 'Acesso irrestrito a todos os módulos, cadastros, usuários e configurações.', permissions: FULL_PERMISSIONS, systemRole: true, editable: false, active: true, userCount: 1, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z' },
  { id: 'role-gestor', code: 'GESTOR', name: 'Gestor Operacional', description: 'Acesso amplo a frotas, manutenções, aprovação de OS e gestão de custos.', permissions: FULL_PERMISSIONS, systemRole: false, editable: true, active: true, userCount: 3, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z' },
  { id: 'role-planejador', code: 'PLANEJADOR', name: 'Planejador de Manutenção', description: 'Gestão de planos preventivos, rotinas de revisão e abertura/planejamento de OS.', permissions: FULL_PERMISSIONS, systemRole: false, editable: true, active: true, userCount: 2, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z' },
  { id: 'role-supervisor', code: 'SUPERVISOR', name: 'Supervisor de Campo', description: 'Validação de checklists, programação de equipe e liberação de OS.', permissions: FULL_PERMISSIONS, systemRole: false, editable: true, active: true, userCount: 4, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z' },
  { id: 'role-mecanico', code: 'MECANICO', name: 'Mecânico / Técnico', description: 'Execução de Ordens de Serviço, apontamentos e requisição de peças.', permissions: FULL_PERMISSIONS, systemRole: false, editable: true, active: true, userCount: 8, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z' },
  { id: 'role-operador', code: 'OPERADOR', name: 'Operador de Máquinas', description: 'Leitura de horímetro, execução de checklists diários e abertura de chamados.', permissions: FULL_PERMISSIONS, systemRole: false, editable: true, active: true, userCount: 15, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z' },
  { id: 'role-inspetor', code: 'INSPETOR', name: 'Inspetor de Qualidade', description: 'Inspeções preventivas de pneus, rotinas de verificação e calibração.', permissions: FULL_PERMISSIONS, systemRole: false, editable: true, active: true, userCount: 2, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z' },
  { id: 'role-almoxarife', code: 'ALMOXARIFE', name: 'Almoxarife', description: 'Gestão de estoque de peças, entrada/saída, empréstimo de ferramentas.', permissions: FULL_PERMISSIONS, systemRole: false, editable: true, active: true, userCount: 2, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z' },
  { id: 'role-borracheiro', code: 'BORRACHEIRO', name: 'Borracheiro / Pneus', description: 'Inspeções, rodízio, reparo e calibragem da frota de pneus.', permissions: FULL_PERMISSIONS, systemRole: false, editable: true, active: true, userCount: 3, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z' },
  { id: 'role-auditor', code: 'AUDITOR', name: 'Auditor Externo', description: 'Consulta detalhada e exportação de relatórios sem permissão de alteração.', permissions: FULL_PERMISSIONS, systemRole: false, editable: true, active: true, userCount: 1, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z' },
  { id: 'role-consulta', code: 'CONSULTA', name: 'Acesso Somente Leitura', description: 'Visualização restrita de indicadores gerais e relatórios básicos.', permissions: FULL_PERMISSIONS, systemRole: true, editable: false, active: true, userCount: 1, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z' },
];

export const rolesService = {
  async getRoles(): Promise<AccessRole[]> {
    return mockRoles;
  },

  async getRoleById(id: string): Promise<AccessRole | undefined> {
    return mockRoles.find(r => r.id === id || r.code === id);
  },

  async createRole(data: Partial<AccessRole>): Promise<AccessRole> {
    const newRole: AccessRole = {
      id: `role-${Date.now()}`,
      code: data.code || `ROLE-${Math.floor(100 + Math.random() * 900)}`,
      name: data.name || 'Novo Perfil',
      description: data.description || '',
      permissions: data.permissions || FULL_PERMISSIONS,
      systemRole: false,
      editable: true,
      active: true,
      userCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockRoles.unshift(newRole);
    return newRole;
  },

  async updateRole(id: string, data: Partial<AccessRole>): Promise<AccessRole> {
    const idx = mockRoles.findIndex(r => r.id === id);
    if (idx >= 0) {
      mockRoles[idx] = { ...mockRoles[idx], ...data, updatedAt: new Date().toISOString() };
      return mockRoles[idx];
    }
    throw new Error('Perfil não encontrado');
  },

  async duplicateRole(id: string): Promise<AccessRole> {
    const source = mockRoles.find(r => r.id === id);
    if (!source) throw new Error('Perfil não encontrado');

    const copy: AccessRole = {
      ...source,
      id: `role-${Date.now()}`,
      code: `${source.code}_COP`,
      name: `${source.name} (Cópia)`,
      systemRole: false,
      editable: true,
      userCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockRoles.unshift(copy);
    return copy;
  },

  async setRoleStatus(id: string, active: boolean): Promise<void> {
    const r = mockRoles.find(role => role.id === id);
    if (r && r.editable) {
      r.active = active;
      r.updatedAt = new Date().toISOString();
    }
  },
};
