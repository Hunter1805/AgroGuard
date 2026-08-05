import React, { useState } from 'react';
import { History, Search, ArrowRightLeft, Wrench, RefreshCw, PlusCircle, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useTireMovements } from '../../../hooks/useTireMovements';
import type { TireAction } from '../../../types/tire-movement';

export const TireMovementList: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<TireAction | ''>('');
  const [search, setSearch] = useState('');
  const { movements, loading } = useTireMovements({ action: selectedAction || undefined });

  const getActionBadge = (action: TireAction) => {
    switch (action) {
      case 'cadastro':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1 w-fit"><PlusCircle size={10} /> Cadastro</span>;
      case 'instalacao':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit"><CheckCircle2 size={10} /> Instalação</span>;
      case 'remocao':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit"><Wrench size={10} /> Remoção</span>;
      case 'rodizio':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1 w-fit"><RefreshCw size={10} /> Rodízio</span>;
      case 'transferencia':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/15 text-teal-400 border border-teal-500/30 flex items-center gap-1 w-fit"><ArrowRightLeft size={10} /> Transferência</span>;
      case 'reparo':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30 flex items-center gap-1 w-fit"><Wrench size={10} /> Reparo</span>;
      case 'recapagem':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center gap-1 w-fit"><RefreshCw size={10} /> Recapagem</span>;
      case 'descarte':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-500/15 text-zinc-400 border border-zinc-500/30 flex items-center gap-1 w-fit"><Trash2 size={10} /> Descarte</span>;
      case 'calibragem':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center gap-1 w-fit">Calibragem</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-500/15 text-gray-400 border border-gray-500/30 flex items-center gap-1 w-fit"><ShieldAlert size={10} /> {action}</span>;
    }
  };

  const filteredMovements = movements.filter(m => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.tireId.toLowerCase().includes(q) ||
      m.equipmentName?.toLowerCase().includes(q) ||
      m.responsibleName.toLowerCase().includes(q) ||
      m.notes?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low/30 p-4 rounded-xl border border-white/10">
        <div>
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <History className="text-primary" size={18} />
            Histórico Consolidado de Movimentações
          </h3>
          <p className="text-xs text-on-surface-variant/70 mt-0.5">
            Registro auditável de todas as alterações de posição, instalações, rodízios, calibrações e manutenções de pneus.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder="Buscar por código do pneu, equipamento ou responsável..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-surface-container/60 rounded-xl border border-white/10 text-xs text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>

          <select
            value={selectedAction}
            onChange={e => setSelectedAction(e.target.value as any)}
            className="bg-surface-container/60 rounded-xl border border-white/10 text-xs px-3 py-1.5 text-on-surface focus:outline-none focus:border-primary/50"
          >
            <option value="">Todas as Ações</option>
            <option value="cadastro">Cadastro</option>
            <option value="instalacao">Instalação</option>
            <option value="remocao">Remoção</option>
            <option value="rodizio">Rodízio</option>
            <option value="transferencia">Transferência</option>
            <option value="calibragem">Calibragem</option>
            <option value="reparo">Reparo</option>
            <option value="recapagem">Recapagem</option>
            <option value="descarte">Descarte</option>
          </select>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-on-surface-variant">Carregando histórico...</div>
        ) : filteredMovements.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <History className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
            <p className="text-xs font-bold text-on-surface">Nenhuma movimentação registrada</p>
            <p className="text-xs text-on-surface-variant/70">Instalações, rodízios, transferências e substituições aparecerão aqui.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-highest/40 text-on-surface-variant/70 font-mono-label uppercase border-b border-white/5">
                  <th className="px-4 py-3 font-medium">Data / Hora</th>
                  <th className="px-4 py-3 font-medium">Cód. Pneu</th>
                  <th className="px-4 py-3 font-medium">Ação</th>
                  <th className="px-4 py-3 font-medium">Equipamento</th>
                  <th className="px-4 py-3 font-medium">Origem / Destino</th>
                  <th className="px-4 py-3 font-medium">Responsável</th>
                  <th className="px-4 py-3 font-medium">Custo</th>
                  <th className="px-4 py-3 font-medium">Observações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant">
                {filteredMovements.map(mov => (
                  <tr key={mov.id} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-4 py-3 font-mono-label text-[11px]">
                      {new Date(mov.date).toLocaleDateString('pt-BR')} {new Date(mov.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 font-mono-label font-bold text-primary">{mov.tireId}</td>
                    <td className="px-4 py-3">{getActionBadge(mov.action)}</td>
                    <td className="px-4 py-3">{mov.equipmentName || '—'}</td>
                    <td className="px-4 py-3 font-mono-label text-[11px]">
                      {mov.originPositionName && <span className="block text-on-surface-variant/70">De: {mov.originPositionName}</span>}
                      {mov.destinationPositionName && <span className="block font-bold text-emerald-400">Para: {mov.destinationPositionName}</span>}
                      {!mov.originPositionName && !mov.destinationPositionName && '—'}
                    </td>
                    <td className="px-4 py-3 font-medium">{mov.responsibleName}</td>
                    <td className="px-4 py-3 font-mono-label">
                      {mov.cost !== undefined ? (
                        <span className={mov.cost > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                          R$ {Math.abs(mov.cost).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-on-surface-variant/80 max-w-xs truncate">{mov.notes || '—'}</td>
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
