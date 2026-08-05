import React, { useState } from 'react';
import { Package, Search, ClipboardCheck } from 'lucide-react';
import { useToolKits } from '../../../hooks/useToolKits';
import { ToolKitInspectionForm } from './ToolKitInspectionForm';
import type { ToolKit } from '../../../types/tool-kit';

export const ToolKitList: React.FC = () => {
  const { kits, loading, search, setSearch, refetch } = useToolKits();
  const [selectedKitForInspection, setSelectedKitForInspection] = useState<ToolKit | undefined>(undefined);

  const getStatusBadge = (status: ToolKit['status']) => {
    switch (status) {
      case 'completo':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Completo</span>;
      case 'incompleto':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">Incompleto</span>;
      case 'com_divergencia':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">Divergência</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant">{status}</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low/30 p-4 rounded-xl border border-white/10">
        <div>
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <Package className="text-primary" size={18} />
            Kits de Ferramentas
          </h3>
          <p className="text-xs text-on-surface-variant/70 mt-0.5">
            Conjuntos de ferramentas atribuídos a mecânicos, operadores, veículos e frentes de serviço.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder="Buscar kit por código, nome ou responsável..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-surface-container/60 rounded-xl border border-white/10 text-xs text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>
          <span className="text-xs font-mono-label text-on-surface-variant">{kits.length} kits cadastrados</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-on-surface-variant">Carregando kits de ferramentas...</div>
        ) : kits.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Package className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
            <p className="text-xs font-bold text-on-surface">Nenhum kit cadastrado</p>
            <p className="text-xs text-on-surface-variant/70">Crie kits para operadores, mecânicos, veículos ou equipamentos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {kits.map(kit => (
              <div key={kit.id} className="p-4 bg-surface-container/40 rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-label font-bold text-primary text-xs">{kit.code}</span>
                      <h4 className="font-bold text-on-surface text-sm">{kit.name}</h4>
                    </div>
                    <span className="text-[11px] text-on-surface-variant/70 block mt-0.5">
                      Resp: {kit.responsibleName} {kit.teamName ? `(${kit.teamName})` : ''}
                    </span>
                  </div>
                  {getStatusBadge(kit.status)}
                </div>

                <div className="text-xs space-y-1">
                  <div className="text-[11px] text-on-surface-variant font-mono-label">
                    Itens Previstos ({kit.items.length}):
                  </div>
                  <div className="space-y-1">
                    {kit.items.map(item => (
                      <div key={item.id} className="flex justify-between font-mono-label text-[11px] bg-surface-container/60 p-2 rounded-lg">
                        <span className="text-on-surface">{item.toolName}</span>
                        <span className={item.currentQuantity < item.expectedQuantity ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {item.currentQuantity} / {item.expectedQuantity} UN
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono-label text-on-surface-variant/70">
                    Última Conferência: {kit.lastInspectionDate ? new Date(kit.lastInspectionDate).toLocaleDateString('pt-BR') : 'Nunca'}
                  </span>

                  <button
                    onClick={() => setSelectedKitForInspection(kit)}
                    className="px-3 py-1.5 bg-primary/15 text-primary hover:bg-primary/25 border border-primary/30 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ClipboardCheck size={14} /> Realizar Conferência
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedKitForInspection && (
        <ToolKitInspectionForm
          kit={selectedKitForInspection}
          onClose={() => setSelectedKitForInspection(undefined)}
          onSuccess={() => { setSelectedKitForInspection(undefined); refetch(); }}
        />
      )}
    </div>
  );
};
