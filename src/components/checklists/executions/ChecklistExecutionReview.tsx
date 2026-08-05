import React, { useState } from 'react';
import { ShieldCheck, Ban, FileSignature } from 'lucide-react';
import { Button } from '../../ui/Button';

interface ChecklistExecutionReviewProps {
  totalItems: number;
  answeredCount: number;
  nonConformingCount: number;
  onComplete: (signature: string, notes?: string) => Promise<any>;
  onBackToSections: () => void;
}

export const ChecklistExecutionReview: React.FC<ChecklistExecutionReviewProps> = ({
  totalItems,
  answeredCount,
  nonConformingCount,
  onComplete,
  onBackToSections,
}) => {
  const [operatorSignature, setOperatorSignature] = useState('Marcos Paulo (Operador Logado)');
  const [generalNotes, setGeneralNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasUnanswered = answeredCount < totalItems;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorSignature.trim()) {
      setError('A assinatura digital / identificação do operador é obrigatória para auditar este checklist.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onComplete(operatorSignature.trim(), generalNotes.trim() || undefined);
    } catch (err: any) {
      setError(err.message || 'Erro ao finalizar checklist.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card bg-surface-container-highest/60 border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl animate-fade-in max-w-2xl mx-auto">
      <div className="flex items-center gap-3 pb-3 border-b border-white/10">
        <div className="p-2.5 rounded-xl bg-secondary/20 text-secondary">
          <FileSignature size={26} />
        </div>
        <div>
          <h3 className="font-title-md text-[18px] font-bold text-on-surface">Revisão e Conclusão de Inspeção</h3>
          <p className="text-[12px] text-on-surface-variant/70">Confirme o parecer e assinale para arquivamento no histórico da máquina.</p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-error/15 text-error text-[13px] border border-error/30 font-medium">
          {error}
        </div>
      )}

      {hasUnanswered && (
        <div className="p-4 rounded-xl bg-warning/15 border border-warning/30 text-[13px] font-medium text-warning flex items-center gap-3">
          <span>⚠️ Você possui {totalItems - answeredCount} item(ns) não respondidos. Recomendamos revisar todas as seções antes de submeter.</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 text-center font-mono-label">
        <div className="p-3 rounded-xl bg-surface-container/70 border border-white/5">
          <span className="text-[11px] text-on-surface-variant uppercase block">Total Itens</span>
          <strong className="text-[20px] font-bold text-on-surface">{totalItems}</strong>
        </div>

        <div className="p-3 rounded-xl bg-surface-container/70 border border-white/5">
          <span className="text-[11px] text-on-surface-variant uppercase block">Respondidos</span>
          <strong className="text-[20px] font-bold text-primary">{answeredCount}</strong>
        </div>

        <div className="p-3 rounded-xl bg-surface-container/70 border border-white/5">
          <span className="text-[11px] text-on-surface-variant uppercase block">Falhas / NCs</span>
          <strong className={`text-[20px] font-bold ${nonConformingCount > 0 ? 'text-error' : 'text-success'}`}>
            {nonConformingCount}
          </strong>
        </div>
      </div>

      {nonConformingCount > 0 && (
        <div className="p-4 rounded-xl bg-error/15 border border-error/40 text-error space-y-1 text-[13px]">
          <div className="flex items-center gap-2 font-bold uppercase font-mono-label">
            <Ban size={16} /> Alerta de Avarias Constatadas
          </div>
          <p className="text-[12px] text-on-surface-variant/90">
            Foram registradas <strong>{nonConformingCount}</strong> não conformidades neste preenchimento. As pendências foram criadas e a situação operacional do ativo será atualizada de acordo com o nível de criticidade dos itens.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
        <div>
          <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
            Assinatura Digital / Operador *
          </label>
          <input
            type="text"
            value={operatorSignature}
            onChange={(e) => setOperatorSignature(e.target.value)}
            className="w-full bg-surface-container border border-white/10 rounded-lg px-3.5 py-2.5 text-on-surface font-semibold focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-mono-label text-on-surface-variant/80 uppercase block mb-1">
            Observações Gerais da Inspeção (Opcional)
          </label>
          <textarea
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            placeholder="Comentários finais ou recados para a oficina mecânica..."
            rows={3}
            className="w-full bg-surface-container border border-white/10 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex justify-between gap-3 pt-3 border-t border-white/10">
          <Button variant="outline" size="sm" type="button" onClick={onBackToSections}>
            Voltar às Seções
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting} icon={<ShieldCheck size={16} />}>
            Concluir e Salvar Checklist
          </Button>
        </div>
      </form>
    </div>
  );
};
