import React, { useState } from 'react';
import { X, Save, ClipboardCheck, AlertCircle } from 'lucide-react';
import type { ToolKit } from '../../../types/tool-kit';
import { useToolKits } from '../../../hooks/useToolKits';
import { Button } from '../../ui/Button';

interface ToolKitInspectionFormProps {
  kit: ToolKit;
  onClose: () => void;
  onSuccess: () => void;
}

export const ToolKitInspectionForm: React.FC<ToolKitInspectionFormProps> = ({ kit, onClose, onSuccess }) => {
  const { inspectKit } = useToolKits();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [inspectorName, setInspectorName] = useState('Roberto Alves (Supervisor de Almoxarifado)');
  const [itemsInspection, setItemsInspection] = useState(
    kit.items.map(item => ({
      itemId: item.id,
      toolName: item.toolName,
      expectedQuantity: item.expectedQuantity,
      foundQuantity: item.currentQuantity,
      condition: item.expectedCondition || 'boa',
      result: item.currentQuantity < item.expectedQuantity ? 'ausente' : 'conforme',
      notes: '',
    }))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await inspectKit({
        kitId: kit.id,
        inspectorName,
        itemsInspection,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar conferência do kit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
              <ClipboardCheck size={16} className="text-primary" />
              Conferência de Kit — {kit.name} ({kit.code})
            </h3>
            <p className="text-[11px] text-on-surface-variant/70">Responsável Atual: {kit.responsibleName}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Inspetor / Conferente *</label>
            <input
              type="text"
              value={inspectorName}
              onChange={e => setInspectorName(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              required
            />
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            <span className="font-bold text-on-surface text-xs font-mono-label block">Verificação dos Itens do Kit:</span>
            {itemsInspection.map((item, idx) => (
              <div key={item.itemId} className="p-3 bg-surface-container rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between font-mono-label">
                  <span className="font-bold text-on-surface">{item.toolName}</span>
                  <span className="text-[11px] text-on-surface-variant/70">Previsto: {item.expectedQuantity} UN</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-on-surface-variant/70 mb-1 font-mono-label">Qtd. Encontrada</label>
                    <input
                      type="number"
                      min={0}
                      value={item.foundQuantity}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setItemsInspection(prev => {
                          const copy = [...prev];
                          copy[idx].foundQuantity = val;
                          copy[idx].result = val < copy[idx].expectedQuantity ? 'ausente' : 'conforme';
                          return copy;
                        });
                      }}
                      className="w-full px-2 py-1 bg-surface-container-high rounded-lg border border-white/10 text-on-surface font-mono-label font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-on-surface-variant/70 mb-1 font-mono-label">Condição</label>
                    <select
                      value={item.condition}
                      onChange={e => {
                        const val = e.target.value;
                        setItemsInspection(prev => {
                          const copy = [...prev];
                          copy[idx].condition = val;
                          return copy;
                        });
                      }}
                      className="w-full px-2 py-1 bg-surface-container-high rounded-lg border border-white/10 text-on-surface"
                    >
                      <option value="boa">Boa</option>
                      <option value="regular">Regular</option>
                      <option value="ruim">Ruim</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-on-surface-variant/70 mb-1 font-mono-label">Resultado</label>
                    <select
                      value={item.result}
                      onChange={e => {
                        const val = e.target.value;
                        setItemsInspection(prev => {
                          const copy = [...prev];
                          copy[idx].result = val;
                          return copy;
                        });
                      }}
                      className="w-full px-2 py-1 bg-surface-container-high rounded-lg border border-white/10 text-on-surface font-bold"
                    >
                      <option value="conforme">Conforme</option>
                      <option value="ausente">Ausente</option>
                      <option value="divergente">Divergente</option>
                      <option value="danificado">Danificado</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="flex items-center gap-1.5">
              <Save size={14} /> Salvar Conferência
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
