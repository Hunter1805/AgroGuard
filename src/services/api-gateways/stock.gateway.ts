import { apiClient } from '../../lib/api/api-client';

export async function fetchStockItemsFromApi(search?: string): Promise<any[]> {
  const q = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await apiClient<any[]>(`/stock/items${q}`);

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
