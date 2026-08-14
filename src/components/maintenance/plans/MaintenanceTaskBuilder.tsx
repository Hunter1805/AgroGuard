import React, { useState } from 'react';
import { Wrench, Plus, CheckCircle, Clock } from 'lucide-react';
import type { MaintenancePlanInterval, MaintenanceTask, MaintenanceRequiredItem } from '../../../types/maintenance-plan';
import { MaintenanceResourceFields } from './MaintenanceResourceFields';
import { Button } from '../../ui/Button';

interface MaintenanceTaskBuilderProps {
  intervals: MaintenancePlanInterval[];
  onAddTask: (intervalIndex: number, task: MaintenanceTask) => void;
}

export const MaintenanceTaskBuilder: React.FC<MaintenanceTaskBuilderProps> = ({ intervals, onAddTask }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('45');
  const [parts, setParts] = useState<MaintenanceRequiredItem[]>([]);
  const [supplies, setSupplies] = useState<MaintenanceRequiredItem[]>([]);
  const [tools, setTools] = useState<MaintenanceRequiredItem[]>([]);

  const activeInterval = intervals[selectedIndex] || intervals[0];

  const handleCreateTask = () => {
    if (!title.trim() || !activeInterval) return;
    const newTask: MaintenanceTask = {
      id: `TSK-${Date.now()}`,
      order: (activeInterval.tasks?.length || 0) + 1,
      title: title.trim(),
      criticality: 'HIGH',
      estimatedDurationMinutes: Number(duration) || 30,
      required: true,
      requirePhotoBefore: false,
      requirePhotoAfter: true,
      requireMeasurement: false,
      parts: [...parts],
      supplies: [...supplies],
      tools: [...tools],
    };
    onAddTask(selectedIndex, newTask);
    setTitle('');
    setParts([]);
    setSupplies([]);
    setTools([]);
  };

  if (intervals.length === 0) {
    return <p className="p-8 text-center text-xs text-amber-600 font-bold bg-amber-50 rounded-2xl">Cadastre primeiro um intervalo no Passo 3 para alocar tarefas.</p>;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Seletor de Intervalo */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {intervals.map((intv, i) => (
          <button
            key={intv.id || i}
            type="button"
            onClick={() => setSelectedIndex(i)}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
              selectedIndex === i ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> {intv.name} ({intv.tasks?.length || 0})
          </button>
        ))}
      </div>

      {/* Box de Adição de Tarefa */}
      <div className="glass-card p-5 border border-gray-200 dark:border-gray-800 space-y-4">
        <h4 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-4 h-4 text-blue-500" /> Nova Tarefa Operacional para "{activeInterval?.name}"
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Título / Ação da Tarefa</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Substituir todos os elementos dos filtros hidráulicos e conferir o torque dos parafusos"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Duração Estimada (Minutos)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 font-extrabold text-sm text-blue-600"
            />
          </div>
        </div>

        {/* Acopladores de Peças, Insumos e Ferramentas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <MaintenanceResourceFields items={parts} category="peca" onAddItem={(it) => setParts((p) => [...p, it])} onRemoveItem={(id) => setParts((p) => p.filter((x) => x.id !== id))} />
          <MaintenanceResourceFields items={supplies} category="insumo" onAddItem={(it) => setSupplies((s) => [...s, it])} onRemoveItem={(id) => setSupplies((s) => s.filter((x) => x.id !== id))} />
          <MaintenanceResourceFields items={tools} category="ferramenta" onAddItem={(it) => setTools((t) => [...t, it])} onRemoveItem={(id) => setTools((t) => t.filter((x) => x.id !== id))} />
        </div>

        <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-gray-800">
          <Button type="button" onClick={handleCreateTask} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 shadow-md">
            <Plus className="w-4 h-4 mr-1" /> Registrar Tarefa & Insumos
          </Button>
        </div>
      </div>

      {/* Tabela de Tarefas Deste Intervalo */}
      <div className="space-y-2">
        <h4 className="font-extrabold text-xs text-gray-700 dark:text-gray-300 uppercase">
          Tarefas Cadastradas em {activeInterval?.name} ({activeInterval?.tasks?.length || 0})
        </h4>
        {activeInterval?.tasks?.map((tsk, idx) => (
          <div key={tsk.id || idx} className="p-3.5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs">
            <span className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> {tsk.title}
            </span>
            <span className="text-gray-400 font-semibold">{tsk.estimatedDurationMinutes || 30}min de oficina</span>
          </div>
        ))}
      </div>
    </div>
  );
};
