export type PermissionAction =
  | 'visualizar'
  | 'criar'
  | 'editar'
  | 'aprovar'
  | 'executar'
  | 'cancelar'
  | 'arquivar'
  | 'exportar'
  | 'administrar';

export type PermissionDecision = 'permitido' | 'negado' | 'herdado';

export type PermissionModule =
  | 'dashboard'
  | 'alertas'
  | 'equipamentos'
  | 'leituras'
  | 'checklists'
  | 'nao_conformidades'
  | 'manutencoes'
  | 'ordens_servico'
  | 'pneus'
  | 'ferramentas'
  | 'pecas_insumos'
  | 'relatorios'
  | 'cadastros'
  | 'usuarios'
  | 'configuracoes'
  | 'auditoria';

export interface ModulePermission {
  module: PermissionModule;
  actions: Record<PermissionAction, boolean>;
}

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  source?: 'perfil' | 'individual' | 'escopo' | 'status';
}
