import { useState } from 'react';
import type { Tire } from '../types/tires';
import { tiresService } from '../services/tires.service';

export function useTireForm(initialTire?: Tire, onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  /** True apenas durante o POST/PATCH — usado no rotulo "Salvando..." do botao. */
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveTire = async (formData: Partial<Tire>) => {
    try {
      setLoading(true);
      setSaving(true);
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
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Erro ao salvar dados do pneu. Tente novamente.';
      setError(message);
      return undefined;
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    error,
    setError,
    saveTire,
  };
}
