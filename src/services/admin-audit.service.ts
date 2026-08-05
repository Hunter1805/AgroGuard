import type { AdminAuditEvent } from '../types/admin-audit';

let mockAuditEvents: AdminAuditEvent[] = [
  {
    id: 'aud-01',
    timestamp: '2026-08-05T09:30:00Z',
    userId: 'usr-01',
    userName: 'Carlos Eduardo',
    userRole: 'Administrador do Sistema',
    eventType: 'usuario_editado',
    module: 'Usuários',
    recordId: 'usr-02',
    recordName: 'Lucas Pereira',
    previousValue: 'Perfil: Mecânico',
    newValue: 'Perfil: Mecânico + Inspetor',
    justification: 'Atribuição de responsabilidade de auditoria de pneus em campo.',
  },
  {
    id: 'aud-02',
    timestamp: '2026-08-04T16:20:00Z',
    userId: 'usr-01',
    userName: 'Carlos Eduardo',
    userRole: 'Administrador do Sistema',
    eventType: 'regra_alerta_alterada',
    module: 'Alertas',
    recordId: 'alt-02',
    recordName: 'Sulco Mínimo Atingido',
    previousValue: 'Prioridade: Alta',
    newValue: 'Prioridade: Crítica',
    justification: 'Alinhamento com diretriz de segurança de frota pesada.',
  },
  {
    id: 'aud-03',
    timestamp: '2026-08-03T11:10:00Z',
    userId: 'usr-01',
    userName: 'Carlos Eduardo',
    userRole: 'Administrador do Sistema',
    eventType: 'numeracao_alterada',
    module: 'Numerações',
    recordId: 'num-os',
    recordName: 'Ordens de Serviço',
    previousValue: 'Próximo: 4029',
    newValue: 'Próximo: 4030',
    justification: 'Ajuste de sequência para início de lote de agendamento mensal.',
  },
];

export const adminAuditService = {
  async getAuditEvents(filters?: any): Promise<AdminAuditEvent[]> {
    let result = [...mockAuditEvents];
    if (filters?.module && filters.module !== 'todos') {
      result = result.filter(e => e.module === filters.module);
    }
    return result;
  },

  async logEvent(event: Omit<AdminAuditEvent, 'id' | 'timestamp'>): Promise<AdminAuditEvent> {
    const newEvent: AdminAuditEvent = {
      ...event,
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    mockAuditEvents.unshift(newEvent);
    return newEvent;
  },
};
