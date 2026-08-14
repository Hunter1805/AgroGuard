import { useState, useEffect, useCallback } from 'react';
import type { MaintenancePlan, MaintenancePlanInterval, MaintenanceTask } from '../types/maintenance-plan';
import { maintenancePlanService } from '../services/maintenance-plan.service';

const DEFAULT_PLAN: Omit<MaintenancePlan, 'id' | 'createdAt' | 'updatedAt' | 'version'> = {
  code: '',
  name: '',
  description: '',
  applicableEquipmentTypeIds: ['Trator'],
  applicableBrandIds: [],
  applicableModelIds: [],
  specificEquipmentIds: [],
  active: true,
  archived: false,
  createdBy: 'Operador Responsável',
  intervals: [
    {
      id: 'INT-INIT-1',
      name: 'Revisão Padrão de 250 Horas',
      triggerType: 'horas',
      rule: 'leitura',
      meterType: 'horimetro',
      readingInterval: 250,
      alertReadingBefore: 25,
      allowedReadingDelay: 10,
      priority: 'HIGH',
      estimatedDurationMinutes: 120,
      requiresEquipmentStop: true,
      requiresApproval: false,
      tasks: [],
    },
  ],
};

export function useMaintenancePlanForm(planId?: string) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<Partial<MaintenancePlan>>(DEFAULT_PLAN as any);
  const [loading, setLoading] = useState<boolean>(!!planId);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [hasHistoryWarning, setHasHistoryWarning] = useState<boolean>(false);

  const fetchExisting = useCallback(async () => {
    if (!planId) return;
    setLoading(true);
    try {
      const found = await maintenancePlanService.getMaintenancePlanById(planId);
      if (found) {
        setFormData(found);
        // Simular aviso de que planos já acionados no passado virarão nova versão ao salvar
        if ((found.version || 1) >= 1) {
          setHasHistoryWarning(true);
        }
      } else {
        setError('Plano não encontrado.');
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar dados do plano.');
    } finally {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    fetchExisting();
  }, [fetchExisting]);

  const updateField = (field: keyof MaintenancePlan, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addInterval = (newInterval: MaintenancePlanInterval) => {
    setFormData((prev) => ({
      ...prev,
      intervals: [...(prev.intervals || []), newInterval],
    }));
  };

  const updateInterval = (index: number, updated: MaintenancePlanInterval) => {
    setFormData((prev) => {
      const copy = [...(prev.intervals || [])];
      copy[index] = updated;
      return { ...prev, intervals: copy };
    });
  };

  const removeInterval = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      intervals: (prev.intervals || []).filter((_, i) => i !== index),
    }));
  };

  const addTaskToInterval = (intervalIndex: number, newTask: MaintenanceTask) => {
    setFormData((prev) => {
      const intervalsCopy = [...(prev.intervals || [])];
      const targetInterval = { ...intervalsCopy[intervalIndex] };
      targetInterval.tasks = [...(targetInterval.tasks || []), newTask];
      intervalsCopy[intervalIndex] = targetInterval;
      return { ...prev, intervals: intervalsCopy };
    });
  };

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep((s) => s + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const submitForm = async (): Promise<{ plan: MaintenancePlan; isNewVersion: boolean }> => {
    setSaving(true);
    setError(null);
    try {
      let saved: MaintenancePlan;
      let isNewVersion = false;
      if (planId) {
        if (hasHistoryWarning) {
          // O sistema preserva auditoria e cria a próxima versão
          saved = await maintenancePlanService.updateMaintenancePlan(planId, formData);
          isNewVersion = true;
        } else {
          saved = await maintenancePlanService.updateMaintenancePlan(planId, formData);
        }
      } else {
        saved = await maintenancePlanService.createMaintenancePlan(formData as any);
      }
      setSuccess(true);
      return { plan: saved, isNewVersion };
    } catch (err: any) {
      const msg = err?.message || 'Erro ao gravar o plano preventivo.';
      setError(msg);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    formData,
    loading,
    saving,
    error,
    success,
    hasHistoryWarning,
    updateField,
    addInterval,
    updateInterval,
    removeInterval,
    addTaskToInterval,
    nextStep,
    prevStep,
    submitForm,
  };
}
