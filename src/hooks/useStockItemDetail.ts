import { useState, useEffect, useCallback } from 'react';
import type { StockItem, StockHistoryLog } from '../types/parts';
import type { StockMovement } from '../types/stock-movement';
import type { StockReservation } from '../types/stock-reservation';
import type { StockLot } from '../types/stock-lot';
import { partsService } from '../services/parts.service';
import { stockMovementService } from '../services/stock-movement.service';
import { stockReservationService } from '../services/stock-reservation.service';
import { stockLotService } from '../services/stock-lot.service';

export function useStockItemDetail(itemId?: string) {
  const [item, setItem] = useState<StockItem | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [reservations, setReservations] = useState<StockReservation[]>([]);
  const [lots, setLots] = useState<StockLot[]>([]);
  const [history, setHistory] = useState<StockHistoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!itemId) return;

    try {
      setLoading(true);
      setError(null);

      const [foundItem, movList, resList, lotList, histList] = await Promise.all([
        partsService.getStockItemById(itemId),
        stockMovementService.getStockMovements({ itemId }),
        stockReservationService.getStockReservations({ itemId }),
        stockLotService.getStockLots({ itemId }),
        partsService.getStockHistory(itemId),
      ]);

      if (!foundItem) {
        setError('Item de estoque não encontrado.');
      } else {
        setItem(foundItem);
        setMovements(movList);
        setReservations(resList);
        setLots(lotList);
        setHistory(histList);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar detalhes do item de estoque.');
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    item,
    movements,
    reservations,
    lots,
    history,
    loading,
    error,
    refetch: fetchDetail,
  };
}
