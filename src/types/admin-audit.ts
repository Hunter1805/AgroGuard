export type AdminAuditEventType =
  | 'usuario_criado'
  | 'usuario_editado'
  | 'perfil_alterado'
  | 'permissao_concedida'
  | 'permissao_removida'
  | 'usuario_bloqueado'
  | 'usuario_desbloqueado'
  | 'escopo_alterado'
  | 'configuracao_alterada'
  | 'numeracao_alterada'
  | 'regra_alerta_alterada';

export interface AdminAuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole?: string;

  eventType: AdminAuditEventType;
  module: string;
  recordId?: string;
  recordName?: string;

  previousValue?: string;
  newValue?: string;
  justification?: string;
}
