import React, { useState } from 'react';
import { X, Save, ArrowRightLeft } from 'lucide-react';
import type { Tool } from '../../../types/tools';
import { toolsService } from '../../../services/tools.service';
import { Button } from '../../ui/Button';

interface ToolTransferModalProps {
  tool: Tool;
  onClose: () => void;
  onSuccess: () => void;
}

export const ToolTransferModal: React.FC<ToolTransferModalProps> = ({ tool, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [destinationLocation, setDestinationLocation] = useState('Almoxarifado Central — Prateleira B');
  const [responsibleName, setResponsibleName] = useState('Roberto Alves');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await toolsService.transferTool(tool.id, {
        destinationLocation,
        responsibleName,
        notes,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao transferir localização.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 text-xs">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
            <ArrowRightLeft size={16} className="text-primary" />
            Transferir Ferramenta {tool.code}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
              {error}
            </div>
          )}

          <div className="p-3 bg-surface-container rounded-xl border border-white/10 space-y-1 font-mono-label">
            <span className="text-[10px] text-on-surface-variant/70 block">Localização Atual</span>
            <span className="font-bold text-on-surface text-xs">
              {tool.location?.detailedLocation || tool.location?.workshop || 'Almoxarifado'}
            </span>
          </div>

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Nova Localização de Destino *</label>
            <input
              type="text"
              value={destinationLocation}
              onChange={e => setDestinationLocation(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Responsável pela Transferência *</label>
            <input
              type="text"
              value={responsibleName}
              onChange={e => setResponsibleName(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              required
            />
          </div>

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Observações</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              placeholder="Motivo da movimentação..."
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading}>
              <Save size={14} className="mr-1" /> Salvar Transferência
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
