import { useState, useEffect, useCallback } from 'react';
import { organizationService } from '../services/organization.service';
import { equipmentService } from '../services/equipment.service';
import { maintenancePlanService } from '../services/maintenance-plan.service';
import { checklistTemplateService } from '../services/checklist-template.service';
import { apiClient } from '../lib/api/api-client';

export interface StepStatus {
  completed: boolean;
  error: string | null;
}

export function useWelcomeOnboarding() {
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState<Record<number, StepStatus>>({
    1: { completed: false, error: null },
    2: { completed: false, error: null },
    3: { completed: false, error: null },
    4: { completed: false, error: null },
  });

  const checkProgress = useCallback(async () => {
    setLoading(true);

    // Etapa 1 - Dados da Empresa
    let step1Completed = false;
    let step1Error: string | null = null;
    try {
      const companies = await organizationService.getCompanies();
      step1Completed = companies.some(
        c => c.name?.trim() !== ''
      );
    } catch (err: any) {
      step1Error = 'Não foi possível verificar esta etapa.';
    }

    // Etapa 2 - Primeiro Equipamento
    let step2Completed = false;
    let step2Error: string | null = null;
    try {
      const equipments = await equipmentService.getAllEquipments();
      step2Completed = equipments.length > 0;
    } catch (err: any) {
      step2Error = 'Não foi possível verificar esta etapa.';
    }

    // Etapa 3 - Convide sua Equipe
    let step3Completed = false;
    let step3Error: string | null = null;
    try {
      const res = await apiClient<any[]>('/users/org');
      const activeMembers = res.data?.filter(m => m.status === 'ativo').length || 0;
      step3Completed = activeMembers > 1;
    } catch (err: any) {
      step3Error = 'Não foi possível verificar esta etapa.';
    }

    // Etapa 4 - Primeira Rotina
    let step4Completed = false;
    let step4Error: string | null = null;
    try {
      const [plans, templates] = await Promise.all([
        maintenancePlanService.getMaintenancePlans(),
        checklistTemplateService.getChecklistTemplates({ active: true }),
      ]);
      step4Completed = plans.length > 0 || templates.length > 0;
    } catch (err: any) {
      step4Error = 'Não foi possível verificar esta etapa.';
    }

    setStatuses({
      1: { completed: step1Completed, error: step1Error },
      2: { completed: step2Completed, error: step2Error },
      3: { completed: step3Completed, error: step3Error },
      4: { completed: step4Completed, error: step4Error },
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    checkProgress();
  }, [checkProgress]);

  const completedCount = Object.values(statuses).filter(s => s.completed).length;

  return {
    loading,
    statuses,
    completedCount,
    refetchProgress: checkProgress,
  };
}
