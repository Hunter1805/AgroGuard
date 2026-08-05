import { useState, useEffect, useCallback, useRef } from 'react';
import type { ChecklistExecution, ChecklistAnswer, ChecklistExecutionFiltersState } from '../types/checklist';
import { checklistExecutionService } from '../services/checklist-execution.service';

export function useChecklistExecution(executionId?: string) {
  const [executions, setExecutions] = useState<ChecklistExecution[]>([]);
  const [currentExecution, setCurrentExecution] = useState<ChecklistExecution | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros de listagem
  const [filters, setFilters] = useState<ChecklistExecutionFiltersState>({
    search: '',
    equipmentId: '',
    templateId: 'todos',
    type: 'todos',
    status: 'todos',
    operator: '',
    onlyWithNonConformity: false,
    onlyWithCriticalItem: false,
    onlyBlockedEquipment: false,
    onlyOverdue: false,
  });

  // Estado da tela de preenchimento (seção ativa e situação de auto-save)
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [saveStatus, setSaveStatus] = useState<'salvo' | 'salvando' | 'nao_salvo'>('salvo');
  const [answersMap, setAnswersMap] = useState<Record<string, ChecklistAnswer>>({});
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadExecutions = useCallback(async () => {
    if (executionId) return; // Se for para uma única execução, tratada abaixo
    setLoading(true);
    setError(null);
    try {
      const list = await checklistExecutionService.getChecklistExecutions(filters);
      setExecutions(list);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar execuções de checklist');
    } finally {
      setLoading(false);
    }
  }, [executionId, filters]);

  const loadSingleExecution = useCallback(async () => {
    if (!executionId) return;
    setLoading(true);
    setError(null);
    try {
      const exec = await checklistExecutionService.getChecklistExecutionById(executionId);
      if (exec) {
        setCurrentExecution(exec);
        // Converter array de respostas em map para facilidade no formulário
        const m: Record<string, ChecklistAnswer> = {};
        exec.answers.forEach((a) => {
          m[a.itemId] = a;
        });
        setAnswersMap(m);
      } else {
        setError('Execução de checklist não localizada na base do AgroGuard.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar os dados desta inspeção.');
    } finally {
      setLoading(false);
    }
  }, [executionId]);

  useEffect(() => {
    if (executionId) {
      loadSingleExecution();
    } else {
      loadExecutions();
    }
  }, [executionId, loadSingleExecution, loadExecutions]);

  // Atualizar uma resposta individual no map (aciona auto-save sem perder dados de outras seções)
  const setAnswer = useCallback((itemId: string, answerData: Partial<ChecklistAnswer>) => {
    setAnswersMap((prev) => {
      const exist = prev[itemId] || { id: `ans-${Date.now()}`, itemId, photoUrls: [] };
      const updated = { ...exist, ...answerData, answeredAt: new Date().toISOString().slice(0, 16) };
      return { ...prev, [itemId]: updated };
    });
    setSaveStatus('nao_salvo');

    // Auto-salvamento após 1.5s de inatividade na digitação
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(async () => {
      if (!executionId || !currentExecution) return;
      setSaveStatus('salvando');
      try {
        const arr = Object.values({ ...answersMap });
        await checklistExecutionService.saveChecklistProgress(executionId, arr);
        setSaveStatus('salvo');
      } catch {
        setSaveStatus('nao_salvo');
      }
    }, 1500);
  }, [executionId, currentExecution, answersMap]);

  const startNewExecution = async (data: {
    templateId: string;
    equipmentId: string;
    operatorName: string;
    horimeterReading?: number;
    odometerReading?: number;
    initialPhotoUrl?: string;
    generalNotes?: string;
  }) => {
    const res = await checklistExecutionService.startChecklistExecution(data);
    return res;
  };

  const completeCurrentExecution = async (operatorSignature: string, generalNotes?: string) => {
    if (!executionId) throw new Error('ID da execução não informado');
    const arr = Object.values(answersMap);
    const completed = await checklistExecutionService.completeChecklistExecution(executionId, {
      answers: arr,
      generalNotes,
      operatorSignature,
    });
    setCurrentExecution(completed);
    return completed;
  };

  const validateExecution = async (validatorName: string, comments?: string) => {
    if (!executionId) throw new Error('ID não informado');
    const validated = await checklistExecutionService.validateChecklistExecution(executionId, { validatorName, comments });
    setCurrentExecution(validated);
    return validated;
  };

  const rejectExecution = async (reason: string, validatorName: string) => {
    if (!executionId) throw new Error('ID não informado');
    const rejected = await checklistExecutionService.rejectChecklistExecution(executionId, reason, validatorName);
    setCurrentExecution(rejected);
    return rejected;
  };

  return {
    executions,
    currentExecution,
    loading,
    error,
    filters,
    setFilters,
    activeSectionIndex,
    setActiveSectionIndex,
    saveStatus,
    answersMap,
    setAnswer,
    startNewExecution,
    completeCurrentExecution,
    validateExecution,
    rejectExecution,
    refetch: executionId ? loadSingleExecution : loadExecutions,
  };
}
