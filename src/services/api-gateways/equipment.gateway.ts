import { apiClient } from '../../lib/api/api-client';
import type { Equipment } from '../../types/equipment';

export async function fetchEquipmentsFromApi(query?: string): Promise<Equipment[]> {
  const q = query ? `?search=${encodeURIComponent(query)}` : '';
  const response = await apiClient<any[]>(`/equipment${q}`);

  return response.data.map(eq => ({
    id: eq.id,
    assetId: eq.id,
    assetType: 'Trator',
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
    meterType: 'horimetro',
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
  }));
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
