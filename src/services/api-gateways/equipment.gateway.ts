import { apiClient } from '../../lib/api/api-client';
import type { Equipment } from '../../types/equipment';

let equipmentCache: Equipment[] | null = null;
let equipmentRequest: Promise<Equipment[]> | null = null;

export async function fetchEquipmentsFromApi(query?: string): Promise<Equipment[]> {
  if (!query && equipmentCache) return equipmentCache;
  if (!query && equipmentRequest) return equipmentRequest;

  const q = query ? `?search=${encodeURIComponent(query)}` : '';
  const request = apiClient<any[]>(`/equipment${q}`, { timeoutMs: 8_000 }).then((response) => response.data.map(eq => ({
    id: eq.id,
    assetId: eq.id,
    assetType: 'Trator' as any,
    code: eq.code,
    plateOrCode: eq.code,
    name: eq.name,
    type: (eq.equipmentType?.name || 'Trator') as any,
    model: eq.model?.name || 'Modelo Padrão',
    brand: eq.model?.brand?.name || 'Marca Padrão',
    manufactureYear: eq.manufactureYear ? String(eq.manufactureYear) : '2024',
    modelYear: eq.manufactureYear ? String(eq.manufactureYear) : '2024',
    year: eq.manufactureYear ? String(eq.manufactureYear) : '2024',
    serialNumber: eq.serialNumber || 'SN-000000',
    status: (eq.status || 'operante') as any,
    currentMeter: Number(eq.meters?.[0]?.currentValue || 0),
    currentHours: Number(eq.meters?.[0]?.currentValue || 0),
    meterUnit: 'h',
    meterType: 'horimetro' as any,
    fuelLevel: 100,
    lastMaintenanceDate: eq.updatedAt,
    nextMaintenanceDate: eq.updatedAt,
    meters: eq.meters?.map((m: any) => ({
      id: m.id,
      type: m.meterType || 'horimetro',
      label: 'Medidor Principal',
      currentValue: Number(m.currentValue),
      unit: m.unit || 'h',
      lastReadingDate: new Date().toLocaleDateString('pt-BR'),
    })) || [],
    lastReadingAt: eq.updatedAt,
    location: 'Pátio Central',
    unitId: eq.unitId,
    farmId: eq.farmId || undefined,
  })));

  if (!query) {
    equipmentRequest = request;
    try {
      const data = await request;
      equipmentCache = data;
      return data;
    } finally {
      equipmentRequest = null;
    }
  }

  return request;
}

export function equipmentCacheInvalidation() {
  equipmentCache = null;
  equipmentRequest = null;
}

export async function registerReadingInApi(equipmentId: string, meterId: string, value: number) {
  return apiClient('/readings', {
    method: 'POST',
    body: JSON.stringify({
      equipmentId,
      meterId,
      readingValue: value,
    }),
  });
}

export interface CreateEquipmentPayload {
  companyId: string;
  unitId: string;
  farmId?: string;
  equipmentTypeId: string;
  modelId: string;
  code: string;
  name: string;
  serialNumber?: string;
  manufactureYear?: number;
}

export async function createEquipmentInApi(payload: CreateEquipmentPayload): Promise<unknown> {
  const res = await apiClient<{ ok?: boolean }>('/equipment', {
    method: 'POST',
    body: JSON.stringify(payload),
    timeoutMs: 10_000,
  });
  return res.data;
}

export async function updateEquipmentInApi(id: string, payload: Record<string, unknown>): Promise<unknown> {
  const res = await apiClient(`/equipment/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    timeoutMs: 10_000,
  });
  return res.data;
}

export async function archiveEquipmentInApi(id: string, reason?: string): Promise<void> {
  await apiClient(`/equipment/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ reason }),
    timeoutMs: 8_000,
  });
}
