import { useState, useEffect, useCallback } from 'react';
import { organizationService } from '../services/organization.service';
import { equipmentCatalogService } from '../services/equipment-catalog.service';
import { maintenanceCatalogService } from '../services/maintenance-catalog.service';
import { suppliersService } from '../services/suppliers.service';
import { materialCatalogService } from '../services/material-catalog.service';
import { unitMeasureService } from '../services/unit-measure.service';

export function useMasterDataList(code: string, search?: string) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      let list: any[] = [];

      switch (code) {
        case 'EMPRESAS': list = await organizationService.getCompanies(); break;
        case 'UNIDADES': list = await organizationService.getUnits(); break;
        case 'FAZENDAS': list = await organizationService.getFarms(); break;
        case 'SETORES': list = await organizationService.getSectors(); break;
        case 'LOCALIZACOES': list = await organizationService.getLocations(); break;
        case 'CENTROS_COSTO': list = await organizationService.getCostCenters(); break;
        case 'OFICINAS': list = await organizationService.getWorkshops(); break;
        case 'ALMOXARIFADOS': list = await organizationService.getWarehouses(); break;
        case 'EQUIPES': list = await organizationService.getTeams(); break;

        case 'TIPOS_EQUIPAMENTO': list = await equipmentCatalogService.getEquipmentTypes(); break;
        case 'CATEGORIAS_EQUIPAMENTO': list = await equipmentCatalogService.getCategories(); break;
        case 'SUBCATEGORIAS_EQUIPAMENTO': list = await equipmentCatalogService.getSubcategories(); break;
        case 'MARCAS': list = await equipmentCatalogService.getBrands(); break;
        case 'MODELOS': list = await equipmentCatalogService.getModels(); break;
        case 'COMBUSTIVEIS': list = await equipmentCatalogService.getFuelTypes(); break;
        case 'FORMAS_PROPRIEDADE': list = await equipmentCatalogService.getOwnershipTypes(); break;

        case 'SISTEMAS': list = await maintenanceCatalogService.getSystems(); break;
        case 'SUBSISTEMAS': list = await maintenanceCatalogService.getSubsystems(); break;
        case 'COMPONENTES': list = await maintenanceCatalogService.getComponents(); break;
        case 'TIPOS_FALHA': list = await maintenanceCatalogService.getFailureTypes(); break;
        case 'SINTOMAS': list = await maintenanceCatalogService.getSymptoms(); break;
        case 'CAUSAS': list = await maintenanceCatalogService.getCauses(); break;
        case 'TIPOS_MANUTENCAO': list = await maintenanceCatalogService.getMaintenanceTypes(); break;
        case 'PRIORIDADES': list = await maintenanceCatalogService.getPriorities(); break;
        case 'MOTIVOS_OPERACIONAIS': list = await maintenanceCatalogService.getOperationalReasons(); break;

        case 'FORNECEDORES': list = await suppliersService.getSuppliers(); break;
        case 'CATEGORIAS_PECAS': list = await materialCatalogService.getPartCategories(); break;
        case 'CATEGORIAS_FERRAMENTAS': list = await materialCatalogService.getToolCategories(); break;
        case 'UNIDADES_MEDIDA': list = await unitMeasureService.getUnitsOfMeasure(); break;
        case 'TIPOS_DOCUMENTO': list = await materialCatalogService.getDocumentTypes(); break;
        default: list = await organizationService.getCompanies(); break;
      }

      if (search) {
        const q = search.toLowerCase();
        list = list.filter(i => (i.name && i.name.toLowerCase().includes(q)) || (i.code && i.code.toLowerCase().includes(q)));
      }

      setItems(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [code, search]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    refetch: fetchItems,
  };
}
