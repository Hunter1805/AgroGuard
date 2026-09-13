import { apiClient } from '../../lib/api/api-client';
import type { Tool } from '../../types/tools';

interface ApiToolRow {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  serialNumber: string | null;
  status: string;
  metadata: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

/** Converte a linha da API no tipo `Tool` usado pelo front (com defaults seguros). */
export function mapApiToolToTool(row: ApiToolRow): Tool {
  const m = row.metadata ?? {};
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    category: m.category ?? 'Geral',
    subcategory: m.subcategory,
    description: m.description,
    technicalSpec: m.technicalSpec,
    controlType: m.controlType ?? 'individual',
    brand: m.brand,
    model: m.model,
    serialNumber: row.serialNumber ?? m.serialNumber,
    patrimonyNumber: m.patrimonyNumber,
    barcodeOrQr: m.barcodeOrQr,
    photoUrl: m.photoUrl,
    totalQuantity: Number(m.totalQuantity ?? 1),
    availableQuantity: Number(m.availableQuantity ?? m.totalQuantity ?? 1),
    minimumQuantity: m.minimumQuantity != null ? Number(m.minimumQuantity) : undefined,
    unitOfMeasure: m.unitOfMeasure,
    location: m.location ?? { workshop: 'Oficina Central' },
    currentResponsibleName: m.currentResponsibleName,
    acquisitionDate: m.acquisitionDate,
    acquisitionValue: m.acquisitionValue != null ? Number(m.acquisitionValue) : undefined,
    supplierName: m.supplierName,
    invoiceNumber: m.invoiceNumber,
    warrantyEndDate: m.warrantyEndDate,
    status: (row.status ?? 'disponivel') as Tool['status'],
    condition: m.condition ?? 'excelente',
    lastInspectionDate: m.lastInspectionDate,
    notes: m.notes,
    unavailabilityReason: m.unavailabilityReason,
    requiresCalibration: Boolean(m.requiresCalibration),
    calibrationType: m.calibrationType,
    calibrationFrequencyValue: m.calibrationFrequencyValue != null ? Number(m.calibrationFrequencyValue) : undefined,
    calibrationFrequencyUnit: m.calibrationFrequencyUnit,
    lastCalibrationDate: m.lastCalibrationDate,
    nextCalibrationDate: m.nextCalibrationDate,
    calibrationCompany: m.calibrationCompany,
    requiresMaintenance: Boolean(m.requiresMaintenance),
    maintenanceFrequencyDays: m.maintenanceFrequencyDays != null ? Number(m.maintenanceFrequencyDays) : undefined,
    lastMaintenanceDate: m.lastMaintenanceDate,
    nextMaintenanceDate: m.nextMaintenanceDate,
  };
}

/** Converte o form do front no payload da API (campos fixos + extras em metadata). */
export function mapToolToApiPayload(data: Partial<Tool>) {
  const metadata: Record<string, unknown> = {
    category: data.category,
    subcategory: data.subcategory,
    description: data.description,
    technicalSpec: data.technicalSpec,
    controlType: data.controlType,
    brand: data.brand,
    model: data.model,
    patrimonyNumber: data.patrimonyNumber,
    barcodeOrQr: data.barcodeOrQr,
    photoUrl: data.photoUrl,
    totalQuantity: data.totalQuantity,
    availableQuantity: data.availableQuantity,
    minimumQuantity: data.minimumQuantity,
    unitOfMeasure: data.unitOfMeasure,
    location: data.location,
    currentResponsibleName: data.currentResponsibleName,
    acquisitionDate: data.acquisitionDate,
    acquisitionValue: data.acquisitionValue,
    supplierName: data.supplierName,
    invoiceNumber: data.invoiceNumber,
    warrantyEndDate: data.warrantyEndDate,
    condition: data.condition,
    lastInspectionDate: data.lastInspectionDate,
    notes: data.notes,
    unavailabilityReason: data.unavailabilityReason,
    requiresCalibration: data.requiresCalibration,
    calibrationType: data.calibrationType,
    calibrationFrequencyValue: data.calibrationFrequencyValue,
    calibrationFrequencyUnit: data.calibrationFrequencyUnit,
    lastCalibrationDate: data.lastCalibrationDate,
    nextCalibrationDate: data.nextCalibrationDate,
    calibrationCompany: data.calibrationCompany,
    requiresMaintenance: data.requiresMaintenance,
    maintenanceFrequencyDays: data.maintenanceFrequencyDays,
    lastMaintenanceDate: data.lastMaintenanceDate,
    nextMaintenanceDate: data.nextMaintenanceDate,
  };
  // Remove chaves undefined (JSON limpo)
  Object.keys(metadata).forEach(k => metadata[k] === undefined && delete metadata[k]);

  return {
    name: data.name,
    code: data.code,
    serialNumber: data.serialNumber || null,
    status: data.status,
    metadata,
  };
}

export async function fetchToolsFromApi(search?: string): Promise<Tool[]> {
  const q = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await apiClient<ApiToolRow[]>(`/tools${q}`, { timeoutMs: 8_000 });
  return res.data.map(mapApiToolToTool);
}

export async function fetchToolByIdFromApi(id: string): Promise<Tool | undefined> {
  const res = await apiClient<ApiToolRow>(`/tools/${id}`, { timeoutMs: 8_000 }).catch(() => null);
  return res ? mapApiToolToTool(res.data) : undefined;
}

export async function createToolInApi(data: Partial<Tool>): Promise<Tool> {
  const res = await apiClient<ApiToolRow>('/tools', {
    method: 'POST',
    body: JSON.stringify(mapToolToApiPayload(data)),
    timeoutMs: 10_000,
  });
  return mapApiToolToTool(res.data);
}

export async function updateToolInApi(id: string, data: Partial<Tool>): Promise<Tool> {
  const res = await apiClient<ApiToolRow>(`/tools/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(mapToolToApiPayload(data)),
    timeoutMs: 10_000,
  });
  return mapApiToolToTool(res.data);
}
