import { useState, useEffect, useCallback } from 'react';
import { masterDataService } from '../services/master-data.service';

export function useMasterDataOverview() {
  const [stats, setStats] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      const [st, cd] = await Promise.all([
        masterDataService.getOverviewStats(),
        masterDataService.getCategoryCards(),
      ]);
      setStats(st);
      setCards(cd);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return {
    stats,
    cards,
    loading,
    refetch: fetchOverview,
  };
}
