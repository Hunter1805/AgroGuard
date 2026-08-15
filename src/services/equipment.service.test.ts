import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Equipment } from '../types/equipment';

const apiList = vi.fn<() => Promise<Equipment[]>>();
const storageGet = vi.fn();
const storageSet = vi.fn();

vi.mock('./api-gateways/equipment.gateway', () => ({
  fetchEquipmentsFromApi: apiList,
}));
vi.mock('./mock-storage', () => ({
  mockStorage: { get: storageGet, set: storageSet },
}));

const sample: Equipment = {
  id: 'api-1', assetId: 'api-1', assetType: 'Trator', name: 'API equipment',
  brand: 'Brand', model: 'Model', year: '2025', plateOrCode: 'API-1',
  status: 'operante', location: 'API location', farm: 'Farm', sector: 'Sector',
  currentHours: 10, meterType: 'horimetro', meters: [], fuelLevel: 80,
  lastMaintenanceDate: '01/01/2025', nextMaintenanceDate: '01/02/2025',
  maintenanceStatus: 'em_dia', patrimony: 'P-1',
};

describe('equipmentService em modo API', () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  async function service() {
    vi.stubEnv('VITE_DATA_SOURCE', 'api');
    return import('./equipment.service');
  }

  it('retorna [] para API vazia em listagem, filtros e locais', async () => {
    apiList.mockResolvedValue([]);
    const { equipmentService } = await service();
    expect(await equipmentService.getAllEquipments()).toEqual([]);
    expect(await equipmentService.filterEquipments({})).toEqual([]);
    expect(await equipmentService.getLocations()).toEqual([]);
    expect(storageGet).not.toHaveBeenCalled();
  });

  it('propaga erro da API sem fallback para mockStorage', async () => {
    const error = new Error('network error');
    apiList.mockRejectedValue(error);
    const { equipmentService } = await service();
    await expect(equipmentService.getAllEquipments()).rejects.toThrow('network error');
    await expect(equipmentService.getEquipmentById('api-1')).rejects.toThrow('network error');
    await expect(equipmentService.getEquipmentStats()).rejects.toThrow('network error');
    await expect(equipmentService.getLocations()).rejects.toThrow('network error');
    await expect(equipmentService.filterEquipments({})).rejects.toThrow('network error');
    expect(storageGet).not.toHaveBeenCalled();
  });

  it('usa a API para leitura e rejeita operações de escrita sem gateway', async () => {
    apiList.mockResolvedValue([sample]);
    const { equipmentService } = await service();
    expect(await equipmentService.getEquipmentById('api-1')).toMatchObject({ id: 'api-1' });
    expect((await equipmentService.getEquipmentStats()).total).toBe(1);
    await expect(equipmentService.createEquipment({} as never)).rejects.toThrow();
    await expect(equipmentService.updateEquipment('api-1', {})).rejects.toThrow();
    await expect(equipmentService.archiveEquipment('api-1', 'test')).rejects.toThrow();
    expect(storageGet).not.toHaveBeenCalled();
    expect(storageSet).not.toHaveBeenCalled();
  });
});

describe('equipmentService em modo mock explícito', () => {
  it('permite os dados default no modo mock', async () => {
    vi.stubEnv('VITE_DATA_SOURCE', 'mock');
    storageGet.mockImplementation((_key: string, fallback: Equipment[]) => fallback);
    const { equipmentService } = await import('./equipment.service');
    expect((await equipmentService.getAllEquipments()).length).toBeGreaterThan(0);
  });
});
