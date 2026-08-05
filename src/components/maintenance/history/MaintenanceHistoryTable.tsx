import React from 'react';
import { Calendar, Shield, CheckCircle, AlertTriangle, ArrowUpRight, Wrench } from 'lucide-react';
import type { MaintenanceHistoryEntry } from '../../../types/maintenance-schedule';
import { Button } from '../../ui/Button';

interface MaintenanceHistoryTableProps {
  entries: MaintenanceHistoryEntry[];
  loading?: boolean;
  onSelectEntry: (entry: MaintenanceHistoryEntry) => void;
}

export const MaintenanceHistoryTable: React.FC<MaintenanceHistoryTableProps> = ({ entries, loading, onSelectEntry }) => {
  if (loading) {
    return (
      <div className="space-y-2 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm animate-fadeIn">
      {entries.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <Shield className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
          <p className="text-sm font-bold">Nenhum registro no histórico operacional encontrado com estes parâmetros.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-gray-800/60 text-[11px] font-black text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                <th className="p-4">Protocolo / Data</th>
                <th className="p-4">Equipamento</th>
                <th className="p-4">Plano & Serviço</th>
                <th className="p-4">Leituras (Real vs Prev.)</th>
                <th className="p-4">Conformidade</th>
                <th className="p-4">Oficina / Técnico</th>
                <th className="p-4 text-right">Auditoria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/70 text-xs font-semibold">
              {entries.map((item) => {
                const hadDelay = (item.performedReading || item.meterReading || 0) > (item.expectedReading || item.meterReading || 0) + 10;
                
                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectEntry(item)}
                    className="hover:bg-blue-50/30 dark:hover:bg-blue-950/20 cursor-pointer transition-colors group"
                  >
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                          #{item.id}
                        </span>
                        {item.preventiveOrderId && (
                          <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                            {item.preventiveOrderId}
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500 flex items-center gap-1 mt-1 font-medium">
                        <Calendar className="w-3 h-3 text-blue-500" /> {new Date(item.executionDate || item.completedDate || '').toLocaleDateString('pt-BR')}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-extrabold text-sm text-gray-900 dark:text-white block group-hover:text-blue-600 transition-colors">
                        {item.equipmentName}
                      </span>
                      <span className="text-[11px] text-gray-400">{item.equipmentCode || 'FROTA-ATV'}</span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                        <Wrench className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" /> {item.intervalName || item.planName}
                      </span>
                      <span className="text-[11px] text-gray-400 block mt-0.5">Duração: {item.durationMinutes}min de oficina</span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="font-black text-gray-900 dark:text-white text-sm block">{item.performedReading} h/km</span>
                      <span className="text-[11px] text-gray-400">Meta prev.: {item.expectedReading}</span>
                    </td>

                    <td className="p-4">
                      {hadDelay ? (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 rounded-full text-[11px] font-extrabold border border-amber-300 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Excedeu Tolerância
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 rounded-full text-[11px] font-extrabold border border-emerald-300 flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Em Dia / No Prazo
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-gray-800 dark:text-gray-200 block">{item.technicianResponsible}</span>
                      <span className="text-[11px] text-gray-400">{item.workshopName || 'Oficina Central'}</span>
                    </td>

                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" className="text-gray-400 group-hover:text-blue-600 rounded-xl">
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
