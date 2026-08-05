import React, { useState } from 'react';
import { X, Save, Bookmark, AlertCircle } from 'lucide-react';
import { useTools } from '../../../hooks/useTools';
import { useToolReservations } from '../../../hooks/useToolReservations';
import { Button } from '../../ui/Button';

interface ToolReservationFormProps {
  workOrderId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ToolReservationForm: React.FC<ToolReservationFormProps> = ({ workOrderId: initialWorkOrderId, onClose, onSuccess }) => {
  const { tools } = useTools();
  const { createReservation } = useToolReservations();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [toolId, setToolId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [requesterName, setRequesterName] = useState('Marcos Souza (Mecânico)');
  const [workOrderCode, setWorkOrderCode] = useState(initialWorkOrderId ? `OS-${initialWorkOrderId}` : '');
  const [equipmentName, setEquipmentName] = useState('TRATOR CASE IH MAGNUM 340');
  const [expectedPickupDate, setExpectedPickupDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [expectedReturnDate, setExpectedReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [justification, setJustification] = useState('Uso agendado para manutenção preventiva de motor');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolId) {
      setError('Selecione uma ferramenta.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createReservation({
        toolId,
        quantity,
        requesterName,
        workOrderId: initialWorkOrderId || undefined,
        workOrderCode: workOrderCode || undefined,
        equipmentName: equipmentName || undefined,
        expectedPickupDate,
        expectedReturnDate,
        justification,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar reserva.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
            <Bookmark size={16} className="text-primary" />
            Criar Reserva de Ferramenta
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
              value={toolId}
              onChange={e => setToolId(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              required
            >
              <option value="">Selecione a ferramenta...</option>
              {tools.filter(t => t.status !== 'baixada' && t.status !== 'perdida').map(t => (
                <option key={t.id} value={t.id}>
                  {t.code} — {t.name} (Estoque Total: {t.totalQuantity})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Quantidade Reservada *</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
                required
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Solicitante *</label>
              <input
                type="text"
                value={requesterName}
                onChange={e => setRequesterName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Previsão de Retirada *</label>
              <input
                type="date"
                value={expectedPickupDate}
                onChange={e => setExpectedPickupDate(e.target.value)}
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
              <label className="block text-on-surface-variant font-mono-label mb-1">Ordem de Serviço (OS)</label>
              <input
                type="text"
                placeholder="Ex: OS-2026-105"
                value={workOrderCode}
                onChange={e => setWorkOrderCode(e.target.value)}
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

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Justificativa da Reserva</label>
            <textarea
              rows={2}
              value={justification}
              onChange={e => setJustification(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              placeholder="Descreva o motivo da reserva antecipada..."
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="flex items-center gap-1.5">
              <Save size={14} /> Salvar Reserva
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
