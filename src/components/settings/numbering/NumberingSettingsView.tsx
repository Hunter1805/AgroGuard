import React, { useState, useEffect } from 'react';
import { Hash, Play } from 'lucide-react';
import { numberingSettingsService } from '../../../services/numbering-settings.service';
import type { NumberingRuleItem } from '../../../types/system-settings';

export const NumberingSettingsView: React.FC = () => {
  const [rules, setRules] = useState<NumberingRuleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRules = async () => {
    setLoading(true);
    const data = await numberingSettingsService.getRules();
    setRules(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleGenerateSample = async (ruleId: string) => {
    const nextNum = await numberingSettingsService.generateNextMockNumber(ruleId);
    alert(`Próximo número gerado: ${nextNum}`);
    await fetchRules();
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[16px] font-bold text-on-surface">Numerações Automáticas</h3>
        <p className="text-[12px] text-on-surface-variant/70">
          Formatação de códigos sequenciais de OS, Equipamentos, Checklists e Inventários.
        </p>
      </div>

      <div className="glass-card rounded-xl border border-white/10 overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 text-center text-[13px] text-on-surface-variant animate-pulse">
            Carregando sequências numéricas...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-white/10 bg-surface-container-high/60 text-[11px] font-semibold text-on-surface-variant/70 uppercase">
                  <th className="py-3 px-4">Entidade</th>
                  <th className="py-3 px-4">Prefixo</th>
                  <th className="py-3 px-4">Próximo Número</th>
                  <th className="py-3 px-4">Exemplo Gerado</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rules.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-container-highest/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-on-surface flex items-center gap-2">
                      <Hash size={15} className="text-primary" />
                      {r.entityName}
                    </td>
                    <td className="py-3 px-4 font-mono-label text-primary">{r.prefix}</td>
                    <td className="py-3 px-4 font-mono-label">{r.nextNumber}</td>
                    <td className="py-3 px-4 font-mono-label text-success">{r.sampleGenerated}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleGenerateSample(r.id)}
                        className="px-3 py-1 rounded-lg bg-surface-container-highest border border-white/10 text-[11px] text-on-surface hover:text-primary flex items-center gap-1 ml-auto"
                      >
                        <Play size={12} />
                        Testar Gerador
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
