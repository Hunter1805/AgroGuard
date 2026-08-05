import React, { useState } from 'react';
import { X, Save, ArrowRightLeft, AlertCircle } from 'lucide-react';
import type { Tool } from '../../../types/tools';
import { useTools } from '../../../hooks/useTools';
import { useToolLoans } from '../../../hooks/useToolLoans';
import { Button } from '../../ui/Button';

interface ToolLoanFormProps {
  initialTool?: Tool;
  workOrderId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ToolLoanForm: React.FC<ToolLoanFormProps> = ({ initialTool, workOrderId: initialWorkOrderId, onClose, onSuccess }) => {
  const { tools } = useTools();
  const { createLoan } = useToolLoans();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedToolId, setSelectedToolId] = useState(initialTool?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [borrowerName, setBorrowerName] = useState('Carlos Silva (Mecânico)');
  const [borrowerTeam, setBorrowerTeam] = useState('Equipe Manutenção Central');
  const [workOrderId, setWorkOrderId] = useState(initialWorkOrderId || '');
  const [workOrderCode, setWorkOrderCode] = useState(initialWorkOrderId ? `OS-${initialWorkOrderId}` : '');
  const [equipmentName, setEquipmentName] = useState('TRATOR MASSEY FERGUSON 265 01');
  const [locationOfUse, setLocationOfUse] = useState('Oficina Central — Campo');
  const [expectedReturnDate, setExpectedReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [responsibleCheckoutName, setResponsibleCheckoutName] = useState('Roberto Alves');
  const [notes, setNotes] = useState('');

  const selectedTool = tools.find(t => t.id === selectedToolId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToolId) {
      setError('Por favor selecione a ferramenta para empréstimo.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createLoan({
        borrowerName,
        borrowerTeam,
        workOrderId: workOrderId || undefined,
        workOrderCode: workOrderCode || undefined,
        equipmentName: equipmentName || undefined,
        locationOfUse,
        expectedReturnDate,
        responsibleCheckoutName,
        items: [{ toolId: selectedToolId, quantity }],
        notes: notes || undefined,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar empréstimo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
            <ArrowRightLeft size={16} className="text-primary" />
            Registrar Empréstimo de Ferramenta
          </h3>
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
            <label className="block text-on-surface-variant font-mono-label mb-1">Ferramenta *</label>
            <select
              value={selectedToolId}
              onChange={e => setSelectedToolId(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              required
            >
              <option value="">Selecione uma ferramenta disponível...</option>
              {tools.filter(t => t.status === 'disponivel' && t.availableQuantity > 0).map(t => (
                <option key={t.id} value={t.id}>
                  {t.code} — {t.name} (Disp: {t.availableQuantity} {t.unitOfMeasure || 'UN'})
                </option>
              ))}
            </select>
          </div>

          {selectedTool && (
            <div className="p-3 bg-surface-container rounded-xl border border-white/10 flex justify-between font-mono-label">
              <div>
                <span className="text-[10px] text-on-surface-variant/70 block">Controle</span>
                <span className="font-bold text-on-surface uppercase">{selectedTool.controlType}</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant/70 block">Patrimônio / Série</span>
                <span className="font-bold text-primary">{selectedTool.patrimonyNumber || selectedTool.serialNumber || 'Lote/Qtd'}</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant/70 block">Disponível</span>
                <span className="font-bold text-emerald-400">{selectedTool.availableQuantity} {selectedTool.unitOfMeasure || 'UN'}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Quantidade Retirada *</label>
              <input
                type="number"
                min={1}
                max={selectedTool ? selectedTool.availableQuantity : 99}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
                required
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Previsão de Devolução *</label>
              <input
                type="date"
                value={expectedReturnDate}
                onChange={e => setExpectedReturnDate(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Responsável pela Retirada *</label>
              <input
                type="text"
                value={borrowerName}
                onChange={e => setBorrowerName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
                required
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Equipe / Setor</label>
              <input
                type="text"
                value={borrowerTeam}
                onChange={e => setBorrowerTeam(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Cód. Ordem de Serviço (OS)</label>
              <input
                type="text"
                placeholder="Ex: OS-2026-089"
                value={workOrderCode}
                onChange={e => {
                  setWorkOrderCode(e.target.value);
                  setWorkOrderId(e.target.value.replace(/[^0-9]/g, ''));
                }}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Equipamento Relacionado</label>
              <input
                type="text"
                value={equipmentName}
                onChange={e => setEquipmentName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Local de Utilização</label>
              <input
                type="text"
                value={locationOfUse}
                onChange={e => setLocationOfUse(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Responsável pela Entrega *</label>
              <input
                type="text"
                value={responsibleCheckoutName}
                onChange={e => setResponsibleCheckoutName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Observações da Retirada</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              placeholder="Descreva detalhes adicionais ou estado inicial..."
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="flex items-center gap-1.5">
              <Save size={14} /> Confirmar Retirada
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
