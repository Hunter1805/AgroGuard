import { useState, useEffect, useCallback } from 'react';
import type { SupplierMaster } from '../types/material-master-data';
import { suppliersService } from '../services/suppliers.service';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<SupplierMaster[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await suppliersService.getSuppliers();
      setSuppliers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  return {
    suppliers,
    loading,
    refetch: fetchSuppliers,
    saveSupplier: suppliersService.saveSupplier,
  };
}
