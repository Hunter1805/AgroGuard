import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { useChecklistExecution } from '../../../hooks/useChecklistExecution';
import { checklistTemplateService } from '../../../services/checklist-template.service';
import type { ChecklistSection } from '../../../types/checklist';
import { ChecklistExecutionHeader } from './ChecklistExecutionHeader';
import { ChecklistSectionNavigation } from './ChecklistSectionNavigation';
import { ChecklistItemField } from './ChecklistItemField';
import { ChecklistExecutionReview } from './ChecklistExecutionReview';
import { ROUTES } from '../../../types/routes';
import { Button } from '../../ui/Button';

export const ChecklistExecutionView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentExecution,
    loading,
    error,
    activeSectionIndex,
    setActiveSectionIndex,
    saveStatus,
    answersMap,
    setAnswer,
    completeCurrentExecution,
  } = useChecklistExecution(id);

  const [sections, setSections] = useState<ChecklistSection[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (currentExecution) {
      if (currentExecution.status !== 'em_andamento') {
        setIsDone(true);
      }
      // Carregar as seções do modelo de base do AgroGuard
      checklistTemplateService.getChecklistTemplateById(currentExecution.templateId).then((tpl) => {
        if (tpl) setSections(tpl.sections || []);
      });
    }
  }, [currentExecution]);

  if (loading) {
    return <div className="p-12 text-center font-mono-label text-on-surface-variant animate-pulse">Carregando dados da inspeção do AgroGuard...</div>;
  }

  if (error || !currentExecution) {
    return (
      <div className="p-8 max-w-lg mx-auto mt-12 text-center bg-error/15 border border-error/30 rounded-2xl text-error space-y-4">
        <AlertTriangle size={32} className="mx-auto text-error" />
        <p className="font-bold text-[15px]">{error || 'Inspeção não encontrada.'}</p>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.CHECKLISTS)}>Voltar às Inspeções</Button>
      </div>
    );
  }

  const totalItems = sections.reduce((acc, s) => acc + s.items.length, 0);
  const answeredCount = Object.values(answersMap).filter(
    (a) => a.result !== undefined || a.booleanValue !== undefined || a.textValue !== undefined
  ).length;
  const nonConformingCount = Object.values(answersMap).filter(
    (a) => a.result === 'nao_conforme' || a.booleanValue === false
  ).length;

  const currentSection = sections[activeSectionIndex];

  return (
    <div className="min-h-screen pb-20 bg-surface text-on-surface">
      <ChecklistExecutionHeader
        execution={currentExecution}
        totalItems={totalItems}
        answeredItems={answeredCount}
        nonConformitiesCount={nonConformingCount}
        saveStatus={saveStatus}
      />

      <div className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
        {isDone ? (
          <div className="glass-card bg-surface-container-highest/80 border border-white/10 rounded-3xl p-8 text-center space-y-4 max-w-xl mx-auto animate-fade-in shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-success/20 text-success flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="font-title-md text-[22px] font-bold text-on-surface">Checklist Concluído!</h2>
            <p className="text-[13px] text-on-surface-variant/80 max-w-md mx-auto">
              A inspeção <strong>{currentExecution.code}</strong> foi concluída por <strong>{currentExecution.operatorName}</strong>.
              A situação operacional do equipamento foi atualizada como <span className="text-primary font-bold uppercase">{currentExecution.finalCondition?.replace('_', ' ')}</span>.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Button variant="primary" size="sm" onClick={() => navigate(ROUTES.CHECKLISTS)}>
                Voltar à Central de Checklists
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ChecklistSectionNavigation
              sections={sections}
              activeSectionIndex={activeSectionIndex}
              onSelectSection={(idx) => {
                setActiveSectionIndex(idx);
                setIsReviewMode(false);
              }}
              answersMap={answersMap}
              isReviewMode={isReviewMode}
              onGoToReview={() => setIsReviewMode(true)}
            />

            {!isReviewMode ? (
              <div className="space-y-4 animate-fade-in">
                {currentSection ? (
                  <>
                    <div className="px-1">
                      <h3 className="font-title-md text-[16px] font-bold text-primary">{currentSection.title}</h3>
                      {currentSection.description && (
                        <p className="text-[12px] text-on-surface-variant/70">{currentSection.description}</p>
                      )}
                    </div>
                    <div className="space-y-3">
                      {currentSection.items.map((it) => (
                        <ChecklistItemField
                          key={it.id}
                          item={it}
                          answer={answersMap[it.id]}
                          onAnswerChange={setAnswer}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={activeSectionIndex === 0}
                        onClick={() => setActiveSectionIndex(Math.max(0, activeSectionIndex - 1))}
                      >
                        Anterior
                      </Button>
                      {activeSectionIndex < sections.length - 1 ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setActiveSectionIndex(activeSectionIndex + 1)}
                        >
                          Próxima Seção
                        </Button>
                      ) : (
                        <Button variant="primary" size="sm" onClick={() => setIsReviewMode(true)}>
                          Ir Para Conclusão
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-center py-10 text-on-surface-variant">Nenhuma seção cadastrada neste modelo.</p>
                )}
              </div>
            ) : (
              <ChecklistExecutionReview
                totalItems={totalItems}
                answeredCount={answeredCount}
                nonConformingCount={nonConformingCount}
                onComplete={async (sig, notes) => {
                  await completeCurrentExecution(sig, notes);
                  setIsDone(true);
                }}
                onBackToSections={() => setIsReviewMode(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
