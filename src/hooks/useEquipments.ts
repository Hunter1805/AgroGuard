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

  // Paginação servida pelo backend (page/pageSize/search).
  const PAGE_SIZE = 100;
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Sincronizar estados com os parâmetros da URL apenas quando filtros forem alterados
  useEffect(() => {
    const params = new URLSearchParams();

    if (filterAssetType !== 'todos') params.set('tipo', filterAssetType);
    if (filterStatus !== 'todos') params.set('status', filterStatus);
    if (filterLocation !== 'todas') params.set('local', filterLocation);
    if (filterMaintenanceStatus !== 'todas') params.set('manutencao', filterMaintenanceStatus);
    if (filterAlertOnly) params.set('alerta', 'true');
    if (filterReadingOverdueOnly) params.set('leituraAtrasada', 'true');
    if (searchTerm.trim() !== '') params.set('busca', searchTerm);
    if (viewMode !== 'table') params.set('view', viewMode);

    const newQuery = params.toString();
    const currentQuery = searchParams.toString();
    if (newQuery !== currentQuery) {
      setSearchParams(params, { replace: true });
    }
  }, [
    filterAssetType,
    filterStatus,
    filterLocation,
    filterMaintenanceStatus,
    filterAlertOnly,
    filterReadingOverdueOnly,
    searchTerm,
    viewMode,
    searchParams,
    setSearchParams,
  ]);

  const loadEquipments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Uma única busca paginada alimenta lista, estatísticas e localizações —
      // antes eram 3 requisições idênticas disparadas em paralelo.
      const result = await equipmentService.filterEquipmentsPaged({
        assetType: filterAssetType,
        status: filterStatus,
        location: filterLocation,
        maintenanceStatus: filterMaintenanceStatus,
        hasPendingAlert: filterAlertOnly ? true : undefined,
        isReadingOverdue: filterReadingOverdueOnly ? true : undefined,
        search: searchTerm,
        page,
        pageSize: PAGE_SIZE,
      });
      setEquipments(result.items);
      setStats(result.stats);
      setLocations(result.locations);
      setTotal(result.total);
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
    page,
  ]);

  useEffect(() => {
    loadEquipments();
  }, [loadEquipments]);

  // Ao mudar qualquer filtro, volta para a primeira página.
  useEffect(() => {
    setPage(1);
  }, [
    filterAssetType,
    filterStatus,
    filterLocation,
    filterMaintenanceStatus,
    filterAlertOnly,
    filterReadingOverdueOnly,
    searchTerm,
  ]);

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
    page,
    setPage,
    total,
    totalPages,
    pageSize: PAGE_SIZE,
    refetch: loadEquipments,
    archiveEquipment,
    clearAllFilters,
  };
}
