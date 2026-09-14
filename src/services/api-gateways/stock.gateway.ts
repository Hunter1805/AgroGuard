import { apiClient } from '../../lib/api/api-client';

export async function fetchStockItemsFromApi(search?: string, page = 1, pageSize = 100): Promise<any[]> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));
  if (search) params.set('search', search);
  const response = await apiClient<any[]>(`/stock/items?${params.toString()}`);

  return response.data.map(item => ({
    id: item.id,
    code: item.code,
    name: item.name,
    partNumber: item.partNumber || 'PN-0000',
    unitMeasure: item.unitMeasure?.symbol || 'UN',
    quantity: Number(item.balances?.[0]?.quantity || 0),
    minQuantity: Number(item.minQuantity || 0),
    status: item.status || 'ativo',
  }));
}

export async function processStockMovementInApi(data: { warehouseId: string; stockItemId: string; type: 'entrada' | 'saida' | 'ajuste'; quantity: number; unitCost?: number; workOrderId?: string }) {
  return apiClient('/stock/movements', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function createStockItemInApi(data: { code: string; name: string; unitMeasureSymbol?: string; partNumber?: string; minQuantity?: number }): Promise<any> {
  const res = await apiClient<any>('/stock/items', {
    method: 'POST',
    body: JSON.stringify({ minQuantity: 0, ...data }),
  });
  return res.data;
}
