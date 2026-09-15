import { apiClient } from '../../lib/api/api-client';
import type { Equipment } from '../../types/equipment';

let equipmentCache: Equipment[] | null = null;
let equipmentCacheTotal: number | null = null;
let equipmentRequest: Promise<EquipmentPage> | null = null;
let equipmentCacheKey: string | null = null;

/** Página de equipamentos: itens + total real informado pelo backend. */
export interface EquipmentPage {
  items: Equipment[];
  total: number;
}

/**
 * O backend usa valores próprios (ex.: 'operacional', 'em_manutencao', 'inativo').
 * O front trabalha com o tipo `EquipmentStatus` ('operante' | 'em_operacao' |
 * 'manutencao' | 'parado' | 'bloqueado' | 'inoperante'). Sem esta normalização,
 * indicadores como Disponibilidade/Utilização ficavam zerados.
 */
function normalizeEquipmentStatus(raw: string | null | undefined): Equipment['status'] {
  const s = (raw || '').toLowerCase().trim();
  switch (s) {
    case 'operacional':
    case 'operante':
    case 'ativo':
    case 'active':
    case 'disponivel':
      return 'operante';
    case 'em_operacao':
    case 'operando':
    case 'in_operation':
      return 'em_operacao';
    case 'manutencao':
    case 'em_manutencao':
    case 'maintenance':
      return 'manutencao';
    case 'parado':
    case 'parada':
    case 'stopped':
      return 'parado';
    case 'bloqueado':
    case 'blocked':
      return 'bloqueado';
    case 'inoperante':
    case 'inativo':
    case 'inactive':
      return 'inoperante';
    default:
      return (raw as Equipment['status']) || 'operante';
  }
}

export interface EquipmentQuery {
  search?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Busca equipamentos paginados. O backend já expõe page/pageSize/search
 * (default 25, máximo 100) e devolve meta.total — sem passar pageSize o front
 * recebia apenas a primeira página e descartava o total.
 */
export async function fetchEquipmentPageFromApi(query: EquipmentQuery = {}): Promise<EquipmentPage> {
  const params = new URLSearchParams();
  params.set('page', String(query.page ?? 1));
  params.set('pageSize', String(query.pageSize ?? 100));
  if (query.search) params.set('search', query.search);
  const q = `?${params.toString()}`;

  const cacheKey = q;
  if (equipmentCache && equipmentCacheKey === cacheKey) return { items: equipmentCache, total: equipmentCacheTotal ?? equipmentCache.length };
  if (equipmentRequest && equipmentCacheKey === cacheKey) return equipmentRequest;

  equipmentCacheKey = cacheKey;
  const request = apiClient<any>(`/equipment${q}`, { timeoutMs: 25_000 }).then((response) => {
    const rawItems: any[] = Array.isArray(response.data)
      ? response.data
      : Array.isArray((response.data as any)?.items)
      ? (response.data as any).items
      : [];
    const total = Number((response.meta as any)?.total ?? rawItems.length);
    equipmentCacheTotal = total;

    const items = rawItems.map(eq => ({
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
      status: normalizeEquipmentStatus(eq.status),
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
    }));
    return { items, total };
  });

  equipmentRequest = request;
  try {
    const page = await request;
    equipmentCache = page.items;
    return page;
  } finally {
    equipmentRequest = null;
  }
}

/** Compatibilidade: retorna apenas os itens da primeira página. */
export async function fetchEquipmentsFromApi(query?: string): Promise<Equipment[]> {
  const page = await fetchEquipmentPageFromApi({ search: query, pageSize: 100 });
  return page.items;
}

export function equipmentCacheInvalidation() {
  equipmentCache = null;
  equipmentCacheTotal = null;
  equipmentCacheKey = null;
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
  companyId?: string;
  unitId?: string;
  farmId?: string;
  equipmentTypeId?: string;
  modelId?: string;
  assetType?: string;
  brand?: string;
  model?: string;
  code: string;
  name: string;
  serialNumber?: string;
  manufactureYear?: number;
}

export async function createEquipmentInApi(payload: CreateEquipmentPayload): Promise<unknown> {
  const res = await apiClient<{ ok?: boolean }>('/equipment', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function updateEquipmentInApi(id: string, payload: Record<string, unknown>): Promise<unknown> {
  const res = await apiClient(`/equipment/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function archiveEquipmentInApi(id: string, reason?: string): Promise<void> {
  await apiClient(`/equipment/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ reason }),
  });
}
