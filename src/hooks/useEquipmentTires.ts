import { useState, useEffect, useCallback } from 'react';
import type { EquipmentTireConfiguration, Tire } from '../types/tires';
import { tiresService } from '../services/tires.service';

export function useEquipmentTires(equipmentId?: string) {
  const [config, setConfig] = useState<EquipmentTireConfiguration | null>(null);
  const [installedTires, setInstalledTires] = useState<Tire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipmentTires = useCallback(async () => {
    if (!equipmentId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [configData, tiresData] = await Promise.all([
        tiresService.getEquipmentTireConfiguration(equipmentId),
        tiresService.getTires({ equipmentId }),
      ]);
      setConfig(configData || null);
      setInstalledTires(tiresData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar configuração de eixos do equipamento');
    } finally {
      setLoading(false);
    }
  }, [equipmentId]);

  useEffect(() => {
    fetchEquipmentTires();
  }, [fetchEquipmentTires]);

  const saveConfiguration = async (data: Partial<EquipmentTireConfiguration>) => {
    if (!equipmentId) return;
    const saved = await tiresService.saveEquipmentTireConfiguration(equipmentId, data);
    await fetchEquipmentTires();
    return saved;
  };

  return {
    config,
    installedTires,
    loading,
    error,
    refetch: fetchEquipmentTires,
    saveConfiguration,
  };
}

