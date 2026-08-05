import React, { useState } from 'react';
import { X, Save, AlertOctagon } from 'lucide-react';
import type { Tool } from '../../../types/tools';
import { toolsService } from '../../../services/tools.service';
import { Button } from '../../ui/Button';

interface ToolLossModalProps {
  tool: Tool;
  onClose: () => void;
  onSuccess: () => void;
}

export const ToolLossModal: React.FC<ToolLossModalProps> = ({ tool, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [description, setDescription] = useState('Extravio no campo durante atendimento noturno no Talhão 08');
  const [responsibleName, setResponsibleName] = useState('Roberto Alves');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await toolsService.reportLoss(tool.id, {
        description,
        responsibleName,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar perda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in text-xs">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2 text-rose-400">
            <AlertOctagon size={16} />
            Registrar Perda / Extravio ({tool.code})
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-[11px]">
            O registro de perda ajustará a quantidade disponível e marcará o status como PERDIDA. O item poderá ser recuperado no futuro.
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Descrição do Ocorrido / Circunstâncias *</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              required
            />
          </div>

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Responsável pelo Registro *</label>
            <input
              type="text"
              value={responsibleName}
              onChange={e => setResponsibleName(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              required
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="bg-rose-600 hover:bg-rose-700">
              <Save size={14} className="mr-1" /> Confirmar Perda
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
