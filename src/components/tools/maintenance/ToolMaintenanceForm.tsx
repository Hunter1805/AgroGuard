import React, { useState } from 'react';
import { X, Save, Wrench, AlertCircle } from 'lucide-react';
import type { ToolMaintenanceType } from '../../../types/tool-maintenance';
import { useTools } from '../../../hooks/useTools';
import { useToolMaintenances } from '../../../hooks/useToolMaintenances';
import { Button } from '../../ui/Button';

interface ToolMaintenanceFormProps {
  toolId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ToolMaintenanceForm: React.FC<ToolMaintenanceFormProps> = ({ toolId: initialToolId, onClose, onSuccess }) => {
  const { tools } = useTools();
  const { createMaintenance } = useToolMaintenances();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [toolId, setToolId] = useState(initialToolId || '');
  const [type, setType] = useState<ToolMaintenanceType>('corretiva');
  const [problemDescription, setProblemDescription] = useState('');
  const [providerName, setProviderName] = useState('Oficina Mecânica Express');
  const [responsibleName, setResponsibleName] = useState('Roberto Alves');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolId || !problemDescription) {
      setError('Preencha a ferramenta e o problema informado.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createMaintenance({
        toolId,
        type,
        problemDescription,
        responsibleName,
        providerName: providerName || undefined,
        notes: notes || undefined,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao abrir manutenção de ferramenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
            <Wrench size={16} className="text-primary" />
            Enviar Ferramenta para Manutenção
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
              {tools.filter(t => t.status !== 'baixada' && t.status !== 'em_manutencao').map(t => (
                <option key={t.id} value={t.id}>
                  {t.code} — {t.name} ({t.brand || 'Geral'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Tipo de Manutenção *</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-semibold"
              >
                <option value="corretiva">Corretiva</option>
                <option value="preventiva">Preventiva</option>
                <option value="limpeza">Limpeza / Higienização</option>
                <option value="afiamento">Afiamento / Afiação</option>
                <option value="lubrificacao">Lubrificação</option>
                <option value="troca_componente">Troca de Componentes</option>
                <option value="revisao_eletrica">Revisão Elétrica</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-on-surface-variant font-mono-label mb-1">Oficina / Fornecedor</label>
              <input
                type="text"
                value={providerName}
                onChange={e => setProviderName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
                placeholder="Ex: Oficina Mecânica Express"
              />
            </div>
          </div>

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Problema Relatado / Defeito *</label>
            <textarea
              rows={2}
              value={problemDescription}
              onChange={e => setProblemDescription(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              placeholder="Descreva a falha ou a necessidade de revisão..."
              required
            />
          </div>

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Responsável pela Abertura *</label>
            <input
              type="text"
              value={responsibleName}
              onChange={e => setResponsibleName(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              required
            />
          </div>

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Observações da Manutenção</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface"
              placeholder="Instruções ou prazos previstos..."
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="flex items-center gap-1.5">
              <Save size={14} /> Registrar Manutenção
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
