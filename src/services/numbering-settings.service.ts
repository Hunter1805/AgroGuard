import type { NumberingRuleItem } from '../types/system-settings';

let mockNumberingRules: NumberingRuleItem[] = [
  { id: 'num-os', entityName: 'Ordens de Serviço', prefix: 'OS', nextNumber: 4030, digitsCount: 5, yearlyReset: true, includeYear: true, sampleGenerated: 'OS-2026-04030' },
  { id: 'num-eq', entityName: 'Equipamentos / Ativos', prefix: 'EQ', nextNumber: 129, digitsCount: 4, yearlyReset: false, includeYear: false, sampleGenerated: 'EQ-0129' },
  { id: 'num-chk', entityName: 'Checklists Diários', prefix: 'CHK', nextNumber: 1580, digitsCount: 6, yearlyReset: true, includeYear: true, sampleGenerated: 'CHK-2026-001580' },
  { id: 'num-pneu', entityName: 'Pneus e Rodados', prefix: 'PN', nextNumber: 840, digitsCount: 5, yearlyReset: false, includeYear: false, sampleGenerated: 'PN-00840' },
  { id: 'num-inv', entityName: 'Inventários de Estoque', prefix: 'INV', nextNumber: 18, digitsCount: 4, yearlyReset: true, includeYear: true, sampleGenerated: 'INV-2026-0018' },
];

export const numberingSettingsService = {
  async getRules(): Promise<NumberingRuleItem[]> {
    return mockNumberingRules;
  },

  async updateRule(id: string, data: Partial<NumberingRuleItem>): Promise<NumberingRuleItem> {
    const idx = mockNumberingRules.findIndex(r => r.id === id);
    if (idx >= 0) {
      const yearStr = data.includeYear ? `${new Date().getFullYear()}-` : '';
      const numStr = String(data.nextNumber || mockNumberingRules[idx].nextNumber).padStart(data.digitsCount || mockNumberingRules[idx].digitsCount, '0');
      const prefixStr = data.prefix !== undefined ? data.prefix : mockNumberingRules[idx].prefix;
      const sampleGenerated = `${prefixStr ? prefixStr + '-' : ''}${yearStr}${numStr}`;

      mockNumberingRules[idx] = {
        ...mockNumberingRules[idx],
        ...data,
        sampleGenerated,
      };
      return mockNumberingRules[idx];
    }
    throw new Error('Regra não encontrada');
  },

  async generateNextMockNumber(type: string): Promise<string> {
    const rule = mockNumberingRules.find(r => r.id === type || r.prefix === type);
    if (!rule) return `${type}-${Date.now()}`;
    const yearStr = rule.includeYear ? `${new Date().getFullYear()}-` : '';
    const numStr = String(rule.nextNumber).padStart(rule.digitsCount, '0');
    const result = `${rule.prefix ? rule.prefix + '-' : ''}${yearStr}${numStr}`;
    rule.nextNumber += 1;
    return result;
  },
};
