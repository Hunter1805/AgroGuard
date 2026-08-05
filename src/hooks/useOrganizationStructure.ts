import { useState, useEffect, useCallback } from 'react';
import { organizationService } from '../services/organization.service';
import type { Company, Unit, Farm, Sector, LocationItem, CostCenter, Workshop, Warehouse, Team } from '../types/organization-master-data';

export function useOrganizationStructure() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStructure = useCallback(async () => {
    try {
      setLoading(true);
      const [c, u, f, s, l, cc, w, wh, t] = await Promise.all([
        organizationService.getCompanies(),
        organizationService.getUnits(),
        organizationService.getFarms(),
        organizationService.getSectors(),
        organizationService.getLocations(),
        organizationService.getCostCenters(),
        organizationService.getWorkshops(),
        organizationService.getWarehouses(),
        organizationService.getTeams(),
      ]);
      setCompanies(c);
      setUnits(u);
      setFarms(f);
      setSectors(s);
      setLocations(l);
      setCostCenters(cc);
      setWorkshops(w);
      setWarehouses(wh);
      setTeams(t);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStructure();
  }, [fetchStructure]);

  return {
    companies,
    units,
    farms,
    sectors,
    locations,
    costCenters,
    workshops,
    warehouses,
    teams,
    loading,
    refetch: fetchStructure,
  };
}
