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
        <div className="flex-1 p-6">
          {activeTab === 'historico' ? (
            <WorkOrderTimelineTab events={timeline} />
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
