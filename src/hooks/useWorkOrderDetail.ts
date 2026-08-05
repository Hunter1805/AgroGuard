import { useState, useEffect, useCallback } from 'react';
import type { WorkOrder, WorkOrderTimelineEvent } from '../types/work-order';
import type { WorkOrderExecutionData } from '../types/work-order-execution';
import { workOrderService } from '../services/work-order.service';
import { workOrderCalculationService } from '../services/work-order-calculation.service';

export function useWorkOrderDetail(orderId?: string) {
  const [order, setOrder] = useState<WorkOrder | null>(null);
  const [execution, setExecution] = useState<WorkOrderExecutionData | null>(null);
  const [timeline, setTimeline] = useState<WorkOrderTimelineEvent[]>([]);
  const [metrics, setMetrics] = useState({
    downtime: 0,
    grossTime: 0,
    pausesTime: 0,
    mttr: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!orderId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [ord, exec, hist] = await Promise.all([
        workOrderService.getWorkOrderById(orderId),
        workOrderService.getExecutionData(orderId),
        workOrderService.getTimelineEvents(orderId)
      ]);

      if (!ord) throw new Error('Ordem de serviço não encontrada');

      setOrder(ord);
      setExecution(exec || null);
      setTimeline(hist || []);

      // Calcular métricas
      const [downtime, grossTime, pausesTime, mttr] = await Promise.all([
        workOrderCalculationService.calculateDowntime(orderId),
        workOrderCalculationService.calculateGrossExecutionTime(orderId),
        workOrderCalculationService.calculateTotalPausesTime(orderId),
        workOrderCalculationService.calculateMTTR(orderId)
      ]);

      setMetrics({ downtime, grossTime, pausesTime, mttr });

    } catch (err: any) {
      setError(err.message || 'Erro ao carregar detalhes da OS');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    order,
    execution,
    timeline,
    metrics,
    loading,
    error,
    refetch: fetchDetail
  };
}
