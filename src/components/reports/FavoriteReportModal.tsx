import React, { useState } from 'react';
import { X, Save, Bookmark, AlertCircle } from 'lucide-react';
import type { ReportCategory } from '../../types/reports';
import { Button } from '../ui/Button';

interface FavoriteReportModalProps {
  category: ReportCategory;
  filters: Record<string, any>;
  visibleColumns: string[];
  onClose: () => void;
  onSave: (name: string, isPrivate: boolean) => Promise<void>;
}

export const FavoriteReportModal: React.FC<FavoriteReportModalProps> = ({
  category,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(`Relatório Favorito de ${category.replace(/-/g, ' ')}`);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Informe um nome para o relatório favorito.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSave(name, isPrivate);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar relatório favorito.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 text-xs">
      <div className="bg-surface-container-highest border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
            <Bookmark size={16} className="text-primary" /> Salvar Relatório Favorito
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-on-surface-variant font-mono-label mb-1">Nome da Configuração *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-xl border border-white/10 text-on-surface font-bold"
              required
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-on-surface font-semibold">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={e => setIsPrivate(e.target.checked)}
              className="rounded bg-surface-container border-white/10 text-primary"
            />
            Relatório Privado (Apenas eu poderei visualizar)
          </label>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading} className="flex items-center gap-1.5">
              <Save size={14} /> Salvar Favorito
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
