import { useEffect, useState } from 'react';
import type { ServiceOrder } from '../types/order';
import { maintenanceService } from '../services/maintenance.service';

export function useOrders() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      const data = await maintenanceService.getOrders();
      setOrders(data);
      setLoading(false);
    }
    loadOrders();
  }, []);

  const addOrder = async (newOrder: ServiceOrder) => {
    const created = await maintenanceService.createOrder(newOrder);
    setOrders((prev) => [created, ...prev]);
    return created;
  };

  return { orders, addOrder, loading };
}
