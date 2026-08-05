import React from 'react';
import { AlertTriangle, ShieldAlert, Clock, Info, ArrowUpRight } from 'lucide-react';
import type { MaintenanceAlertItem } from '../../types/maintenance';
import { Button } from '../ui/Button';

interface MaintenanceAlertsPanelProps {
  alerts: MaintenanceAlertItem[];
  loading?: boolean;
  onNavigate: (route: string) => void;
}

export const MaintenanceAlertsPanel: React.FC<MaintenanceAlertsPanelProps> = ({ alerts, loading, onNavigate }) => {
  if (loading) {
    return (
      <div className="glass-card p-5 animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 w-1/2 rounded-lg" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const getAlertIcon = (type: MaintenanceAlertItem['type'], priority: string) => {
    if (type === 'vencida' || priority === 'critica' || type === 'aguardando_peca') {
      return (
        <div className="p-2.5 bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-900 flex-shrink-0">
          <ShieldAlert className="w-5 h-5 animate-bounce" />
        </div>
      );
    }
    if (type === 'proxima' || type === 'urgente' || priority === 'alta') {
      return (
        <div className="p-2.5 bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-900 flex-shrink-0">
          <Clock className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="p-2.5 bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 rounded-xl border border-blue-200 dark:border-blue-900 flex-shrink-0">
        <Info className="w-5 h-5" />
      </div>
    );
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'vencida':
      case 'aguardando_peca':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-900/50';
      case 'urgente':
      case 'proxima':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900/50';
      default:
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900/50';
    }
  };

  const formatTypeTitle = (type: string) => {
    switch (type) {
      case 'proxima': return 'Próxima do Vencimento';
      case 'aguardando_peca': return 'Pendente de Insumo / Peça';
      case 'sem_plano': return 'Sem Plano Preventivo Ativo';
      case 'vencida': return 'Manutenção Vencida';
      default: return 'Alerta Operacional';
    }
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Central de Alertas Preventivos</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Gatilhos disparados pelo motor de leituras e agenda</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg">
            {alerts.length} ativos
          </span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800/80 mt-2">
          {alerts.map((alert) => (
            <div key={alert.id} className="py-3.5 flex items-start gap-3.5 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 px-2 rounded-xl transition-all">
              {getAlertIcon(alert.type, alert.priority)}
              
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {alert.equipmentName}
                  </span>
                  <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full border ${getBadgeStyle(alert.type)}`}>
                    {formatTypeTitle(alert.type)}
                  </span>
                </div>

                {alert.intervalName && (
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {alert.intervalName} • <span className="font-bold text-rose-600 dark:text-rose-400">{alert.remainingValue}</span>
                  </p>
                )}
                {!alert.intervalName && alert.remainingValue && (
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    {alert.remainingValue}
                  </p>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-100 dark:border-gray-800/50 mt-1.5">
                  <strong className="text-gray-700 dark:text-gray-300">Recomenda-se:</strong> {alert.recommendedAction}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                title="Ir para módulo correspondente"
                onClick={() => onNavigate(alert.route)}
                className="self-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('/alertas')} className="text-xs text-gray-500 hover:text-gray-700 font-semibold">
          Abrir Central de Alertas Geral &rarr;
        </Button>
      </div>
    </div>
  );
};
