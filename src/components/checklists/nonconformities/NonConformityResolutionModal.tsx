import React, { useState } from 'react';
import { X, Wrench, Ban } from 'lucide-react';
import type { ChecklistNonConformity } from '../../../types/checklist';
import { Button } from '../../ui/Button';

interface NonConformityResolutionModalProps {
  nonConformity: ChecklistNonConformity | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (id: string, solution: string, resolvedBy: string, photoAfter?: string, unblock?: boolean) => Promise<any>;
}

export const NonConformityResolutionModal: React.FC<NonConformityResolutionModalProps> = ({
  nonConformity,
  isOpen,
  onClose,
  onResolve,
}) => {
  const [solutionApplied, setSolutionApplied] = useState('');
  const [resolvedBy, setResolvedBy] = useState('Equipe de Oficina Mecânica');
  const [photoAfterUrl, setPhotoAfterUrl] = useState('');
  const [unblockEquipment, setUnblockEquipment] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !nonConformity) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solutionApplied.trim() || !resolvedBy.trim()) {
      setError('Relate a solução aplicada e o responsável pela resolução.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onResolve(
        nonConformity.id,
        solutionApplied.trim(),
        resolvedBy.trim(),
        photoAfterUrl.trim() || undefined,
        unblockEquipment
      );
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao resolver não conformidade.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="relative max-w-lg w-full glass-card bg-surface-container-highest border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl text-[12px]">
        <div className="flex justify-between items-center pb-2 border-b border-white/10 text-primary">
          <div className="flex items-center gap-2">
            <Wrench size={20} />
            <h3 className="font-title-md text-[16px] font-bold text-on-surface">Tratar & Resolver Falha</h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1 rounded">
            <X size={18} />
          </button>
        </div>

        <div className="p-3 rounded-xl bg-surface-container/60 border border-white/5 space-y-1 font-mono-label text-[11px]">
          <p>Pendência: <strong>{nonConformity.code} — {nonConformity.title}</strong></p>
          <p>Equipamento: <strong className="text-secondary">{nonConformity.equipmentCode} ({nonConformity.equipmentName})</strong></p>
          <p>Criticidade: <strong className="uppercase text-error">{nonConformity.criticality}</strong></p>
        </div>

        {error && <div className="p-2.5 rounded-lg bg-error/15 text-error text-[11px] font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
              Responsável pelo Reparo / Oficina *
            </label>
            <input
              type="text"
              value={resolvedBy}
              onChange={(e) => setResolvedBy(e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
              Solução Mecânica Aplicada / Serviço Realizado *
            </label>
            <textarea
              value={solutionApplied}
              onChange={(e) => setSolutionApplied(e.target.value)}
              placeholder="Ex: Substituída a mangueira hidráulica e completado o nível de óleo..."
              rows={3}
              className="w-full bg-surface-container border border-white/10 rounded-lg p-2.5 text-on-surface focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
              URL Foto Comprobatória Após Correção (Opcional)
            </label>
            <input
              type="text"
              value={photoAfterUrl}
              onChange={(e) => setPhotoAfterUrl(e.target.value)}
              placeholder="https://exemplo.com/foto-reparo-pronto.jpg"
              className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none"
            />
          </div>

          {nonConformity.blockedEquipment && (
            <div className="p-3 rounded-xl bg-error/15 border border-error/40 space-y-2">
              <div className="flex items-center gap-1.5 text-error font-bold font-mono-label text-[11px]">
                <Ban size={15} /> Máquina Interditada por Esta Pendência
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-[12px] text-on-surface select-none font-semibold">
                <input
                  type="checkbox"
                  checked={unblockEquipment}
                  onChange={(e) => setUnblockEquipment(e.target.checked)}
                  className="rounded border-white/20 bg-surface-container text-success focus:ring-0"
                />
                <span className="text-success">Liberar imediatamente a operação da máquina ao concluir reparo</span>
              </label>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>Cancelar</Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting} icon={<Wrench size={14} />}>
              Confirmar Resolução
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
