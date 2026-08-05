import { useState, useEffect, useCallback } from 'react';
import type { SavedReport } from '../types/reports';
import { reportsService } from '../services/reports.service';

export function useFavoriteReports() {
  const [favorites, setFavorites] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const res = await reportsService.getSavedReports();
      setFavorites(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const saveFavorite = async (data: Omit<SavedReport, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await reportsService.saveFavoriteReport(data);
    await fetchFavorites();
    return created;
  };

  const deleteFavorite = async (id: string) => {
    await reportsService.deleteFavoriteReport(id);
    await fetchFavorites();
  };

  return {
    favorites,
    loading,
    saveFavorite,
    deleteFavorite,
    refetchFavorites: fetchFavorites,
  };
}
