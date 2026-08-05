import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LayoutList, KanbanSquare } from 'lucide-react';
import { useWorkOrders } from '../../hooks/useWorkOrders';
import { WorkOrderTable } from './WorkOrderTable';
import { WorkOrderStats } from './WorkOrderStats';
import { WorkOrderFilters } from './WorkOrderFilters';
import { Button } from '../ui/Button';
import { ROUTES } from '../../types/routes';

export const WorkOrdersView: React.FC = () => {
  const navigate = useNavigate();
  const { orders, loading } = useWorkOrders();
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  return (
    <div className="space-y-6">
      {/* Header e Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-title-lg font-extrabold text-on-surface">Ordens de Serviço</h2>
          <p className="text-on-surface-variant text-sm mt-1">Gestão de execuções, manutenções e reparos no pátio.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-surface-container/50 p-1 rounded-xl flex">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-gray-800 shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              title="Visão em Tabela"
            >
              <LayoutList size={18} />
            </button>
            <button 
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-white dark:bg-gray-800 shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              title="Visão Kanban"
            >
              <KanbanSquare size={18} />
            </button>
          </div>
          
          <Button variant="primary" onClick={() => navigate(ROUTES.ORDEM_NOVA)} className="flex items-center gap-2">
            <Plus size={18} />
            Nova OS
          </Button>
        </div>
      </div>

      <WorkOrderStats orders={orders} />

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col">
        <WorkOrderFilters />
        
        {loading ? (
          <div className="p-12 text-center text-on-surface-variant font-medium">Carregando ordens de serviço...</div>
        ) : viewMode === 'table' ? (
          <WorkOrderTable orders={orders} />
        ) : (
          <div className="p-12 text-center text-on-surface-variant font-medium">Kanban em construção. Exibindo Tabela por padrão.</div>
        )}
      </div>
    </div>
  );
};
