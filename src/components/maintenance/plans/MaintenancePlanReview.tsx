import React from 'react';
import { ShieldCheck, AlertTriangle, Wrench, Clock, FileText } from 'lucide-react';
import type { MaintenancePlan } from '../../../types/maintenance-plan';

interface MaintenancePlanReviewProps {
  formData: Partial<MaintenancePlan>;
  hasHistoryWarning: boolean;
}

export const MaintenancePlanReview: React.FC<MaintenancePlanReviewProps> = ({ formData, hasHistoryWarning }) => {
  const totalTasks = formData.intervals?.reduce((acc, i) => acc + (i.tasks?.length || 0), 0) || 0;
  const hasCombinedRule = formData.intervals?.some((i) => i.triggerType === 'combinado' || i.rule === 'o_que_ocorrer_primeiro');

  return (
    <div className="space-y-6 animate-fadeIn">
      {hasHistoryWarning ? (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-center gap-3 text-sm font-semibold text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <div>
            <span className="font-extrabold block text-amber-800 dark:text-amber-300">Preservação Auditável Ativada (Versionamento Automático)</span>
            <p className="text-xs mt-0.5">Este plano já possui manutenções gravadas no histórico operacional. Ao confirmar, o AgroGuard manterá o registro antigo intacto e publicará a <strong>versão v{(formData.version || 1) + 1}</strong> desta matriz.</p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-semibold text-emerald-900 dark:text-emerald-200">
          <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-extrabold block text-emerald-800 dark:text-emerald-300">Pronto para Publicação no Banco Preventivo</span>
            <p className="text-xs mt-0.5">Todas as etapas foram verificadas e encontram-se em perfeita conformidade com as regras arquiteturais do AgroGuard.</p>
          </div>
        </div>
      )}

      <div className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-6">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">{formData.name || 'Plano Preventivo sem título'}</h3>
          <p className="text-xs text-gray-500 mt-1">{formData.description || 'Nenhuma descrição detalhada fornecida.'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-gray-100 dark:border-gray-800 py-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold">Módulos & Intervalos</p>
              <p className="text-base font-extrabold text-gray-900 dark:text-white">{formData.intervals?.length || 0} gatilhos ativos</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold">Total de Tarefas</p>
              <p className="text-base font-extrabold text-gray-900 dark:text-white">{totalTasks} itens de oficina</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold">Motor Combinado</p>
              <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                {hasCombinedRule ? 'Sim (O Que Ocorrer 1º)' : 'Gatilhos Simples'}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-extrabold text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
            Resumo Operacional de Paradas & Tolerância
          </h4>
          <div className="space-y-2">
            {formData.intervals?.map((intv) => (
              <div key={intv.id} className="p-3.5 bg-gray-50 dark:bg-gray-900/70 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-900 dark:text-white font-bold">{intv.name}</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  Parada est.: {intv.estimatedDurationMinutes || 120}min • Tolerância: {intv.allowedReadingDelay || 10}h
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
