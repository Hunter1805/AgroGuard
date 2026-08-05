import React from 'react';
import { Camera, ShieldAlert, Ban, Info } from 'lucide-react';
import type { ChecklistItem, ChecklistAnswer, ChecklistItemResult } from '../../../types/checklist';

interface ChecklistItemFieldProps {
  item: ChecklistItem;
  answer?: ChecklistAnswer;
  onAnswerChange: (itemId: string, updated: Partial<ChecklistAnswer>) => void;
}

export const ChecklistItemField: React.FC<ChecklistItemFieldProps> = ({
  item,
  answer,
  onAnswerChange,
}) => {
  const result = answer?.result;
  const isNOK = result === 'nao_conforme' || answer?.booleanValue === false;

  const handleResultClick = (res: ChecklistItemResult) => {
    onAnswerChange(item.id, { result: res, booleanValue: res === 'conforme' });
  };

  return (
    <div className={`p-4 rounded-2xl transition-all border ${
      isNOK
        ? 'bg-error/10 border-error/40 shadow-md shadow-error/5'
        : result === 'conforme'
        ? 'bg-surface-container-highest/40 border-success/30'
        : 'bg-surface-container-highest/70 border-white/10'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            {item.code && (
              <span className="text-[11px] font-mono-label bg-surface-container px-2 py-0.5 rounded text-primary font-bold">
                {item.code}
              </span>
            )}
            <h4 className="font-title-md text-[14px] font-bold text-on-surface">
              {item.title}
            </h4>
            {item.required && <span className="text-error text-[12px] font-bold">*</span>}
            {item.criticality === 'critica' && (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono-label px-2 py-0.5 rounded bg-error/20 text-error border border-error/30 font-extrabold">
                <ShieldAlert size={12} /> Crítico
              </span>
            )}
          </div>
          
          {item.description && (
            <p className="text-[12px] text-on-surface-variant/80">{item.description}</p>
          )}
          {item.correctionGuidance && (
            <p className="text-[11px] text-warning inline-flex items-center gap-1 pt-1">
              <Info size={13} /> {item.correctionGuidance}
            </p>
          )}
        </div>

        {/* Botoes de Resposta Principal */}
        <div className="flex gap-2 shrink-0 self-start sm:self-center font-mono-label text-[12px]">
          {(item.responseType === 'conformidade' || item.responseType === 'sim_nao') && (
            <>
              <button
                type="button"
                onClick={() => handleResultClick('conforme')}
                className={`px-4 py-2 rounded-xl border font-bold transition-transform active:scale-95 cursor-pointer ${
                  result === 'conforme'
                    ? 'bg-success text-on-primary border-success shadow-md shadow-success/20'
                    : 'bg-surface-container hover:bg-surface-container-highest text-on-surface border-white/10'
                }`}
              >
                {item.responseType === 'sim_nao' ? 'SIM' : 'CONFORME'}
              </button>

              <button
                type="button"
                onClick={() => handleResultClick('nao_conforme')}
                className={`px-4 py-2 rounded-xl border font-bold transition-transform active:scale-95 cursor-pointer ${
                  result === 'nao_conforme'
                    ? 'bg-error text-on-primary border-error shadow-md shadow-error/20'
                    : 'bg-surface-container hover:bg-surface-container-highest text-error border-white/10'
                }`}
              >
                {item.responseType === 'sim_nao' ? 'NÃO' : 'NÃO CONFORME'}
              </button>

              {item.allowNotApplicable && (
                <button
                  type="button"
                  onClick={() => handleResultClick('nao_se_aplica')}
                  className={`px-3 py-2 rounded-xl border font-medium text-[11px] transition-transform active:scale-95 cursor-pointer ${
                    result === 'nao_se_aplica'
                      ? 'bg-secondary text-on-secondary border-secondary'
                      : 'bg-surface-container text-on-surface-variant/70 border-white/10'
                  }`}
                >
                  N/A
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Campos numéricos / medição / texto quando exigidos pelo responseType */}
      <div className="mt-3 space-y-2">
        {item.responseType === 'numero' || item.responseType === 'medicao' ? (
          <div className="max-w-xs">
            <label className="text-[11px] font-mono-label text-on-surface-variant uppercase block mb-1">
              Valor Medido {item.measurementUnit ? `(${item.measurementUnit})` : ''}
            </label>
            <input
              type="number"
              value={answer?.numericValue !== undefined ? answer.numericValue : ''}
              onChange={(e) => onAnswerChange(item.id, { numericValue: parseFloat(e.target.value) || 0, result: 'conforme' })}
              className="bg-surface-container border border-white/20 rounded-lg px-3 py-1.5 text-[13px] text-on-surface w-full focus:outline-none focus:border-primary"
              placeholder="Digite o número medido..."
            />
          </div>
        ) : null}

        {item.responseType === 'texto' ? (
          <div>
            <textarea
              value={answer?.textValue || ''}
              onChange={(e) => onAnswerChange(item.id, { textValue: e.target.value, result: 'conforme' })}
              placeholder="Insira as observações textuais da inspeção..."
              rows={2}
              className="w-full bg-surface-container border border-white/20 rounded-lg p-2 text-[12px] text-on-surface focus:outline-none focus:border-primary"
            />
          </div>
        ) : null}

        {/* Expansão condicional em caso de Não Conformidade (NC) */}
        {isNOK && (
          <div className="mt-3 pt-3 border-t border-error/20 space-y-2 animate-fade-in text-[12px]">
            {item.blockEquipment && (
              <div className="p-2 rounded-lg bg-error/20 text-error font-mono-label font-bold flex items-center gap-2 text-[11px]">
                <Ban size={15} /> ATENÇÃO: Marcar este item como Não Conforme causará o bloqueio automático de operação deste equipamento!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono-label text-error font-bold uppercase block mb-1">
                  Observações da Falha * {item.requireNotesOnNonConformity && '(Obrigatório)'}
                </label>
                <input
                  type="text"
                  value={answer?.notes || ''}
                  onChange={(e) => onAnswerChange(item.id, { notes: e.target.value })}
                  placeholder="Descreva a falha ou vazamento avistado..."
                  className="w-full bg-surface-container border border-error/40 rounded-lg px-3 py-1.5 text-on-surface focus:outline-none focus:border-error"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono-label text-on-surface-variant/90 uppercase block mb-1">
                  Ação Imediata Tomada (Ex: Chave retirada)
                </label>
                <input
                  type="text"
                  value={answer?.immediateAction || ''}
                  onChange={(e) => onAnswerChange(item.id, { immediateAction: e.target.value })}
                  placeholder="Ex: Contenção de óleo instalada..."
                  className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-1.5 text-on-surface focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono-label text-on-surface-variant/90 uppercase block mb-1 flex items-center gap-1">
                <Camera size={14} className="text-error" />
                URL da Foto Comprobatória da Não Conformidade {item.requirePhotoOnNonConformity && '*'}
              </label>
              <input
                type="text"
                value={answer?.photoUrls?.[0] || ''}
                onChange={(e) => onAnswerChange(item.id, { photoUrls: [e.target.value] })}
                placeholder="https://exemplo.com/foto-avaria-item.jpg"
                className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-1.5 text-on-surface text-[12px] focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
