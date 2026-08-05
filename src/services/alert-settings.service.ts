export interface AlertRuleConfig {
  id: string;
  moduleName: string;
  alertType: string;
  description: string;
  active: boolean;
  priority: 'baixa' | 'media' | 'alta' | 'critica';
  daysAhead: number;
  inAppNotification: boolean;
  emailNotification: boolean;
}

let mockAlertRules: AlertRuleConfig[] = [
  { id: 'alt-01', moduleName: 'Manutenção', alertType: 'Preventiva Vencida ou Próxima', description: 'Gera alerta quando o horímetro do equipamento se aproxima do limite de revisão.', active: true, priority: 'alta', daysAhead: 7, inAppNotification: true, emailNotification: false },
  { id: 'alt-02', moduleName: 'Pneus', alertType: 'Sulco Mínimo Atingido', description: 'Gera alerta quando a profundidade do sulco do pneu está abaixo do limite de segurança.', active: true, priority: 'critica', daysAhead: 1, inAppNotification: true, emailNotification: true },
  { id: 'alt-03', moduleName: 'Ferramentas', alertType: 'Vencimento de Calibração', description: 'Alerta sobre instrumentos e ferramentas com calibração técnica prestes a vencer.', active: true, priority: 'media', daysAhead: 15, inAppNotification: true, emailNotification: false },
  { id: 'alt-04', moduleName: 'Estoque', alertType: 'Nível Mínimo Atingido', description: 'Gera alerta quando o saldo disponível do item de estoque atinge o ponto de pedido.', active: true, priority: 'media', daysAhead: 5, inAppNotification: true, emailNotification: false },
  { id: 'alt-05', moduleName: 'Checklists', alertType: 'Não Conformidade Crítica', description: 'Alerta imediato quando um operador registra falha crítica no checklist diário.', active: true, priority: 'critica', daysAhead: 0, inAppNotification: true, emailNotification: true },
];

export const alertSettingsService = {
  async getAlertRules(): Promise<AlertRuleConfig[]> {
    return mockAlertRules;
  },

  async toggleRule(id: string, active: boolean): Promise<void> {
    const rule = mockAlertRules.find(r => r.id === id);
    if (rule) rule.active = active;
  },

  async updateRule(id: string, data: Partial<AlertRuleConfig>): Promise<AlertRuleConfig> {
    const idx = mockAlertRules.findIndex(r => r.id === id);
    if (idx >= 0) {
      mockAlertRules[idx] = { ...mockAlertRules[idx], ...data };
      return mockAlertRules[idx];
    }
    throw new Error('Regra não encontrada');
  },
};
