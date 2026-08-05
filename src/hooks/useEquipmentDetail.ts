import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { EquipmentDetailData, EquipmentDetailTab } from '../types/equipment-detail';
import { equipmentDetailService } from '../services/equipment-detail.service';
import { ROUTE_HELPERS } from '../types/routes';

const VALID_TABS: EquipmentDetailTab[] = [
  'visao-geral',
  'leituras',
  'checklists',
  'manutencoes',
  'ordens-servico',
  'falhas',
  'pneus',
  'pecas-insumos',
  'custos',
  'documentos',
  'fotos',
  'historico',
];

export function useEquipmentDetail() {
  const { id, tab } = useParams<{ id: string; tab?: string }>();
  const navigate = useNavigate();

  // Validar se a aba passada na URL é válida, caso contrário assume 'visao-geral'
  const currentTab: EquipmentDetailTab =
    tab && (VALID_TABS as string[]).includes(tab)
      ? (tab as EquipmentDetailTab)
      : 'visao-geral';

  const [detailData, setDetailData] = useState<EquipmentDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Redirecionar para a sub-rota /visao-geral se apenas /equipamentos/:id for acessado
  useEffect(() => {
    if (id && (!tab || !(VALID_TABS as string[]).includes(tab))) {
      navigate(ROUTE_HELPERS.equipmentDetailTab(id, 'visao-geral'), { replace: true });
    }
  }, [id, tab, navigate]);

  const loadDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const data = await equipmentDetailService.getEquipmentDetail(id);
      if (!data) {
        setError('Equipamento não encontrado');
      } else {
        setDetailData(data);
      }
    } catch {
      setError('Erro ao carregar dados do equipamento.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const changeTab = (newTab: EquipmentDetailTab) => {
    if (!id) return;
    navigate(ROUTE_HELPERS.equipmentDetailTab(id, newTab));
  };

  return {
    equipmentId: id,
    activeTab: currentTab,
    detailData,
    equipment: detailData?.equipment || null,
    summary: detailData?.summary || null,
    loading,
    error,
    changeTab,
    refetch: loadDetail,
  };
}
