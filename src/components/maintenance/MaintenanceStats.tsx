import React from 'react';
import { AlertTriangle, Clock, Calendar, CheckCircle2, FileText, Wrench, Activity } from 'lucide-react';
import type { MaintenanceOverviewStats } from '../../types/maintenance';

interface MaintenanceStatsProps {
  stats: MaintenanceOverviewStats | null;
  loading?: boolean;
}

export const MaintenanceStats: React.FC<MaintenanceStatsProps> = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Vencidas */}
        <div className="glass-card p-5 border-l-4 border-rose-500 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Manutenções Vencidas
              </p>
              <p className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-2">{stats.vencidas}</p>
            </div>
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-100 dark:border-rose-900/50">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
          </div>
          <span className="text-xs text-rose-600 dark:text-rose-400 mt-2 font-medium block">
            Ação prioritária recomendada
          </span>
        </div>

        {/* Card 2: Urgentes & Próximas */}
        <div className="glass-card p-5 border-l-4 border-amber-500 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Urgentes / Próximas
              </p>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{stats.urgentes}</span>
                <span className="text-sm text-gray-400 font-medium">/ {stats.proximas} avisos</span>
              </div>
            </div>
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/50">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <span className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium block">
            Dentro da janela de aviso do plano
          </span>
        </div>

        {/* Card 3: Programadas na Agenda */}
        <div className="glass-card p-5 border-l-4 border-blue-500 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Agenda Esta Semana
              </p>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{stats.programadas}</span>
                <span className="text-xs text-blue-500 font-semibold bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                  {stats.emExecucao} em execução
                </span>
              </div>
            </div>
            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/50">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
            Serviços com oficina definida
          </span>
        </div>

        {/* Card 4: Taxa de Cumprimento e Eficiência */}
        <div className="glass-card p-5 border-l-4 border-emerald-500 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Cumprimento do Plano
              </p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
                {stats.percentualCumprimento}%
              </p>
            </div>
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
              <Activity className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${stats.percentualCumprimento}%` }} />
          </div>
        </div>
      </div>

      {/* Mini Bar Inferior com Métricas Operacionais e Ordens Preventivas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-md px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Wrench className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Concluídas nesta safra/mês</span>
          </div>
          <span className="text-base font-bold text-gray-900 dark:text-white px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
            {stats.concluidasPeriodo} unidades
          </span>
        </div>

        <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-md px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">OS Preventivas em Aberto</span>
          </div>
          <span className="text-base font-bold text-gray-900 dark:text-white px-2 py-0.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
            {stats.ordensPreventivasAbertas} ordens
          </span>
        </div>

        <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-md px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Precisão de Tempo Oficina</span>
          </div>
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded-lg">
            {Math.round(stats.tempoRealizadoMinutos / 60)}h realiz. de {Math.round(stats.tempoPrevistoMinutos / 60)}h prev.
          </span>
        </div>
      </div>
    </div>
  );
};
