import React from 'react';
import { ShieldAlert, Wrench, ClockAlert } from 'lucide-react';
import type { Equipment } from '../../../types/equipment';

interface EquipmentStatusNoticeProps {
  equipment: Equipment;
}

export const EquipmentStatusNotice: React.FC<EquipmentStatusNoticeProps> = ({ equipment }) => {
  if (equipment.status === 'bloqueado') {
    return (
      <div className="bg-error/15 border border-error/40 rounded-xl p-4 text-error flex items-start gap-3 animate-fade-in shadow-lg">
        <ShieldAlert size={22} className="shrink-0 mt-0.5" />
        <div>
          <h4 className="font-title-md text-[14px] font-bold">Equipamento Bloqueado para Operação</h4>
          <p className="text-[12px] opacity-90 mt-0.5">
            Existe uma falha crítica ou restrição de segurança ativa impedindo a liberação de uso no campo.
          </p>
        </div>
      </div>
    );
  }

  if (equipment.status === 'manutencao' || equipment.status === 'inoperante') {
    return (
      <div className="bg-warning/15 border border-warning/40 rounded-xl p-4 text-warning flex items-start gap-3 animate-fade-in shadow-lg">
        <Wrench size={22} className="shrink-0 mt-0.5" />
        <div>
          <h4 className="font-title-md text-[14px] font-bold">Equipamento em Manutenção na Oficina</h4>
          <p className="text-[12px] opacity-90 mt-0.5">
            Ordem de Serviço (OS-2026-0042) em andamento. Aguardando finalização dos testes operacionais.
          </p>
        </div>
      </div>
    );
  }

  if (equipment.isReadingOverdue) {
    return (
      <div className="bg-warning/10 border border-warning/30 rounded-xl p-3.5 text-warning flex items-center gap-3 animate-fade-in">
        <ClockAlert size={20} className="shrink-0" />
        <div className="text-[12px]">
          <strong>Atenção:</strong> Leitura de horímetro/odômetro pendente de atualização há mais de 3 dias.
        </div>
      </div>
    );
  }

  return null;
};
