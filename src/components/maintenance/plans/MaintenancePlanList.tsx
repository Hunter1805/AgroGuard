import React, { useState } from 'react';
import { FileText, Plus, Copy, Edit, Link2, Shield, Wrench, Clock, Trash2, CheckCircle2 } from 'lucide-react';
import { useMaintenancePlans } from '../../../hooks/useMaintenancePlans';
import { MaintenancePlanFilters } from './MaintenancePlanFilters';
import { MaintenancePlanForm } from './MaintenancePlanForm';
import { EquipmentPlanLinkModal } from './EquipmentPlanLinkModal';
import { Button } from '../../ui/Button';
import type { MaintenancePlan } from '../../../types/maintenance-plan';

interface MaintenancePlanListProps {
  onNavigateToSchedule?: () => void;
}

export const MaintenancePlanList: React.FC<MaintenancePlanListProps> = () => {
  const {
    plans,
    links,
    filters,
    loading,
    actionMessage,
    clearMessage,
    updateFilters,
    resetFilters,
    duplicatePlan,
    upgradePlanVersion,
    archivePlan,
    refresh,
  } = useMaintenancePlans();

  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [selectedPlanForLink, setSelectedPlanForLink] = useState<MaintenancePlan | null>(null);

  if (isCreating || editingPlanId) {
    return (
      <MaintenancePlanForm
        planId={editingPlanId || undefined}
        onCancel={() => {
          setIsCreating(false);
          setEditingPlanId(null);
        }}
        onSuccess={() => {
          setIsCreating(false);
          setEditingPlanId(null);
          refresh();
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Alerta de Ações Reativas */}
      {actionMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl flex items-center justify-between text-sm font-semibold text-emerald-800 dark:text-emerald-200 shadow-sm animate-bounceOnce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={clearMessage} className="text-emerald-600 hover:text-emerald-900 font-bold text-xs px-2">
            FECHAR
          </button>
        </div>
      )}

      {/* Barra de Filtros */}
      <MaintenancePlanFilters
        filters={filters}
        onUpdateFilters={updateFilters}
        onResetFilters={resetFilters}
      />

      <div className="flex justify-between items-center px-1">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
          Exibindo <strong className="text-gray-900 dark:text-white">{plans.length}</strong> planos preventivos
        </p>
        <Button onClick={() => setIsCreating(true)} size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md">
          <Plus className="w-4 h-4 mr-1" /> Criar Plano Preventivo
        </Button>
      </div>

      {/* Grade de Planos Preventivos */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-52 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="glass-card p-12 text-center text-gray-500">
          <FileText className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
          <h3 className="font-bold text-gray-700 dark:text-gray-300 text-base">Nenhum plano preventivo cadastrado para estes filtros</h3>
          <p className="text-xs text-gray-400 mt-1">Clique em "Criar Plano Preventivo" para montar uma matriz em 6 etapas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {plans.map((plan) => {
            const planLinks = links.filter((l) => l.planId === plan.id || l.planName === plan.name);
            const hasCombinedRule = plan.intervals?.some((i) => i.triggerType === 'combinado' || i.rule === 'o_que_ocorrer_primeiro');
            
            return (
              <div key={plan.id} className="glass-card p-6 flex flex-col justify-between hover:shadow-xl transition-all border border-gray-200/80 dark:border-gray-800/80 relative overflow-hidden group">
                {hasCombinedRule && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-indigo-600 text-white font-extrabold text-[10px] uppercase px-3 py-0.5 rounded-bl-xl shadow-sm tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Regra Combinada (1º que Ocorrer)
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900/50">
                          {plan.code || plan.id}
                        </span>
                        <span className="text-xs font-extrabold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-1">
                          <Shield className="w-3 h-3 text-emerald-500" /> v{plan.version || 1} Ativo
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2 group-hover:text-blue-600 transition-colors">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {plan.description || 'Nenhuma descrição complementar.'}
                      </p>
                    </div>
                  </div>

                  {/* Intervalos Cadastrados no Plano */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Módulo de Gatilhos & Intervalos ({plan.intervals?.length || 0})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {plan.intervals?.map((intv) => (
                        <span key={intv.id} className="text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800/80 px-3 py-1 rounded-xl flex items-center gap-1.5 border border-gray-200 dark:border-gray-700/60">
                          <Wrench className="w-3 h-3 text-blue-500" /> {intv.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Máquinas Vinculadas */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 font-medium">
                      <Link2 className="w-4 h-4 text-purple-500" />
                      <span>{planLinks.length === 0 ? 'Nenhuma máquina vinculada' : `${planLinks.length} ativo(s) em monitoramento real`}</span>
                    </div>
                    {planLinks.length > 0 && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                        {planLinks[0].equipmentCode || planLinks[0].equipmentName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Botões de Ação Rápida */}
                <div className="mt-6 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditingPlanId(plan.id!)} title="Editar Plano (Se possuir histórico, gerará nova versão)" className="text-xs font-bold text-blue-600 dark:text-blue-400 px-2.5">
                      <Edit className="w-3.5 h-3.5 mr-1" /> Editar / Ver
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => duplicatePlan(plan.id!)} title="Duplicar Plano" className="text-xs text-gray-500 hover:text-gray-800 px-2.5">
                      <Copy className="w-3.5 h-3.5 mr-1" /> Duplicar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => upgradePlanVersion(plan.id!)} title="Gerar Nova Versão Auditable" className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 px-2.5 font-semibold">
                      v{(plan.version || 1) + 1}+
                    </Button>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPlanForLink(plan)}
                      className="text-xs font-bold bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 px-3 py-1"
                    >
                      <Link2 className="w-3.5 h-3.5 mr-1" /> Vincular Ativo
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => archivePlan(plan.id!)} title="Arquivar Plano" className="text-gray-400 hover:text-rose-600 rounded-xl">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Vinculação */}
      {selectedPlanForLink && (
        <EquipmentPlanLinkModal
          plan={selectedPlanForLink}
          onClose={() => setSelectedPlanForLink(null)}
          onSuccess={() => {
            setSelectedPlanForLink(null);
            refresh();
          }}
        />
      )}
    </div>
  );
};
