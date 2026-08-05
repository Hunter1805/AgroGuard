import React from 'react';
import type { ToolCalibration } from '../../../types/tool-calibration';
import { CalendarCheck } from 'lucide-react';

interface ToolCalibrationTabProps {
  calibrations: ToolCalibration[];
}

export const ToolCalibrationTab: React.FC<ToolCalibrationTabProps> = ({ calibrations }) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 text-xs">
      <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
        <CalendarCheck size={16} className="text-primary" /> Histórico de Calibrações e Certificados
      </h3>

      {calibrations.length === 0 ? (
        <p className="text-xs text-on-surface-variant/60 py-4 text-center">Nenhuma calibração registrada para esta ferramenta.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
                <th className="px-3.5 py-2 font-medium">Certificado</th>
                <th className="px-3.5 py-2 font-medium">Laboratório</th>
                <th className="px-3.5 py-2 font-medium">Data Calibração</th>
                <th className="px-3.5 py-2 font-medium">Validade / Próxima</th>
                <th className="px-3.5 py-2 font-medium">Resultado</th>
                <th className="px-3.5 py-2 font-medium text-right">Custo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-on-surface-variant font-mono-label">
              {calibrations.map(c => (
                <tr key={c.id} className="hover:bg-surface-container-highest/20">
                  <td className="px-3.5 py-2.5 text-primary font-bold">{c.certificateNumber || '—'}</td>
                  <td className="px-3.5 py-2.5 font-sans">{c.responsibleCompany}</td>
                  <td className="px-3.5 py-2.5">{c.calibrationDate ? new Date(c.calibrationDate).toLocaleDateString('pt-BR') : '—'}</td>
                  <td className="px-3.5 py-2.5">{c.nextCalibrationDate ? new Date(c.nextCalibrationDate).toLocaleDateString('pt-BR') : '—'}</td>
                  <td className="px-3.5 py-2.5 font-sans font-bold capitalize text-emerald-400">{c.result}</td>
                  <td className="px-3.5 py-2.5 text-right font-bold text-on-surface">
                    R$ {(c.cost || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
