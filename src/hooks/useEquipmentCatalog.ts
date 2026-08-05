import { useState, useEffect, useCallback } from 'react';
import { equipmentCatalogService } from '../services/equipment-catalog.service';
import type {
  EquipmentTypeMaster, EquipmentCategoryMaster, EquipmentSubcategoryMaster,
  BrandMaster, ModelMaster, FuelTypeMaster, OwnershipTypeMaster
} from '../types/equipment-master-data';

export function useEquipmentCatalog() {
  const [types, setTypes] = useState<EquipmentTypeMaster[]>([]);
  const [categories, setCategories] = useState<EquipmentCategoryMaster[]>([]);
  const [subcategories, setSubcategories] = useState<EquipmentSubcategoryMaster[]>([]);
  const [brands, setBrands] = useState<BrandMaster[]>([]);
  const [models, setModels] = useState<ModelMaster[]>([]);
  const [fuelTypes, setFuelTypes] = useState<FuelTypeMaster[]>([]);
  const [ownershipTypes, setOwnershipTypes] = useState<OwnershipTypeMaster[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCatalog = useCallback(async () => {
    try {
      setLoading(true);
      const [t, c, sub, b, m, f, o] = await Promise.all([
        equipmentCatalogService.getEquipmentTypes(),
        equipmentCatalogService.getCategories(),
        equipmentCatalogService.getSubcategories(),
        equipmentCatalogService.getBrands(),
        equipmentCatalogService.getModels(),
        equipmentCatalogService.getFuelTypes(),
        equipmentCatalogService.getOwnershipTypes(),
      ]);
      setTypes(t);
      setCategories(c);
      setSubcategories(sub);
      setBrands(b);
      setModels(m);
      setFuelTypes(f);
      setOwnershipTypes(o);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return {
    types,
    categories,
    subcategories,
    brands,
    models,
    fuelTypes,
    ownershipTypes,
    loading,
    refetch: fetchCatalog,
  };
}
