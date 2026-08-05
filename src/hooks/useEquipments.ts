import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Equipment, EquipmentStats, MaintenanceSituation } from '../types/equipment';
import { equipmentService } from '../services/equipment.service';

export function useEquipments() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Ler estados iniciais dos query params na URL
  const [filterAssetType, setFilterAssetType] = useState<string>(
    searchParams.get('tipo') || 'todos'
  );
  const [filterStatus, setFilterStatus] = useState<string>(
    searchParams.get('status') || 'todos'
  );
  const [filterLocation, setFilterLocation] = useState<string>(
    searchParams.get('local') || 'todas'
  );
  const [filterMaintenanceStatus, setFilterMaintenanceStatus] = useState<MaintenanceSituation>(
    (searchParams.get('manutencao') as MaintenanceSituation) || 'todas'
  );
  const [filterAlertOnly, setFilterAlertOnly] = useState<boolean>(
    searchParams.get('alerta') === 'true'
  );
  const [filterReadingOverdueOnly, setFilterReadingOverdueOnly] = useState<boolean>(
    searchParams.get('leituraAtrasada') === 'true'
  );
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get('busca') || ''
  );
  const [viewMode, setViewMode] = useState<'table' | 'cards'>(
    (searchParams.get('view') as 'table' | 'cards') || 'table'
  );

  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [stats, setStats] = useState<EquipmentStats | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sincronizar estados com os parâmetros da URL
  useEffect(() => {
    const params: Record<string, string> = {};

    if (filterAssetType !== 'todos') params.tipo = filterAssetType;
    if (filterStatus !== 'todos') params.status = filterStatus;
    if (filterLocation !== 'todas') params.local = filterLocation;
    if (filterMaintenanceStatus !== 'todas') params.manutencao = filterMaintenanceStatus;
    if (filterAlertOnly) params.alerta = 'true';
    if (filterReadingOverdueOnly) params.leituraAtrasada = 'true';
    if (searchTerm.trim() !== '') params.busca = searchTerm;
    if (viewMode !== 'table') params.view = viewMode;

    setSearchParams(params, { replace: true });
  }, [
    filterAssetType,
    filterStatus,
    filterLocation,
    filterMaintenanceStatus,
    filterAlertOnly,
    filterReadingOverdueOnly,
    searchTerm,
    viewMode,
    setSearchParams,
  ]);

  const loadEquipments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, statsData, locsData] = await Promise.all([
        equipmentService.filterEquipments({
          assetType: filterAssetType,
          status: filterStatus,
          location: filterLocation,
          maintenanceStatus: filterMaintenanceStatus,
          hasPendingAlert: filterAlertOnly ? true : undefined,
          isReadingOverdue: filterReadingOverdueOnly ? true : undefined,
          search: searchTerm,
        }),
        equipmentService.getEquipmentStats(),
        equipmentService.getLocations(),
      ]);
      setEquipments(data);
      setStats(statsData);
      setLocations(locsData);
    } catch {
      setError('Erro ao carregar lista de equipamentos.');
    } finally {
      setLoading(false);
    }
  }, [
    filterAssetType,
    filterStatus,
    filterLocation,
    filterMaintenanceStatus,
    filterAlertOnly,
    filterReadingOverdueOnly,
    searchTerm,
  ]);

  useEffect(() => {
    loadEquipments();
  }, [loadEquipments]);

  const archiveEquipment = async (id: string, reason: string) => {
    const success = await equipmentService.archiveEquipment(id, reason);
    if (success) {
      await loadEquipments();
    }
    return success;
  };

  const clearAllFilters = () => {
    setFilterAssetType('todos');
    setFilterStatus('todos');
    setFilterLocation('todas');
    setFilterMaintenanceStatus('todas');
    setFilterAlertOnly(false);
    setFilterReadingOverdueOnly(false);
    setSearchTerm('');
  };

  return {
    equipments,
    stats,
    locations,
    filterAssetType,
    setFilterAssetType,
    filterStatus,
    setFilterStatus,
    filterLocation,
    setFilterLocation,
    filterMaintenanceStatus,
    setFilterMaintenanceStatus,
    filterAlertOnly,
    setFilterAlertOnly,
    filterReadingOverdueOnly,
    setFilterReadingOverdueOnly,
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    loading,
    error,
    refetch: loadEquipments,
    archiveEquipment,
    clearAllFilters,
  };
}
