import React, { useState, useEffect } from 'react';
import { Bell, Power } from 'lucide-react';
import { alertSettingsService, type AlertRuleConfig } from '../../../services/alert-settings.service';

export const AlertSettingsView: React.FC = () => {
  const [rules, setRules] = useState<AlertRuleConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    alertSettingsService.getAlertRules().then((data) => {
      setRules(data);
      setLoading(false);
    });
  }, []);

  const handleToggle = async (id: string, active: boolean) => {
    await alertSettingsService.toggleRule(id, active);
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, active } : r)));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[16px] font-bold text-on-surface">Regras Globais de Alertas</h3>
        <p className="text-[12px] text-on-surface-variant/70">
          Ative ou inative notificações do sistema e prioridades de atendimento.
        </p>
      </div>

      <div className="glass-card rounded-xl border border-white/10 overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 text-center text-[13px] text-on-surface-variant animate-pulse">
            Carregando regras de alertas...
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {rules.map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between hover:bg-surface-container-highest/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10 text-warning border border-warning/20">
                    <Bell size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[14px] text-on-surface">{r.alertType}</h4>
                      <span className="text-[10px] font-mono-label text-on-surface-variant/60 uppercase">({r.moduleName})</span>
                    </div>
                    <p className="text-[12px] text-on-surface-variant/70 mt-0.5">{r.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-label bg-error/10 text-error uppercase border border-error/20">
                    {r.priority}
                  </span>
                  <button
                    onClick={() => handleToggle(r.id, !r.active)}
                    className={`p-2 rounded-lg transition-all ${
                      r.active ? 'bg-success/20 text-success border border-success/30' : 'bg-surface-container-high text-on-surface-variant/40'
                    }`}
                  >
                    <Power size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
