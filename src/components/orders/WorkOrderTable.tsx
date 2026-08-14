import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { WorkOrder } from '../../types/work-order';
import { Calendar, AlertTriangle, ShieldCheck, Settings, Zap } from 'lucide-react';
import { ROUTES } from '../../types/routes';

export const WorkOrderTable: React.FC<{ orders: WorkOrder[] }> = ({ orders }) => {
  const navigate = useNavigate();

  const getPriorityStyle = (priority: string) => {
    const prio = priority ? priority.toUpperCase() : 'NORMAL';
    switch (prio) {
      case 'CRITICAL': return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20';
      case 'URGENT': return 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20';
      case 'HIGH': return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      case 'NORMAL': return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20';
      case 'LOW': default: return 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/20';
    }
  };

  const getPriorityLabel = (priority: string) => {
    const prio = priority ? priority.toUpperCase() : 'NORMAL';
    switch (prio) {
      case 'CRITICAL': return 'Crítica';
      case 'URGENT': return 'Urgente';
      case 'HIGH': return 'Alta';
      case 'NORMAL': return 'Normal';
      case 'LOW': default: return 'Baixa';
    }
  };

  const getStatusStyle = (status: string) => {
    if (status === 'encerrada') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    if (status === 'cancelada') return 'bg-gray-500/10 text-gray-500';
    if (status === 'em_execucao') return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
    if (status === 'em_teste' || status === 'aguardando_liberacao') return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
    if (status.startsWith('aguardando')) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
    if (status === 'pausada') return 'bg-error/10 text-error border-error/20';
    return 'bg-surface-container-high text-on-surface-variant';
  };

  const getTypeIcon = (os: WorkOrder) => {
    if (os.nature !== 'MAINTENANCE') return <AlertTriangle className="w-4 h-4 text-blue-500" />;
    
    const mType = os.maintenanceType || 'CORRECTIVE';
    if (mType === 'PREVENTIVE') return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
    if (mType === 'CORRECTIVE') {
      if (os.correctiveMode === 'EMERGENCY') return <Zap className="w-4 h-4 text-red-500" />;
      return <Settings className="w-4 h-4 text-amber-500" />;
    }
    return <AlertTriangle className="w-4 h-4 text-indigo-500" />;
  };

  const getTypeText = (os: WorkOrder) => {
    if (os.nature !== 'MAINTENANCE') {
      switch (os.nature) {
        case 'INSPECTION': return 'Inspeção';
        case 'DIAGNOSIS': return 'Diagnóstico';
        case 'INSTALLATION': return 'Instalação';
        case 'IMPROVEMENT': return 'Melhoria';
        case 'CAMPAIGN_RECALL': return 'Recall';
        default: return os.nature;
      }
    }
    const mType = os.maintenanceType || 'CORRECTIVE';
    switch (mType) {
      case 'PREVENTIVE': return 'Preventiva';
      case 'CORRECTIVE':
        return os.correctiveMode === 'EMERGENCY' ? 'Corretiva Emergencial' : 'Corretiva Planejada';
      case 'PREDICTIVE': return 'Preditiva';
      case 'CONDITION_BASED': return 'Condicional';
      case 'ROUTINE_INSPECTION': return 'Inspeção / Rotina';
      default: return mType;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
          <Settings className="w-8 h-8 text-on-surface-variant/50" />
        </div>
        <p className="text-on-surface font-bold">Nenhuma ordem de serviço encontrada</p>
        <p className="text-on-surface-variant text-sm mt-1">As ordens abertas ou concluídas aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low/50 text-[11px] uppercase tracking-wider text-on-surface-variant font-extrabold">
            <th className="p-4 rounded-tl-xl">Número</th>
            <th className="p-4">Equipamento</th>
            <th className="p-4">Serviço / Sintoma</th>
            <th className="p-4">Prioridade</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right rounded-tr-xl">Abertura</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-sm font-medium">
          {orders.map((os) => (
            <tr 
              key={os.id} 
              onClick={() => navigate(ROUTES.ORDEM_DETALHE.replace(':orderId', os.id))}
              className="hover:bg-surface-container/50 cursor-pointer transition-colors group"
            >
              <td className="p-4 whitespace-nowrap">
                <span className="font-mono font-extrabold text-primary bg-primary/5 px-2 py-1 rounded">
                  #{os.code}
                </span>
                {(os.trigger === 'SCHEDULE' || (os as any).origin === 'manutencao_preventiva') && (
                  <span className="ml-2 text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-full uppercase font-bold">Prev</span>
                )}
              </td>
              
              <td className="p-4">
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface">{os.equipmentName}</span>
                  {os.equipmentCode && <span className="text-xs text-on-surface-variant">{os.equipmentCode}</span>}
                </div>
              </td>
              
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {getTypeIcon(os)}
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface line-clamp-1">{os.title}</span>
                    <span className="text-xs text-on-surface-variant line-clamp-1">{getTypeText(os)} — {os.description}</span>
                  </div>
                </div>
              </td>
              
              <td className="p-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${getPriorityStyle(os.priority)}`}>
                  {getPriorityLabel(os.priority)}
                </span>
              </td>
              
              <td className="p-4 whitespace-nowrap">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border border-transparent ${getStatusStyle(os.status)}`}>
                  {os.status.replace(/_/g, ' ')}
                </span>
              </td>
              
              <td className="p-4 whitespace-nowrap text-right">
                <span className="text-on-surface-variant text-xs flex items-center justify-end gap-1 font-semibold">
                  <Calendar className="w-3.5 h-3.5" /> 
                  {new Date(os.openedAt).toLocaleDateString('pt-BR')}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
