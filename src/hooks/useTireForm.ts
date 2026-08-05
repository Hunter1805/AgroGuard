import { useState } from 'react';
import type { Tire } from '../types/tires';
import { tiresService } from '../services/tires.service';

export function useTireForm(initialTire?: Tire, onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveTire = async (formData: Partial<Tire>) => {
    try {
      setLoading(true);
      setError(null);

      if (initialTire?.id) {
        const updated = await tiresService.updateTire(initialTire.id, formData);
        if (onSuccess) onSuccess();
        return updated;
      } else {
        const created = await tiresService.createTire(formData);
        if (onSuccess) onSuccess();
        return created;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar dados do pneu.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    saveTire,
  };
}
