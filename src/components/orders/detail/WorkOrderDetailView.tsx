import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkOrderDetail } from '../../../hooks/useWorkOrderDetail';
import { ArrowLeft, CheckCircle2, LayoutList, PenTool, ClipboardList, Package, Wrench, Clock, FileText, FileCheck, DollarSign, History } from 'lucide-react';
import { Button } from '../../ui/Button';
import { WorkOrderTimelineTab } from './WorkOrderTimelineTab';

// Omissão de todos os Sub-Tabs reais para focar na estrutura
const TabButton: React.FC<{ active: boolean; icon: any; label: string; onClick: () => void }> = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
      active 
        ? 'border-primary text-primary bg-primary/5' 
        : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
    }`}
  >
    <Icon size={16} />
    {label}
  </button>
);

export const WorkOrderDetailView: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { order, timeline, loading, error } = useWorkOrderDetail(orderId);
  const [activeTab, setActiveTab] = useState('resumo');

  if (loading) return <div className="p-12 text-center text-on-surface-variant">Carregando ficha da OS...</div>;
  if (error || !order) return <div className="p-12 text-center text-error font-bold">Erro ao carregar OS ou OS não encontrada.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Fixo */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/ordens-servico')} className="mt-1">
            <ArrowLeft size={16} />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-title-lg font-black text-on-surface tracking-tight">OS #{order.code}</h2>
              <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase bg-primary/10 text-primary border border-primary/20`}>
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-on-surface-variant text-sm font-semibold mt-1">
              {order.equipmentName} • Aberta em {new Date(order.openedAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Ações contextuais de acordo com o status */}
          {order.status === 'aberta' && (
            <Button variant="primary" className="flex items-center gap-2">
              <ClipboardList size={16} /> Iniciar Planejamento
            </Button>
          )}
          {order.status === 'planejada' && (
            <Button variant="primary" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-transparent">
              <PenTool size={16} /> Iniciar Execução
            </Button>
          )}
          {order.status === 'em_teste' && (
            <Button variant="primary" className="flex items-center gap-2">
              <CheckCircle2 size={16} /> Liberar Equipamento
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col min-h-[500px]">
        <div className="overflow-x-auto custom-scrollbar border-b border-white/10 bg-surface-container-high/30">
          <div className="flex min-w-max">
            <TabButton active={activeTab === 'resumo'} icon={LayoutList} label="Resumo da OS" onClick={() => setActiveTab('resumo')} />
            <TabButton active={activeTab === 'diagnostico'} icon={FileText} label="Diagnóstico" onClick={() => setActiveTab('diagnostico')} />
            <TabButton active={activeTab === 'tarefas'} icon={CheckCircle2} label="Tarefas" onClick={() => setActiveTab('tarefas')} />
            <TabButton active={activeTab === 'pecas'} icon={Package} label="Peças e Insumos" onClick={() => setActiveTab('pecas')} />
            <TabButton active={activeTab === 'ferramentas'} icon={Wrench} label="Ferramentas" onClick={() => setActiveTab('ferramentas')} />
            <TabButton active={activeTab === 'pausas'} icon={Clock} label="Pausas" onClick={() => setActiveTab('pausas')} />
            <TabButton active={activeTab === 'testes'} icon={FileCheck} label="Teste e Liberação" onClick={() => setActiveTab('testes')} />
            <TabButton active={activeTab === 'custos'} icon={DollarSign} label="Custos" onClick={() => setActiveTab('custos')} />
            <TabButton active={activeTab === 'historico'} icon={History} label="Linha do Tempo" onClick={() => setActiveTab('historico')} />
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 text-sm">
          {activeTab === 'historico' ? (
            <WorkOrderTimelineTab events={timeline} />
          ) : activeTab === 'resumo' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informações Gerais */}
                <div className="glass-card p-5 rounded-xl border border-white/5 space-y-4 bg-surface-container-low/20">
                  <h3 className="font-bold text-base text-primary border-b border-white/10 pb-2">Classificação Geral</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs font-bold text-on-surface-variant/70 uppercase">Natureza da OS</span>
                      <span className="font-bold text-on-surface text-base">
                        {(() => {
                          switch (order.nature) {
                            case 'MAINTENANCE': return 'Manutenção';
                            case 'INSPECTION': return 'Inspeção';
                            case 'DIAGNOSIS': return 'Diagnóstico';
                            case 'INSTALLATION': return 'Instalação';
                            case 'IMPROVEMENT': return 'Melhoria';
                            case 'CAMPAIGN_RECALL': return 'Recall';
                            default: return (order as any).nature || 'Manutenção';
                          }
                        })()}
                      </span>
                    </div>

                    {order.nature === 'MAINTENANCE' && (
                      <div>
                        <span className="block text-xs font-bold text-on-surface-variant/70 uppercase">Tipo de Manutenção</span>
                        <span className="font-bold text-on-surface text-base">
                          {(() => {
                            const mType = order.maintenanceType || ((order as any).type === 'preventiva' ? 'PREVENTIVE' : 'CORRECTIVE');
                            switch (mType) {
                              case 'PREVENTIVE': return 'Preventiva';
                              case 'CORRECTIVE':
                                return order.correctiveMode === 'EMERGENCY' ? 'Corretiva Emergencial' : 'Corretiva Planejada';
                              case 'PREDICTIVE': return 'Preditiva';
                              case 'CONDITION_BASED': return 'Baseada em Condição';
                              case 'ROUTINE_INSPECTION': return 'Inspeção / Rotina';
                              default: return mType;
                            }
                          })()}
                        </span>
                      </div>
                    )}

                    <div>
                      <span className="block text-xs font-bold text-on-surface-variant/70 uppercase">Gatilho / Origem</span>
                      <span className="font-bold text-on-surface text-base">
                        {(() => {
                          switch (order.trigger) {
                            case 'SCHEDULE': return 'Plano Preventivo';
                            case 'CALENDAR': return 'Calendário';
                            case 'HOUR_METER': return 'Horímetro';
                            case 'ODOMETER': return 'Odômetro';
                            case 'CYCLE': return 'Ciclos';
                            case 'CHECKLIST': return 'Checklist';
                            case 'INSPECTION': return 'Inspeção';
                            case 'FAILURE': return 'Falha Reportada';
                            case 'SENSOR': return 'Sensor / Telemetria';
                            case 'ALERT': return 'Alerta';
                            case 'OPERATOR_REPORT': return 'Solicitação do Operador';
                            case 'MANUAL': default: return 'Ordem Manual';
                          }
                        })()}
                      </span>
                    </div>

                    <div>
                      <span className="block text-xs font-bold text-on-surface-variant/70 uppercase">Prioridade</span>
                      <div className="mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${(() => {
                          const prio = order.priority ? order.priority.toUpperCase() : 'NORMAL';
                          switch (prio) {
                            case 'CRITICAL': return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20';
                            case 'URGENT': return 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20';
                            case 'HIGH': return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20';
                            case 'NORMAL': return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20';
                            case 'LOW': default: return 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/20';
                          }
                        })()}`}>
                          {(() => {
                            const prio = order.priority ? order.priority.toUpperCase() : 'NORMAL';
                            switch (prio) {
                              case 'CRITICAL': return 'Crítica';
                              case 'URGENT': return 'Urgente';
                              case 'HIGH': return 'Alta';
                              case 'NORMAL': return 'Normal';
                              case 'LOW': default: return 'Baixa';
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status e Descrição */}
                <div className="glass-card p-5 rounded-xl border border-white/5 space-y-4 bg-surface-container-low/20">
                  <h3 className="font-bold text-base text-primary border-b border-white/10 pb-2">Status & Problema</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="block text-xs font-bold text-on-surface-variant/70 uppercase">Título do Serviço</span>
                      <p className="font-semibold text-on-surface">{order.title}</p>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-on-surface-variant/70 uppercase">Descrição Detalhada</span>
                      <p className="text-on-surface-variant bg-black/10 p-3 rounded-lg border border-white/5 min-h-[60px] whitespace-pre-wrap">{order.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
              <LayoutList className="w-16 h-16 text-primary/50 mb-4" />
              <p className="text-xl font-bold text-on-surface">Aba: {activeTab.toUpperCase()}</p>
              <p className="text-sm font-semibold text-on-surface-variant mt-2">Visões detalhadas sendo construídas de forma modular.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
