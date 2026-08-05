import { useState, useEffect, useCallback } from 'react';
import type { TireRecommendation } from '../services/tire-recommendation.service';
import { tireRecommendationService } from '../services/tire-recommendation.service';

export function useTireRecommendations(filters?: { category?: string; size?: string; activeOnly?: boolean }) {
  const [recommendations, setRecommendations] = useState<TireRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tireRecommendationService.getRecommendations(filters);
      setRecommendations(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar recomendações de pressão');
    } finally {
      setLoading(false);
    }
  }, [filters?.category, filters?.size, filters?.activeOnly]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const createRecommendation = async (data: Omit<TireRecommendation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await tireRecommendationService.createRecommendation(data);
    await fetchRecommendations();
    return created;
  };

  const updateRecommendation = async (id: string, data: Partial<TireRecommendation>) => {
    const updated = await tireRecommendationService.updateRecommendation(id, data);
    await fetchRecommendations();
    return updated;
  };

  return {
    recommendations,
    loading,
    error,
    refetch: fetchRecommendations,
    createRecommendation,
    updateRecommendation,
  };
}
