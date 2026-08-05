import React, { useState } from 'react';
import { Plus, Trash2, Clock, Wrench, Shield } from 'lucide-react';
import type { MaintenancePlanInterval } from '../../../types/maintenance-plan';
import { Button } from '../../ui/Button';

interface MaintenanceIntervalBuilderProps {
  intervals: MaintenancePlanInterval[];
  onAddInterval: (interval: MaintenancePlanInterval) => void;
  onRemoveInterval: (index: number) => void;
}

export const MaintenanceIntervalBuilder: React.FC<MaintenanceIntervalBuilderProps> = ({
  intervals,
  onAddInterval,
  onRemoveInterval,
}) => {
  const [name, setName] = useState('A Cada 250 Horas');
  const [triggerType, setTriggerType] = useState<MaintenancePlanInterval['triggerType']>('horas');
  const [rule, setRule] = useState<MaintenancePlanInterval['rule']>('leitura');
  const [readingInterval, setReadingInterval] = useState(250);
  const [timeInterval, setTimeInterval] = useState(6);
  const [timeUnit] = useState<MaintenancePlanInterval['timeUnit']>('meses');
  const [priority] = useState<MaintenancePlanInterval['priority']>('alta');
  const [stopDuration] = useState(120);

  const handleCreate = () => {
    if (!name.trim()) return;
    const newIntv: MaintenancePlanInterval = {
      id: `INT-${Date.now().toString().slice(-5)}`,
      name,
      triggerType,
      rule,
      meterType: 'horimetro',
      readingInterval: triggerType === 'horas' || triggerType === 'combinado' ? Number(readingInterval) : undefined,
      timeInterval: triggerType === 'meses' || triggerType === 'dias' || triggerType === 'combinado' ? Number(timeInterval) : undefined,
      timeUnit: triggerType === 'meses' || triggerType === 'combinado' ? timeUnit : 'dias',
      alertReadingBefore: Math.round(Number(readingInterval) * 0.1),
      allowedReadingDelay: Math.round(Number(readingInterval) * 0.05),
      priority,
      estimatedDurationMinutes: Number(stopDuration),
      requiresEquipmentStop: true,
      requiresApproval: priority === 'critica',
      tasks: [],
    };
    onAddInterval(newIntv);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-2xl border border-blue-200 dark:border-blue-900 flex items-center justify-between text-xs text-blue-800 dark:text-blue-300 font-medium">
        <span>Defina um ou múltiplos gatilhos sequenciais. Para lubrificações diárias ou anuais simultâneas, ative a Regra Combinada (O que Ocorrer Primeiro).</span>
      </div>

      {/* Cartão de Adição Rápida */}
      <div className="glass-card p-5 border border-gray-200 dark:border-gray-800 space-y-4">
        <h4 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" /> Cadastrar Novo Módulo / Intervalo
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Título do Módulo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Revisão 500 Horas"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Tipo de Gatilho</label>
            <select
              value={triggerType}
              onChange={(e) => {
                const v = e.target.value as any;
                setTriggerType(v);
                if (v === 'combinado') setRule('o_que_ocorrer_primeiro');
              }}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900 text-sm font-semibold text-gray-900 dark:text-white"
            >
              <option value="horas">Somente Horas (Horímetro)</option>
              <option value="quilometros">Quilometros (Odômetro)</option>
              <option value="meses">Por Tempo (Meses / Safra)</option>
              <option value="combinado">Regra Combinada (Horas + Tempo)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Regra de Vencimento</label>
            <select
              value={rule}
              onChange={(e) => setRule(e.target.value as any)}
              disabled={triggerType !== 'combinado'}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-sm font-extrabold text-purple-600 dark:text-purple-400"
            >
              <option value="leitura">Pela Leitura Numérica</option>
              <option value="tempo">Pelo Relógio Temporal</option>
              <option value="o_que_ocorrer_primeiro">⭐ O Que Ocorrer Primeiro</option>
            </select>
          </div>

          {(triggerType === 'horas' || triggerType === 'quilometros' || triggerType === 'combinado') && (
            <div>
              <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Intervalo de Leitura (h ou km)</label>
              <input
                type="number"
                value={readingInterval}
                onChange={(e) => setReadingInterval(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900 font-extrabold text-sm text-blue-600 dark:text-blue-400"
              />
            </div>
          )}

          {(triggerType === 'meses' || triggerType === 'dias' || triggerType === 'combinado') && (
            <div>
              <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Intervalo Temporal ({timeUnit})</label>
              <input
                type="number"
                value={timeInterval}
                onChange={(e) => setTimeInterval(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900 font-extrabold text-sm text-emerald-600 dark:text-emerald-400"
              />
            </div>
          )}

          <div className="flex items-end">
            <Button onClick={handleCreate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 shadow-md">
              <Plus className="w-4 h-4 mr-1" /> Adicionar Intervalo
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de Intervalos Atuais no Plano */}
      <div className="space-y-3">
        <h4 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-4 h-4 text-emerald-500" /> Intervalos Configurados ({intervals.length})
        </h4>

        {intervals.map((intv, i) => (
          <div key={intv.id} className="p-4 bg-white/70 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-between gap-3 hover:shadow-md transition-all">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-gray-900 dark:text-white">{intv.name}</span>
                {intv.rule === 'o_que_ocorrer_primeiro' && (
                  <span className="text-[11px] font-extrabold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-300 dark:border-purple-800 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-purple-600" /> O Que Ocorrer Primeiro
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Gatilho: <span className="font-bold text-gray-700 dark:text-gray-300 uppercase">{intv.triggerType}</span> • Parada de {intv.estimatedDurationMinutes}min
              </p>
            </div>

            <Button variant="ghost" size="sm" onClick={() => onRemoveInterval(i)} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
