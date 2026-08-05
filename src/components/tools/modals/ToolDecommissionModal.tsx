import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import type { Tool } from '../../../types/tools';
import { toolsService } from '../../../services/tools.service';
import { Button } from '../../ui/Button';

interface ToolDecommissionModalProps {
  tool: Tool;
  onClose: () => void;
  onSuccess: () => void;
}

export const ToolDecommissionModal: React.FC<ToolDecommissionModalProps> = ({ tool, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reason, setReason] = useState('Desgaste natural de uso sem reparo viável');
  const [residualValue, setResidualValue] = useState<number | ''>(50);
  const [responsibleName, setResponsibleName] = useState('Roberto Alves');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await toolsService.decommissionTool(tool.id, {
        reason,
        residualValue: residualValue === '' ? undefined : Number(residualValue),
        responsibleName,
        notes: notes || undefined,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar baixa da ferramenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 text-xs">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2 text-rose-400">
            <Trash2 size={16} />
            Baixa Definitiva — Ferramenta {tool.code}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-[11px]">
            Atenção: A baixa registrará a desativação permanente da ferramenta no estoque. Ela continuará visível para fins de auditoria e histórico patrimonial.
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Motivo da Baixa *</label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              required
            >
              <option value="Desgaste natural de uso sem reparo viável">Desgaste natural de uso</option>
              <option value="Quebra com dano estrutural sem conserto">Quebra com dano estrutural</option>
              <option value="Obsolescência tecnológica">Obsolescência tecnológica</option>
              <option value="Perda confirmada / Inadimplência">Perda confirmada</option>
              <option value="Substituição por modelo novo">Substituição por modelo novo</option>
              <option value="Venda / Alienação de sucata">Venda / Sucata</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Valor Residual Obtido (R$)</label>
              <input
                type="number"
                step="0.01"
                value={residualValue}
                onChange={e => setResidualValue(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-mono-label"
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Responsável *</label>
              <input
                type="text"
                value={responsibleName}
                onChange={e => setResponsibleName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Observações de Laudo / Auditoria</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              placeholder="Número do laudo técnico ou nota fiscal de sucata..."
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="bg-rose-600 hover:bg-rose-700">
              <Trash2 size={14} className="mr-1" /> Confirmar Baixa
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
