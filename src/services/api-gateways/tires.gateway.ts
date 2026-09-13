import { apiClient } from '../../lib/api/api-client';
import type { Tire } from '../../types/tires';

interface ApiTireRow {
  id: string;
  code: string;
  brand: string;
  model: string;
  size: string;
  serialNumber: string | null;
  status: string;
  currentDepthMm: number | string;
  metadata: Record<string, any> | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Converte a linha da API no tipo `Tire` usado pelo front. */
export function mapApiTireToTire(row: ApiTireRow): Tire {
  const m = row.metadata ?? {};
  return {
    id: row.id,
    internalCode: row.code,
    brand: row.brand,
    model: row.model,
    size: row.size,
    constructionType: m.constructionType,
    application: m.application,
    serialNumber: row.serialNumber ?? m.serialNumber,
    dotCode: m.dotCode,
    manufacturingDate: m.manufacturingDate,
    acquisitionDate: m.acquisitionDate,
    acquisitionValue: m.acquisitionValue != null ? Number(m.acquisitionValue) : undefined,
    supplierId: m.supplierId,
    warrantyEndDate: m.warrantyEndDate,
    initialTreadDepth: m.initialTreadDepth != null ? Number(m.initialTreadDepth) : undefined,
    currentTreadDepth: m.currentTreadDepth != null ? Number(m.currentTreadDepth) : Number(row.currentDepthMm),
    minimumTreadDepth: m.minimumTreadDepth != null ? Number(m.minimumTreadDepth) : undefined,
    recommendedMinimumPressure: m.recommendedMinimumPressure != null ? Number(m.recommendedMinimumPressure) : undefined,
    recommendedMaximumPressure: m.recommendedMaximumPressure != null ? Number(m.recommendedMaximumPressure) : undefined,
    pressureUnit: m.pressureUnit ?? 'psi',
    hasTube: Boolean(m.hasTube),
    usesWaterBallast: Boolean(m.usesWaterBallast),
    status: (row.status ?? 'disponivel') as Tire['status'],
    condition: m.condition ?? 'novo',
    currentEquipmentId: m.currentEquipmentId,
    currentPositionId: m.currentPositionId,
    installationDate: m.installationDate,
    installationReading: m.installationReading != null ? Number(m.installationReading) : undefined,
    installationReadingUnit: m.installationReadingUnit,
    accumulatedHours: m.accumulatedHours != null ? Number(m.accumulatedHours) : undefined,
    accumulatedKilometers: m.accumulatedKilometers != null ? Number(m.accumulatedKilometers) : undefined,
    retreadCount: Number(m.retreadCount ?? 0),
    maximumRetreads: m.maximumRetreads != null ? Number(m.maximumRetreads) : undefined,
    notes: m.notes,
    mainPhotoUrl: m.mainPhotoUrl,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    archivedAt: row.archivedAt ?? undefined,
  };
}

/** Converte o form do front no payload da API (campos fixos + extras em metadata). */
export function mapTireToApiPayload(data: Partial<Tire>) {
  const metadata: Record<string, unknown> = {
    constructionType: data.constructionType,
    application: data.application,
    dotCode: data.dotCode,
    manufacturingDate: data.manufacturingDate,
    acquisitionDate: data.acquisitionDate,
    acquisitionValue: data.acquisitionValue,
    supplierId: data.supplierId,
    warrantyEndDate: data.warrantyEndDate,
    initialTreadDepth: data.initialTreadDepth,
    currentTreadDepth: data.currentTreadDepth,
    minimumTreadDepth: data.minimumTreadDepth,
    recommendedMinimumPressure: data.recommendedMinimumPressure,
    recommendedMaximumPressure: data.recommendedMaximumPressure,
    pressureUnit: data.pressureUnit,
    hasTube: data.hasTube,
    usesWaterBallast: data.usesWaterBallast,
    condition: data.condition,
    currentEquipmentId: data.currentEquipmentId,
    currentPositionId: data.currentPositionId,
    installationDate: data.installationDate,
    installationReading: data.installationReading,
    installationReadingUnit: data.installationReadingUnit,
    accumulatedHours: data.accumulatedHours,
    accumulatedKilometers: data.accumulatedKilometers,
    retreadCount: data.retreadCount,
    maximumRetreads: data.maximumRetreads,
    notes: data.notes,
    mainPhotoUrl: data.mainPhotoUrl,
  };
  Object.keys(metadata).forEach(k => metadata[k] === undefined && delete metadata[k]);

  return {
    code: data.internalCode,
    brand: data.brand ?? 'Marca Padrão',
    model: data.model ?? 'Modelo Padrão',
    size: data.size,
    serialNumber: data.serialNumber || null,
    status: data.status,
    currentDepthMm: data.currentTreadDepth,
    metadata,
  };
}

export async function fetchTiresFromApi(search?: string): Promise<Tire[]> {
  const q = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await apiClient<ApiTireRow[]>(`/tires${q}`, { timeoutMs: 8_000 });
  return res.data.map(mapApiTireToTire);
}

export async function fetchTireByIdFromApi(id: string): Promise<Tire | undefined> {
  const res = await apiClient<ApiTireRow>(`/tires/${id}`, { timeoutMs: 8_000 }).catch(() => null);
  return res ? mapApiTireToTire(res.data) : undefined;
}

export async function createTireInApi(data: Partial<Tire>): Promise<Tire> {
  const res = await apiClient<ApiTireRow>('/tires', {
    method: 'POST',
    body: JSON.stringify(mapTireToApiPayload(data)),
    timeoutMs: 10_000,
  });
  return mapApiTireToTire(res.data);
}

export async function updateTireInApi(id: string, data: Partial<Tire>): Promise<Tire> {
  const res = await apiClient<ApiTireRow>(`/tires/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(mapTireToApiPayload(data)),
    timeoutMs: 10_000,
  });
  return mapApiTireToTire(res.data);
}

export async function archiveTireInApi(id: string): Promise<void> {
  await apiClient(`/tires/${id}`, { method: 'DELETE', timeoutMs: 8_000 });
}

export interface TireMovementPayload {
  tireId: string;
  action: 'instalar' | 'remover' | 'rodizio' | 'transferir' | 'reparo' | 'recapagem' | 'descartar' | 'condenar';
  equipmentId?: string;
  positionId?: string;
  newPositionId?: string;
  depthMm?: number;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export async function logTireMovementInApi(payload: TireMovementPayload): Promise<Tire> {
  const res = await apiClient<ApiTireRow>('/tires/movements', {
    method: 'POST',
    body: JSON.stringify(payload),
    timeoutMs: 10_000,
  });
  return mapApiTireToTire(res.data);
}
