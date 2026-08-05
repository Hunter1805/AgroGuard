import { useState, useEffect, useCallback } from 'react';
import type { MaintenancePlan, MaintenancePlanFilterState } from '../types/maintenance-plan';
import type { EquipmentMaintenancePlanLink } from '../types/maintenance-schedule';
import { maintenancePlanService } from '../services/maintenance-plan.service';

const DEFAULT_FILTERS: MaintenancePlanFilterState = {
  search: '',
  equipmentType: 'todos',
  brand: 'todos',
  model: 'todos',
  status: 'todos',
  triggerType: 'todos',
  linkStatus: 'todos',
};

export function useMaintenancePlans() {
  const [plans, setPlans] = useState<MaintenancePlan[]>([]);
  const [links, setLinks] = useState<EquipmentMaintenancePlanLink[]>([]);
  const [filters, setFilters] = useState<MaintenancePlanFilterState>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedPlans, fetchedLinks] = await Promise.all([
        maintenancePlanService.getMaintenancePlans(filters),
        maintenancePlanService.getEquipmentPlanLinks(),
      ]);
      setPlans(fetchedPlans);
      setLinks(fetchedLinks);
    } catch (err: any) {
      setError(err?.message || 'Falha ao recuperar a listagem de planos preventivos.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const updateFilters = (newFilters: Partial<MaintenancePlanFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const duplicatePlan = async (id: string) => {
    try {
      const copied = await maintenancePlanService.duplicateMaintenancePlan(id);
      setActionMessage(`Plano clonado com sucesso sob o código ${copied.code}!`);
      await fetchPlans();
    } catch (err: any) {
      setError(err?.message || 'Erro ao duplicar plano de manutenção.');
    }
  };

  const upgradePlanVersion = async (id: string) => {
    try {
      const upgraded = await maintenancePlanService.createMaintenancePlanVersion(id);
      setActionMessage(`Nova versão v${upgraded.version} criada para preservar a auditoria retroativa!`);
      await fetchPlans();
    } catch (err: any) {
      setError(err?.message || 'Erro ao criar versão auditable do plano.');
    }
  };

  const archivePlan = async (id: string) => {
    try {
      await maintenancePlanService.updateMaintenancePlan(id, { archived: true, active: false });
      setActionMessage('Plano arquivado do diretório ativo com sucesso.');
      await fetchPlans();
    } catch (err: any) {
      setError(err?.message || 'Falha ao arquivar plano preventivo.');
    }
  };

  return {
    plans,
    links,
    filters,
    loading,
    error,
    actionMessage,
    clearMessage: () => setActionMessage(null),
    updateFilters,
    resetFilters,
    duplicatePlan,
    upgradePlanVersion,
    archivePlan,
    refresh: fetchPlans,
  };
}
