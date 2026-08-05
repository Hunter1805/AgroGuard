import React, { useState } from 'react';
import { X, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ToolLoan } from '../../../types/tool-loan';
import { useToolLoans } from '../../../hooks/useToolLoans';
import { Button } from '../../ui/Button';

interface ToolReturnModalProps {
  loan: ToolLoan;
  onClose: () => void;
  onSuccess: () => void;
}

export const ToolReturnModal: React.FC<ToolReturnModalProps> = ({ loan, onClose, onSuccess }) => {
  const { registerReturn } = useToolLoans();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [responsibleReturnName, setResponsibleReturnName] = useState('Roberto Alves (Almoxarife)');
  const [returns, setReturns] = useState(
    loan.items.map(item => ({
      itemId: item.id,
      toolName: item.toolName,
      maxQuantity: item.quantity - item.returnedQuantity,
      returnedQuantity: item.quantity - item.returnedQuantity,
      conditionAtReturn: item.conditionAtCheckout || 'boa',
      hasDamage: false,
      hasLoss: false,
      notes: '',
    }))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await registerReturn({
        loanId: loan.id,
        responsibleReturnName,
        itemsReturn: returns.map(r => ({
          itemId: r.itemId,
          returnedQuantity: Number(r.returnedQuantity),
          conditionAtReturn: r.conditionAtReturn,
          hasDamage: r.hasDamage,
          hasLoss: r.hasLoss,
          notes: r.notes || undefined,
        })),
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar devolução.');
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
              <CheckCircle2 size={16} className="text-emerald-400" />
              Devolução de Empréstimo ({loan.code})
            </h3>
            <p className="text-[11px] text-on-surface-variant/70">Retirado por: {loan.borrowerName}</p>
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

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {returns.map((ret, idx) => (
              <div key={ret.itemId} className="p-3 bg-surface-container rounded-xl border border-white/10 space-y-2">
                <span className="font-bold text-on-surface block text-xs">{ret.toolName}</span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-on-surface-variant/70 mb-1 font-mono-label">Qtd. Devolvida (Máx: {ret.maxQuantity})</label>
                    <input
                      type="number"
                      min={0}
                      max={ret.maxQuantity}
                      value={ret.returnedQuantity}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setReturns(prev => {
                          const copy = [...prev];
                          copy[idx].returnedQuantity = val;
                          return copy;
                        });
                      }}
                      className="w-full px-2.5 py-1 bg-surface-container-high rounded-lg border border-white/10 text-on-surface font-mono-label font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-on-surface-variant/70 mb-1 font-mono-label">Conservação na Devolução</label>
                    <select
                      value={ret.conditionAtReturn}
                      onChange={e => {
                        const val = e.target.value;
                        setReturns(prev => {
                          const copy = [...prev];
                          copy[idx].conditionAtReturn = val;
                          return copy;
                        });
                      }}
                      className="w-full px-2.5 py-1 bg-surface-container-high rounded-lg border border-white/10 text-on-surface"
                    >
                      <option value="excelente">Excelente</option>
                      <option value="boa">Boa</option>
                      <option value="regular">Regular</option>
                      <option value="ruim">Ruim</option>
                      <option value="inutilizavel">Inutilizável</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[11px] pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer text-amber-400">
                    <input
                      type="checkbox"
                      checked={ret.hasDamage}
                      onChange={e => {
                        const checked = e.target.checked;
                        setReturns(prev => {
                          const copy = [...prev];
                          copy[idx].hasDamage = checked;
                          return copy;
                        });
                      }}
                      className="rounded bg-surface-container border-white/10 text-amber-500"
                    />
                    Apresenta Dano / Defeito
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-rose-400">
                    <input
                      type="checkbox"
                      checked={ret.hasLoss}
                      onChange={e => {
                        const checked = e.target.checked;
                        setReturns(prev => {
                          const copy = [...prev];
                          copy[idx].hasLoss = checked;
                          return copy;
                        });
                      }}
                      className="rounded bg-surface-container border-white/10 text-rose-500"
                    />
                    Houve Perda / Extravio
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Responsável pelo Recebimento *</label>
            <input
              type="text"
              value={responsibleReturnName}
              onChange={e => setResponsibleReturnName(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              required
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700">
              <Save size={14} /> Registrar Devolução
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
