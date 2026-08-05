import React from 'react';
import type { TireInspectionHeader, TireCalibrationLog } from '../../../types/tire-inspection';
import { ClipboardCheck, Gauge } from 'lucide-react';

interface TireInspectionHistoryTabProps {
  inspections: TireInspectionHeader[];
  calibrations: TireCalibrationLog[];
}

export const TireInspectionHistoryTab: React.FC<TireInspectionHistoryTabProps> = ({ inspections, calibrations }) => {
  return (
    <div className="space-y-6">
      {/* Calibragens */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
        <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
          <Gauge size={16} className="text-primary" /> Histórico de Calibragens
        </h3>

        {calibrations.length === 0 ? (
          <p className="text-xs text-on-surface-variant/60 py-4 text-center">Nenhuma calibragem registrada individualmente para este pneu.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
                  <th className="px-3.5 py-2 font-medium">Data</th>
                  <th className="px-3.5 py-2 font-medium">Pressão Anterior</th>
                  <th className="px-3.5 py-2 font-medium">Pressão Ajustada</th>
                  <th className="px-3.5 py-2 font-medium">Recomendada</th>
                  <th className="px-3.5 py-2 font-medium">Responsável</th>
                  <th className="px-3.5 py-2 font-medium">Equipamento Utilizado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant font-mono-label">
                {calibrations.map(c => (
                  <tr key={c.id} className="hover:bg-surface-container-highest/20">
                    <td className="px-3.5 py-2.5">{new Date(c.date).toLocaleDateString('pt-BR')}</td>
                    <td className="px-3.5 py-2.5 text-amber-400 font-bold">{c.previousPressure ?? '—'} {c.unit}</td>
                    <td className="px-3.5 py-2.5 text-emerald-400 font-bold">{c.adjustedPressure} {c.unit}</td>
                    <td className="px-3.5 py-2.5">{c.recommendedPressure ?? '—'} {c.unit}</td>
                    <td className="px-3.5 py-2.5 text-on-surface font-sans">{c.responsibleName}</td>
                    <td className="px-3.5 py-2.5 text-on-surface-variant/70 font-sans">{c.equipmentUsed || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspeções Completas */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
        <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
          <ClipboardCheck size={16} className="text-primary" /> Inspeções com Avaliação de Sulco e Anomalias
        </h3>

        {inspections.length === 0 ? (
          <p className="text-xs text-on-surface-variant/60 py-4 text-center">Nenhuma inspeção associada a este pneu.</p>
        ) : (
          <div className="space-y-3">
            {inspections.map(insp => {
              const item = insp.items.find(i => i.tireId);
              return (
                <div key={insp.id} className="p-3.5 bg-surface-container/40 rounded-xl border border-white/5 text-xs space-y-2">
                  <div className="flex items-center justify-between font-mono-label">
                    <span className="font-bold text-primary">{insp.id} ({new Date(insp.date).toLocaleDateString('pt-BR')})</span>
                    <span className="capitalize text-on-surface-variant">Inspetor: {insp.responsibleName}</span>
                  </div>
                  {item && (
                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono-label text-on-surface-variant">
                      <span>Pressão: <strong className="text-on-surface">{item.measuredPressure} PSI</strong></span>
                      <span>Sulco: <strong className="text-on-surface">{item.measuredTreadDepth} mm</strong></span>
                      <span>Resultado: <strong className="text-emerald-400 capitalize">{item.result}</strong></span>
                      {item.anomalies.length > 0 && (
                        <span className="text-amber-400 font-bold">Anomalias: {item.anomalies.join(', ')}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
