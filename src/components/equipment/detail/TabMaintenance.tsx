import React from 'react';
import type { Equipment } from '../../../types/equipment';
import { StatusBadge } from '../../ui/StatusBadge';

interface TabMaintenanceProps {
  equipment?: Equipment;
}

export const TabMaintenance: React.FC<TabMaintenanceProps> = () => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-[14px] font-semibold text-on-surface">Planos Preventivos e Manutenções</h4>
        <p className="text-[12px] text-on-surface-variant/70">Planos de revisão periódicos atrelados a este equipamento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5 border border-white/10 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono-label text-primary uppercase">Plano Ativo</span>
              <h5 className="font-title-md text-[15px] font-bold text-on-surface">Revisão Periódica 250h</h5>
            </div>
            <StatusBadge status="Em Progresso" />
          </div>
          <p className="text-[12px] text-on-surface-variant/70">
            Troca de óleo de motor, substituição dos filtros de ar e combustível, regulagem de válvulas.
          </p>
          <div className="space-y-1.5 text-[11px] font-mono-label pt-2 border-t border-white/5">
            <div className="flex justify-between">
              <span className="text-on-surface-variant/60">Gatilho:</span>
              <span className="text-on-surface">A cada 250 horas</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant/60">Última realização:</span>
              <span className="text-on-surface">6.550 h (10/07/2026)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant/60">Próxima realização:</span>
              <span className="text-warning font-bold">6.800 h (Vencimento estimado)</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-white/10 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono-label text-on-surface-variant/60 uppercase">Plano Anual</span>
              <h5 className="font-title-md text-[15px] font-bold text-on-surface">Revisão Geral de Entressafra</h5>
            </div>
            <StatusBadge status="Pendente" />
          </div>
          <p className="text-[12px] text-on-surface-variant/70">
            Revisão completa do sistema hidráulico, transmissão, embreagem e alinhamento do chassi.
          </p>
          <div className="space-y-1.5 text-[11px] font-mono-label pt-2 border-t border-white/5">
            <div className="flex justify-between">
              <span className="text-on-surface-variant/60">Gatilho:</span>
              <span className="text-on-surface">Anual (Novembro)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant/60">Previsto para:</span>
              <span className="text-primary font-bold">15/11/2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
