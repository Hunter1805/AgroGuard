import React from 'react';
import { Plus } from 'lucide-react';
import type { ServiceOrder } from '../types';
import { OSTable } from './orders/OSTable';
import { Button } from './ui/Button';

interface OrdensServicoViewProps {
  orders: ServiceOrder[];
  onOpenNewOS: () => void;
}

export const OrdensServicoView: React.FC<OrdensServicoViewProps> = ({ orders, onOpenNewOS }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-title-md text-[24px] font-semibold text-on-surface tracking-tight">Ordens de Serviço (OS)</h2>
          <p className="font-body-sm text-[13px] text-on-surface-variant/70 mt-0.5">Acompanhamento e controle de todas as OS da frota.</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={onOpenNewOS}>
          Nova Ordem de Serviço
        </Button>
      </div>

      <OSTable orders={orders} />
    </div>
  );
};
