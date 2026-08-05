import React from 'react';
import { ArrowLeft, Save, AlertTriangle, Clock, Tractor, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ChecklistExecution } from '../../../types/checklist';
import { ROUTES } from '../../../types/routes';

interface ChecklistExecutionHeaderProps {
  execution: ChecklistExecution;
  totalItems: number;
  answeredItems: number;
  nonConformitiesCount: number;
  saveStatus: 'salvo' | 'salvando' | 'nao_salvo';
  onForceSave?: () => void;
}

export const ChecklistExecutionHeader: React.FC<ChecklistExecutionHeaderProps> = ({
  execution,
  totalItems,
  answeredItems,
  nonConformitiesCount,
  saveStatus,
  onForceSave,
}) => {
  const navigate = useNavigate();
  const progressPercent = totalItems > 0 ? Math.round((answeredItems / totalItems) * 100) : 0;

  return (
    <div className="sticky top-0 z-40 bg-surface-container-highest/95 backdrop-blur-md border-b border-white/10 p-4 shadow-xl">
      <div className="max-w-5xl mx-auto flex flex-col gap-3">
        {/* Linha superior */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(ROUTES.CHECKLISTS)}
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              title="Voltar ao Painel"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-label text-primary font-bold text-[13px]">
                  {execution.code}
                </span>
                <span className="text-[11px] font-mono-label text-on-surface-variant/70 uppercase">
                  v{execution.templateVersion}
                </span>
              </div>
              <h1 className="font-title-md text-[18px] font-bold text-on-surface leading-tight">
                {execution.templateName}
              </h1>
            </div>
          </div>

          {/* Status do auto-save / Botão Rascunho */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[12px] font-mono-label">
              {saveStatus === 'salvo' && (
                <span className="text-success inline-flex items-center gap-1">
                  <CheckCircle2 size={14} /> Rascunho Salvo
                </span>
              )}
              {saveStatus === 'salvando' && (
                <span className="text-warning animate-pulse inline-flex items-center gap-1">
                  <Save size={14} /> Salvando...
                </span>
              )}
              {saveStatus === 'nao_salvo' && (
                <button
                  onClick={onForceSave}
                  className="text-primary hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <Save size={14} /> Salvar Rascunho Agora
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Informações da Máquina e Indicadores do Progresso */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-[12px] p-2.5 rounded-xl bg-surface-container/60 border border-white/5 font-mono-label">
          <div className="flex items-center gap-2 text-on-surface truncate">
            <Tractor size={15} className="text-primary shrink-0" />
            <span className="truncate"><strong>{execution.equipmentCode}</strong> — {execution.equipmentName}</span>
          </div>
          
          <div className="flex items-center gap-2 text-on-surface-variant truncate">
            <Clock size={15} className="text-secondary shrink-0" />
            <span className="truncate">Início: <strong>{execution.startedAt?.slice(11, 16) || 'Hoje'}</strong> ({execution.operatorName?.split(' ')[0]})</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-bold text-on-surface">{answeredItems}/{totalItems} ({progressPercent}%)</span>
          </div>

          <div className={`flex items-center justify-center gap-1.5 rounded-lg py-1 px-2 font-bold ${nonConformitiesCount > 0 ? 'bg-error/15 text-error border border-error/30' : 'bg-surface text-on-surface-variant/70'}`}>
            <AlertTriangle size={14} />
            <span>{nonConformitiesCount} Não Conformidade{nonConformitiesCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
