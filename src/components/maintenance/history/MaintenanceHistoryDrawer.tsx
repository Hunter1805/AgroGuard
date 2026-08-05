import React from 'react';
import { X, ShieldCheck, Calendar, User, MapPin, CheckCircle, Clock, DollarSign } from 'lucide-react';
import type { MaintenanceHistoryEntry } from '../../../types/maintenance-schedule';
import { Button } from '../../ui/Button';

interface MaintenanceHistoryDrawerProps {
  entry: MaintenanceHistoryEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MaintenanceHistoryDrawer: React.FC<MaintenanceHistoryDrawerProps> = ({ entry, isOpen, onClose }) => {
  if (!isOpen || !entry) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 w-full max-w-xl h-full shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col justify-between overflow-y-auto animate-slideLeft">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-2xl border border-purple-100 dark:border-purple-800">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Registro Auditável de Conclusão</h3>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-extrabold">Protocolo #{entry.id} • {entry.equipmentName}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white p-2 rounded-xl">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status e Selos */}
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Status de Execução</p>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                <CheckCircle className="w-4 h-4" /> Concluído e Auditado na Oficina
              </span>
            </div>
            {entry.preventiveOrderId && (
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs rounded-xl border border-emerald-300">
                {entry.preventiveOrderId}
              </span>
            )}
          </div>

          {/* Dados Operacionais e Horímetro */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Detalhamento Técnico de Leituras
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/50">
                <p className="text-[11px] font-bold text-gray-500 uppercase">Leitura Real na Parada</p>
                <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400 mt-1">{entry.performedReading} h/km</p>
              </div>

              <div className="p-3.5 bg-purple-50/50 dark:bg-purple-950/20 rounded-2xl border border-purple-100 dark:border-purple-900/50">
                <p className="text-[11px] font-bold text-gray-500 uppercase">Leitura Originalmente Prevista</p>
                <p className="text-lg font-extrabold text-purple-600 dark:text-purple-400 mt-1">{entry.expectedReading} h/km</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-200/60 dark:border-gray-800 font-semibold">
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" /> Data Execução: {new Date(entry.executionDate || entry.completedDate || '').toLocaleDateString('pt-BR')}
              </p>
              {entry.workshopName && (
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" /> Oficina: {entry.workshopName}
                </p>
              )}
              <p className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-500" /> Responsável Técnico: {entry.technicianResponsible}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" /> Duração Real na Oficina: {entry.durationMinutes || 120} min
              </p>
              {entry.totalCostEstimate !== undefined && (
                <p className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <DollarSign className="w-4 h-4" /> Investimento Estimado: R$ {entry.totalCostEstimate.toFixed(2)}
                </p>
              )}
            </div>

            {entry.technicianNotes && (
              <div>
                <h4 className="font-extrabold text-xs text-gray-700 dark:text-gray-300 uppercase mt-4 mb-1">Observações do Mecânico / Comboio</h4>
                <p className="text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800/80 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                  {entry.technicianNotes}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center text-xs font-bold text-gray-400">
          <span>Registro inviolável de auditoria v5.</span>
          <Button onClick={onClose} className="bg-gray-800 hover:bg-gray-950 text-white font-extrabold text-xs px-6 py-2">
            Fechar Inspeção
          </Button>
        </div>
      </div>
    </div>
  );
};
