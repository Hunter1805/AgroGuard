import React, { useState } from 'react';

export const ConfiguracoesView: React.FC = () => {
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyAlerts, setNotifyAlerts] = useState(true);
  const [maintenanceInterval, setMaintenanceInterval] = useState('250');

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl">
      <div>
        <h2 className="font-title-md text-[24px] font-semibold text-on-surface tracking-tight">Configurações do Sistema</h2>
        <p className="font-body-sm text-[13px] text-on-surface-variant/70 mt-0.5">Parâmetros de alerta, notificações e limites operacionais.</p>
      </div>

      <div className="glass-card rounded-xl p-6 border border-white/5 space-y-6">
        <div>
          <h3 className="font-title-md text-[16px] font-semibold text-on-surface mb-4">Notificações e Alertas</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-[13px] font-medium text-on-surface">Notificações por E-mail</p>
                <p className="text-[11px] text-on-surface-variant/70">Receber alertas de manutenções vencidas e críticas no e-mail.</p>
              </div>
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-[13px] font-medium text-on-surface">Alertas na Interface (Push)</p>
                <p className="text-[11px] text-on-surface-variant/70">Exibir balão de contagem de alertas no cabeçalho superior.</p>
              </div>
              <input
                type="checkbox"
                checked={notifyAlerts}
                onChange={(e) => setNotifyAlerts(e.target.checked)}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <h3 className="font-title-md text-[16px] font-semibold text-on-surface mb-4">Parâmetros de Manutenção Preventiva</h3>
          <div className="space-y-3">
            <label className="block text-[12px] font-medium text-on-surface-variant">Intervalo Padrão de Revisão Preventiva (Horas de Uso)</label>
            <input
              type="number"
              value={maintenanceInterval}
              onChange={(e) => setMaintenanceInterval(e.target.value)}
              className="w-64 bg-surface-container-highest border border-white/10 rounded-md py-2 px-3 text-[13px] text-on-surface focus:outline-none focus:border-primary/50"
            />
            <p className="text-[11px] text-on-surface-variant/60">Define após quantas horas de operação o sistema emitirá aviso preventivo automático.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
