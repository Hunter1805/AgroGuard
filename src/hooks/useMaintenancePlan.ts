import { useState, useEffect } from 'react';
import type { MaintenancePlan } from '../types/maintenance-plan';
import { maintenancePlanService } from '../services/maintenance-plan.service';

export function useMaintenancePlan(equipmentId?: string) {
  const [plan, setPlan] = useState<MaintenancePlan | null>(null);
  const [allPlans, setAllPlans] = useState<MaintenancePlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (equipmentId) {
      maintenancePlanService.getByEquipmentId(equipmentId).then((p) => {
        setPlan(p ?? null);
        setLoading(false);
      });
    } else {
      maintenancePlanService.getAll().then((plans) => {
        setAllPlans(plans);
        setLoading(false);
      });
    }
  }, [equipmentId]);

  return { plan, allPlans, loading };
}
