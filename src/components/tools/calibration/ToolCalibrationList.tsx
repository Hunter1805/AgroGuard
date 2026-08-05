import React, { useState } from 'react';
import { CalendarCheck, Plus, Search } from 'lucide-react';
import { useToolCalibrations } from '../../../hooks/useToolCalibrations';
import { Button } from '../../ui/Button';
import { ToolCalibrationForm } from './ToolCalibrationForm';

export const ToolCalibrationList: React.FC = () => {
  const { calibrations, loading, search, setSearch, refetch } = useToolCalibrations();
  const [showModal, setShowModal] = useState(false);

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'aprovada':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Aprovada</span>;
      case 'aprovada_com_restricao':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">Com Restrição</span>;
      case 'reprovada':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">Reprovada</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">Aguardando</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low/30 p-4 rounded-xl border border-white/10">
        <div>
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <CalendarCheck className="text-primary" size={18} />
            Calibrações e Aferições Técnicas
          </h3>
          <p className="text-xs text-on-surface-variant/70 mt-0.5">
            Certificados de torquímetros, multímetros, manômetros e instrumentos de medição da frota.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setShowModal(true)} className="flex items-center gap-1.5">
          <Plus size={16} /> Nova Calibração
        </Button>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder="Buscar por ferramenta, certificado ou laboratório..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-surface-container/60 rounded-xl border border-white/10 text-xs text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>
          <span className="text-xs font-mono-label text-on-surface-variant">{calibrations.length} calibrações registradas</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-on-surface-variant">Carregando calibrações...</div>
        ) : calibrations.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <CalendarCheck className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
            <p className="text-xs font-bold text-on-surface">Nenhuma calibração registrada</p>
            <p className="text-xs text-on-surface-variant/70">O histórico de aferições e certificados aparecerá aqui.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
                  <th className="px-4 py-3 font-medium">Ferramenta</th>
                  <th className="px-4 py-3 font-medium">Tipo de Calibração</th>
                  <th className="px-4 py-3 font-medium">Certificado</th>
                  <th className="px-4 py-3 font-medium">Laboratório Responsável</th>
                  <th className="px-4 py-3 font-medium">Data Calibração</th>
                  <th className="px-4 py-3 font-medium">Próxima Calibração</th>
                  <th className="px-4 py-3 font-medium">Resultado</th>
                  <th className="px-4 py-3 font-medium text-right">Custo (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant font-mono-label">
                {calibrations.map(cal => (
                  <tr key={cal.id} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-on-surface block font-sans">{cal.toolName}</span>
                      <span className="text-[10px] text-primary block font-mono-label font-bold">{cal.toolCode}</span>
                    </td>
                    <td className="px-4 py-3 font-sans text-on-surface-variant/90">{cal.calibrationType}</td>
                    <td className="px-4 py-3 text-primary font-bold">{cal.certificateNumber || 'Sem Certificado'}</td>
                    <td className="px-4 py-3 font-sans">{cal.responsibleCompany}</td>
                    <td className="px-4 py-3 text-[11px]">{cal.calibrationDate ? new Date(cal.calibrationDate).toLocaleDateString('pt-BR') : '—'}</td>
                    <td className="px-4 py-3 text-[11px]">
                      <span className={cal.nextCalibrationDate && cal.nextCalibrationDate < new Date().toISOString().split('T')[0] ? 'text-rose-400 font-bold' : ''}>
                        {cal.nextCalibrationDate ? new Date(cal.nextCalibrationDate).toLocaleDateString('pt-BR') : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans">{getResultBadge(cal.result)}</td>
                    <td className="px-4 py-3 text-right font-bold text-on-surface">
                      {cal.cost ? `R$ ${cal.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <ToolCalibrationForm onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); refetch(); }} />
      )}
    </div>
  );
};
