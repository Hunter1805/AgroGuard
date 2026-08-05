import React from 'react';
import { Disc, AlertTriangle } from 'lucide-react';
import type { TireAnomaly, TireInspectionResult, TireInspectionRecommendedAction } from '../../../types/tire-inspection';

interface InspectionItemState {
  positionId: string;
  positionName: string;
  tireId: string;
  tireCode: string;
  measuredPressure?: number;
  recommendedPressure?: number;
  measuredTreadDepth?: number;
  anomalies: TireAnomaly[];
  result: TireInspectionResult;
  recommendedAction: TireInspectionRecommendedAction;
  notes?: string;
}

interface TireInspectionPositionCardProps {
  item: InspectionItemState;
  onChange: (updated: InspectionItemState) => void;
}

const ANOMALY_OPTIONS: { id: TireAnomaly; label: string }[] = [
  { id: 'desgaste_irregular', label: 'Desgaste Irregular' },
  { id: 'desgaste_interno', label: 'Desgaste Interno' },
  { id: 'desgaste_externo', label: 'Desgaste Externo' },
  { id: 'corte', label: 'Corte Lateral' },
  { id: 'bolha', label: 'Bolha' },
  { id: 'rachadura', label: 'Rachadura' },
  { id: 'objeto_perfurante', label: 'Objeto Perfurante' },
  { id: 'vazamento', label: 'Vazamento' },
  { id: 'porca_frouxa', label: 'Porca Frouxa' },
  { id: 'aro_danificado', label: 'Aro Danificado' },
];

export const TireInspectionPositionCard: React.FC<TireInspectionPositionCardProps> = ({ item, onChange }) => {
  const toggleAnomaly = (anomalyId: TireAnomaly) => {
    const has = item.anomalies.includes(anomalyId);
    const updatedAnomalies = has ? item.anomalies.filter(a => a !== anomalyId) : [...item.anomalies, anomalyId];

    let newResult = item.result;
    if (updatedAnomalies.length > 0) {
      newResult = updatedAnomalies.includes('corte') || updatedAnomalies.includes('bolha') ? 'critico' : 'atencao';
    } else {
      newResult = 'conforme';
    }

    onChange({
      ...item,
      anomalies: updatedAnomalies,
      result: newResult,
    });
  };

  return (
    <div className="glass-card rounded-xl p-4 border border-white/10 space-y-3 bg-surface-container/40">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <Disc size={16} className="text-primary" />
          <span className="font-bold text-on-surface text-xs">{item.positionName}</span>
          <span className="font-mono-label text-[11px] text-primary font-bold">({item.tireCode})</span>
        </div>
        <select
          value={item.result}
          onChange={e => onChange({ ...item, result: e.target.value as any })}
          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
            item.result === 'conforme'
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : item.result === 'atencao'
              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
          }`}
        >
          <option value="conforme" className="bg-surface-container text-on-surface">Conforme</option>
          <option value="atencao" className="bg-surface-container text-on-surface">Atenção</option>
          <option value="nao_conforme" className="bg-surface-container text-on-surface">Não Conforme</option>
          <option value="critico" className="bg-surface-container text-on-surface">Crítico</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-mono-label text-on-surface-variant/70 mb-1">
            Pressão Medida (PSI) {item.recommendedPressure && <span className="text-[10px] text-emerald-400">(Rec: {item.recommendedPressure})</span>}
          </label>
          <input
            type="number"
            value={item.measuredPressure ?? ''}
            onChange={e => onChange({ ...item, measuredPressure: e.target.value === '' ? undefined : Number(e.target.value) })}
            className="w-full px-2.5 py-1.5 bg-surface-container rounded-lg border border-white/10 text-on-surface font-mono-label"
            placeholder="Ex: 32"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono-label text-on-surface-variant/70 mb-1">Sulco Medido (mm)</label>
          <input
            type="number"
            step="0.1"
            value={item.measuredTreadDepth ?? ''}
            onChange={e => onChange({ ...item, measuredTreadDepth: e.target.value === '' ? undefined : Number(e.target.value) })}
            className="w-full px-2.5 py-1.5 bg-surface-container rounded-lg border border-white/10 text-on-surface font-mono-label"
            placeholder="Ex: 14.5"
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[11px] font-mono-label text-on-surface-variant/70 mb-1">Ação Recomendada</label>
          <select
            value={item.recommendedAction}
            onChange={e => onChange({ ...item, recommendedAction: e.target.value as any })}
            className="w-full px-2.5 py-1.5 bg-surface-container rounded-lg border border-white/10 text-on-surface"
          >
            <option value="nenhuma">Nenhuma</option>
            <option value="calibrar">Calibrar</option>
            <option value="reparar">Reparar</option>
            <option value="rodiziar">Rodiziar</option>
            <option value="recapar">Recapar</option>
            <option value="substituir">Substituir</option>
            <option value="criar_os">Criar OS</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono-label text-on-surface-variant/70 mb-1 flex items-center gap-1">
          <AlertTriangle size={12} className="text-amber-400" /> Anomalias / Danos Detectados
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ANOMALY_OPTIONS.map(anomaly => {
            const isSelected = item.anomalies.includes(anomaly.id);
            return (
              <button
                key={anomaly.id}
                type="button"
                onClick={() => toggleAnomaly(anomaly.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors border ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-surface-container text-on-surface-variant/70 border-white/5 hover:bg-surface-container-highest'
                }`}
              >
                {anomaly.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
