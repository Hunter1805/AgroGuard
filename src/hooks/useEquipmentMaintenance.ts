import { useState, useEffect, useCallback } from 'react';
import type { EquipmentMaintenancePlanLink } from '../types/maintenance-schedule';
import type { MaintenancePlan } from '../types/maintenance-plan';
import { maintenancePlanService } from '../services/maintenance-plan.service';
import { maintenanceCalculationService } from '../services/maintenance-calculation.service';
import type { CalculationResult } from '../services/maintenance-calculation.service';
import { equipmentService } from '../services/equipment.service';

export function useEquipmentMaintenance(equipmentId: string) {
  const [activeLink, setActiveLink] = useState<EquipmentMaintenancePlanLink | null>(null);
  const [linkedPlan, setLinkedPlan] = useState<MaintenancePlan | null>(null);
  const [calculatedStatuses, setCalculatedStatuses] = useState<CalculationResult[]>([]);
  const [availablePlans, setAvailablePlans] = useState<MaintenancePlan[]>([]);
  const [currentReading, setCurrentReading] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    if (!equipmentId) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Puxar equipamento atual para saber a leitura da Fase 3D
      const eq = await equipmentService.getEquipmentById(equipmentId);
      const reading = eq?.currentHours || 0;
      setCurrentReading(reading);

      // 2. Buscar vínculos ativos deste equipamento
      const links = await maintenancePlanService.getEquipmentPlanLinks(equipmentId);
      const currentLink = links[0] || null;
      setActiveLink(currentLink);

      // 3. Buscar todos os planos disponíveis para possível vínculo
      const allPlans = await maintenancePlanService.getMaintenancePlans({ status: 'ativo' });
      setAvailablePlans(allPlans);

      // 4. Se tiver vínculo ativo, carregar o plano correspondente e calcular status por intervalo
      if (currentLink && currentLink.planId) {
        const plan = await maintenancePlanService.getMaintenancePlanById(currentLink.planId);
        setLinkedPlan(plan || null);

        if (plan && plan.intervals && plan.intervals.length > 0) {
          const statuses = plan.intervals.map((intv) =>
            maintenanceCalculationService.calculateMaintenanceStatus(intv, currentLink, reading)
          );
          setCalculatedStatuses(statuses);
        } else {
          setCalculatedStatuses([]);
        }
      } else {
        setLinkedPlan(null);
        setCalculatedStatuses([]);
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar status reativo das manutenções do ativo.');
    } finally {
      setLoading(false);
    }
  }, [equipmentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLinkPlan = async (planId: string, baseRead: number, baseDate: string, workshop: string, responsible: string) => {
    try {
      setError(null);
      const plan = availablePlans.find((p) => p.id === planId || p.code === planId);
      await maintenancePlanService.linkPlanToEquipment({
        equipmentId,
        planId: plan?.id || planId,
        planName: plan?.name || 'Plano Preventivo',
        planVersion: plan?.version || 1,
        startDate: baseDate,
        baseReading: baseRead,
        baseDate,
        active: true,
        workshopName: workshop,
        maintenanceResponsibleName: responsible,
      } as any);

      setActionMessage('Plano vinculado à máquina com êxito! O motor preventivo já iniciou o rastreio.');
      setIsLinkModalOpen(false);
      await fetchData();
    } catch (err: any) {
      setError(err?.message || 'Falha na vinculação do plano.');
    }
  };

  const handleUnlinkPlan = async (linkId?: string) => {
    const idToRm = linkId || activeLink?.id;
    if (!idToRm) return;
    try {
      await maintenancePlanService.unlinkPlanFromEquipment(idToRm);
      setActionMessage('Plano desvinculado deste ativo com sucesso.');
      await fetchData();
    } catch (err: any) {
      setError(err?.message || 'Erro ao desvincular o plano.');
    }
  };

  return {
    activeLink,
    linkedPlan,
    calculatedStatuses,
    availablePlans,
    currentReading,
    loading,
    error,
    actionMessage,
    isLinkModalOpen,
    setIsLinkModalOpen,
    clearMessage: () => setActionMessage(null),
    handleLinkPlan,
    handleUnlinkPlan,
    refresh: fetchData,
  };
}
