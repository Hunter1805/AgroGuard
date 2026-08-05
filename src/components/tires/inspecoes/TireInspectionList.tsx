import React, { useState } from 'react';
import { Plus, Search, ClipboardCheck, Eye } from 'lucide-react';
import { useTireInspections } from '../../../hooks/useTireInspections';
import { Button } from '../../ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../types/routes';

export const TireInspectionList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { inspections, loading } = useTireInspections();

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'conforme':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Conforme</span>;
      case 'atencao':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">Atenção</span>;
      case 'nao_conforme':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">Não Conforme</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">Crítico</span>;
    }
  };

  const filtered = inspections.filter(i => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      i.id.toLowerCase().includes(q) ||
      i.equipmentId.toLowerCase().includes(q) ||
      i.responsibleName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low/30 p-4 rounded-xl border border-white/10">
        <div>
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <ClipboardCheck className="text-primary" size={18} />
            Inspeções Técnicas de Pneus
          </h3>
          <p className="text-xs text-on-surface-variant/70 mt-0.5">
            Registro de auditorias de pressão, medições de profundidade de sulco e identificação de anomalias.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => navigate(ROUTES.PNEUS_INSPECAO_NOVA)} className="flex items-center gap-1.5">
          <Plus size={16} /> Nova Inspeção
        </Button>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder="Buscar por código de inspeção, equipamento ou responsável..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-surface-container/60 rounded-xl border border-white/10 text-xs text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>
          <span className="text-xs text-on-surface-variant font-mono-label">{inspections.length} inspeções realizadas</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-on-surface-variant">Carregando inspeções...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <ClipboardCheck className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
            <p className="text-xs font-bold text-on-surface">Nenhuma inspeção registrada</p>
            <p className="text-xs text-on-surface-variant/70">As inspeções de pressão, sulco e condição aparecerão aqui.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
                  <th className="px-4 py-3 font-medium">Cód. Inspeção</th>
                  <th className="px-4 py-3 font-medium">Equipamento</th>
                  <th className="px-4 py-3 font-medium">Data / Hora</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Pneus Inspecionados</th>
                  <th className="px-4 py-3 font-medium">Resultado Geral</th>
                  <th className="px-4 py-3 font-medium">Responsável</th>
                  <th className="px-4 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant">
                {filtered.map(insp => (
                  <tr key={insp.id} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-4 py-3 font-mono-label font-bold text-primary">{insp.id}</td>
                    <td className="px-4 py-3 font-semibold text-on-surface">{insp.equipmentId}</td>
                    <td className="px-4 py-3 font-mono-label text-[11px]">
                      {new Date(insp.date).toLocaleDateString('pt-BR')} {new Date(insp.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 capitalize">{insp.inspectionType.replace('_', ' ')}</td>
                    <td className="px-4 py-3 font-mono-label">{insp.items?.length || 0} pneus</td>
                    <td className="px-4 py-3">{getResultBadge(insp.overallResult)}</td>
                    <td className="px-4 py-3">{insp.responsibleName}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/pneus/inspecoes/${insp.id}`)}
                        className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors"
                        title="Ver Detalhes"
                      >
                        <Eye size={15} />
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
