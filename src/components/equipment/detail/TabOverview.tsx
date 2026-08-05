import React from 'react';
import type { Equipment } from '../../../types/equipment';
import { Gauge, MapPin, Calendar, User, Fuel, Shield } from 'lucide-react';

interface TabOverviewProps {
  equipment: Equipment;
}

export const TabOverview: React.FC<TabOverviewProps> = ({ equipment }) => {
  const unit = equipment.meterType === 'odometro' ? 'km' : 'horas';

  return (
    <div className="space-y-6">
      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Gauge size={20} />
          </div>
          <div>
            <span className="text-[11px] text-on-surface-variant/60 font-mono-label uppercase">Medidor Atual</span>
            <p className="font-title-md text-[18px] font-bold text-on-surface font-mono-label">
              {equipment.currentHours.toLocaleString('pt-BR')} {unit}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/10 border border-warning/20 flex items-center justify-center text-warning">
            <Fuel size={20} />
          </div>
          <div>
            <span className="text-[11px] text-on-surface-variant/60 font-mono-label uppercase">Combustível</span>
            <p className="font-title-md text-[18px] font-bold text-on-surface font-mono-label">
              {equipment.fuelLevel}%
            </p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center text-success">
            <MapPin size={20} />
          </div>
          <div>
            <span className="text-[11px] text-on-surface-variant/60 font-mono-label uppercase">Localização</span>
            <p className="font-title-md text-[14px] font-medium text-on-surface truncate max-w-[150px]">
              {equipment.location}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-tertiary/10 border border-tertiary/20 flex items-center justify-center text-tertiary">
            <Calendar size={20} />
          </div>
          <div>
            <span className="text-[11px] text-on-surface-variant/60 font-mono-label uppercase">Próx. Revisão</span>
            <p className="font-title-md text-[14px] font-medium text-on-surface font-mono-label">
              {equipment.nextMaintenanceDate || '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Ficha de Dados Detalhados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5 border border-white/10 space-y-3">
          <h4 className="text-[13px] font-semibold text-on-surface flex items-center gap-2 pb-2 border-b border-white/10">
            <Shield size={16} className="text-primary" /> Informações do Ativo
          </h4>
          <div className="space-y-2 text-[12px]">
            <div className="flex justify-between">
              <span className="text-on-surface-variant/70">Código / Placa:</span>
              <span className="font-mono-label text-on-surface font-semibold">{equipment.plateOrCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant/70">Patrimônio:</span>
              <span className="font-mono-label text-on-surface">{equipment.patrimony || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant/70">Número de Série / Chassi:</span>
              <span className="font-mono-label text-on-surface">{equipment.serialNumber || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant/70">Ano de Fabricação:</span>
              <span className="text-on-surface">{equipment.year || '—'}</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-white/10 space-y-3">
          <h4 className="text-[13px] font-semibold text-on-surface flex items-center gap-2 pb-2 border-b border-white/10">
            <User size={16} className="text-primary" /> Alocação & Operação
          </h4>
          <div className="space-y-2 text-[12px]">
            <div className="flex justify-between">
              <span className="text-on-surface-variant/70">Fazenda / Unidade:</span>
              <span className="text-on-surface font-medium">{equipment.farm || 'Fazenda Principal'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant/70">Setor / Cultura:</span>
              <span className="text-on-surface font-medium">{equipment.sector || 'Geral'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant/70">Operador Atribuído:</span>
              <span className="text-on-surface">{equipment.operatorName || 'Não atribuído'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant/70">Última Manutenção:</span>
              <span className="font-mono-label text-on-surface">{equipment.lastMaintenanceDate || '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
