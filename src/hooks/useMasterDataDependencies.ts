import { useState, useCallback } from 'react';
import type { MasterDataDependencyCheckResult } from '../types/master-data-dependency';
import { masterDataDependencyService } from '../services/master-data-dependency.service';

export function useMasterDataDependencies() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MasterDataDependencyCheckResult | null>(null);

  const checkDependencies = useCallback(async (type: string, id: string) => {
    try {
      setLoading(true);
      const res = await masterDataDependencyService.checkDependencies(type, id);
      setResult(res);
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    result,
    loading,
    checkDependencies,
  };
}
